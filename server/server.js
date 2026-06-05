require('dotenv').config();
const express    = require('express');
const http       = require('http');
const cors       = require('cors');
const { Server } = require('socket.io');

// ─── Setup ────────────────────────────────────────────────────────────────────
const app  = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 4000;

// Allow both local dev and the live Vercel frontend
const ALLOWED_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://jamsesh.vercel.app',
  // If you add a custom domain later, add it here too
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(cors({ origin: ALLOWED_ORIGINS, credentials: true }));
app.use(express.json());

const io = new Server(server, {
  cors: { origin: ALLOWED_ORIGINS, methods: ['GET', 'POST'], credentials: true },
  // Railway's proxy strips the path — pingTimeout keeps connections alive
  pingTimeout: 60000,
  pingInterval: 25000,
});

// ─── In-memory room store ─────────────────────────────────────────────────────
// Shape: rooms[code] = { code, name, maxSize, sessionType, defaultKey, notes,
//                        currentSongId, currentNumber,
//                        players: { [socketId]: PlayerInfo } }
const rooms = {};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function roomPlayers(code) {
  return Object.values(rooms[code]?.players ?? {});
}

function broadcastState(code) {
  const room = rooms[code];
  if (!room) return;
  io.to(code).emit('room:state', {
    code:          room.code,
    name:          room.name,
    maxSize:       room.maxSize,
    sessionType:   room.sessionType,
    defaultKey:    room.defaultKey,
    notes:         room.notes,
    players:       roomPlayers(code),
    currentSongId: room.currentSongId,
    currentNumber: room.currentNumber,
  });
}

// ─── REST endpoints ───────────────────────────────────────────────────────────

// Health — Railway and Vercel both hit this to confirm the server is up
app.get('/',           (_req, res) => res.json({ service: 'JamSesh server', ok: true }));
app.get('/api/health', (_req, res) => res.json({
  ok:    true,
  rooms: Object.keys(rooms).length,
  players: Object.values(rooms).reduce((n, r) => n + Object.keys(r.players).length, 0),
  uptime: Math.floor(process.uptime()) + 's',
}));

// Check if a room code exists (so the frontend can validate before joining)
app.get('/api/room/:code', (req, res) => {
  const room = rooms[req.params.code.toUpperCase()];
  if (!room) return res.status(404).json({ error: 'Room not found' });
  res.json({
    code:        room.code,
    name:        room.name,
    sessionType: room.sessionType,
    defaultKey:  room.defaultKey,
    playerCount: Object.keys(room.players).length,
    maxSize:     room.maxSize,
    full:        Object.keys(room.players).length >= room.maxSize,
  });
});

// ─── Socket.io ────────────────────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`[+] connected    ${socket.id}`);

  // ── Create room ─────────────────────────────────────────────────────────────
  socket.on('room:create', ({ code, name, maxSize, sessionType, defaultKey, notes, player }) => {
    const upperCode = code.toUpperCase();
    if (rooms[upperCode]) {
      socket.emit('room:error', { message: 'Room code already in use — a new one will be generated.' });
      return;
    }
    rooms[upperCode] = {
      code: upperCode, name,
      maxSize:     maxSize     ?? 4,
      sessionType: sessionType ?? 'worship',
      defaultKey:  defaultKey  ?? 'A',
      notes:       notes       ?? '',
      currentSongId:  null,
      currentNumber:  null,
      players: {},
    };
    socket.join(upperCode);
    rooms[upperCode].players[socket.id] = {
      ...player,
      id:        socket.id,
      latencyMs: 0,
      joinedAt:  Date.now(),
    };
    console.log(`[room] created   ${upperCode}  "${name}"  by ${player.name}`);
    broadcastState(upperCode);
  });

  // ── Join room ────────────────────────────────────────────────────────────────
  socket.on('room:join', ({ code, player }) => {
    const upperCode = code.toUpperCase();
    const room = rooms[upperCode];
    if (!room) {
      socket.emit('room:error', { message: `Room ${upperCode} not found. Check the code and try again.` });
      return;
    }
    if (Object.keys(room.players).length >= room.maxSize) {
      socket.emit('room:error', { message: 'This room is full.' });
      return;
    }
    socket.join(upperCode);
    room.players[socket.id] = {
      ...player,
      id:        socket.id,
      latencyMs: 0,
      joinedAt:  Date.now(),
    };
    console.log(`[room] joined    ${upperCode}  by ${player.name}`);
    // Tell existing players someone joined
    socket.to(upperCode).emit('player:joined', { ...player, id: socket.id });
    // Send full state to the new joiner
    broadcastState(upperCode);
  });

  // ── MD calls a number ────────────────────────────────────────────────────────
  socket.on('md:call-number', ({ roomCode, number }) => {
    const code = roomCode.toUpperCase();
    const room = rooms[code];
    if (!room) return;
    const caller = room.players[socket.id];
    if (!caller || caller.role !== 'md') {
      socket.emit('room:error', { message: 'Only the MD can call numbers.' });
      return;
    }
    room.currentNumber = number;
    io.to(code).emit('md:number', number);
    console.log(`[md]   ${code}  → ${number}  by ${caller.name}`);
  });

  // ── Song change ──────────────────────────────────────────────────────────────
  socket.on('song:select', ({ roomCode, songId }) => {
    const code = roomCode.toUpperCase();
    const room = rooms[code];
    if (!room) return;
    room.currentSongId = songId;
    room.currentNumber = null; // reset number when song changes
    io.to(code).emit('song:changed', songId);
    console.log(`[song] ${code}  → ${songId}`);
  });

  // ── Volume (for VU meters on other players' screens) ─────────────────────────
  socket.on('player:volume', ({ roomCode, vol }) => {
    socket.to(roomCode.toUpperCase()).emit('player:volume', { id: socket.id, vol });
  });

  // ── Latency ping ─────────────────────────────────────────────────────────────
  socket.on('ping:measure', ({ roomCode, sentAt }) => {
    const latencyMs = Date.now() - sentAt;
    const code = roomCode?.toUpperCase();
    if (code && rooms[code]?.players[socket.id]) {
      rooms[code].players[socket.id].latencyMs = latencyMs;
      // Broadcast updated latency to the room so everyone sees it
      socket.to(code).emit('player:latency', { id: socket.id, latencyMs });
    }
    socket.emit('pong:measure', { latencyMs });
  });

  // ── Disconnect ───────────────────────────────────────────────────────────────
  socket.on('disconnect', (reason) => {
    console.log(`[-] disconnected ${socket.id}  (${reason})`);
    for (const code of Object.keys(rooms)) {
      const room = rooms[code];
      if (!room.players[socket.id]) continue;
      const leaving = room.players[socket.id];
      delete room.players[socket.id];
      io.to(code).emit('player:left', socket.id);
      console.log(`[room] left      ${code}  by ${leaving.name}`);
      if (Object.keys(room.players).length === 0) {
        delete rooms[code];
        console.log(`[room] deleted   ${code}  (empty)`);
      } else {
        broadcastState(code);
      }
    }
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────
server.listen(PORT, '0.0.0.0', () => {
  console.log(`\n🎸  JamSesh server  →  http://0.0.0.0:${PORT}\n`);
});

require('dotenv').config();
const express = require('express');
const http    = require('http');
const cors    = require('cors');
const { Server } = require('socket.io');

// ─── Setup ────────────────────────────────────────────────────────────────────
const app    = express();
const server = http.createServer(app);
const PORT   = process.env.PORT || 4000;

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000' }));
app.use(express.json());

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:3000',
    methods: ['GET', 'POST'],
  },
});

// ─── In-memory room store ─────────────────────────────────────────────────────
// In production this moves to Supabase / Redis — same shape, just persisted.
//
// rooms = {
//   'JAM·XXXX': {
//     code, name, maxSize, sessionType, defaultKey, notes,
//     currentSongId, currentNumber,
//     players: { [socketId]: { id, name, instrument, subtype, role, latencyMs } }
//   }
// }
const rooms = {};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getRoomPlayers(code) {
  return Object.values(rooms[code]?.players ?? {});
}

function broadcastRoomState(code) {
  const room = rooms[code];
  if (!room) return;
  io.to(code).emit('room:state', {
    code:          room.code,
    name:          room.name,
    players:       getRoomPlayers(code),
    currentSongId: room.currentSongId,
    currentNumber: room.currentNumber,
  });
}

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => res.json({ ok: true, rooms: Object.keys(rooms).length }));

// ─── Socket events ────────────────────────────────────────────────────────────
io.on('connection', (socket) => {
  console.log(`[+] connected  ${socket.id}`);

  // ── Create a new room ──────────────────────────────────────────────────────
  socket.on('room:create', ({ code, name, maxSize, sessionType, defaultKey, notes, player }) => {
    if (rooms[code]) {
      socket.emit('room:error', { message: 'Room code already exists — try again.' });
      return;
    }
    rooms[code] = {
      code, name,
      maxSize:     maxSize ?? 4,
      sessionType: sessionType ?? 'worship',
      defaultKey:  defaultKey ?? 'A',
      notes:       notes ?? '',
      currentSongId:   null,
      currentNumber:   null,
      players: {},
    };
    socket.join(code);
    rooms[code].players[socket.id] = { ...player, id: socket.id, latencyMs: 0 };
    console.log(`[room] created  ${code}  by ${player.name}`);
    broadcastRoomState(code);
  });

  // ── Join an existing room ──────────────────────────────────────────────────
  socket.on('room:join', ({ code, player }) => {
    const room = rooms[code];
    if (!room) {
      socket.emit('room:error', { message: `Room ${code} not found.` });
      return;
    }
    const playerCount = Object.keys(room.players).length;
    if (playerCount >= room.maxSize) {
      socket.emit('room:error', { message: 'Room is full.' });
      return;
    }
    socket.join(code);
    room.players[socket.id] = { ...player, id: socket.id, latencyMs: 0 };
    console.log(`[room] joined   ${code}  by ${player.name}`);
    // Tell everyone else who just joined
    socket.to(code).emit('player:joined', { ...player, id: socket.id });
    // Send full state to the new joiner
    broadcastRoomState(code);
  });

  // ── MD calls a number ──────────────────────────────────────────────────────
  socket.on('md:call-number', ({ roomCode, number }) => {
    const room = rooms[roomCode];
    if (!room) return;
    const caller = room.players[socket.id];
    if (!caller || caller.role !== 'md') return; // only MD can call
    room.currentNumber = number;
    io.to(roomCode).emit('md:number', number);
    console.log(`[md]   ${roomCode}  called ${number}  by ${caller.name}`);
  });

  // ── MD changes the active song ─────────────────────────────────────────────
  socket.on('song:select', ({ roomCode, songId }) => {
    const room = rooms[roomCode];
    if (!room) return;
    room.currentSongId = songId;
    io.to(roomCode).emit('song:changed', songId);
    console.log(`[song] ${roomCode}  → ${songId}`);
  });

  // ── Player sends their volume level (for VU meter) ─────────────────────────
  socket.on('player:volume', ({ roomCode, vol }) => {
    socket.to(roomCode).emit('player:volume', { id: socket.id, vol });
  });

  // ── Ping / latency measurement ─────────────────────────────────────────────
  socket.on('ping:measure', ({ roomCode, sentAt }) => {
    const latencyMs = Date.now() - sentAt;
    const room = rooms[roomCode];
    if (room?.players[socket.id]) {
      room.players[socket.id].latencyMs = latencyMs;
    }
    socket.emit('pong:measure', { latencyMs });
  });

  // ── Disconnect ─────────────────────────────────────────────────────────────
  socket.on('disconnect', () => {
    console.log(`[-] disconnected ${socket.id}`);
    // Remove player from every room they were in
    for (const code of Object.keys(rooms)) {
      const room = rooms[code];
      if (room.players[socket.id]) {
        const leaving = room.players[socket.id];
        delete room.players[socket.id];
        io.to(code).emit('player:left', socket.id);
        console.log(`[room] left     ${code}  by ${leaving.name}`);
        // Clean up empty rooms
        if (Object.keys(room.players).length === 0) {
          delete rooms[code];
          console.log(`[room] deleted  ${code}  (empty)`);
        } else {
          broadcastRoomState(code);
        }
      }
    }
  });
});

// ─── Start ────────────────────────────────────────────────────────────────────
server.listen(PORT, () => {
  console.log(`\n🎸  JamSesh server running on http://localhost:${PORT}\n`);
});

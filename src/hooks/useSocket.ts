import { useEffect, useRef, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';

// Events the server emits TO the client
interface ServerToClient {
  'room:state':      (room: RoomState) => void;
  'player:joined':   (player: PlayerInfo) => void;
  'player:left':     (playerId: string) => void;
  'md:number':       (number: string) => void;
  'song:changed':    (songId: string) => void;
  'player:volume':   (data: { id: string; vol: number }) => void;
}

// Events the client emits TO the server
interface ClientToServer {
  'room:join':       (data: { code: string; player: PlayerInfo }) => void;
  'room:create':     (data: RoomCreatePayload) => void;
  'md:call-number':  (data: { roomCode: string; number: string }) => void;
  'song:select':     (data: { roomCode: string; songId: string }) => void;
  'player:volume':   (data: { roomCode: string; vol: number }) => void;
}

export interface PlayerInfo {
  id: string;
  name: string;
  instrument: string;
  subtype: string;
  role: 'md' | 'player';
  latencyMs?: number;
}

export interface RoomState {
  code: string;
  name: string;
  players: PlayerInfo[];
  currentSongId: string | null;
  currentNumber: string | null;
}

export interface RoomCreatePayload {
  code: string;
  name: string;
  maxSize: number;
  sessionType: string;
  defaultKey: string;
  notes: string;
  player: PlayerInfo;
}

let socketInstance: Socket<ServerToClient, ClientToServer> | null = null;

function getSocket() {
  if (!socketInstance) {
    socketInstance = io(
      import.meta.env.VITE_SERVER_URL || 'http://localhost:4000',
      { autoConnect: false, transports: ['websocket'] }
    );
  }
  return socketInstance;
}

interface UseSocketOptions {
  onRoomState?: (room: RoomState) => void;
  onPlayerJoined?: (player: PlayerInfo) => void;
  onPlayerLeft?: (id: string) => void;
  onMDNumber?: (number: string) => void;
  onSongChanged?: (songId: string) => void;
  onPlayerVolume?: (data: { id: string; vol: number }) => void;
}

export function useSocket(options: UseSocketOptions = {}) {
  const socketRef = useRef(getSocket());
  const optRef = useRef(options);
  optRef.current = options;

  useEffect(() => {
    const s = socketRef.current;
    if (!s.connected) s.connect();

    const handlers: Partial<ServerToClient> = {
      'room:state':    (r) => optRef.current.onRoomState?.(r),
      'player:joined': (p) => optRef.current.onPlayerJoined?.(p),
      'player:left':   (id) => optRef.current.onPlayerLeft?.(id),
      'md:number':     (n) => optRef.current.onMDNumber?.(n),
      'song:changed':  (id) => optRef.current.onSongChanged?.(id),
      'player:volume': (d) => optRef.current.onPlayerVolume?.(d),
    };

    (Object.entries(handlers) as Array<[keyof ServerToClient, (...args: any[]) => void]>)
      .forEach(([ev, fn]) => s.on(ev, fn));

    return () => {
      (Object.entries(handlers) as Array<[keyof ServerToClient, (...args: any[]) => void]>)
        .forEach(([ev, fn]) => s.off(ev, fn));
    };
  }, []);

  const createRoom = useCallback((payload: RoomCreatePayload) => {
    socketRef.current.emit('room:create', payload);
  }, []);

  const joinRoom = useCallback((code: string, player: PlayerInfo) => {
    socketRef.current.emit('room:join', { code, player });
  }, []);

  const callNumber = useCallback((roomCode: string, number: string) => {
    socketRef.current.emit('md:call-number', { roomCode, number });
  }, []);

  const selectSong = useCallback((roomCode: string, songId: string) => {
    socketRef.current.emit('song:select', { roomCode, songId });
  }, []);

  const sendVolume = useCallback((roomCode: string, vol: number) => {
    socketRef.current.emit('player:volume', { roomCode, vol });
  }, []);

  return { createRoom, joinRoom, callNumber, selectSong, sendVolume };
}

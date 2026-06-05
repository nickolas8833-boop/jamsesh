import React, { useState, useEffect } from 'react';
import type { AppSetup } from '../App';
import type { Screen } from '../types';
import { useSocket, type PlayerInfo, type RoomState } from '../hooks/useSocket';

interface Props { go: (s: Screen) => void; setup: AppSetup; patch: (p: Partial<AppSetup>) => void; }

export default function LobbyScreen({ go, setup }: Props) {
  const room = setup.room;
  const code = room?.code ?? '????';
  const name = room?.name ?? 'My Room';
  const maxSize = room?.maxSize ?? 4;

  const [players, setPlayers] = useState<PlayerInfo[]>([]);

  const { joinRoom, createRoom } = useSocket({
    onRoomState: (r: RoomState) => setPlayers(r.players),
    onPlayerJoined: (p: PlayerInfo) => setPlayers(prev =>
      prev.find(x => x.id === p.id) ? prev : [...prev, p]
    ),
    onPlayerLeft: (id: string) => setPlayers(prev => prev.filter(p => p.id !== id)),
  });

  useEffect(() => {
    if (!room) return;
    const player: PlayerInfo = {
      id:         '',
      name:       setup.name || 'Anonymous',
      instrument: setup.instrument,
      subtype:    setup.subtype,
      role:       setup.role,
      latencyMs:  0,
    };

    // Wait for socket to finish connecting before emitting
    const timer = setTimeout(() => {
      if (setup.mode === 'private' && setup.role === 'md') {
        createRoom({
          code:        room.code,
          name:        room.name,
          maxSize:     room.maxSize,
          sessionType: room.sessionType,
          defaultKey:  room.defaultKey,
          notes:       room.notes,
          player,
        });
      } else {
        joinRoom(room.code, player);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  function copy() {
    navigator.clipboard?.writeText(code).catch(() => {});
  }

  const emptySlots = Math.max(0, maxSize - players.length);

  return (
    <div className="screen" style={{ padding:'28px 36px', gap:20, overflowY:'auto' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <span className="back-link" onClick={() => go('input')}>← back</span>
        <span style={{ color:'#7070aa', fontSize:12 }}>{name}</span>
        <span/>
      </div>

      <div style={{ display:'flex', gap:16, alignItems:'flex-start' }}>
        <div style={{ flex:1 }}>
          {/* Code card */}
          <div style={{ background:'#1e1e3a', borderRadius:14, padding:'16px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
            <div>
              <div style={{ color:'#5a5a8a', fontSize:10, marginBottom:4 }}>invite code</div>
              <div style={{ fontSize:28, fontWeight:600, letterSpacing:6 }}>{code}</div>
            </div>
            <div onClick={copy} style={{ background:'#533AB7', borderRadius:8, padding:'8px 16px', fontSize:12, cursor:'pointer', display:'flex', alignItems:'center', gap:5 }}>
              <i className="ti ti-copy" style={{ fontSize:13 }}/> copy
            </div>
          </div>

          {/* Player grid */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10, marginBottom:16 }}>
            {players.map(p => {
              const color = p.role === 'md' ? '#7F77DD' : '#D4537E';
              const tag   = p.role === 'md' ? '#533AB7' : '#2e1428';
              return (
                <div key={p.id} style={{ background:'#13132a', borderRadius:12, padding:'14px 10px', textAlign:'center', border:`1.5px solid ${p.role==='md'?'#533AB7':'transparent'}` }}>
                  <div style={{ width:50, height:50, borderRadius:'50%', border:`2px solid ${color}`, background:'#1e1e3a', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 7px', fontSize:10, color }}>
                    <i className="ti ti-user" style={{ fontSize:22 }}/>
                  </div>
                  <div style={{ fontSize:11, fontWeight:500 }}>{p.name}</div>
                  <div style={{ display:'flex', gap:3, justifyContent:'center', marginTop:3 }}>
                    <span style={{ background:tag, color, fontSize:9, padding:'1px 5px', borderRadius:3 }}>{p.instrument}</span>
                    {p.role === 'md' && <span style={{ background:'#533AB7', color:'#EEEDFE', fontSize:9, padding:'1px 5px', borderRadius:3 }}>MD</span>}
                  </div>
                  <div style={{ display:'flex', alignItems:'center', gap:3, justifyContent:'center', marginTop:4 }}>
                    <div style={{ width:5, height:5, borderRadius:'50%', background:'#1D9E75' }}/>
                    <span style={{ color:'#5a5a8a', fontSize:9 }}>{p.latencyMs ?? 0}ms</span>
                  </div>
                </div>
              );
            })}
            {Array.from({ length: emptySlots }).map((_, i) => (
              <div key={i} style={{ background:'#13132a', borderRadius:12, padding:'14px 10px', textAlign:'center', border:'1.5px dashed #1e1e3a', opacity:.5 }}>
                <div style={{ width:50, height:50, borderRadius:'50%', border:'1.5px dashed #2a2a50', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 7px' }}>
                  <i className="ti ti-plus" style={{ fontSize:18, color:'#3a3a6a' }}/>
                </div>
                <div style={{ color:'#3a3a6a', fontSize:11 }}>waiting...</div>
              </div>
            ))}
          </div>

          <button className="btn-primary" onClick={() => go('session')} style={{ padding:14, fontSize:15, width:'100%' }}>
            Start session →
          </button>
        </div>

        {/* Info sidebar */}
        <div style={{ width:200, background:'#13132a', borderRadius:14, padding:16, flexShrink:0 }}>
          <div style={{ color:'#5a5a8a', fontSize:10, marginBottom:10 }}>session info</div>
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {[
              ['Type', room?.sessionType ?? 'Worship'],
              ['Max size', `${maxSize} players`],
              ['Key', `${room?.defaultKey ?? 'A'} major`],
            ].map(([label, val]) => (
              <div key={label} style={{ display:'flex', justifyContent:'space-between' }}>
                <span style={{ color:'#5a5a8a', fontSize:11 }}>{label}</span>
                <span style={{ fontSize:11 }}>{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
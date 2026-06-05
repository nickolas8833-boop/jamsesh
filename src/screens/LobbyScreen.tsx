import React from 'react';
import type { AppSetup } from '../App';
import type { Screen } from '../types';

interface Props { go: (s: Screen) => void; setup: AppSetup; patch: (p: Partial<AppSetup>) => void; }

const DEMO_PLAYERS = [
  { name:'Nicko', instrument:'Keys', role:'MD', color:'#7F77DD', tag:'#533AB7', tagText:'MD', latency:12 },
  { name:'Jordan', instrument:'Guitar', role:'player', color:'#D4537E', tag:'#2e1428', tagText:'guitar', latency:19 },
];

export default function LobbyScreen({ go, setup }: Props) {
  const room = setup.room;
  const code = room?.code ?? 'JAM·????';
  const name = room?.name ?? 'My Room';

  function copy() {
    navigator.clipboard?.writeText(code).catch(() => {});
  }

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
            {DEMO_PLAYERS.map(p => (
              <div key={p.name} style={{ background:'#13132a', borderRadius:12, padding:'14px 10px', textAlign:'center', border:`1.5px solid ${p.role==='MD'?'#533AB7':'transparent'}` }}>
                <div style={{ width:50, height:50, borderRadius:'50%', border:`2px solid ${p.color}`, background:'#1e1e3a', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 7px', fontSize:10, color:p.color }}>
                  <i className="ti ti-user" style={{ fontSize:22 }}/>
                </div>
                <div style={{ fontSize:11, fontWeight:500 }}>{p.name}</div>
                <div style={{ display:'flex', gap:3, justifyContent:'center', marginTop:3 }}>
                  <span style={{ background:p.tag, color:p.color, fontSize:9, padding:'1px 5px', borderRadius:3 }}>{p.tagText}</span>
                  {p.role==='MD' && <span style={{ background:'#533AB7', color:'#EEEDFE', fontSize:9, padding:'1px 5px', borderRadius:3 }}>MD</span>}
                </div>
                <div style={{ display:'flex', alignItems:'center', gap:3, justifyContent:'center', marginTop:4 }}>
                  <div style={{ width:5, height:5, borderRadius:'50%', background:'#1D9E75' }}/>
                  <span style={{ color:'#5a5a8a', fontSize:9 }}>{p.latency}ms</span>
                </div>
              </div>
            ))}
            {[0,1].map(i => (
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
              ['Max size', `${room?.maxSize ?? 4} players`],
              ['Key', `${room?.defaultKey ?? 'A'} major`],
            ].map(([label, val]) => (
              <div key={label} style={{ display:'flex', justifyContent:'space-between' }}>
                <span style={{ color:'#5a5a8a', fontSize:11 }}>{label}</span>
                <span style={{ fontSize:11 }}>{val}</span>
              </div>
            ))}
            <div style={{ borderTop:'1px solid #1e1e3a', paddingTop:8 }}>
              <span style={{ color:'#1D9E75', fontSize:10, display:'flex', alignItems:'center', gap:4 }}>
                <span style={{ width:6, height:6, borderRadius:'50%', background:'#1D9E75', display:'inline-block' }}/>
                Planning Center connected
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

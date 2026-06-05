import React from 'react';
import type { AppSetup } from '../App';
import type { Screen, UserRole } from '../types';

interface Props { go: (s: Screen) => void; setup: AppSetup; patch: (p: Partial<AppSetup>) => void; }

export default function RoleScreen({ go, setup, patch }: Props) {
  const { role } = setup;
  const select = (r: UserRole) => patch({ role: r });

  return (
    <div className="screen" style={{ alignItems:'center', justifyContent:'center', padding:'48px 40px', gap:28 }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ fontSize:22, fontWeight:600, marginBottom:6 }}>What's your role?</div>
        <div style={{ color:'#5a5a8a', fontSize:13 }}>You can change this once you're in the room.</div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, width:'100%', maxWidth:440 }}>
        <div onClick={() => select('md')} style={{
          background:'#1e1e3a', border:`2px solid ${role==='md'?'#533AB7':'transparent'}`,
          borderRadius:18, padding:'26px 18px', cursor:'pointer', textAlign:'center', transition:'border-color .15s'
        }}>
          <i className="ti ti-antenna" style={{ fontSize:30, color:'#7F77DD', display:'block', margin:'0 auto 10px' }}/>
          <div style={{ fontSize:14, fontWeight:500 }}>Music Director</div>
          <div style={{ color:'#7070aa', fontSize:11, marginTop:4 }}>call numbers, lead the room</div>
          <div style={{ background:'#533AB7', color:'#EEEDFE', fontSize:10, padding:'3px 10px', borderRadius:20, display:'inline-block', marginTop:10 }}>MD</div>
        </div>

        <div onClick={() => select('player')} style={{
          background:'#1e1e3a', border:`2px solid ${role==='player'?'#1D9E75':'transparent'}`,
          borderRadius:18, padding:'26px 18px', cursor:'pointer', textAlign:'center', transition:'border-color .15s'
        }}>
          <i className="ti ti-music" style={{ fontSize:30, color:'#1D9E75', display:'block', margin:'0 auto 10px' }}/>
          <div style={{ fontSize:14, fontWeight:500 }}>Player / Vocalist</div>
          <div style={{ color:'#7070aa', fontSize:11, marginTop:4 }}>follow the chart, play your part</div>
          <div style={{ background:'#0e3028', color:'#9FE1CB', fontSize:10, padding:'3px 10px', borderRadius:20, display:'inline-block', marginTop:10 }}>musician</div>
        </div>
      </div>

      <button className="btn-primary" onClick={() => go('instrument')} style={{ padding:'15px 40px', fontSize:15 }}>
        Continue →
      </button>
    </div>
  );
}

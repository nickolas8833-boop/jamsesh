import React from 'react';
import type { AppSetup } from '../App';
import type { Screen } from '../types';

interface Props { go: (s: Screen) => void; setup: AppSetup; patch: (p: Partial<AppSetup>) => void; }

export default function SplashScreen({ go, patch }: Props) {
  return (
    <div className="screen" style={{
      alignItems: 'center', justifyContent: 'center',
      padding: '56px 40px', gap: 40,
      background: 'radial-gradient(ellipse at 50% 0%, #1a1240 0%, #0c0c1e 60%)'
    }}>
      <div style={{ textAlign: 'center' }}>
        <svg width="58" height="58" viewBox="0 0 56 56" style={{ display:'block', margin:'0 auto 14px' }}>
          <circle cx="28" cy="28" r="26" stroke="#533AB7" strokeWidth="1.5" fill="none"/>
          <ellipse cx="19" cy="31" rx="7" ry="4" fill="#533AB7"/>
          <rect x="25" y="13" width="2" height="20" rx="1" fill="#533AB7"/>
          <rect x="25" y="13" width="14" height="2" rx="1" fill="#533AB7"/>
          <rect x="37" y="13" width="2" height="13" rx="1" fill="#533AB7"/>
        </svg>
        <div style={{ color: '#EEEDFE', fontSize: 38, fontWeight: 600, letterSpacing: -1.5 }}>JamSesh</div>
        <div style={{ color: '#5a5a8a', fontSize: 13, marginTop: 7, letterSpacing: 0.3 }}>
          your band. your worship. your space.
        </div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:10, width:'100%', maxWidth:380 }}>
        <button className="btn-primary" onClick={() => { patch({ mode: 'private' }); go('private-setup'); }}
          style={{ padding:'18px 22px', width:'100%', textAlign:'left', display:'flex', alignItems:'center', gap:14, fontSize:14 }}>
          <div style={{ width:42, height:42, background:'#2a1e50', borderRadius:11, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <i className="ti ti-lock" style={{ fontSize:19, color:'#AFA9EC' }}/>
          </div>
          <div>
            <div style={{ fontSize:15, fontWeight:500 }}>Private room</div>
            <div style={{ fontSize:11, color:'#AFA9EC', marginTop:2 }}>create or join with a code</div>
          </div>
          <i className="ti ti-arrow-right" style={{ marginLeft:'auto', fontSize:16, color:'#AFA9EC' }}/>
        </button>

        <button className="btn-ghost" style={{ padding:'18px 22px', width:'100%', textAlign:'left', display:'flex', alignItems:'center', gap:14, fontSize:14, opacity:.4, cursor:'not-allowed' }} disabled>
          <div style={{ width:42, height:42, background:'#1a1a2e', borderRadius:11, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <i className="ti ti-world" style={{ fontSize:19, color:'#3a3a6a' }}/>
          </div>
          <div>
            <div style={{ fontSize:15, fontWeight:500, color:'#3a3a6a' }}>JamSesh online</div>
            <div style={{ fontSize:11, color:'#3a3a6a', marginTop:2 }}>join a public session</div>
          </div>
          <span style={{ marginLeft:'auto', background:'#1a1a2e', color:'#3a3a6a', fontSize:10, padding:'3px 9px', borderRadius:20, border:'1px solid #2a2a50' }}>coming soon</span>
        </button>

        <button className="btn-ghost" onClick={() => { patch({ mode: 'solo' }); go('solo-setup'); }}
          style={{ padding:'18px 22px', width:'100%', textAlign:'left', display:'flex', alignItems:'center', gap:14, fontSize:14 }}>
          <div style={{ width:42, height:42, background:'#2e1428', borderRadius:11, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
            <i className="ti ti-headphones" style={{ fontSize:19, color:'#D4537E' }}/>
          </div>
          <div>
            <div style={{ fontSize:15, fontWeight:500 }}>Solo mode</div>
            <div style={{ fontSize:11, color:'#7070aa', marginTop:2 }}>practice, charts, metronome</div>
          </div>
          <i className="ti ti-arrow-right" style={{ marginLeft:'auto', fontSize:16, color:'#5a5a8a' }}/>
        </button>
      </div>
    </div>
  );
}

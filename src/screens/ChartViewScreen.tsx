import React, { useState } from 'react';
import type { AppSetup } from '../App';
import type { Screen, ChartView } from '../types';

interface Props { go: (s: Screen) => void; setup: AppSetup; patch: (p: Partial<AppSetup>) => void; }

export default function ChartViewScreen({ go, setup }: Props) {
  const song = setup.activeSong;
  const [view, setView] = useState<ChartView>('num');

  return (
    <div className="screen">
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'10px 20px', borderBottom:'1px solid #13132a', flexShrink:0 }}>
        <span className="back-link" onClick={() => go('solo-setup')}>← library</span>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:14, fontWeight:500 }}>{song?.title ?? '—'}</span>
          {song && <>
            <span style={{ background:'#2a1e50', color:'#AFA9EC', fontSize:10, padding:'2px 7px', borderRadius:4 }}>Key {song.key}</span>
            <span style={{ color:'#5a5a8a', fontSize:11 }}>{song.bpm} BPM</span>
          </>}
        </div>
        <div style={{ display:'flex', gap:4 }}>
          {(['num','chord','lyric','pdf'] as ChartView[]).map(v => (
            <div key={v} className={`chip${view===v?' on':''}`} style={{ fontSize:10, padding:'3px 10px' }} onClick={() => setView(v)}>
              {v==='num'?'numbers':v==='chord'?'chords':v==='lyric'?'lyrics':'PDF view'}
            </div>
          ))}
        </div>
      </div>

      {/* Chart body */}
      <div style={{ flex:1, overflowY:'auto', padding:'24px 40px', maxWidth:700, margin:'0 auto', width:'100%' }}>
        {view === 'pdf' ? (
          <div style={{ textAlign:'center', padding:'40px 20px' }}>
            <i className="ti ti-file-upload" style={{ fontSize:36, color:'#533AB7', display:'block', margin:'0 auto 14px' }}/>
            <div style={{ fontSize:14, marginBottom:8 }}>No PDF uploaded for this song</div>
            <div style={{ color:'#5a5a8a', fontSize:12 }}>Upload a chord chart PDF — it will display here so you can sit back and scroll with arrow keys, no mouse needed.</div>
          </div>
        ) : song ? (
          song.sections.map((sec, si) => (
            <div key={si}>
              <div className="section-label">{sec.label}</div>
              {sec.lines.map((line, li) => (
                <div key={li} className="chart-line">
                  {view !== 'lyric' && <span className="chart-num">{view==='num' ? line.number : ''}</span>}
                  {view !== 'lyric' && <span className="chart-chord">{line.chord}</span>}
                  <span className="chart-lyric">{line.lyric}</span>
                </div>
              ))}
            </div>
          ))
        ) : (
          <div style={{ color:'#5a5a8a', textAlign:'center', paddingTop:40 }}>No song selected</div>
        )}
      </div>
    </div>
  );
}

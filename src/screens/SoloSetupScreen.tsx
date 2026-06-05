import React, { useState } from 'react';
import type { AppSetup } from '../App';
import type { Screen, Song } from '../types';
import { SAMPLE_SONGS } from '../lib/data';

interface Props { go: (s: Screen) => void; setup: AppSetup; patch: (p: Partial<AppSetup>) => void; }

type SoloTab = 'library' | 'upload' | 'metro';

export default function SoloSetupScreen({ go, setup, patch }: Props) {
  const [tab, setTab] = useState<SoloTab>('library');
  const [bpm, setBpm] = useState(76);
  const [timeSig, setTimeSig] = useState('4/4');
  const library: Song[] = setup.library ?? SAMPLE_SONGS;

  function openSong(song: Song) {
    patch({ activeSong: song });
    go('chart-view');
  }

  return (
    <div className="screen" style={{ flexDirection:'row' }}>
      {/* Sidebar */}
      <div style={{ width:340, padding:36, borderRight:'1px solid #13132a', display:'flex', flexDirection:'column', gap:20, flexShrink:0 }}>
        <span className="back-link" onClick={() => go('splash')}>← home</span>
        <div>
          <div style={{ fontSize:22, fontWeight:600, marginBottom:5 }}>Solo mode</div>
          <div style={{ color:'#5a5a8a', fontSize:13 }}>Practice charts, manage your library.</div>
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {([
            { key:'library', icon:'ti-books',          color:'#7F77DD', label:'Song library',  sub:'browse and view charts' },
            { key:'upload',  icon:'ti-upload',         color:'#1D9E75', label:'Upload charts', sub:'chords, numbers, PDF, lyrics' },
            { key:'metro',   icon:'ti-clock',          color:'#EF9F27', label:'Metronome',     sub:'tap tempo, time signatures' },
          ] as const).map(({ key, icon, color, label, sub }) => (
            <div key={key} onClick={() => setTab(key)} style={{
              background:'#1e1e3a', border:`2px solid ${tab===key?'#533AB7':'transparent'}`,
              borderRadius:14, padding:'14px 16px', cursor:'pointer', display:'flex', alignItems:'center', gap:12,
              transition:'border-color .15s'
            }}>
              <i className={`ti ${icon}`} style={{ fontSize:22, color }}/>
              <div>
                <div style={{ fontSize:13, fontWeight:500 }}>{label}</div>
                <div style={{ color:'#5a5a8a', fontSize:11, marginTop:2 }}>{sub}</div>
              </div>
            </div>
          ))}
          {/* NotePlay — coming soon */}
          <div style={{ background:'#1e1e3a', border:'2px solid #2a2a50', borderRadius:14, padding:'14px 16px', display:'flex', alignItems:'center', gap:12, opacity:.5, cursor:'not-allowed' }}>
            <i className="ti ti-device-gamepad-2" style={{ fontSize:22, color:'#D4537E' }}/>
            <div>
              <div style={{ fontSize:13, fontWeight:500 }}>NotePlay</div>
              <div style={{ color:'#5a5a8a', fontSize:11, marginTop:2 }}>coming soon</div>
            </div>
            <span style={{ marginLeft:'auto', background:'#1a1a2e', color:'#3a3a6a', fontSize:10, padding:'3px 9px', borderRadius:20, border:'1px solid #2a2a50' }}>soon</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex:1, padding:36, overflowY:'auto' }}>
        {tab === 'library' && (
          <div>
            <div style={{ fontSize:15, fontWeight:500, marginBottom:14 }}>Your library</div>
            <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
              {library.map(song => (
                <div key={song.id} onClick={() => openSong(song)} style={{ background:'#1e1e3a', borderRadius:12, padding:'14px 16px', display:'flex', alignItems:'center', gap:12, cursor:'pointer', transition:'background .1s' }}
                  onMouseEnter={e => (e.currentTarget.style.background='#2a2a50')}
                  onMouseLeave={e => (e.currentTarget.style.background='#1e1e3a')}>
                  <i className="ti ti-file-music" style={{ fontSize:18, color:'#7F77DD' }}/>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:13, fontWeight:500 }}>{song.title}</div>
                    <div style={{ color:'#5a5a8a', fontSize:10, marginTop:2 }}>{song.key} · {song.bpm} BPM · {song.chartType} chart</div>
                  </div>
                  <i className="ti ti-arrow-right" style={{ fontSize:14, color:'#5a5a8a' }}/>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === 'upload' && (
          <div>
            <div style={{ fontSize:15, fontWeight:500, marginBottom:14 }}>Upload a chart</div>
            <div style={{ border:'1.5px dashed #2a2a50', borderRadius:14, padding:32, textAlign:'center', cursor:'pointer', marginBottom:14 }}>
              <i className="ti ti-cloud-upload" style={{ fontSize:30, color:'#533AB7', display:'block', margin:'0 auto 10px' }}/>
              <div style={{ fontSize:13, fontWeight:500 }}>Drop files or click to browse</div>
              <div style={{ color:'#5a5a8a', fontSize:11, marginTop:4 }}>PDF, image, .txt, ChordPro</div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:14 }}>
              {[
                { label:'Song title', ph:'Way Maker' },
                { label:'Key', ph:'A major' },
                { label:'Tempo (BPM)', ph:'76' },
              ].map(({ label, ph }) => (
                <div key={label}>
                  <label style={{ color:'#7070aa', fontSize:11, display:'block', marginBottom:5 }}>{label}</label>
                  <input className="input-field" placeholder={ph}/>
                </div>
              ))}
              <div>
                <label style={{ color:'#7070aa', fontSize:11, display:'block', marginBottom:5 }}>Chart type</label>
                <select className="input-field">
                  <option>Number chart</option><option>Chord chart</option><option>Lyrics only</option>
                </select>
              </div>
            </div>
            <button className="btn-primary" style={{ width:'100%', padding:12, fontSize:14 }}>Save to library</button>
          </div>
        )}

        {tab === 'metro' && (
          <div>
            <div style={{ fontSize:15, fontWeight:500, marginBottom:14 }}>Metronome</div>
            <div style={{ background:'#1e1e3a', borderRadius:14, padding:28, textAlign:'center', marginBottom:14 }}>
              <div style={{ color:'#5a5a8a', fontSize:11, marginBottom:6 }}>tempo</div>
              <div style={{ fontSize:52, fontWeight:600, lineHeight:1 }}>{bpm}</div>
              <div style={{ color:'#5a5a8a', fontSize:12, marginBottom:16 }}>BPM</div>
              <input type="range" min={40} max={220} value={bpm} step={1}
                onChange={e => setBpm(Number(e.target.value))}
                style={{ width:'85%', display:'block', margin:'0 auto' }}/>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:8, marginBottom:12 }}>
              {['4/4','3/4','6/8','5/4'].map(ts => (
                <div key={ts} onClick={() => setTimeSig(ts)} style={{
                  background: timeSig===ts ? '#533AB7' : '#1e1e3a',
                  borderRadius:10, padding:12, textAlign:'center', cursor:'pointer', fontSize:13, fontWeight:500,
                  transition:'background .1s'
                }}>{ts}</div>
              ))}
            </div>
            <button style={{ width:'100%', background:'#1D9E75', border:'none', borderRadius:12, padding:14, color:'#E1F5EE', fontSize:14, fontWeight:500, cursor:'pointer', fontFamily:'inherit' }}>
              Tap tempo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

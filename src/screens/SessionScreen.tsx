import React, { useState, useEffect, useRef } from 'react';
import type { AppSetup } from '../App';
import type { Screen, ChartView, MDMode, Song } from '../types';

interface Props { go: (s: Screen) => void; setup: AppSetup; patch: (p: Partial<AppSetup>) => void; }

const DEMO_PLAYERS = [
  { id:'p1', name:'Nicko',  role:'MD',     color:'#7F77DD', instrument:'keys'   },
  { id:'p2', name:'Jordan', role:'player', color:'#D4537E', instrument:'guitar'  },
];

export default function SessionScreen({ go, setup }: Props) {
  const { room, library, activeSong } = setup;
  const [bandVisible,   setBandVisible]   = useState(true);
  const [songsOpen,     setSongsOpen]     = useState(true);
  const [mdOpen,        setMdOpen]        = useState(false);
  const [chartView,     setChartView]     = useState<ChartView>('num');
  const [mdMode,        setMdMode]        = useState<MDMode>('voice');
  const [isRecording,   setIsRecording]   = useState(false);
  const [currentNumber, setCurrentNumber] = useState<string>('—');
  const [litNumber,     setLitNumber]     = useState<string>('');
  const [listening,     setListening]     = useState(false);
  const [vsStatus,      setVsStatus]      = useState('tap mic — say a number');
  const [mdMicOn,       setMdMicOn]       = useState(true);
  const [volumes,       setVolumes]       = useState<Record<string,number>>({ p1:30, p2:55 });
  const [beat,          setBeat]          = useState(0);
  const [selectedSong,  setSelectedSong]  = useState<Song | null>(activeSong ?? library[0] ?? null);

  // beat ticker
  useEffect(() => {
    const iv = setInterval(() => {
      setBeat(b => (b + 1) % 4);
      setVolumes({ p1: 15 + Math.random()*75, p2: 20 + Math.random()*70 });
    }, 420);
    return () => clearInterval(iv);
  }, []);

  // voice simulation
  const voiceRef = useRef<ReturnType<typeof setInterval>|null>(null);
  const words = ['one','five','four','six','one','five','two'];
  const vMap: Record<string,string> = { one:'1',two:'2',three:'3',four:'4',five:'5',six:'6',seven:'7' };
  let vIdx = useRef(0);
  function toggleListen() {
    if (listening) {
      setListening(false);
      if (voiceRef.current) clearInterval(voiceRef.current);
      setVsStatus('tap mic — say a number');
    } else {
      setListening(true);
      voiceRef.current = setInterval(() => {
        const w = words[vIdx.current % words.length]; vIdx.current++;
        setVsStatus(`heard: "${w}"`);
        const n = vMap[w];
        if (n) { setCurrentNumber(n); setLitNumber(n); }
      }, 2000);
    }
  }

  function callManual(n: string) { setCurrentNumber(n); setLitNumber(n); }

  const panelCount = (songsOpen ? 1 : 0) + (mdOpen ? 1 : 0);

  return (
    <div className="screen" style={{ flexDirection:'row' }}>
      {/* ── Main column ── */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0, overflow:'hidden' }}>

        {/* Top bar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'8px 14px', borderBottom:'1px solid #13132a', flexShrink:0, gap:8 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div style={{ width:7, height:7, borderRadius:'50%', background: isRecording ? '#E24B4A' : '#1D9E75', animation: isRecording ? 'blink 1s infinite' : 'none' }}/>
            <span style={{ color:'#5a5a8a', fontSize:11 }}>{isRecording ? 'recording' : 'live'}</span>
            <span style={{ background:'#1e1e3a', color:'#5a5a8a', fontSize:10, padding:'2px 9px', borderRadius:20, marginLeft:4 }}>{room?.code ?? 'JAM·????'}</span>
            <span style={{ color:'#5a5a8a', fontSize:11 }}>{room?.name ?? 'Room'}</span>
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:4 }}>
            <div className={`tbtn${bandVisible?' active':''}`} onClick={() => setBandVisible(v => !v)}>
              <i className="ti ti-users" style={{ fontSize:13 }}/> Band
            </div>
            <div className={`tbtn${songsOpen?' active':''}`} onClick={() => setSongsOpen(v => !v)}>
              <i className="ti ti-playlist" style={{ fontSize:13 }}/> Set list
            </div>
            <div className="tbtn active">
              <i className="ti ti-file-music" style={{ fontSize:13 }}/> Chart
            </div>
            <div className={`tbtn${mdOpen?' active':''}`} onClick={() => setMdOpen(v => !v)}>
              <i className="ti ti-antenna" style={{ fontSize:13 }}/> MD
            </div>
            <div className="divider-v"/>
            <div className={`tbtn${isRecording?' active':''}`} onClick={() => setIsRecording(r => !r)}>
              <i className="ti ti-player-record" style={{ fontSize:13, color:'#E24B4A' }}/>
              {isRecording ? ' Stop' : ' Record'}
            </div>
            <div className="tbtn"><i className="ti ti-microphone" style={{ fontSize:13 }}/> Mic</div>
            <div className="tbtn"><i className="ti ti-video" style={{ fontSize:13 }}/> Camera</div>
            <div className="tbtn"><i className="ti ti-message" style={{ fontSize:13 }}/> Chat</div>
            <div className="divider-v"/>
            <div onClick={() => go('splash')} style={{ background:'#2e1a1a', color:'#F09595', fontSize:11, padding:'5px 12px', borderRadius:8, cursor:'pointer', fontWeight:500, whiteSpace:'nowrap' }}>
              Leave room
            </div>
          </div>
        </div>

        {/* Band view */}
        {bandVisible && (
          <div style={{ padding:'8px 14px', borderBottom:'1px solid #13132a', display:'flex', gap:10, alignItems:'center', flexShrink:0 }}>
            {DEMO_PLAYERS.map(p => (
              <div key={p.id} style={{ background:'#13132a', borderRadius:12, padding:'8px 12px', display:'flex', alignItems:'center', gap:10, border:`1.5px solid ${p.role==='MD'?'#533AB7':'transparent'}` }}>
                <div style={{ width:36, height:36, borderRadius:'50%', border:`2px solid ${p.color}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  <i className="ti ti-user" style={{ fontSize:16, color:p.color }}/>
                </div>
                <div>
                  <div style={{ fontSize:12, fontWeight:500 }}>
                    {p.name}
                    {p.role==='MD' && <span style={{ background:'#533AB7', color:'#EEEDFE', fontSize:9, padding:'1px 5px', borderRadius:3, marginLeft:5 }}>MD</span>}
                  </div>
                  <div style={{ color:p.color, fontSize:10 }}>{p.instrument}</div>
                  <div className="vol-track">
                    <div className="vol-bar" style={{ width:`${volumes[p.id]}%`, background:p.color }}/>
                  </div>
                </div>
              </div>
            ))}
            <span style={{ color:'#3a3a6a', fontSize:11, marginLeft:'auto', cursor:'pointer' }} onClick={() => setBandVisible(false)}>hide ↑</span>
          </div>
        )}

        {/* Content row */}
        <div style={{ flex:1, display:'flex', overflow:'hidden', minHeight:0 }}>

          {/* Song list */}
          {songsOpen && (
            <div style={{ width:220, borderRight:'1px solid #13132a', display:'flex', flexDirection:'column', overflow:'hidden', flexShrink:0 }}>
              <div style={{ padding:'8px 12px', borderBottom:'1px solid #13132a' }}>
                <div style={{ color:'#7070aa', fontSize:10, textTransform:'uppercase', letterSpacing:'.8px' }}>Set list</div>
              </div>
              <div style={{ flex:1, overflowY:'auto', padding:'6px 8px' }}>
                {library.map(song => (
                  <div key={song.id} className={`srow${selectedSong?.id===song.id?' now':''}`} onClick={() => setSelectedSong(song)}>
                    <div style={{ width:4, height:4, borderRadius:'50%', background: selectedSong?.id===song.id ? '#7F77DD' : '#2a2a50', flexShrink:0 }}/>
                    <div style={{ minWidth:0 }}>
                      <div style={{ fontSize:12, fontWeight: selectedSong?.id===song.id ? 500 : 400, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis', color: selectedSong?.id===song.id ? '#EEEDFE' : '#7070aa' }}>
                        {song.title}
                      </div>
                      <div style={{ color:'#5a5a8a', fontSize:10 }}>{song.key} · {song.bpm} BPM</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Chart */}
          <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 }}>
            {/* Chart header */}
            <div style={{ padding:'8px 14px', borderBottom:'1px solid #13132a', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0, gap:8 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, minWidth:0 }}>
                <span style={{ fontSize:14, fontWeight:500, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{selectedSong?.title ?? '—'}</span>
                {selectedSong && <>
                  <span style={{ background:'#2a1e50', color:'#AFA9EC', fontSize:10, padding:'2px 7px', borderRadius:4, flexShrink:0 }}>Key {selectedSong.key}</span>
                  <span style={{ color:'#5a5a8a', fontSize:11, flexShrink:0 }}>{selectedSong.bpm} BPM</span>
                </>}
                {/* Beat indicator */}
                <div style={{ display:'flex', gap:3, marginLeft:8, flexShrink:0 }}>
                  {[0,1,2,3].map(i => (
                    <div key={i} style={{ width:18, height:3, borderRadius:2, background: i===beat ? '#533AB7' : '#1e1e3a', transition:'background .1s' }}/>
                  ))}
                </div>
              </div>
              <div style={{ display:'flex', gap:4, flexShrink:0 }}>
                {(['num','chord','lyric','pdf'] as ChartView[]).map(v => (
                  <div key={v} className={`chip${chartView===v?' on':''}`} style={{ fontSize:10, padding:'3px 10px' }} onClick={() => setChartView(v)}>
                    {v==='num'?'numbers':v==='chord'?'chords':v==='lyric'?'lyrics':'PDF view'}
                  </div>
                ))}
              </div>
            </div>

            {/* Chart body */}
            <div style={{ flex:1, overflowY:'auto', padding:'16px 20px' }}>
              {chartView === 'pdf' ? (
                <div style={{ textAlign:'center', padding:'40px 20px' }}>
                  <i className="ti ti-file-upload" style={{ fontSize:32, color:'#533AB7', display:'block', margin:'0 auto 12px' }}/>
                  <div style={{ fontSize:14, marginBottom:8 }}>No PDF for this song yet</div>
                  <div style={{ color:'#5a5a8a', fontSize:12 }}>Upload a chart PDF and it will display here — sit back and scroll with arrow keys.</div>
                  <button className="btn-primary" style={{ marginTop:14, padding:'10px 20px', fontSize:13 }}>Upload PDF chart</button>
                </div>
              ) : selectedSong ? (
                selectedSong.sections.map((sec, si) => (
                  <div key={si}>
                    <div className="section-label">{sec.label}</div>
                    {sec.lines.map((line, li) => (
                      <div key={li} className="chart-line">
                        {chartView !== 'lyric' && <span className="chart-num">{chartView==='num' ? line.number : ''}</span>}
                        {chartView !== 'lyric' && <span className="chart-chord">{line.chord}</span>}
                        <span className="chart-lyric">{line.lyric}</span>
                      </div>
                    ))}
                  </div>
                ))
              ) : (
                <div style={{ color:'#5a5a8a', fontSize:13, textAlign:'center', paddingTop:40 }}>Select a song from the set list</div>
              )}
            </div>
          </div>

          {/* MD panel */}
          {mdOpen && (
            <div style={{ width:240, borderLeft:'1px solid #13132a', display:'flex', flexDirection:'column', overflow:'hidden', flexShrink:0 }}>
              <div style={{ padding:'8px 14px', borderBottom:'1px solid #13132a' }}>
                <div style={{ color:'#7070aa', fontSize:10, textTransform:'uppercase', letterSpacing:'.8px' }}>MD controls</div>
              </div>
              <div style={{ flex:1, overflowY:'auto', padding:'10px 12px', display:'flex', flexDirection:'column', gap:10 }}>
                {/* Current number display */}
                <div style={{ background:'#0c0c1e', borderRadius:12, padding:'14px', textAlign:'center' }}>
                  <div style={{ color:'#5a5a8a', fontSize:10, marginBottom:4 }}>calling</div>
                  <div style={{ color:'#7F77DD', fontSize:44, fontWeight:600, lineHeight:1 }}>{currentNumber}</div>
                </div>

                {/* Mode chips */}
                <div style={{ display:'flex', gap:4 }}>
                  {(['voice','auto','manual'] as MDMode[]).map(m => (
                    <div key={m} className={`chip${mdMode===m?' on':''}`} style={{ fontSize:10, padding:'3px 10px', flex:1, textAlign:'center' }} onClick={() => setMdMode(m)}>{m}</div>
                  ))}
                </div>

                {/* Voice mode */}
                {mdMode === 'voice' && (
                  <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
                    <div style={{ background:'#0c0c1e', borderRadius:10, padding:10, display:'flex', alignItems:'center', gap:10 }}>
                      <div onClick={toggleListen} style={{ width:38, height:38, borderRadius:'50%', background: listening ? '#2a1e50' : '#1e1e3a', border:`2px solid ${listening?'#7F77DD':'#2a2a50'}`, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', flexShrink:0 }}>
                        <i className="ti ti-microphone" style={{ fontSize:16, color: listening ? '#7F77DD' : '#5a5a8a' }}/>
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:11 }}>{vsStatus}</div>
                        <div style={{ color:'#5a5a8a', fontSize:10, marginTop:1 }}>say "one" through "seven"</div>
                      </div>
                    </div>
                    <div style={{ background:'#0c0c1e', borderRadius:10, padding:'8px 12px', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <div>
                        <div style={{ fontSize:11, fontWeight:500 }}>MD mic to band</div>
                        <div style={{ color:'#5a5a8a', fontSize:10 }}>mutes during recording</div>
                      </div>
                      <div className={`toggle${mdMicOn?' on':''}`} onClick={() => setMdMicOn(v => !v)}>
                        <div className="toggle-thumb"/>
                      </div>
                    </div>
                  </div>
                )}

                {/* Auto mode */}
                {mdMode === 'auto' && (
                  <div style={{ background:'#0c0c1e', borderRadius:10, padding:'10px 12px', display:'flex', alignItems:'center', gap:10 }}>
                    <div style={{ width:8, height:8, borderRadius:'50%', background:'#1D9E75', flexShrink:0 }}/>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:11 }}>detecting chord in real time</div>
                      <div style={{ color:'#5a5a8a', fontSize:10 }}>key of A — plays what you play</div>
                    </div>
                    <div style={{ background:'#533AB7', borderRadius:6, padding:'3px 10px', fontSize:16, fontWeight:500 }}>{currentNumber}</div>
                  </div>
                )}

                {/* Manual mode */}
                {mdMode === 'manual' && (
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:4 }}>
                    {['1','2','3','4','5','6','7','♭'].map(n => (
                      <div key={n} className={`nb${litNumber===n?' lit':''}`} onClick={() => callManual(n)}>{n}</div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

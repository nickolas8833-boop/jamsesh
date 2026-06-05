import React, { useState } from 'react';
import type { AppSetup } from '../App';
import type { Room, Screen } from '../types';

interface Props {
  go: (s: Screen) => void;
  setup: AppSetup;
  patch: (p: Partial<AppSetup>) => void;
  onSubmit: (room: Partial<Room>) => void;
}

const KEYS = ['A','Bb','B','C','C#','D','Eb','E','F','F#','G','Ab'];

export default function PrivateSetupScreen({ go, onSubmit }: Props) {
  const [name, setName]       = useState('Sunday Worship Band');
  const [maxSize, setMaxSize] = useState('4');
  const [type, setType]       = useState<Room['sessionType']>('worship');
  const [key, setKey]         = useState('A');
  const [notes, setNotes]     = useState('');
  const [joinCode, setJoinCode] = useState('');

  function handleCreate() {
    onSubmit({ name, maxSize: parseInt(maxSize), sessionType: type, defaultKey: key, notes });
  }

  return (
    <div className="screen" style={{ flexDirection:'row' }}>
      {/* Left: create */}
      <div style={{ width:460, padding:'36px 36px', borderRight:'1px solid #13132a', display:'flex', flexDirection:'column', gap:20, overflowY:'auto' }}>
        <span className="back-link" onClick={() => go('splash')}>← home</span>
        <div>
          <div style={{ fontSize:22, fontWeight:600, marginBottom:5 }}>Create a room</div>
          <div style={{ color:'#5a5a8a', fontSize:13 }}>Set up your session before inviting others.</div>
        </div>

        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <div>
            <label style={{ color:'#7070aa', fontSize:11, display:'block', marginBottom:5 }}>Group / Band name</label>
            <input className="input-field" value={name} onChange={e => setName(e.target.value)} placeholder="Sunday Worship Band"/>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
            <div>
              <label style={{ color:'#7070aa', fontSize:11, display:'block', marginBottom:5 }}>Max players</label>
              <select className="input-field" value={maxSize} onChange={e => setMaxSize(e.target.value)}>
                {[2,3,4,5,6,8,10,12].map(n => <option key={n}>{n} players</option>)}
              </select>
            </div>
            <div>
              <label style={{ color:'#7070aa', fontSize:11, display:'block', marginBottom:5 }}>Session type</label>
              <select className="input-field" value={type} onChange={e => setType(e.target.value as Room['sessionType'])}>
                <option value="worship">Worship</option>
                <option value="rehearsal">Rehearsal</option>
                <option value="jam">Jam session</option>
                <option value="recording">Recording</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ color:'#7070aa', fontSize:11, display:'block', marginBottom:7 }}>Default key</label>
            <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
              {KEYS.map(k => (
                <div key={k} className={`chip${key===k?' on':''}`} onClick={() => setKey(k)}>{k}</div>
              ))}
            </div>
          </div>

          <div>
            <label style={{ color:'#7070aa', fontSize:11, display:'block', marginBottom:5 }}>
              Notes for players <span style={{ color:'#3a3a6a' }}>(optional)</span>
            </label>
            <textarea className="input-field" value={notes} onChange={e => setNotes(e.target.value)}
              placeholder="e.g. Set list attached, transposing to Bb tonight…"
              style={{ resize:'none', height:64 }}/>
          </div>
        </div>

        <button className="btn-primary" onClick={handleCreate} style={{ padding:14, fontSize:15, marginTop:'auto' }}>
          Continue →
        </button>
      </div>

      {/* Right: join */}
      <div style={{ flex:1, padding:36, display:'flex', flexDirection:'column', gap:20 }}>
        <div style={{ color:'#5a5a8a', fontSize:13 }}>or join an existing room</div>
        <div style={{ background:'#13132a', borderRadius:14, padding:22, display:'flex', flexDirection:'column', gap:12 }}>
          <div style={{ fontSize:14, fontWeight:500 }}>Enter invite code</div>
          <div style={{ display:'flex', gap:8 }}>
            <input className="input-field" value={joinCode}
              onChange={e => setJoinCode(e.target.value.toUpperCase())}
              placeholder="JAM·XXXX"
              style={{ letterSpacing:3, textTransform:'uppercase' }}/>
            <button className="btn-primary" onClick={() => go('role')}
              style={{ padding:'10px 18px', fontSize:13, whiteSpace:'nowrap' }}>
              Join
            </button>
          </div>
        </div>
        <div style={{ color:'#3a3a6a', fontSize:11, textAlign:'center', marginTop:'auto' }}>
          Room codes expire after 24 hours of inactivity.
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import type { AppSetup } from '../App';
import type { Screen, Instrument } from '../types';
import { AV_SUBS, AV_LABELS } from '../lib/data';

interface Props { go: (s: Screen) => void; setup: AppSetup; patch: (p: Partial<AppSetup>) => void; }

const INSTRUMENTS: { key: Instrument; label: string; svg: React.ReactNode }[] = [
  { key:'keys', label:'Keys', svg: <svg width="44" height="44" viewBox="0 0 44 44"><rect x="4" y="14" width="36" height="18" rx="3" fill="#2a1e50" stroke="#7F77DD" strokeWidth="1.5"/><rect x="7" y="18" width="5" height="9" rx="1" fill="#EEEDFE" opacity=".9"/><rect x="13.5" y="18" width="5" height="9" rx="1" fill="#EEEDFE" opacity=".9"/><rect x="20" y="18" width="5" height="9" rx="1" fill="#EEEDFE" opacity=".9"/><rect x="26.5" y="18" width="5" height="9" rx="1" fill="#EEEDFE" opacity=".9"/><rect x="33" y="18" width="4" height="9" rx="1" fill="#EEEDFE" opacity=".9"/><rect x="10" y="18" width="3.5" height="6" rx="1" fill="#1a1a2e"/><rect x="23" y="18" width="3.5" height="6" rx="1" fill="#1a1a2e"/></svg> },
  { key:'guitar', label:'Guitar', svg: <svg width="44" height="44" viewBox="0 0 44 44"><ellipse cx="22" cy="30" rx="9" ry="7" fill="#2e1428" stroke="#D4537E" strokeWidth="1.5"/><rect x="20" y="10" width="4" height="22" rx="2" fill="#2e1428" stroke="#D4537E" strokeWidth="1.5"/><rect x="17" y="10" width="10" height="3.5" rx="1.5" fill="#2e1428" stroke="#D4537E" strokeWidth="1.5"/></svg> },
  { key:'bass', label:'Bass', svg: <svg width="44" height="44" viewBox="0 0 44 44"><ellipse cx="22" cy="31" rx="8" ry="6" fill="#0e3028" stroke="#1D9E75" strokeWidth="1.5"/><rect x="20" y="8" width="4" height="25" rx="2" fill="#0e3028" stroke="#1D9E75" strokeWidth="1.5"/><rect x="18" y="8" width="8" height="3" rx="1.5" fill="#0e3028" stroke="#1D9E75" strokeWidth="1.5"/></svg> },
  { key:'drums', label:'Drums', svg: <svg width="44" height="44" viewBox="0 0 44 44"><ellipse cx="22" cy="29" rx="13" ry="6" fill="#2e1428" stroke="#EF9F27" strokeWidth="1.5"/><ellipse cx="22" cy="23" rx="13" ry="6" fill="#2e1428" stroke="#EF9F27" strokeWidth="1.5"/><ellipse cx="12" cy="18" rx="6" ry="3" fill="#2e1428" stroke="#EF9F27" strokeWidth="1.2"/></svg> },
  { key:'vocals', label:'Vocals', svg: <svg width="44" height="44" viewBox="0 0 44 44"><rect x="16" y="9" width="12" height="16" rx="6" fill="#1a2e3a" stroke="#378ADD" strokeWidth="1.5"/><path d="M12 24 Q12 32 22 32 Q32 32 32 24" fill="none" stroke="#378ADD" strokeWidth="1.5"/><line x1="22" y1="32" x2="22" y2="37" stroke="#378ADD" strokeWidth="1.5"/><line x1="16" y1="37" x2="28" y2="37" stroke="#378ADD" strokeWidth="1.5"/></svg> },
  { key:'cajon', label:'Cajon', svg: <svg width="44" height="44" viewBox="0 0 44 44"><rect x="13" y="10" width="18" height="24" rx="3" fill="#2e1e0e" stroke="#EF9F27" strokeWidth="1.5"/><ellipse cx="22" cy="20" rx="5" ry="6" fill="none" stroke="#EF9F27" strokeWidth=".9" opacity=".6"/></svg> },
  { key:'acoustic', label:'Acoustic', svg: <svg width="44" height="44" viewBox="0 0 44 44"><ellipse cx="22" cy="30" rx="10" ry="8" fill="#1e1a10" stroke="#BA7517" strokeWidth="1.5"/><ellipse cx="22" cy="30" rx="4" ry="4" fill="none" stroke="#BA7517" strokeWidth=".9" opacity=".5"/><rect x="20" y="9" width="4" height="23" rx="2" fill="#1e1a10" stroke="#BA7517" strokeWidth="1.5"/><rect x="17" y="9" width="10" height="3.5" rx="2" fill="#1e1a10" stroke="#BA7517" strokeWidth="1.5"/></svg> },
  { key:'other', label:'Other', svg: <svg width="44" height="44" viewBox="0 0 44 44"><circle cx="22" cy="22" r="14" fill="#1a1a2e" stroke="#888780" strokeWidth="1.5"/><text x="22" y="27" textAnchor="middle" fontSize="16" fill="#888780">+</text></svg> },
];

export default function InstrumentScreen({ go, setup, patch }: Props) {
  const { instrument, subtype } = setup;
  const subs = AV_SUBS[instrument] ?? [];

  function pickInstrument(key: Instrument) {
    patch({ instrument: key, subtype: AV_SUBS[key]?.[0] ?? '' });
  }

  return (
    <div className="screen" style={{ padding:'32px 36px', gap:20, overflowY:'auto' }}>
      <span className="back-link" onClick={() => go('role')}>← back</span>

      <div>
        <div style={{ fontSize:20, fontWeight:600, marginBottom:5 }}>Who are you in the band?</div>
        <div style={{ color:'#5a5a8a', fontSize:12 }}>Your avatar shows this to everyone in the room.</div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(8,1fr)', gap:10 }}>
        {INSTRUMENTS.map(({ key, label, svg }) => (
          <div key={key} className={`av${instrument===key?' sel':''}`} onClick={() => pickInstrument(key)}>
            <div style={{ display:'block', margin:'0 auto 6px' }}>{svg}</div>
            <div style={{ fontSize:11, fontWeight:500 }}>{label}</div>
          </div>
        ))}
      </div>

      <div style={{ background:'#13132a', borderRadius:12, padding:'12px 14px' }}>
        <div style={{ color:'#5a5a8a', fontSize:11, marginBottom:8 }}>{AV_LABELS[instrument] ?? 'type?'}</div>
        <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
          {subs.map(s => (
            <div key={s} className={`chip${subtype===s?' on':''}`} onClick={() => patch({ subtype: s })}>{s}</div>
          ))}
        </div>
      </div>

      <button className="btn-primary" onClick={() => go('input')} style={{ padding:14, fontSize:15, marginTop:'auto' }}>
        Choose input device →
      </button>
    </div>
  );
}

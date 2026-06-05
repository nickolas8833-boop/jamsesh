import React, { useState } from 'react';
import type { AppSetup } from '../App';
import type { Screen, InputDevice } from '../types';

interface Props { go: (s: Screen) => void; setup: AppSetup; patch: (p: Partial<AppSetup>) => void; }

const INPUTS: { key: InputDevice; label: string; sub: string; icon: string; color: string }[] = [
  { key:'usb',       label:'USB / MIDI direct',      sub:'keyboard, pad, or controller plugged in', icon:'ti-usb',       color:'#7F77DD' },
  { key:'interface', label:'Audio interface',         sub:'guitar, bass, or vocal mic through interface', icon:'ti-plug', color:'#1D9E75' },
  { key:'mic',       label:'Built-in / headset mic',  sub:'vocals or acoustic, no interface', icon:'ti-microphone',      color:'#D4537E' },
];

export default function InputScreen({ go, setup, patch }: Props) {
  const { inputDevice } = setup;
  return (
    <div className="screen" style={{ padding:'32px 36px', gap:20 }}>
      <span className="back-link" onClick={() => go('instrument')}>← back</span>
      <div>
        <div style={{ fontSize:20, fontWeight:600, marginBottom:5 }}>How is your instrument connected?</div>
        <div style={{ color:'#5a5a8a', fontSize:12 }}>Helps JamSesh pick up your audio correctly.</div>
      </div>

      <div style={{ display:'flex', flexDirection:'column', gap:10, maxWidth:520 }}>
        {INPUTS.map(({ key, label, sub, icon, color }) => (
          <div key={key} onClick={() => patch({ inputDevice: key })} style={{
            background:'#1e1e3a', border:`2px solid ${inputDevice===key?'#533AB7':'transparent'}`,
            borderRadius:14, padding:'16px 18px', cursor:'pointer', display:'flex', alignItems:'center', gap:14,
            transition:'border-color .15s'
          }}>
            <i className={`ti ${icon}`} style={{ fontSize:22, color, flexShrink:0 }}/>
            <div>
              <div style={{ fontSize:13, fontWeight:500 }}>{label}</div>
              <div style={{ color:'#7070aa', fontSize:11, marginTop:2 }}>{sub}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background:'#13132a', borderRadius:12, padding:14, display:'flex', alignItems:'center', gap:12, maxWidth:520 }}>
        <div style={{ width:10, height:10, borderRadius:'50%', background:'#1D9E75', flexShrink:0 }}/>
        <div>
          <div style={{ fontSize:12, fontWeight:500 }}>Roland A-49 detected</div>
          <div style={{ color:'#5a5a8a', fontSize:11 }}>MIDI input ready — latency 4ms</div>
        </div>
      </div>

      <button className="btn-primary" onClick={() => go('lobby')} style={{ padding:14, fontSize:15, maxWidth:520, marginTop:'auto' }}>
        Enter lobby →
      </button>
    </div>
  );
}

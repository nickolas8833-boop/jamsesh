import React, { useState, useCallback } from 'react';
import type { Screen, UserRole, Instrument, InputDevice, Song, Room } from './types';
import { SAMPLE_SONGS, generateRoomCode } from './lib/data';

// Screens
import SplashScreen        from './screens/SplashScreen';
import PrivateSetupScreen  from './screens/PrivateSetupScreen';
import RoleScreen          from './screens/RoleScreen';
import InstrumentScreen    from './screens/InstrumentScreen';
import InputScreen         from './screens/InputScreen';
import LobbyScreen         from './screens/LobbyScreen';
import SessionScreen       from './screens/SessionScreen';
import SoloSetupScreen     from './screens/SoloSetupScreen';
import ChartViewScreen     from './screens/ChartViewScreen';

export interface AppSetup {
  mode: 'private' | 'solo' | null;
  role: UserRole;
  instrument: Instrument;
  subtype: string;
  inputDevice: InputDevice;
  room: Room | null;
  library: Song[];
  activeSong: Song | null;
}

const DEFAULT_SETUP: AppSetup = {
  mode: null,
  role: 'md',
  instrument: 'keys',
  subtype: 'Grand piano',
  inputDevice: 'usb',
  room: null,
  library: SAMPLE_SONGS,
  activeSong: SAMPLE_SONGS[0],
};

export default function App() {
  const [screen, setScreen] = useState<Screen>('splash');
  const [setup, setSetup] = useState<AppSetup>(DEFAULT_SETUP);

  const go = useCallback((s: Screen) => setScreen(s), []);
  const patch = useCallback((p: Partial<AppSetup>) => setSetup(prev => ({ ...prev, ...p })), []);

  const startPrivate = useCallback((roomConfig: Partial<Room>) => {
    const code = generateRoomCode();
    patch({
      mode: 'private',
      room: {
        code,
        name: roomConfig.name ?? 'My Room',
        maxSize: roomConfig.maxSize ?? 4,
        sessionType: roomConfig.sessionType ?? 'worship',
        defaultKey: roomConfig.defaultKey ?? 'A',
        notes: roomConfig.notes ?? '',
        currentSongId: null,
        currentNumber: null,
        players: [],
      },
    });
    go('role');
  }, [go, patch]);

  const commonProps = { go, setup, patch };

  return (
    <div className="app fade-up">
      {screen === 'splash'         && <SplashScreen         {...commonProps} />}
      {screen === 'private-setup'  && <PrivateSetupScreen   {...commonProps} onSubmit={startPrivate} />}
      {screen === 'role'           && <RoleScreen           {...commonProps} />}
      {screen === 'instrument'     && <InstrumentScreen     {...commonProps} />}
      {screen === 'input'          && <InputScreen          {...commonProps} />}
      {screen === 'lobby'          && <LobbyScreen          {...commonProps} />}
      {screen === 'session'        && <SessionScreen        {...commonProps} />}
      {screen === 'solo-setup'     && <SoloSetupScreen      {...commonProps} />}
      {screen === 'chart-view'     && <ChartViewScreen      {...commonProps} />}
    </div>
  );
}

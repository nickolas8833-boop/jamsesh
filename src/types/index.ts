export type UserRole = 'md' | 'player';
export type Instrument = 'keys'|'guitar'|'bass'|'drums'|'vocals'|'cajon'|'acoustic'|'other';
export type InputDevice = 'usb'|'interface'|'mic';
export type ChartView = 'num'|'chord'|'lyric'|'pdf';
export type MDMode = 'voice'|'auto'|'manual';

export interface Player {
  id: string;
  name: string;
  instrument: Instrument;
  subtype: string;
  role: UserRole;
  latencyMs: number;
  volumePct: number;
  connected: boolean;
}

export interface ChartLine {
  number: string;
  chord: string;
  lyric: string;
}

export interface Section {
  label: string;
  lines: ChartLine[];
}

export interface Song {
  id: string;
  title: string;
  key: string;
  bpm: number;
  chartType: 'number'|'chord'|'lyric';
  hasPdf: boolean;
  pdfUrl?: string;
  sections: Section[];
}

export interface Room {
  code: string;
  name: string;
  maxSize: number;
  sessionType: 'worship'|'rehearsal'|'jam'|'recording';
  defaultKey: string;
  notes: string;
  currentSongId: string|null;
  currentNumber: string|null;
  players: Player[];
}

export type Screen =
  | 'splash' | 'private-setup' | 'role' | 'instrument'
  | 'input' | 'lobby' | 'session' | 'solo-setup' | 'chart-view';

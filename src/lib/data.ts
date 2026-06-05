import type { Song } from '../types';

export const SAMPLE_SONGS: Song[] = [
  {
    id: 'way-maker',
    title: 'Way Maker',
    key: 'A',
    bpm: 76,
    chartType: 'number',
    hasPdf: false,
    sections: [
      {
        label: 'Verse',
        lines: [
          { number: '1',  chord: 'A',   lyric: 'You are here, moving in our midst' },
          { number: '5',  chord: 'E',   lyric: 'I worship You, I worship You' },
          { number: '6m', chord: 'F#m', lyric: 'You are here, working in this place' },
          { number: '4',  chord: 'D',   lyric: 'I worship You, I worship You' },
        ],
      },
      {
        label: 'Chorus',
        lines: [
          { number: '1',  chord: 'A',   lyric: 'Way Maker, Miracle Worker' },
          { number: '5',  chord: 'E',   lyric: 'Promise Keeper, Light in the darkness' },
          { number: '6m', chord: 'F#m', lyric: 'My God, that is who You are' },
          { number: '4',  chord: 'D',   lyric: 'That is who You are' },
        ],
      },
      {
        label: 'Bridge',
        lines: [
          { number: '6m', chord: 'F#m', lyric: "Even when I don't see it, You're working" },
          { number: '4',  chord: 'D',   lyric: "Even when I can't feel it, You're working" },
          { number: '1',  chord: 'A',   lyric: "You never stop, You never stop working" },
          { number: '5',  chord: 'E',   lyric: "You never stop, You never stop working" },
        ],
      },
    ],
  },
  {
    id: 'goodness-of-god',
    title: 'Goodness of God',
    key: 'Bb',
    bpm: 68,
    chartType: 'chord',
    hasPdf: false,
    sections: [
      {
        label: 'Verse',
        lines: [
          { number: '1',  chord: 'Bb',  lyric: "I love You Lord, Oh Your mercy never fails me" },
          { number: '4',  chord: 'Eb',  lyric: "All my days, I've been held in Your hands" },
          { number: '1',  chord: 'Bb',  lyric: "From the moment that I wake up" },
          { number: '5',  chord: 'F',   lyric: "Until I lay my head" },
        ],
      },
      {
        label: 'Chorus',
        lines: [
          { number: '1',  chord: 'Bb',  lyric: "Cause all my life You have been faithful" },
          { number: '4',  chord: 'Eb',  lyric: "And all my life You have been so, so good" },
          { number: '1',  chord: 'Bb',  lyric: "With every breath that I am able" },
          { number: '5',  chord: 'F',   lyric: "Oh I will sing of the goodness of God" },
        ],
      },
    ],
  },
  {
    id: 'build-my-life',
    title: 'Build My Life',
    key: 'G',
    bpm: 72,
    chartType: 'number',
    hasPdf: false,
    sections: [
      {
        label: 'Verse',
        lines: [
          { number: '1',  chord: 'G',  lyric: 'Worthy of every song we could ever sing' },
          { number: '4',  chord: 'C',  lyric: 'Worthy of all the praise we could ever bring' },
          { number: '6m', chord: 'Em', lyric: 'Worthy of every breath we could ever breathe' },
          { number: '4',  chord: 'C',  lyric: 'We live for You, we live for You' },
        ],
      },
      {
        label: 'Chorus',
        lines: [
          { number: '1',  chord: 'G',  lyric: 'Holy, there is no one like You' },
          { number: '4',  chord: 'C',  lyric: "There is none beside You" },
          { number: '6m', chord: 'Em', lyric: "Open up my eyes in wonder" },
          { number: '4',  chord: 'C',  lyric: "And show me who You are" },
        ],
      },
    ],
  },
  {
    id: 'oceans',
    title: 'Oceans',
    key: 'D',
    bpm: 60,
    chartType: 'number',
    hasPdf: false,
    sections: [
      {
        label: 'Verse',
        lines: [
          { number: '1',  chord: 'D',   lyric: 'You call me out upon the waters' },
          { number: '4',  chord: 'G',   lyric: 'The great unknown where feet may fail' },
          { number: '1',  chord: 'D',   lyric: 'And there I find You in the mystery' },
          { number: '5',  chord: 'A',   lyric: 'In oceans deep my faith will stand' },
        ],
      },
      {
        label: 'Chorus',
        lines: [
          { number: '1',  chord: 'D',   lyric: 'And I will call upon Your name' },
          { number: '4',  chord: 'G',   lyric: 'And keep my eyes above the waves' },
          { number: '6m', chord: 'Bm',  lyric: 'When oceans rise my soul will rest in Your embrace' },
          { number: '4',  chord: 'G',   lyric: 'For I am Yours and You are mine' },
        ],
      },
    ],
  },
];

export const AV_SUBS: Record<string, string[]> = {
  keys:     ['Grand piano', 'MIDI keyboard', 'Electric piano', 'Synth / pad', 'Organ'],
  guitar:   ['Electric', 'Acoustic', 'Classical', '12-string', 'Other'],
  bass:     ['Electric bass', 'Upright', 'Fretless', '5-string'],
  drums:    ['Full kit', 'Electronic', 'Cajon only'],
  vocals:   ['Lead 1', 'Lead 2', 'Harmony', 'Background'],
  cajon:    ['Cajon', 'Djembe', 'Bongo', 'Shaker'],
  acoustic: ['Steel string', 'Nylon', 'Parlor', 'Resonator'],
  other:    ['Violin', 'Cello', 'Trumpet', 'Flute', 'Other'],
};

export const AV_LABELS: Record<string, string> = {
  keys:     'what kind of keys?',
  guitar:   'what kind of guitar?',
  bass:     'what kind of bass?',
  drums:    'drum setup?',
  vocals:   'which vocal part?',
  cajon:    'percussion type?',
  acoustic: 'acoustic style?',
  other:    'what instrument?',
};

export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return 'JAM·' + Array.from({ length: 4 }, () =>
    chars[Math.floor(Math.random() * chars.length)]
  ).join('');
}

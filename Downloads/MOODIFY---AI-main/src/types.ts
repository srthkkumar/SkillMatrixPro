export interface Track {
  title: string;
  artist: string;
  lang: 'en' | 'hi';
  youtube: string;
  spotify: string;
  vibe: string;
}

export interface MoodResult {
  mood: string;
  confidence: number;
  reason: string;
  emoji: string;
}

export const MOOD_MAP: Record<string, { emoji: string; desc: string }> = {
  Happy:     { emoji: '😄', desc: 'Feeling great and joyful!' },
  Sad:       { emoji: '😢', desc: 'A bit down today...' },
  Energetic: { emoji: '⚡', desc: 'Full of energy and pumped up!' },
  Calm:      { emoji: '😌', desc: 'Peaceful and relaxed.' },
  Focused:   { emoji: '🎯', desc: 'In the zone and productive.' },
  Romantic:  { emoji: '💕', desc: 'Feeling the love.' },
  Angry:     { emoji: '😤', desc: 'Frustrated and fired up.' },
  Anxious:   { emoji: '😰', desc: 'A little stressed out.' },
  Nostalgic: { emoji: '🌅', desc: 'Lost in sweet memories.' },
  Neutral:   { emoji: '😐', desc: 'Just cruising along.' },
  Surprised: { emoji: '😮', desc: 'Caught off guard!' },
};

export const MANUAL_MOODS = [
  { mood: 'Happy',     emoji: '😄' },
  { mood: 'Sad',       emoji: '😢' },
  { mood: 'Energetic', emoji: '⚡' },
  { mood: 'Calm',      emoji: '😌' },
  { mood: 'Focused',   emoji: '🎯' },
  { mood: 'Romantic',  emoji: '💕' },
  { mood: 'Angry',     emoji: '😤' },
  { mood: 'Anxious',   emoji: '😰' },
  { mood: 'Nostalgic', emoji: '🌅' },
];

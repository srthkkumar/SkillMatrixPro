import { MoodResult, Track } from '../types';

const API_URL = 'https://api.anthropic.com/v1/messages';

async function callClaude(body: object): Promise<string> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: 'claude-sonnet-4-6', max_tokens: 1000, ...body }),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  return data.content[0].text.trim();
}

export async function detectMoodFromImage(base64: string): Promise<MoodResult> {
  const text = await callClaude({
    max_tokens: 200,
    messages: [{
      role: 'user',
      content: [
        { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: base64 } },
        {
          type: 'text',
          text: `Look at this person's face and detect their emotional mood.
Respond ONLY with a valid JSON object, no markdown, no backticks:
{"mood":"one of: Happy/Sad/Energetic/Calm/Focused/Romantic/Angry/Anxious/Nostalgic/Neutral/Surprised","confidence":0.0-1.0,"reason":"one short sentence about their expression"}`,
        },
      ],
    }],
  });

  try {
    const clean = text.replace(/```json|```/g, '').trim();
    const match = clean.match(/\{[\s\S]*\}/);
    const parsed = match ? JSON.parse(match[0]) : null;
    if (!parsed) throw new Error('parse failed');
    return {
      mood:       parsed.mood       || 'Neutral',
      confidence: Math.min(1, Math.max(0, parsed.confidence || 0.7)),
      reason:     parsed.reason     || '',
      emoji:      '😐',
    };
  } catch {
    return { mood: 'Neutral', confidence: 0.65, reason: 'Expression detected.', emoji: '😐' };
  }
}

export async function getRecommendations(mood: string): Promise<Track[]> {
  const text = await callClaude({
    messages: [{
      role: 'user',
      content: `You are a music expert. The user is feeling "${mood}".
Suggest exactly 8 songs — 4 English and 4 Hindi/Bollywood — that perfectly match this mood.
Respond ONLY with a valid JSON array, no markdown, no backticks:
[{"title":"Song Name","artist":"Artist Name","lang":"en","youtube":"https://www.youtube.com/results?search_query=Song+Name+Artist","spotify":"https://open.spotify.com/search/Song%20Name","vibe":"2-3 word vibe"}]
Use real, popular songs that truly match a ${mood} mood.`,
    }],
  });

  try {
    const clean = text.replace(/```json|```/g, '').trim();
    const match = clean.match(/\[[\s\S]*\]/);
    return match ? JSON.parse(match[0]) : [];
  } catch {
    return [];
  }
}

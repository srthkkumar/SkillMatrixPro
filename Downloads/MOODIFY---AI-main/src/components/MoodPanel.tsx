import React from 'react';
import { MoodResult, MOOD_MAP, MANUAL_MOODS } from '../types';

interface Props {
  mood: MoodResult | null;
  onManualSelect: (result: MoodResult) => void;
  onGetPlaylist: () => void;
  loading: boolean;
}

export default function MoodPanel({ mood, onManualSelect, onGetPlaylist, loading }: Props) {
  const panelStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 14,
    overflow: 'hidden',
  };

  return (
    <div style={panelStyle}>
      <div style={{
        padding: '14px 18px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ fontSize: 16 }}>😊</span>
        <span style={{ fontSize: 14, fontWeight: 500, color: '#e2e8f0' }}>Your Mood</span>
      </div>

      <div style={{ padding: 16 }}>
        {/* Detected mood display */}
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <span style={{ fontSize: 48, display: 'block', marginBottom: 8 }}>
            {mood ? mood.emoji : '🎵'}
          </span>
          <div style={{ fontSize: 22, fontWeight: 500, color: '#e2e8f0', marginBottom: 4 }}>
            {mood ? mood.mood : 'Waiting...'}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginBottom: 16 }}>
            {mood ? mood.reason : 'Use camera or pick a mood below'}
          </div>

          {/* Confidence bar */}
          {mood && (
            <>
              <div style={{
                background: 'rgba(255,255,255,0.08)',
                borderRadius: 6, height: 6, marginBottom: 6, overflow: 'hidden',
              }}>
                <div style={{
                  width: `${Math.round(mood.confidence * 100)}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #7c3aed, #ec4899)',
                  borderRadius: 6,
                  transition: 'width 0.8s ease',
                }} />
              </div>
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 16,
              }}>
                <span>Confidence</span>
                <span>{Math.round(mood.confidence * 100)}%</span>
              </div>
            </>
          )}
        </div>

        {/* Manual mood picker */}
        <div style={{
          fontSize: 13, color: 'rgba(255,255,255,0.6)',
          display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8,
        }}>
          <span>⚙️</span> Or pick manually
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6, marginBottom: 16,
        }}>
          {MANUAL_MOODS.map(({ mood: m, emoji }) => (
            <button
              key={m}
              onClick={() => onManualSelect({
                mood: m,
                emoji,
                confidence: 1,
                reason: MOOD_MAP[m]?.desc || '',
              })}
              style={{
                padding: '8px 4px',
                borderRadius: 8,
                textAlign: 'center',
                fontSize: 11,
                background: mood?.mood === m
                  ? 'rgba(124,58,237,0.25)'
                  : 'rgba(255,255,255,0.04)',
                border: mood?.mood === m
                  ? '1px solid #7c3aed'
                  : '1px solid rgba(255,255,255,0.06)',
                color: mood?.mood === m ? '#c4b5fd' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: 16, display: 'block', marginBottom: 3 }}>{emoji}</span>
              {m}
            </button>
          ))}
        </div>

        <button
          onClick={onGetPlaylist}
          disabled={!mood || loading}
          style={{
            width: '100%', padding: '10px 0',
            borderRadius: 10, border: 'none',
            cursor: (!mood || loading) ? 'not-allowed' : 'pointer',
            fontSize: 13, fontWeight: 500,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            background: 'linear-gradient(135deg, #ec4899, #db2777)',
            color: '#fff',
            opacity: (!mood || loading) ? 0.4 : 1,
            transition: 'all 0.2s',
          }}
        >
          <span>🎧</span>
          <span>{loading ? 'Building playlist...' : 'Get My Playlist'}</span>
        </button>
      </div>
    </div>
  );
}

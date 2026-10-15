import React from 'react';
import { Track } from '../types';

interface Props {
  mood: string;
  emoji: string;
  tracks: Track[];
  loading: boolean;
}

export default function Playlist({ mood, emoji, tracks, loading }: Props) {
  if (!mood && !loading) return null;

  return (
    <div style={{
      gridColumn: '1 / -1',
      background: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      borderRadius: 14,
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '14px 18px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ fontSize: 16 }}>🎵</span>
        <span style={{ fontSize: 14, fontWeight: 500, color: '#e2e8f0' }}>
          {emoji} {mood} mood playlist
        </span>
      </div>

      <div style={{ padding: 16 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 30 }}>
            <div style={{
              width: 28, height: 28,
              border: '2px solid rgba(124,58,237,0.3)',
              borderTopColor: '#7c3aed',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
              margin: '0 auto 10px',
            }} />
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
              Finding the perfect tracks for you...
            </p>
          </div>
        ) : tracks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 20px', color: 'rgba(255,255,255,0.3)' }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>🎵</div>
            <p style={{ fontSize: 13 }}>Could not load recommendations. Please try again.</p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 10,
          }}>
            {tracks.map((t, i) => (
              <a
                key={i}
                href={t.youtube}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: 12,
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  borderRadius: 10,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  textDecoration: 'none',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.12)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.3)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.07)';
                  (e.currentTarget as HTMLElement).style.transform = 'none';
                }}
              >
                {/* Icon */}
                <div style={{
                  width: 44, height: 44, borderRadius: 8, flexShrink: 0,
                  background: 'linear-gradient(135deg, rgba(124,58,237,0.2), rgba(236,72,153,0.2))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20,
                }}>
                  🎵
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 13, fontWeight: 500, color: '#e2e8f0',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>{t.title}</div>
                  <div style={{
                    fontSize: 11, color: 'rgba(255,255,255,0.45)',
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>{t.artist}</div>
                  <span style={{
                    fontSize: 10, padding: '2px 6px', borderRadius: 4,
                    marginTop: 3, display: 'inline-block',
                    background: t.lang === 'hi'
                      ? 'rgba(251,146,60,0.15)'
                      : 'rgba(59,130,246,0.15)',
                    color: t.lang === 'hi' ? '#fed7aa' : '#93c5fd',
                  }}>
                    {t.lang === 'hi' ? '🇮🇳 Hindi' : '🌍 English'}
                  </span>
                </div>

                {/* Play icon */}
                <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.3)', flexShrink: 0 }}>▶</span>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import React from 'react';

export default function Header() {
  return (
    <header style={{
      background: 'linear-gradient(135deg, #1a0a2e 0%, #16213e 50%, #1a0a2e 100%)',
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid rgba(255,255,255,0.08)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 36, height: 36,
          background: 'linear-gradient(135deg, #7c3aed, #ec4899)',
          borderRadius: 10,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 18,
        }}>🎵</div>
        <span style={{
          fontSize: 20, fontWeight: 500,
          background: 'linear-gradient(135deg, #a78bfa, #f9a8d4)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>Moodify AI</span>
      </div>
      <span style={{
        fontSize: 11,
        background: 'rgba(124,58,237,0.3)',
        color: '#a78bfa',
        border: '1px solid rgba(124,58,237,0.4)',
        padding: '3px 10px',
        borderRadius: 20,
      }}>Made by Aryan lamba</span>
    </header>
  );
}

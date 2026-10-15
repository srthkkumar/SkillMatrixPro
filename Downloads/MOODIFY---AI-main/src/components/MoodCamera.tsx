import React, { useRef, useState, useCallback } from 'react';
import { detectMoodFromImage } from '../services/claudeApi';
import { MoodResult, MOOD_MAP } from '../types';

interface Props {
  onMoodDetected: (result: MoodResult) => void;
}

export default function MoodCamera({ onMoodDetected }: Props) {
  const videoRef   = useRef<HTMLVideoElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const streamRef  = useRef<MediaStream | null>(null);

  const [cameraOn,  setCameraOn]  = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [error,     setError]     = useState('');

  const startCamera = useCallback(async () => {
    setError('');
    try {
      const s = await navigator.mediaDevices.getUserMedia({
        video: { width: 320, height: 240, facingMode: 'user' },
      });
      streamRef.current = s;
      if (videoRef.current) {
        videoRef.current.srcObject = s;
      }
      setCameraOn(true);
    } catch {
      setError('Camera access denied. Please allow camera permission and try again.');
    }
  }, []);

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setCameraOn(false);
  }, []);

  const analyze = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setAnalyzing(true);
    const ctx = canvasRef.current.getContext('2d')!;
    ctx.drawImage(videoRef.current, 0, 0, 320, 240);
    const base64 = canvasRef.current.toDataURL('image/jpeg', 0.7).split(',')[1];
    const result = await detectMoodFromImage(base64);
    const info   = MOOD_MAP[result.mood] || MOOD_MAP['Neutral'];
    onMoodDetected({ ...result, emoji: info.emoji });
    setAnalyzing(false);
  }, [onMoodDetected]);

  const panelStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.04)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: 14,
    overflow: 'hidden',
  };

  const btnBase: React.CSSProperties = {
    width: '100%', padding: '10px 0', borderRadius: 10, border: 'none',
    cursor: 'pointer', fontSize: 13, fontWeight: 500,
    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
    transition: 'all 0.2s',
  };

  return (
    <div style={panelStyle}>
      <div style={{
        padding: '14px 18px',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <span style={{ fontSize: 16 }}>📷</span>
        <span style={{ fontSize: 14, fontWeight: 500, color: '#e2e8f0' }}>Mood Camera</span>
        <span style={{
          marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%',
          background: cameraOn ? (analyzing ? '#f59e0b' : '#4ade80') : 'rgba(255,255,255,0.2)',
          animation: cameraOn && !analyzing ? 'blink 1.5s infinite' : 'none',
        }} />
      </div>

      <div style={{ padding: 16 }}>
        {/* Camera view */}
        <div style={{
          aspectRatio: '4/3',
          background: '#080812',
          borderRadius: 10,
          overflow: 'hidden',
          position: 'relative',
          marginBottom: 12,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {!cameraOn && (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>📷</div>
              <p style={{ fontSize: 12 }}>Camera off</p>
            </div>
          )}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transform: 'scaleX(-1)',
              display: cameraOn ? 'block' : 'none',
            }}
          />
          <canvas ref={canvasRef} width={320} height={240} style={{ display: 'none' }} />

          {/* Face guide ring */}
          {cameraOn && (
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              pointerEvents: 'none',
            }}>
              <div style={{
                width: 120, height: 140,
                border: '2px solid #7c3aed',
                borderRadius: '50%',
                boxShadow: '0 0 20px rgba(124,58,237,0.4)',
                animation: 'pulse-border 2s infinite',
              }} />
            </div>
          )}

          {/* Scan line */}
          {cameraOn && !analyzing && (
            <div style={{
              position: 'absolute', left: 0, right: 0, height: 2,
              background: 'linear-gradient(90deg, transparent, #7c3aed, transparent)',
              animation: 'scan 2.5s linear infinite',
            }} />
          )}

          {/* Analyzing overlay */}
          {analyzing && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(8,8,18,0.75)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 10,
            }}>
              <div style={{
                width: 28, height: 28,
                border: '2px solid rgba(124,58,237,0.3)',
                borderTopColor: '#7c3aed',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }} />
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>Reading your vibe...</p>
            </div>
          )}
        </div>

        {/* Buttons */}
        <button
          onClick={cameraOn ? stopCamera : startCamera}
          style={{
            ...btnBase,
            background: cameraOn
              ? 'rgba(239,68,68,0.15)'
              : 'linear-gradient(135deg, #7c3aed, #6d28d9)',
            color: cameraOn ? '#f87171' : '#fff',
            border: cameraOn ? '1px solid rgba(239,68,68,0.3)' : 'none',
          }}
        >
          <span>{cameraOn ? '🚫' : '📷'}</span>
          <span>{cameraOn ? 'Stop Camera' : 'Start Camera'}</span>
        </button>

        <button
          onClick={analyze}
          disabled={!cameraOn || analyzing}
          style={{
            ...btnBase,
            marginTop: 10,
            background: 'linear-gradient(135deg, #ec4899, #db2777)',
            color: '#fff',
            opacity: (!cameraOn || analyzing) ? 0.4 : 1,
            cursor: (!cameraOn || analyzing) ? 'not-allowed' : 'pointer',
          }}
        >
          <span>🧠</span>
          <span>{analyzing ? 'Analyzing...' : 'Detect My Mood'}</span>
        </button>

        {error && (
          <div style={{
            marginTop: 10, padding: '10px 14px',
            background: 'rgba(239,68,68,0.1)',
            border: '1px solid rgba(239,68,68,0.3)',
            color: '#fca5a5', borderRadius: 8, fontSize: 12,
          }}>{error}</div>
        )}

        {/* Privacy note */}
        <div style={{
          marginTop: 10, padding: 10,
          background: 'rgba(124,58,237,0.08)',
          border: '1px solid rgba(124,58,237,0.15)',
          borderRadius: 8, display: 'flex', gap: 8, alignItems: 'flex-start',
        }}>
          <span style={{ fontSize: 14, color: '#a78bfa', flexShrink: 0, marginTop: 1 }}>🔒</span>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', lineHeight: 1.4 }}>
            Your photo is analyzed instantly and never stored. Processing happens securely via Claude AI.
          </p>
        </div>
      </div>
    </div>
  );
}

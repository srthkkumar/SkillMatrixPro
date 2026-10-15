import React, { useState } from 'react';
import Header from './components/Header';
import MoodCamera from './components/MoodCamera';
import MoodPanel from './components/MoodPanel';
import Playlist from './components/Playlist';
import { getRecommendations } from './services/claudeApi';
import { MoodResult, Track } from './types';

export default function App() {
  const [mood,          setMood]          = useState<MoodResult | null>(null);
  const [tracks,        setTracks]        = useState<Track[]>([]);
  const [playlistMood,  setPlaylistMood]  = useState('');
  const [playlistEmoji, setPlaylistEmoji] = useState('');
  const [loadingTracks, setLoadingTracks] = useState(false);

  const handleMoodDetected = (result: MoodResult) => {
    setMood(result);
    setTracks([]);
    setPlaylistMood('');
  };

  const handleGetPlaylist = async () => {
    if (!mood) return;
    setLoadingTracks(true);
    setPlaylistMood(mood.mood);
    setPlaylistEmoji(mood.emoji);
    setTracks([]);
    const results = await getRecommendations(mood.mood);
    setTracks(results);
    setLoadingTracks(false);
  };

  return (
    <div style={{ background: '#0d0d1a', minHeight: '100vh', color: '#fff' }}>
      <Header />
      <div style={{
        padding: 20,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 16,
        maxWidth: 1200,
        margin: '0 auto',
      }}>
        <MoodCamera onMoodDetected={handleMoodDetected} />

        <MoodPanel
          mood={mood}
          onManualSelect={handleMoodDetected}
          onGetPlaylist={handleGetPlaylist}
          loading={loadingTracks}
        />

        {(playlistMood || loadingTracks) && (
          <Playlist
            mood={playlistMood}
            emoji={playlistEmoji}
            tracks={tracks}
            loading={loadingTracks}
          />
        )}
      </div>
    </div>
  );
}

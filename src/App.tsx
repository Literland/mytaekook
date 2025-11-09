import React, { useState, useEffect } from 'react';
import SceneManager from './components/SceneManager';
import UI from './components/UI';
import MusicPlayer from './components/MusicPlayer';
import { scenes } from './scenes.tsx';
import './App.css';

function App() {
  const [currentSceneIndex, setCurrentSceneIndex] = useState(0);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [userHasInteracted, setUserHasInteracted] = useState(false);

  const handleInteraction = () => {
    if (!userHasInteracted) {
      setUserHasInteracted(true);
      setIsMusicPlaying(true);
    }
  };

  useEffect(() => {
    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
    return () => {
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
  }, [userHasInteracted]);

  const nextScene = () => {
    setCurrentSceneIndex((prevIndex) => (prevIndex + 1) % scenes.length);
  };

  const prevScene = () => {
    setCurrentSceneIndex((prevIndex) => (prevIndex - 1 + scenes.length) % scenes.length);
  };

  const toggleMusic = () => {
    setIsMusicPlaying(!isMusicPlaying);
  };

  return (
    <div className="App">
      <SceneManager currentSceneIndex={currentSceneIndex} />
      <UI
        currentSceneName={scenes[currentSceneIndex].name}
        onNextScene={nextScene}
        onPrevScene={prevScene}
        onToggleMusic={toggleMusic}
        isMusicPlaying={isMusicPlaying}
      />
      <MusicPlayer
        musicUrl={scenes[currentSceneIndex].music}
        isMusicPlaying={isMusicPlaying}
        setIsMusicPlaying={setIsMusicPlaying}
        userHasInteracted={userHasInteracted}
      />
    </div>
  );
}

export default App;
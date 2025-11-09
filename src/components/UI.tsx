import React from 'react';

interface UIProps {
  currentSceneName: string;
  onPrevScene: () => void;
  onNextScene: () => void;
  onToggleMusic: () => void;
  isMusicPlaying: boolean;
}

const UI: React.FC<UIProps> = ({
  currentSceneName,
  onPrevScene,
  onNextScene,
  onToggleMusic,
  isMusicPlaying,
}) => {
  return (
    <div className="ui-container">
      <div className="top-bar">
        <div className="scene-indicator">{currentSceneName}</div>
        <div className="music-control">
          <button onClick={onToggleMusic} className="music-button">
            {isMusicPlaying ? '⏸️' : '▶️'}
          </button>
        </div>
      </div>
      <div className="navigation-controls">
        <button onClick={onPrevScene} className="nav-button prev-button">&lt;</button>
        <button onClick={onNextScene} className="nav-button next-button">&gt;</button>
      </div>
    </div>
  );
};

export default UI;

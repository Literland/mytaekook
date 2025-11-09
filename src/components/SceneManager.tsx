import React from 'react';
import { scenes } from '../scenes';
import { Canvas } from '@react-three/fiber';

interface SceneManagerProps {
  currentSceneIndex: number;
}

const SceneManager: React.FC<SceneManagerProps> = ({ currentSceneIndex }) => {
  return (
    <div className="scene-manager">
      {scenes.map((scene, index) => (
        <div
          key={scene.id}
          className={`scene-container ${index === currentSceneIndex ? 'active' : ''}`}
        >
          {scene.component}
        </div>
      ))}
    </div>
  );
};

export default SceneManager;

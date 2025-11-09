import React, { useEffect } from 'react';
import { photos } from '../../constants';
import DraggablePhoto from '../DraggablePhoto';
import './KdramaHome.css';

const KdramaHome = () => {
  useEffect(() => {
    console.log('KdramaHome scene mounted');
    return () => {
      console.log('KdramaHome scene unmounted');
    };
  }, []);

  const photoPositions = [
    { x: '20%', y: '25%' }, { x: '80%', y: '25%' },
    { x: '20%', y: '75%' }, { x: '80%', y: '75%' }
  ];

  // Using photos from index 8 to 11 as in the original app.js
  const photoIndices = [8, 9, 10, 11];

  return (
    <div className="scene" id="k-drama-home">
      {photoPositions.map((pos, index) => (
        <DraggablePhoto key={index} photoUrl={photos[photoIndices[index]]} initialPosition={pos} />
      ))}
      <div className="scene-message" style={{ left: '50%', top: '15%' }}>Mi hogar eres tú.</div>
      <div className="scene-message" style={{ left: '50%', top: '85%' }}>Aquí construimos nuestro amor.</div>
    </div>
  );
};

export default KdramaHome;

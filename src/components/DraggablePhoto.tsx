import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import '../scenes/SnowGarden.css';

gsap.registerPlugin(Draggable);

interface DraggablePhotoProps {
  photoUrl: string;
  initialPosition: { x: string; y: string };
}

const DraggablePhoto: React.FC<DraggablePhotoProps> = ({ photoUrl, initialPosition }) => {
  const photoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (photoRef.current) {
      Draggable.create(photoRef.current, {
        bounds: '.scene',
        edgeResistance: 0.65,
        type: 'x,y',
      });
    }
  }, []);

  return (
    <div className="photo-frame frosty" ref={photoRef} style={{ left: initialPosition.x, top: initialPosition.y }}>
      <img src={photoUrl} alt="Our memory" draggable="false" />
    </div>
  );
};

export default DraggablePhoto;
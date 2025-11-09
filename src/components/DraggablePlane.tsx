import React, { useEffect, useRef } from 'react';
import { useThree, useLoader } from '@react-three/fiber';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import * as THREE from 'three';

gsap.registerPlugin(Draggable);

const GRID_SIZE = 30;

interface DraggablePlaneProps {
  photoUrl: string;
  initialPosition: [number, number, number];
}

const DraggablePlane: React.FC<DraggablePlaneProps> = ({ photoUrl, initialPosition }) => {
  const planeRef = useRef<THREE.Mesh>(null!);
  const texture = useLoader(THREE.TextureLoader, photoUrl);

  // Calculate aspect ratio
  const aspectRatio = texture.image.width / texture.image.height;
  const width = 15; // Desired width
  const height = width / aspectRatio; // Adjust height based on aspect ratio

  useEffect(() => {
    if (planeRef.current) {
      Draggable.create(planeRef.current, {
        type: 'x,y,z',
        onDrag: function () {
          planeRef.current.position.set(this.x, this.y, this.z);
        },
        onRelease: function () {
          const { x, y, z } = planeRef.current.position;
          gsap.to(planeRef.current.position, {
            x: Math.round(x / GRID_SIZE) * GRID_SIZE,
            y: Math.round(y / GRID_SIZE) * GRID_SIZE,
            z: Math.round(z / GRID_SIZE) * GRID_SIZE,
            duration: 0.5,
            ease: 'power2.out',
          });
        },
      });
    }
  }, []); // Removed 'camera' from dependency array

  return (
    <mesh ref={planeRef} position={initialPosition}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
    </mesh>
  );
};

export default DraggablePlane;

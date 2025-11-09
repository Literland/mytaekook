import React from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

interface PhotoPlaneProps {
  position: [number, number, number];
  rotation: [number, number, number];
  url: string;
}

const PhotoPlane: React.FC<PhotoPlaneProps> = ({ position, rotation, url }) => {
  const texture = useLoader(THREE.TextureLoader, url);

  // Calculate aspect ratio
  const aspectRatio = texture.image.width / texture.image.height;
  const width = 15; // Desired width
  const height = width / aspectRatio; // Adjust height based on aspect ratio

  return (
    <mesh position={position} rotation={rotation}>
      <planeGeometry args={[width, height]} />
      <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
    </mesh>
  );
};

export default PhotoPlane;

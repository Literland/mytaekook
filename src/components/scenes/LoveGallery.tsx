import React, { useEffect, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { photos } from '../../constants';
import DraggablePlane from '../DraggablePlane';

const LoveGallery = () => {
  useEffect(() => {
    console.log('LoveGallery scene mounted');
    return () => {
      console.log('LoveGallery scene unmounted');
    };
  }, []);

  const draggablePlanes = useMemo(() => {
    return photos.map((photoUrl, index) => (
      <DraggablePlane 
        key={index} 
        photoUrl={photoUrl} 
        initialPosition={[
          (Math.random() - 0.5) * 80,
          (Math.random() - 0.5) * 60,
          (Math.random() - 0.5) * 40
        ]} 
      />
    ));
  }, [photos]);

  return (
    <Canvas camera={{ position: [0, 0, 50], fov: 75 }}>
      <ambientLight intensity={0.8} />
      <pointLight position={[10, 10, 10]} />
      <color attach="background" args={['#1a1a1a']} />

      {draggablePlanes}

      <OrbitControls enableDamping dampingFactor={0.05} screenSpacePanning />
      
      <Html position={[-10, 10, 0]}>
        <div style={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '5px' }}>
            Arrastra las fotos
        </div>
      </Html>
    </Canvas>
  );
};

export default LoveGallery;

import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars, Html } from '@react-three/drei';
import * as THREE from 'three';
import { photos, universeImages } from '../../constants';
import PhotoPlane from '../PhotoPlane';

interface Star extends THREE.Mesh {
  velocity: THREE.Vector3;
}

const ShootingStars = () => {
  const group = useMemo(() => {
    const group = new THREE.Group();
    const starGeo = new THREE.SphereGeometry(0.1, 8, 8);
    const starMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    for (let i = 0; i < 5; i++) {
      const star = new THREE.Mesh(starGeo, starMat) as Star;
      star.position.set(
        (Math.random() - 0.5) * 1500,
        Math.random() * 500 + 200,
        (Math.random() - 0.5) * 1500
      );
      star.velocity = new THREE.Vector3(
        (Math.random() - 0.5) * 20,
        -Math.random() * 5 - 5,
        (Math.random() - 0.5) * 20
      );
      group.add(star);
    }
    return group;
  }, []);

  useFrame(() => {
    group.children.forEach(star => {
      const s = star as Star;
      s.position.add(s.velocity);
      if (s.position.y < -500) {
        s.position.set(
          (Math.random() - 0.5) * 1500,
          Math.random() * 500 + 200,
          (Math.random() - 0.5) * 1500
        );
      }
    });
  });

  return <primitive object={group} />;
};


const Universe = () => {
  const constellationRef = useRef<THREE.Mesh>(null);
  const backgroundTexture = useLoader(THREE.TextureLoader, universeImages.background);
  const constellationTexture = useLoader(THREE.TextureLoader, universeImages.constellation);

  useEffect(() => {
    console.log('Universe scene mounted');
    return () => {
      console.log('Universe scene unmounted');
    };
  }, []);

  useFrame(() => {
    if (constellationRef.current) {
      constellationRef.current.rotation.y += 0.0001;
      constellationRef.current.rotation.x += 0.00005;
    }
  });

  const photoPlanes = useMemo(() => {
    const photoIndices = [4, 5, 6, 7, 8, 9, 10, 11];
    return photoIndices.map((photoIndex) => ({
        position: [(Math.random() - 0.5) * 100, (Math.random() - 0.5) * 50, (Math.random() - 0.5) * 80] as [number, number, number],
        rotation: [(Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 0.2] as [number, number, number],
        url: photos[photoIndex]
    }));
  }, []);

  return (
    <Canvas camera={{ position: [0, 0, 50], fov: 75 }}>
      <ambientLight intensity={0.5} />
      
      {/* Background Sphere */}
      <mesh>
        <sphereGeometry args={[1000, 60, 40]} />
        <meshBasicMaterial map={backgroundTexture} side={THREE.BackSide} />
      </mesh>

      {/* Constellation Sphere */}
      <mesh ref={constellationRef}>
        <sphereGeometry args={[990, 60, 40]} />
        <meshBasicMaterial map={constellationTexture} transparent opacity={0.8} blending={THREE.AdditiveBlending} side={THREE.BackSide} />
      </mesh>

      <Stars radius={300} depth={50} count={20000} factor={8} saturation={0} fade speed={1} />

      {photoPlanes.map((plane, index) => (
          <PhotoPlane key={index} {...plane} />
      ))}

      <ShootingStars />

      <OrbitControls enableDamping dampingFactor={0.05} minDistance={5} maxDistance={300} />

      <Html position={[-10, 10, 0]}>
        <div style={{ color: 'white', backgroundColor: 'rgba(0,0,0,0.5)', padding: '10px', borderRadius: '5px' }}>
            Arrastra para explorar
        </div>
      </Html>
    </Canvas>
  );
};

export default Universe;

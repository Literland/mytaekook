import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { photos } from '../../constants';
import DraggablePhoto from '../DraggablePhoto';
import './SnowGarden.css';

interface Snowflake {
  x: number;
  y: number;
  opacity: number;
  speedX: number;
  speedY: number;
  radius: number;
  char: string;
  fontSize: number;
}

const SnowGarden = () => {
  const sceneRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const snowflakes: Snowflake[] = [];
    const snowflakeChars = ['❄', '❆', '❅', '·', '.'];

    for (let i = 0; i < 150; i++) {
      snowflakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        opacity: Math.random() * 0.6 + 0.2,
        speedX: Math.random() * 3 - 1.5,
        speedY: Math.random() * 2 + 1,
        radius: Math.random() * 2 + 1,
        char: snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)],
        fontSize: Math.random() * 1.2 + 0.4,
      });
    }

    const draw = () => {
      if (!context) return;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = 'white';
      snowflakes.forEach(flake => {
        context.globalAlpha = flake.opacity;
        context.font = `${flake.fontSize}rem sans-serif`;
        context.fillText(flake.char, flake.x, flake.y);
      });
    };

    const update = () => {
      snowflakes.forEach(flake => {
        flake.y += flake.speedY;
        flake.x += flake.speedX;

        if (flake.y > canvas.height) {
          flake.y = -20;
          flake.x = Math.random() * canvas.width;
        }
      });
    };

    const animate = () => {
      draw();
      update();
      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const photoPositions = [
    { x: '25%', y: '30%' }, { x: '75%', y: '30%' },
    { x: '25%', y: '70%' }, { x: '75%', y: '70%' }
  ];

  return (
    <div className="scene" id="snow-garden" ref={sceneRef}>
      <canvas ref={canvasRef} className="snow-canvas"></canvas>
      {photoPositions.map((pos, index) => (
        <DraggablePhoto key={index} photoUrl={photos[index]} initialPosition={pos} />
      ))}
      <div className="scene-message" style={{ left: '50%', top: '15%' }}>Aquí florecen nuestros sueños.</div>
      <div className="scene-message" style={{ left: '50%', top: '85%' }}>Un invierno junto a ti.</div>
    </div>
  );
};

export default SnowGarden;

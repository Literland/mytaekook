import React, { useEffect, useRef } from 'react';

interface MusicPlayerProps {
  musicUrl: string | null;
  isMusicPlaying: boolean;
  setIsMusicPlaying: (isPlaying: boolean) => void;
  userHasInteracted: boolean;
}

const MusicPlayer: React.FC<MusicPlayerProps> = ({
  musicUrl,
  isMusicPlaying,
  setIsMusicPlaying,
  userHasInteracted,
}) => {
  const audioRef = useRef<HTMLAudioElement>(new Audio());

  useEffect(() => {
    const audio = audioRef.current;
    if (musicUrl && audio.src !== musicUrl) {
      audio.src = musicUrl;
      audio.loop = true;
      audio.volume = 0.5;
      console.log(`MusicPlayer: Updating audio source to ${musicUrl}`);
    }
    
    if (isMusicPlaying && musicUrl && userHasInteracted) {
      console.log(`MusicPlayer: Attempting to play audio for ${musicUrl}`);
      audio.play().catch(e => {
        console.error("Audio play failed:", e);
        setIsMusicPlaying(false);
      });
    } else {
      console.log(`MusicPlayer: Pausing audio`);
      audio.pause();
    }
  }, [musicUrl, isMusicPlaying, setIsMusicPlaying, userHasInteracted]);

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      audio.pause(); // Cleanup on unmount
    };
  }, []);

  return null; // This component does not render anything
};

export default MusicPlayer;

import SnowGarden from './components/scenes/SnowGarden';
import Universe from './components/scenes/Universe';
import KdramaHome from './components/scenes/KdramaHome';
import LoveGallery from './components/scenes/LoveGallery';

export const scenes = [
  { id: 'snow-garden', name: '❄️ Jardín', music: 'Music/Snow Flower (feat. Peakboy).mp3', component: <SnowGarden /> },
  { id: 'universe', name: '🌌 Nuestro Universo', music: 'Music/Best Of Me.mp3', component: <Universe /> },
  { id: 'k-drama-home', name: '🏡 Hogar', music: 'Music/HOME.mp3', component: <KdramaHome /> },
  { id: 'love-gallery', name: '💞 Galería del Alma', music: 'Music/Confess To You.mp3', component: <LoveGallery /> },
];

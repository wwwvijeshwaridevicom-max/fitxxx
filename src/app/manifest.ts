import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'FitXxx — Premium Streetwear & 3D Custom Clothing',
    short_name: 'FitXxx',
    description: 'Design. Wear. Own it. 450 GSM French Terry essentials and real-time 3D garment customization.',
    start_url: '/',
    display: 'standalone',
    background_color: '#090909',
    theme_color: '#E50924',
    icons: [
      {
        src: '/icon',
        sizes: '48x48',
        type: 'image/png',
      },
    ],
  };
}

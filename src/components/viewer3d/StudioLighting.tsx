'use client';

import React from 'react';

interface StudioLightingProps {
  intensity?: number;
  rimColor?: string;
}

export function StudioLighting({ intensity = 1.0, rimColor = '#FFFFFF' }: StudioLightingProps) {
  return (
    <>
      {/* Ambient Fill Light — elevated so black fabrics reveal seams, folds & textures */}
      <ambientLight intensity={1.1 * intensity} color="#E8E8EC" />

      {/* Main Front Key Spotlight — high-angle key fashion beam */}
      <spotLight
        position={[3.5, 7.5, 4.5]}
        angle={0.55}
        penumbra={0.7}
        intensity={2.8 * intensity}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0001}
        color="#FFFFFF"
      />

      {/* Front-Left Soft Fill Light — prevents harsh pitch-black shadow pockets */}
      <directionalLight
        position={[-4.5, 4.5, 3.5]}
        intensity={1.8 * intensity}
        color="#E2E8F0"
      />

      {/* Primary Rear-Right Silhouette Rim Light — creates crisp white edge on shoulders & sleeves */}
      <spotLight
        position={[4.5, 5.5, -4.0]}
        angle={0.65}
        penumbra={0.8}
        intensity={3.2 * intensity}
        color={rimColor}
      />

      {/* Secondary Rear-Left Silhouette Rim Light — defines the hood, sleeves, and baggy legs */}
      <spotLight
        position={[-4.5, 5.0, -4.0]}
        angle={0.65}
        penumbra={0.8}
        intensity={3.0 * intensity}
        color={rimColor}
      />

      {/* Subtle Crimson Accent Underglow — streetwear atmosphere */}
      <pointLight
        position={[0, -1.6, 1.8]}
        intensity={1.2 * intensity}
        color="#E50924"
        distance={5}
      />

      {/* Soft Ground Bounce Light — illuminates under-hem folds and shoe soles */}
      <directionalLight
        position={[0, -3.0, 2.0]}
        intensity={0.6 * intensity}
        color="#CBD5E1"
      />

      {/* Top Hair / Hood Light */}
      <directionalLight
        position={[0, 9.0, 0]}
        intensity={1.0 * intensity}
        color="#FFFFFF"
      />
    </>
  );
}

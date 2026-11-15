'use client';

import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Center } from '@react-three/drei';
import * as THREE from 'three';
import { useCustomizerStore, CameraViewAngle } from '@/store/useCustomizerStore';
import { StudioLighting } from './StudioLighting';
import { PlacementZone } from '@/types';
import { 
  Rotate3d, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Play, 
  Pause,
  Compass
} from 'lucide-react';

// Controller to smoothly animate Three.js camera to preset viewpoints
function CameraRig({ viewAngle }: { viewAngle: CameraViewAngle }) {
  const { camera } = useThree();
  const targetPos = useMemo(() => new THREE.Vector3(), []);
  
  useEffect(() => {
    switch (viewAngle) {
      case 'front':
        targetPos.set(0, 0, 3.8);
        break;
      case 'back':
        targetPos.set(0, 0, -3.8);
        break;
      case 'left':
        targetPos.set(-3.8, 0, 0);
        break;
      case 'right':
        targetPos.set(3.8, 0, 0);
        break;
      case 'orbit':
      default:
        targetPos.set(1.9, 1.1, 3.4);
        break;
    }
  }, [viewAngle, targetPos]);

  useFrame(() => {
    if (viewAngle !== 'orbit') {
      camera.position.lerp(targetPos, 0.08);
      camera.lookAt(0, 0, 0);
    }
  });

  return null;
}

// Hook to generate transparent decal texture for a specific placement zone
function useZoneDecalTexture(zone: PlacementZone) {
  const { layers } = useCustomizerStore();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      canvasRef.current = canvas;
      const texture = new THREE.CanvasTexture(canvas);
      textureRef.current = texture;
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear with complete transparency
    ctx.clearRect(0, 0, 1024, 1024);

    const zoneLayers = layers.filter((l) => {
      if (l.zone === zone) return true;
      if (zone === 'lower_leg' && (l.zone === 'left_lower_leg' || l.zone === 'right_lower_leg')) return true;
      if (zone === 'left_thigh' && l.zone === 'front_thigh') return true;
      return false;
    });

    if (zoneLayers.length === 0) {
      if (textureRef.current) textureRef.current.needsUpdate = true;
      return;
    }

    zoneLayers.forEach((layer) => {
      ctx.save();
      const centerX = 512 + (layer.x * 4.2);
      const centerY = 512 + (layer.y * 4.2);
      const targetSize = (zone === 'large_back' ? 520 : 360) * layer.scale;

      ctx.translate(centerX, centerY);
      ctx.rotate((layer.rotation * Math.PI) / 180);
      ctx.globalAlpha = layer.opacity;

      if (layer.type === 'graphic' && layer.svgContent) {
        const img = new Image();
        const svgBlob = new Blob([layer.svgContent], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        img.onload = () => {
          ctx.drawImage(img, -targetSize / 2, -targetSize / 2, targetSize, targetSize);
          URL.revokeObjectURL(url);
          if (textureRef.current) textureRef.current.needsUpdate = true;
        };
        img.src = url;
      } else if (layer.type === 'text' && layer.text) {
        const fontSize = (layer.fontSize || 32) * 1.6 * layer.scale;
        ctx.font = `900 ${fontSize}px 'JetBrains Mono', monospace, sans-serif`;
        ctx.fillStyle = layer.fontColor || '#FFFFFF';
        ctx.textAlign = layer.textAlign || 'center';
        ctx.textBaseline = 'middle';
        ctx.letterSpacing = '4px';
        ctx.fillText(layer.text, 0, 0);
        if (textureRef.current) textureRef.current.needsUpdate = true;
      } else if (layer.type === 'upload' && layer.uploadUrl) {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          ctx.drawImage(img, -targetSize / 2, -targetSize / 2, targetSize, targetSize);
          if (textureRef.current) textureRef.current.needsUpdate = true;
        };
        img.src = layer.uploadUrl;
      }

      ctx.restore();
    });

    if (textureRef.current) {
      textureRef.current.needsUpdate = true;
    }
  }, [zone, layers]);

  return textureRef.current;
}

// Realistic 3D Garment Component with Organic Fabric Folds, Hood, and Zones
function Realistic3DGarment() {
  const { garmentType, baseColor, autoRotate } = useCustomizerStore();
  const groupRef = useRef<THREE.Group>(null);

  // Dedicated zone textures
  const frontChestTexture = useZoneDecalTexture('front_chest');
  const largeBackTexture = useZoneDecalTexture('large_back');
  const leftSleeveTexture = useZoneDecalTexture('left_sleeve');
  const rightSleeveTexture = useZoneDecalTexture('right_sleeve');
  const hoodTexture = useZoneDecalTexture('hood');
  const leftThighTexture = useZoneDecalTexture('left_thigh');
  const rightThighTexture = useZoneDecalTexture('right_thigh');
  const frontLegTexture = useZoneDecalTexture('front_leg');
  const backLegTexture = useZoneDecalTexture('back_leg');
  const lowerLegTexture = useZoneDecalTexture('lower_leg');

  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.7;
    }
  });

  // PBR Heavy French Terry Cotton Fabric Material
  const fabricMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: baseColor,
      roughness: 0.88,
      metalness: 0.04,
      side: THREE.DoubleSide,
    });
  }, [baseColor]);

  // Decal material helper
  const createDecalMat = (map: THREE.CanvasTexture | null) => {
    return new THREE.MeshBasicMaterial({
      map: map || undefined,
      transparent: true,
      depthWrite: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
      side: THREE.DoubleSide,
    });
  };

  const frontDecalMaterial = useMemo(() => createDecalMat(frontChestTexture), [frontChestTexture]);
  const backDecalMaterial = useMemo(() => createDecalMat(largeBackTexture), [largeBackTexture]);
  const leftSleeveDecalMaterial = useMemo(() => createDecalMat(leftSleeveTexture), [leftSleeveTexture]);
  const rightSleeveDecalMaterial = useMemo(() => createDecalMat(rightSleeveTexture), [rightSleeveTexture]);
  const hoodDecalMaterial = useMemo(() => createDecalMat(hoodTexture), [hoodTexture]);
  const leftThighDecalMaterial = useMemo(() => createDecalMat(leftThighTexture), [leftThighTexture]);
  const rightThighDecalMaterial = useMemo(() => createDecalMat(rightThighTexture), [rightThighTexture]);
  const frontLegDecalMaterial = useMemo(() => createDecalMat(frontLegTexture), [frontLegTexture]);
  const backLegDecalMaterial = useMemo(() => createDecalMat(backLegTexture), [backLegTexture]);
  const lowerLegDecalMaterial = useMemo(() => createDecalMat(lowerLegTexture), [lowerLegTexture]);

  const drawstringCordMaterial = new THREE.MeshStandardMaterial({
    color: '#E0D8CC',
    roughness: 0.5,
  });

  const antiqueMetalAglet = new THREE.MeshStandardMaterial({
    color: '#D4AF37',
    metalness: 0.85,
    roughness: 0.25,
  });

  const crimsonAgletAccent = new THREE.MeshStandardMaterial({
    color: '#E50924',
    roughness: 0.3,
    metalness: 0.3,
  });

  // Hoodie sub-mesh
  const renderHoodie = () => (
    <group position={[0, -0.35, 0]}>
      {/* 1. MAIN OVERSIZED TORSO WITH NATURAL DRAPE & WAIST TAPERING */}
      <mesh material={fabricMaterial} castShadow receiveShadow>
        <cylinderGeometry args={[0.95, 0.88, 1.85, 48]} />
      </mesh>

      {/* 2. REALISTIC CURVED HOOD (Volumetric Double-Layer Streetwear Hood) */}
      <group position={[0, 1.15, -0.15]}>
        <mesh material={fabricMaterial} castShadow>
          <sphereGeometry args={[0.62, 32, 24, 0, Math.PI * 2, 0, Math.PI * 0.76]} />
        </mesh>
        {/* Hood opening collar ring */}
        <mesh position={[0, -0.22, 0.25]} rotation={[0.45, 0, 0]} material={fabricMaterial}>
          <torusGeometry args={[0.42, 0.08, 16, 48]} />
        </mesh>
        {/* Hood Decal Plane (Back of Hood) */}
        <mesh position={[0, 0.2, -0.6]} rotation={[-0.35, Math.PI, 0]} material={hoodDecalMaterial}>
          <planeGeometry args={[0.48, 0.48]} />
        </mesh>
      </group>

      {/* 3. KANGAROO POCKET WITH ANGLED ENTRANCES */}
      <mesh position={[0, -0.38, 0.82]} rotation={[-0.06, 0, 0]} material={fabricMaterial} castShadow>
        <boxGeometry args={[0.92, 0.52, 0.18]} />
      </mesh>

      {/* 4. DRAWSTRINGS WITH ANTIQUE METAL AGLETS & CRIMSON TIPS */}
      <group position={[-0.14, 0.65, 0.88]}>
        <mesh material={drawstringCordMaterial}>
          <cylinderGeometry args={[0.015, 0.015, 0.72, 16]} />
        </mesh>
        <mesh position={[0, -0.38, 0]} material={antiqueMetalAglet}>
          <cylinderGeometry args={[0.022, 0.022, 0.08, 16]} />
        </mesh>
        <mesh position={[0, -0.43, 0]} material={crimsonAgletAccent}>
          <sphereGeometry args={[0.02, 12, 12]} />
        </mesh>
      </group>

      <group position={[0.14, 0.65, 0.88]}>
        <mesh material={drawstringCordMaterial}>
          <cylinderGeometry args={[0.015, 0.015, 0.68, 16]} />
        </mesh>
        <mesh position={[0, -0.36, 0]} material={antiqueMetalAglet}>
          <cylinderGeometry args={[0.022, 0.022, 0.08, 16]} />
        </mesh>
        <mesh position={[0, -0.41, 0]} material={crimsonAgletAccent}>
          <sphereGeometry args={[0.02, 12, 12]} />
        </mesh>
      </group>

      {/* 5. DROPPED-SHOULDER SLEEVES WITH NATURAL ELBOW CURVES */}
      {/* Left Sleeve */}
      <group position={[-1.16, 0.2, 0]} rotation={[0, 0, 0.26]}>
        <mesh material={fabricMaterial} castShadow>
          <cylinderGeometry args={[0.42, 0.28, 1.65, 32]} />
        </mesh>
        {/* Ribbed Wrist Cuff */}
        <mesh position={[0, -0.88, 0]} material={fabricMaterial}>
          <cylinderGeometry args={[0.28, 0.26, 0.18, 32]} />
        </mesh>
        {/* Left Sleeve Decal Plane */}
        <mesh position={[-0.32, 0.05, 0]} rotation={[0, -Math.PI / 2, 0]} material={leftSleeveDecalMaterial}>
          <planeGeometry args={[0.6, 0.9]} />
        </mesh>
      </group>

      {/* Right Sleeve */}
      <group position={[1.16, 0.2, 0]} rotation={[0, 0, -0.26]}>
        <mesh material={fabricMaterial} castShadow>
          <cylinderGeometry args={[0.42, 0.28, 1.65, 32]} />
        </mesh>
        {/* Ribbed Wrist Cuff */}
        <mesh position={[0, -0.88, 0]} material={fabricMaterial}>
          <cylinderGeometry args={[0.28, 0.26, 0.18, 32]} />
        </mesh>
        {/* Right Sleeve Decal Plane */}
        <mesh position={[0.32, 0.05, 0]} rotation={[0, Math.PI / 2, 0]} material={rightSleeveDecalMaterial}>
          <planeGeometry args={[0.6, 0.9]} />
        </mesh>
      </group>

      {/* 6. RIBBED BOTTOM HEM */}
      <mesh position={[0, -1.02, 0]} material={fabricMaterial}>
        <cylinderGeometry args={[0.88, 0.86, 0.2, 48]} />
      </mesh>

      {/* 7. DEDICATED FRONT CHEST DECAL PLANE */}
      <mesh position={[0, 0.28, 0.92]} material={frontDecalMaterial}>
        <planeGeometry args={[0.9, 0.7]} />
      </mesh>

      {/* 8. DEDICATED LARGE BACK DECAL PLANE (IMPERIAL DRAGON ARTWORK) */}
      <mesh position={[0, 0.12, -0.92]} rotation={[0, Math.PI, 0]} material={backDecalMaterial}>
        <planeGeometry args={[1.35, 1.45]} />
      </mesh>
    </group>
  );

  // Crewneck Sweatshirt sub-mesh
  const renderSweatshirt = () => (
    <group position={[0, -0.35, 0]}>
      {/* 1. MAIN OVERSIZED TORSO */}
      <mesh material={fabricMaterial} castShadow receiveShadow>
        <cylinderGeometry args={[0.95, 0.88, 1.85, 48]} />
      </mesh>

      {/* 2. CLASSIC RIBBED CREW NECKLINE */}
      <group position={[0, 0.95, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <mesh material={fabricMaterial} castShadow>
          <torusGeometry args={[0.38, 0.08, 16, 48]} />
        </mesh>
      </group>

      {/* 3. DROPPED-SHOULDER SLEEVES WITH NATURAL ELBOW CURVES */}
      {/* Left Sleeve */}
      <group position={[-1.16, 0.2, 0]} rotation={[0, 0, 0.26]}>
        <mesh material={fabricMaterial} castShadow>
          <cylinderGeometry args={[0.42, 0.28, 1.65, 32]} />
        </mesh>
        {/* Ribbed Wrist Cuff */}
        <mesh position={[0, -0.88, 0]} material={fabricMaterial}>
          <cylinderGeometry args={[0.28, 0.26, 0.18, 32]} />
        </mesh>
        {/* Left Sleeve Decal Plane (White Flame Graphics) */}
        <mesh position={[-0.32, 0.05, 0]} rotation={[0, -Math.PI / 2, 0]} material={leftSleeveDecalMaterial}>
          <planeGeometry args={[0.6, 0.9]} />
        </mesh>
      </group>

      {/* Right Sleeve */}
      <group position={[1.16, 0.2, 0]} rotation={[0, 0, -0.26]}>
        <mesh material={fabricMaterial} castShadow>
          <cylinderGeometry args={[0.42, 0.28, 1.65, 32]} />
        </mesh>
        {/* Ribbed Wrist Cuff */}
        <mesh position={[0, -0.88, 0]} material={fabricMaterial}>
          <cylinderGeometry args={[0.28, 0.26, 0.18, 32]} />
        </mesh>
        {/* Right Sleeve Decal Plane (White Flame Graphics) */}
        <mesh position={[0.32, 0.05, 0]} rotation={[0, Math.PI / 2, 0]} material={rightSleeveDecalMaterial}>
          <planeGeometry args={[0.6, 0.9]} />
        </mesh>
      </group>

      {/* 4. RIBBED BOTTOM HEM */}
      <mesh position={[0, -1.02, 0]} material={fabricMaterial}>
        <cylinderGeometry args={[0.88, 0.86, 0.2, 48]} />
      </mesh>

      {/* 5. DEDICATED FRONT CHEST DECAL PLANE */}
      <mesh position={[0, 0.28, 0.92]} material={frontDecalMaterial}>
        <planeGeometry args={[0.9, 0.7]} />
      </mesh>

      {/* 6. DEDICATED LARGE BACK DECAL PLANE (ANGEL WINGS ARTWORK) */}
      <mesh position={[0, 0.12, -0.92]} rotation={[0, Math.PI, 0]} material={backDecalMaterial}>
        <planeGeometry args={[1.35, 1.45]} />
      </mesh>
    </group>
  );

  // Lower sub-mesh
  const renderLower = () => (
    <group position={[0, 0.25, 0]}>
      {/* Elasticated Drawcord Waistband */}
      <mesh position={[0, 1.05, 0]} material={fabricMaterial} castShadow>
        <cylinderGeometry args={[0.78, 0.75, 0.28, 32]} />
      </mesh>
      
      {/* Waist Drawstring */}
      <mesh position={[0, 1.0, 0.76]} material={drawstringCordMaterial}>
        <cylinderGeometry args={[0.015, 0.015, 0.45, 16]} />
      </mesh>

      {/* Left Balloon Leg */}
      <group position={[-0.4, -0.15, 0]}>
        <mesh material={fabricMaterial} castShadow receiveShadow>
          <cylinderGeometry args={[0.45, 0.29, 2.2, 32]} />
        </mesh>
        {/* Knee articulation fold */}
        <mesh position={[0, -0.1, 0.15]} material={fabricMaterial}>
          <boxGeometry args={[0.42, 0.12, 0.1]} />
        </mesh>
        {/* Ankle Cuff */}
        <mesh position={[0, -1.15, 0]} material={fabricMaterial}>
          <cylinderGeometry args={[0.28, 0.26, 0.16, 32]} />
        </mesh>
        {/* Left Thigh Decal Plane */}
        <mesh position={[0, 0.55, 0.44]} material={leftThighDecalMaterial}>
          <planeGeometry args={[0.42, 0.5]} />
        </mesh>
        {/* Front Leg Decal Plane */}
        <mesh position={[0, -0.15, 0.4]} material={frontLegDecalMaterial}>
          <planeGeometry args={[0.45, 0.65]} />
        </mesh>
        {/* Back Leg Decal Plane */}
        <mesh position={[0, -0.15, -0.4]} rotation={[0, Math.PI, 0]} material={backLegDecalMaterial}>
          <planeGeometry args={[0.45, 0.65]} />
        </mesh>
        {/* Lower Leg Decal Plane */}
        <mesh position={[0, -0.65, 0.36]} material={lowerLegDecalMaterial}>
          <planeGeometry args={[0.42, 0.55]} />
        </mesh>
      </group>

      {/* Right Balloon Leg */}
      <group position={[0.4, -0.15, 0]}>
        <mesh material={fabricMaterial} castShadow receiveShadow>
          <cylinderGeometry args={[0.45, 0.29, 2.2, 32]} />
        </mesh>
        {/* Knee articulation fold */}
        <mesh position={[0, -0.1, 0.15]} material={fabricMaterial}>
          <boxGeometry args={[0.42, 0.12, 0.1]} />
        </mesh>
        {/* Ankle Cuff */}
        <mesh position={[0, -1.15, 0]} material={fabricMaterial}>
          <cylinderGeometry args={[0.28, 0.26, 0.16, 32]} />
        </mesh>
        {/* Right Thigh Decal Plane */}
        <mesh position={[0, 0.55, 0.44]} material={rightThighDecalMaterial}>
          <planeGeometry args={[0.42, 0.5]} />
        </mesh>
      </group>
    </group>
  );

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {garmentType === 'hoodie' && renderHoodie()}
      {garmentType === 'sweatshirt' && renderSweatshirt()}
      {garmentType === 'lower' && renderLower()}
      {garmentType === 'combo' && (
        <group position={[0, 0, 0]}>
          <group position={[0, 0.6, 0]} scale={[0.82, 0.82, 0.82]}>
            {renderHoodie()}
          </group>
          <group position={[0, -0.85, 0]} scale={[0.82, 0.82, 0.82]}>
            {renderLower()}
          </group>
        </group>
      )}
    </group>
  );
}

export function GarmentViewer() {
  const { 
    cameraView, 
    setCameraView, 
    autoRotate, 
    toggleAutoRotate, 
    resetView, 
    zoom, 
    setZoom 
  } = useCustomizerStore();

  const handleZoomIn = () => setZoom(zoom + 0.15);
  const handleZoomOut = () => setZoom(zoom - 0.15);

  return (
    <div className="relative w-full h-full min-h-[500px] lg:min-h-[640px] bg-gradient-to-b from-brand-black via-[#111114] to-brand-black rounded-3xl overflow-hidden flex items-center justify-center border border-brand-surface-borderDark shadow-2xl">
      
      {/* 3D RENDER CANVAS */}
      <Canvas
        shadows
        camera={{ position: [0, 0, 3.8], fov: 40 }}
        gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <color attach="background" args={['#08080A']} />
        <StudioLighting />
        <CameraRig viewAngle={cameraView} />

        <Center>
          <Realistic3DGarment />
        </Center>

        <ContactShadows
          position={[0, -1.8, 0]}
          opacity={0.8}
          scale={7.5}
          blur={2.4}
          far={3.8}
          color="#000000"
        />

        <OrbitControls
          enablePan={true}
          minDistance={1.8}
          maxDistance={5.5}
          minPolarAngle={Math.PI / 8}
          maxPolarAngle={Math.PI / 1.7}
        />
      </Canvas>

      {/* TOP FLOATING CAMERA VIEW PRESETS BAR */}
      <div className="absolute top-4 inset-x-0 flex justify-center pointer-events-none z-10">
        <div className="pointer-events-auto flex items-center gap-1.5 p-1 rounded-2xl bg-brand-charcoal/90 backdrop-blur-md border border-brand-surface-borderDark shadow-2xl text-xs font-mono">
          <button
            onClick={() => setCameraView('front')}
            className={`px-3 py-1.5 rounded-xl transition-all font-bold tracking-wider ${
              cameraView === 'front' 
                ? 'bg-brand-crimson text-white shadow-lg shadow-brand-crimson/30' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            FRONT
          </button>
          <button
            onClick={() => setCameraView('back')}
            className={`px-3 py-1.5 rounded-xl transition-all font-bold tracking-wider ${
              cameraView === 'back' 
                ? 'bg-brand-crimson text-white shadow-lg shadow-brand-crimson/30' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            BACK
          </button>
          <button
            onClick={() => setCameraView('left')}
            className={`px-3 py-1.5 rounded-xl transition-all font-bold tracking-wider ${
              cameraView === 'left' 
                ? 'bg-brand-crimson text-white shadow-lg shadow-brand-crimson/30' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            LEFT
          </button>
          <button
            onClick={() => setCameraView('right')}
            className={`px-3 py-1.5 rounded-xl transition-all font-bold tracking-wider ${
              cameraView === 'right' 
                ? 'bg-brand-crimson text-white shadow-lg shadow-brand-crimson/30' 
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            RIGHT
          </button>
          <button
            onClick={() => setCameraView('orbit')}
            className={`px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-1 font-bold ${
              cameraView === 'orbit' 
                ? 'bg-brand-crimson text-white shadow-lg shadow-brand-crimson/30' 
                : 'text-neutral-400 hover:text-white'
            }`}
            title="360 Free Orbit"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>360°</span>
          </button>
        </div>
      </div>

      {/* BOTTOM ACTION & ZOOM CONTROLS TOOLBAR */}
      <div className="absolute bottom-4 inset-x-4 sm:inset-x-6 flex items-center justify-between pointer-events-none z-10">
        
        {/* Status indicator */}
        <div className="pointer-events-auto flex items-center gap-2 bg-brand-charcoal/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-neutral-800 text-[11px] font-mono text-neutral-300 shadow-xl">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="hidden sm:inline">360° 3D PRODUCT VIEWER • DRAG TO ROTATE</span>
          <span className="sm:hidden">360° DRAG</span>
        </div>

        {/* View Controls: Auto-rotate, Reset, Zoom */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-brand-charcoal/90 backdrop-blur-md p-1 rounded-2xl border border-neutral-800 shadow-2xl">
          
          <button
            onClick={toggleAutoRotate}
            className={`p-2 rounded-xl transition-colors ${
              autoRotate ? 'bg-brand-crimson text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
            title={autoRotate ? 'Stop auto-rotation' : 'Start 360 auto-rotation'}
          >
            {autoRotate ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <button
            onClick={resetView}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Reset Camera View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleZoomIn}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors hidden sm:block"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={handleZoomOut}
            className="p-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors hidden sm:block"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

        </div>

      </div>

    </div>
  );
}

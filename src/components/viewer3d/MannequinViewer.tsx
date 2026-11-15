'use client';

import React, { useRef, useState, useMemo, useEffect, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows, useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { StudioLighting } from './StudioLighting';
import { Rotate3d, Play, Pause, Compass, RotateCcw, ZoomIn, ZoomOut, Sparkles } from 'lucide-react';
import { useCustomizerStore } from '@/store/useCustomizerStore';

// Camera position presets for genuine 360° multi-angle viewing
type ViewPreset = 'front' | 'back' | 'left' | 'right' | 'orbit';

function CameraRig({ preset }: { preset: ViewPreset }) {
  const { camera } = useThree();
  const targetPos = useMemo(() => new THREE.Vector3(), []);
  const lookTarget = useMemo(() => new THREE.Vector3(0, 0, 0), []);

  useEffect(() => {
    switch (preset) {
      case 'front':
        targetPos.set(0, 0.05, 2.35);
        break;
      case 'back':
        targetPos.set(0, 0.05, -2.35);
        break;
      case 'left':
        targetPos.set(-2.35, 0.05, 0);
        break;
      case 'right':
        targetPos.set(2.35, 0.05, 0);
        break;
      case 'orbit':
      default:
        targetPos.set(1.1, 0.4, 2.1);
        break;
    }
  }, [preset, targetPos]);

  useFrame(() => {
    if (preset !== 'orbit') {
      camera.position.lerp(targetPos, 0.07);
      camera.lookAt(lookTarget);
    }
  });

  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// REALISTIC HUMAN STREETWEAR FASHION MODEL COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
function HumanFashionModel({ 
  autoRotate = true,
  customColor = '#121215'
}: { 
  autoRotate?: boolean;
  customColor?: string;
}) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Load official high-quality rigged human avatar GLB from public directory
  const gltf = useGLTF('/models/fashion-model.glb');
  
  // Clone the scene graph so multiple instances don't share mutation state
  const clonedScene = useMemo(() => {
    const scene = gltf.scene.clone(true);
    return scene;
  }, [gltf.scene]);

  // Turn off auto-rotation when user manually interacts or pauses
  useFrame((_, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.35;
    }
  });

  // Apply FitXxx Streetwear materials across human avatar mesh nodes
  useEffect(() => {
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = true;
        mesh.receiveShadow = true;

        // Hide facial hair for modern clean Korean male streetwear model aesthetic
        if (mesh.name === 'Wolf3D_Beard' || mesh.name.includes('Beard')) {
          mesh.visible = false;
        }

        // 1. TOP OUTFIT: Jet-Black Heavyweight French Terry Hoodie
        if (mesh.name === 'Wolf3D_Outfit_Top') {
          const originalMat = mesh.material as THREE.MeshStandardMaterial;
          const hoodieMat = new THREE.MeshStandardMaterial({
            color: customColor,
            roughness: 0.62,
            metalness: 0.05,
            normalMap: originalMat?.normalMap || null,
            normalScale: new THREE.Vector2(1.2, 1.2),
            roughnessMap: originalMat?.roughnessMap || null,
          });
          mesh.material = hoodieMat;
        }

        // 2. BOTTOM OUTFIT: Jet-Black Korean Baggy Lower / Sweatpants
        if (mesh.name === 'Wolf3D_Outfit_Bottom') {
          const originalMat = mesh.material as THREE.MeshStandardMaterial;
          const lowerMat = new THREE.MeshStandardMaterial({
            color: '#121215',
            roughness: 0.65,
            metalness: 0.04,
            normalMap: originalMat?.normalMap || null,
            normalScale: new THREE.Vector2(1.1, 1.1),
            roughnessMap: originalMat?.roughnessMap || null,
          });
          mesh.material = lowerMat;
        }

        // 3. SNEAKERS: Clean Luxury White Streetwear Kicks
        if (mesh.name === 'Wolf3D_Outfit_Footwear') {
          const originalMat = mesh.material as THREE.MeshStandardMaterial;
          const sneakerMat = new THREE.MeshStandardMaterial({
            color: '#F8FAFC',
            roughness: 0.28,
            metalness: 0.08,
            normalMap: originalMat?.normalMap || null,
          });
          mesh.material = sneakerMat;
        }

        // 4. SKIN: Realistic human skin with warm natural undertone
        if (mesh.name === 'Wolf3D_Head' || mesh.name === 'Wolf3D_Body') {
          if (mesh.material && (mesh.material as THREE.MeshStandardMaterial).isMeshStandardMaterial) {
            const skinMat = (mesh.material as THREE.MeshStandardMaterial);
            skinMat.roughness = 0.42;
            skinMat.metalness = 0.05;
          }
        }
      }
    });
  }, [clonedScene, customColor]);

  return (
    <group ref={groupRef} position={[0, -0.88, 0]}>
      
      {/* ──────────────────────────────────────────────────────────── */}
      {/* 1. RIGGED HUMAN MODEL WITH STREETWEAR OUTFIT                 */}
      {/* ──────────────────────────────────────────────────────────── */}
      <primitive object={clonedScene} />

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 2. FITXXX SIGNATURE 3D EMBROIDERY & SEAM PIPING DETAILS      */}
      {/* ──────────────────────────────────────────────────────────── */}
      {/* White FitXxx Chest Logo Badge (Embroidered Left Chest) */}
      <group position={[0.095, 0.44, 0.125]} rotation={[-0.04, 0.18, 0]}>
        {/* Main Logo Plaque */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[0.075, 0.024, 0.006]} />
          <meshBasicMaterial color="#FFFFFF" />
        </mesh>
        {/* Crimson Accent Mark (Signature XXX) */}
        <mesh position={[0.044, 0, 0.001]}>
          <boxGeometry args={[0.018, 0.024, 0.007]} />
          <meshBasicMaterial color="#E50924" />
        </mesh>
      </group>

      {/* 3D Hoodie Drawstrings with Crimson Metal Aglets */}
      <group position={[-0.035, 0.48, 0.12]}>
        <mesh>
          <cylinderGeometry args={[0.003, 0.003, 0.18, 16]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.095, 0]}>
          <cylinderGeometry args={[0.005, 0.005, 0.02, 16]} />
          <meshStandardMaterial color="#E50924" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      <group position={[0.035, 0.48, 0.12]}>
        <mesh>
          <cylinderGeometry args={[0.003, 0.003, 0.17, 16]} />
          <meshStandardMaterial color="#FFFFFF" roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.09, 0]}>
          <cylinderGeometry args={[0.005, 0.005, 0.02, 16]} />
          <meshStandardMaterial color="#E50924" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Subtle White Contrast Piping (Left Sleeve Seam) */}
      <mesh position={[-0.24, 0.22, 0]} rotation={[0, 0, -0.12]}>
        <boxGeometry args={[0.006, 0.42, 0.012]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.3} emissive="#FFFFFF" emissiveIntensity={0.15} />
      </mesh>

      {/* Subtle White Contrast Piping (Right Sleeve Seam) */}
      <mesh position={[0.24, 0.22, 0]} rotation={[0, 0, 0.12]}>
        <boxGeometry args={[0.006, 0.42, 0.012]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.3} emissive="#FFFFFF" emissiveIntensity={0.15} />
      </mesh>

      {/* White Outer Seam Piping on Baggy Lower (Left Outer Leg) */}
      <mesh position={[-0.14, -0.42, 0]}>
        <boxGeometry args={[0.005, 0.72, 0.01]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.3} emissive="#FFFFFF" emissiveIntensity={0.15} />
      </mesh>

      {/* White Outer Seam Piping on Baggy Lower (Right Outer Leg) */}
      <mesh position={[0.14, -0.42, 0]}>
        <boxGeometry args={[0.005, 0.72, 0.01]} />
        <meshStandardMaterial color="#FFFFFF" roughness={0.3} emissive="#FFFFFF" emissiveIntensity={0.15} />
      </mesh>

      {/* ──────────────────────────────────────────────────────────── */}
      {/* 3. STUDIO TURNTABLE PEDESTAL & GROUND SHADOW                 */}
      {/* ──────────────────────────────────────────────────────────── */}
      <group position={[0, -0.01, 0]}>
        {/* Dark stage plinth */}
        <mesh receiveShadow>
          <cylinderGeometry args={[0.72, 0.76, 0.025, 48]} />
          <meshStandardMaterial color="#121215" roughness={0.3} metalness={0.4} />
        </mesh>
        {/* Glowing crimson LED stage rim */}
        <mesh position={[0, 0.013, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.69, 0.71, 48]} />
          <meshStandardMaterial color="#E50924" emissive="#E50924" emissiveIntensity={0.9} />
        </mesh>
      </group>

    </group>
  );
}

// Preload the GLB model
useGLTF.preload('/models/fashion-model.glb');

// ─────────────────────────────────────────────────────────────────────────────
// MAIN EXPORT: 360° HUMAN FASHION MODEL VIEWER
// ─────────────────────────────────────────────────────────────────────────────
export function MannequinViewer() {
  const [autoRotate, setAutoRotate] = useState(true);
  const [viewPreset, setViewPreset] = useState<ViewPreset>('front');
  const [zoomLevel, setZoomLevel] = useState(1);
  const { baseColor } = useCustomizerStore();

  const handleReset = () => {
    setViewPreset('front');
    setAutoRotate(true);
    setZoomLevel(1);
  };

  return (
    <div className="relative w-full h-[540px] sm:h-[640px] lg:h-[740px] rounded-3xl overflow-hidden bg-gradient-to-b from-[#141416] via-[#0C0C0E] to-[#08080A] flex items-center justify-center border border-neutral-800/80 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)]">
      
      {/* TOP CAMPAIGN BADGE */}
      <div className="absolute top-5 left-5 right-5 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex items-center gap-2 bg-brand-black/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-neutral-800 text-[11px] font-mono text-neutral-300 shadow-xl">
          <span className="w-2 h-2 rounded-full bg-brand-crimson animate-pulse" />
          <span className="font-bold tracking-widest text-white">HERO FASHION CAMPAIGN</span>
          <span className="text-neutral-500">•</span>
          <span className="text-neutral-400">360° HUMAN MODEL</span>
        </div>

        {/* View Presets Toolbar */}
        <div className="pointer-events-auto flex items-center gap-1 bg-brand-black/90 backdrop-blur-md p-1 rounded-xl border border-neutral-800 text-[10px] font-mono shadow-xl">
          <button
            onClick={() => { setViewPreset('front'); setAutoRotate(false); }}
            className={`px-2.5 py-1 rounded-lg transition-all font-bold ${
              viewPreset === 'front' ? 'bg-brand-crimson text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            FRONT
          </button>
          <button
            onClick={() => { setViewPreset('back'); setAutoRotate(false); }}
            className={`px-2.5 py-1 rounded-lg transition-all font-bold ${
              viewPreset === 'back' ? 'bg-brand-crimson text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            BACK
          </button>
          <button
            onClick={() => { setViewPreset('left'); setAutoRotate(false); }}
            className={`px-2.5 py-1 rounded-lg transition-all font-bold ${
              viewPreset === 'left' ? 'bg-brand-crimson text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            LEFT
          </button>
          <button
            onClick={() => { setViewPreset('right'); setAutoRotate(false); }}
            className={`px-2.5 py-1 rounded-lg transition-all font-bold ${
              viewPreset === 'right' ? 'bg-brand-crimson text-white' : 'text-neutral-400 hover:text-white'
            }`}
          >
            RIGHT
          </button>
          <button
            onClick={() => { setViewPreset('orbit'); setAutoRotate(true); }}
            className={`px-2 py-1 rounded-lg transition-all flex items-center gap-1 ${
              viewPreset === 'orbit' ? 'bg-brand-crimson text-white' : 'text-neutral-400 hover:text-white'
            }`}
            title="Free 360 Orbit"
          >
            <Compass className="w-3 h-3" />
            <span>360°</span>
          </button>
        </div>
      </div>

      {/* 3D CANVAS */}
      <Canvas
        shadows
        camera={{ position: [0, 0.05, 2.35], fov: 42 }}
        gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <color attach="background" args={['#0A0A0C']} />
        
        {/* Three-Point Fashion Studio Lighting with Silhouette Rim Defining Black Clothing */}
        <StudioLighting intensity={1.2} rimColor="#FFFFFF" />

        {/* Camera Lerp Controller */}
        <CameraRig preset={viewPreset} />

        {/* Human Streetwear Model */}
        <Suspense fallback={null}>
          <HumanFashionModel 
            autoRotate={autoRotate}
            customColor={baseColor || '#121215'}
          />
        </Suspense>

        {/* Deep Contact Shadow directly under the human model's sneakers */}
        <ContactShadows
          position={[0, -0.89, 0]}
          opacity={0.85}
          scale={2.6}
          blur={1.8}
          far={1.6}
          color="#000000"
        />

        {/* Bounded Orbit Controls */}
        <OrbitControls
          enablePan={false}
          minDistance={1.6}
          maxDistance={3.8}
          minPolarAngle={Math.PI / 4.5}
          maxPolarAngle={Math.PI / 1.85}
          target={[0, 0, 0]}
        />
      </Canvas>

      {/* 360 ROTATION CONTROLS OVERLAY (BOTTOM) */}
      <div className="absolute bottom-5 inset-x-5 flex items-center justify-between z-10 pointer-events-none">
        
        <div className="flex items-center gap-2 bg-brand-black/85 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-neutral-800 text-[11px] font-mono text-neutral-300 shadow-xl">
          <Rotate3d className="w-3.5 h-3.5 text-brand-crimson animate-spin" style={{ animationDuration: '6s' }} />
          <span>DRAG 360° TO ROTATE HUMAN MODEL • FULL OUTFIT VISIBLE</span>
        </div>

        {/* Controls: Auto-Rotate, Reset */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-brand-charcoal/95 backdrop-blur-md p-1.5 rounded-xl border border-neutral-700/80 shadow-xl">
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            className={`p-2 rounded-lg transition-all ${
              autoRotate ? 'bg-brand-crimson text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
            }`}
            title={autoRotate ? 'Pause 360 presentation' : 'Resume auto-rotation'}
            aria-label="Toggle auto rotation"
          >
            {autoRotate ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={handleReset}
            className="p-2 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
            title="Reset Camera Angle"
            aria-label="Reset camera"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Architectural Studio Horizon Glow */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(9,9,11,0.85)_100%)]" />

    </div>
  );
}

import { create } from 'zustand';
import { GarmentType, PlacementZone, DesignLayer, CustomDesignConfig } from '@/types';

export const GARMENT_BASE_PRICES: Record<GarmentType, number> = {
  hoodie: 3999,
  lower: 3499,
  combo: 6999,
  tshirt: 1999,
  sweatshirt: 3299,
  jacket: 5999,
};

export const COLOR_PALETTE = [
  { name: 'Jet Black', hex: '#090909' },
  { name: 'Warm Ivory', hex: '#F0E6D8' },
  { name: 'Chocolate Brown', hex: '#3D2314' },
  { name: 'Dusty Rose Pink', hex: '#D49A9E' },
  { name: 'Charcoal Grey', hex: '#2B2B2B' },
  { name: 'Olive Green', hex: '#3A4032' },
  { name: 'Crimson Red', hex: '#E50924' },
];

export type CameraViewAngle = 'front' | 'back' | 'left' | 'right' | 'orbit';

interface CustomizerState {
  garmentType: GarmentType;
  baseColor: string;
  colorName: string;
  activeZone: PlacementZone;
  selectedLayerId: string | null;
  layers: DesignLayer[];
  selectedSize: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
  
  // Camera & Viewer controls
  cameraView: CameraViewAngle;
  autoRotate: boolean;
  zoom: number;

  // History stack for Undo / Redo
  undoStack: DesignLayer[][];
  redoStack: DesignLayer[][];

  // Actions
  setGarmentType: (type: GarmentType) => void;
  setBaseColor: (hex: string, name?: string) => void;
  setActiveZone: (zone: PlacementZone) => void;
  setSelectedLayerId: (id: string | null) => void;
  setSelectedSize: (size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL') => void;
  
  // Layer manipulations
  addLayer: (layer: Omit<DesignLayer, 'id'>) => string;
  updateLayer: (id: string, updates: Partial<DesignLayer>) => void;
  removeLayer: (id: string) => void;
  duplicateLayer: (id: string) => void;
  clearAllLayers: () => void;
  
  // History controls
  undo: () => void;
  redo: () => void;
  
  // Camera actions
  setCameraView: (view: CameraViewAngle) => void;
  toggleAutoRotate: () => void;
  setZoom: (zoom: number) => void;
  resetView: () => void;

  // Calculations & Exporters
  calculatePrice: () => number;
  getDesignConfig: () => CustomDesignConfig;
  loadDesignConfig: (config: CustomDesignConfig) => void;
}

export const DEFAULT_HOODIE_LAYERS: DesignLayer[] = [
  {
    id: 'layer-default-dragon-back',
    type: 'graphic',
    zone: 'large_back',
    graphicId: 'art-dragon-imperial',
    graphicName: 'Imperial Silver Dragon',
    svgContent: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 20 C120 40 150 30 160 60 C170 90 140 110 160 140 C170 155 180 180 140 180 C110 180 120 150 90 140 C60 130 50 160 30 140 C10 120 30 90 40 70 C50 50 80 0 100 20 Z" stroke="#E2E8F0" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M90 40 Q130 60 110 90 Q150 120 120 160" stroke="#E50924" stroke-width="3" stroke-dasharray="4 4"/>
      <circle cx="150" cy="55" r="4" fill="#E50924"/>
      <path d="M155 52 L175 45 M152 60 L170 70" stroke="#FFFFFF" stroke-width="2"/>
      <path d="M80 80 L65 70 M85 100 L70 105 M125 120 L140 125" stroke="#94A3B8" stroke-width="2"/>
    </svg>`,
    x: 0,
    y: -10,
    scale: 1.3,
    rotation: 0,
    opacity: 1.0,
  },
  {
    id: 'layer-default-manifesto-text',
    type: 'text',
    zone: 'large_back',
    text: 'DISCIPLINE / GRIND / EVOLVE',
    fontFamily: 'mono',
    fontSize: 16,
    fontColor: '#E50924',
    textAlign: 'center',
    x: 0,
    y: 75,
    scale: 0.9,
    rotation: 0,
    opacity: 1.0,
  },
  {
    id: 'layer-default-chest-logo',
    type: 'graphic',
    zone: 'front_chest',
    graphicId: 'art-symbol-fitxxx-monogram',
    graphicName: 'FitXxx Triple-X Insignia',
    svgContent: `<svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="100" y="58" font-family="Arial, sans-serif" font-weight="900" font-size="44" fill="#FFFFFF" text-anchor="middle" letter-spacing="4">FIT<tspan fill="#E50924">XXX</tspan></text>
      <line x1="20" y1="72" x2="180" y2="72" stroke="#FFFFFF" stroke-width="2"/>
    </svg>`,
    x: 0,
    y: -15,
    scale: 0.8,
    rotation: 0,
    opacity: 1.0,
  }
];

export const useCustomizerStore = create<CustomizerState>()((set, get) => ({
  garmentType: 'hoodie',
  baseColor: '#090909',
  colorName: 'Jet Black',
  activeZone: 'large_back',
  selectedLayerId: null,
  layers: [...DEFAULT_HOODIE_LAYERS],
  selectedSize: 'L',

  cameraView: 'front',
  autoRotate: false,
  zoom: 1,

  undoStack: [],
  redoStack: [],

  setGarmentType: (type) => {
    // If switching to lower, switch active zone if needed
    const currentZone = get().activeZone;
    let newZone = currentZone;
    if (type === 'lower' && (currentZone === 'front_chest' || currentZone === 'large_back' || currentZone.includes('sleeve'))) {
      newZone = 'left_lower_leg';
    } else if (type !== 'lower' && (currentZone.includes('leg') || currentZone.includes('thigh'))) {
      newZone = 'front_chest';
    }
    set({ garmentType: type, activeZone: newZone });
  },

  setBaseColor: (hex, name) => set({
    baseColor: hex,
    colorName: name || 'Custom Shade',
  }),

  setActiveZone: (zone) => {
    // Automatically match camera angle to zone!
    let cameraView: CameraViewAngle = get().cameraView;
    if (zone === 'large_back') cameraView = 'back';
    else if (zone === 'front_chest' || zone === 'front_thigh') cameraView = 'front';
    else if (zone === 'left_sleeve' || zone === 'left_lower_leg') cameraView = 'left';
    else if (zone === 'right_sleeve' || zone === 'right_lower_leg') cameraView = 'right';

    set({ activeZone: zone, cameraView });
  },

  setSelectedLayerId: (id) => set({ selectedLayerId: id }),
  setSelectedSize: (size) => set({ selectedSize: size }),

  addLayer: (layerData) => {
    const id = `layer-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newLayer: DesignLayer = { ...layerData, id };

    set((state) => ({
      undoStack: [...state.undoStack, state.layers],
      redoStack: [],
      layers: [...state.layers, newLayer],
      selectedLayerId: id,
    }));
    return id;
  },

  updateLayer: (id, updates) => {
    set((state) => {
      const currentLayers = state.layers;
      const updatedLayers = currentLayers.map((l) => (l.id === id ? { ...l, ...updates } : l));
      return {
        undoStack: [...state.undoStack, currentLayers],
        redoStack: [],
        layers: updatedLayers,
      };
    });
  },

  removeLayer: (id) => {
    set((state) => ({
      undoStack: [...state.undoStack, state.layers],
      redoStack: [],
      layers: state.layers.filter((l) => l.id !== id),
      selectedLayerId: state.selectedLayerId === id ? null : state.selectedLayerId,
    }));
  },

  duplicateLayer: (id) => {
    const target = get().layers.find((l) => l.id === id);
    if (!target) return;
    const duplicated: DesignLayer = {
      ...target,
      id: `layer-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      x: target.x + 5,
      y: target.y + 5,
    };
    set((state) => ({
      undoStack: [...state.undoStack, state.layers],
      redoStack: [],
      layers: [...state.layers, duplicated],
      selectedLayerId: duplicated.id,
    }));
  },

  clearAllLayers: () => {
    set((state) => ({
      undoStack: [...state.undoStack, state.layers],
      redoStack: [],
      layers: [],
      selectedLayerId: null,
    }));
  },

  undo: () => {
    const { undoStack, layers, redoStack } = get();
    if (undoStack.length === 0) return;
    const previous = undoStack[undoStack.length - 1];
    set({
      undoStack: undoStack.slice(0, -1),
      redoStack: [layers, ...redoStack],
      layers: previous,
      selectedLayerId: null,
    });
  },

  redo: () => {
    const { redoStack, layers, undoStack } = get();
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    set({
      redoStack: redoStack.slice(1),
      undoStack: [...undoStack, layers],
      layers: next,
      selectedLayerId: null,
    });
  },

  setCameraView: (view) => set({ cameraView: view, autoRotate: false }),
  toggleAutoRotate: () => set((state) => ({ autoRotate: !state.autoRotate })),
  setZoom: (zoom) => set({ zoom: Math.min(2.5, Math.max(0.6, zoom)) }),
  resetView: () => set({ cameraView: 'front', autoRotate: false, zoom: 1 }),

  calculatePrice: () => {
    const base = GARMENT_BASE_PRICES[get().garmentType];
    const uniqueZones = new Set(get().layers.map((l) => l.zone));
    // Base price covers 1 print zone; each additional zone is +₹350
    const extraZoneFee = Math.max(0, uniqueZones.size - 1) * 350;
    // Uploads require high-res raster to vector processing (+₹200 per custom upload layer)
    const customUploads = get().layers.filter((l) => l.type === 'upload').length * 200;
    return base + extraZoneFee + customUploads;
  },

  getDesignConfig: () => {
    const state = get();
    return {
      id: `custom-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      title: `Custom ${state.garmentType.toUpperCase()} — ${state.colorName}`,
      garmentType: state.garmentType,
      baseColor: state.baseColor,
      colorName: state.colorName,
      layers: state.layers,
      basePrice: GARMENT_BASE_PRICES[state.garmentType],
      calculatedPrice: state.calculatePrice(),
      createdAt: new Date().toISOString(),
    };
  },

  loadDesignConfig: (config) => {
    set({
      garmentType: config.garmentType,
      baseColor: config.baseColor,
      colorName: config.colorName,
      layers: config.layers || [],
      undoStack: [],
      redoStack: [],
      selectedLayerId: null,
    });
  },
}));

import { ArtworkGraphic, ArtworkCategory } from '@/types';

export const ARTWORK_CATEGORIES: { id: ArtworkCategory; label: string; count: number }[] = [
  { id: 'dragons', label: 'Dragons & Serpents', count: 3 },
  { id: 'flames', label: 'Streetwear Flames', count: 3 },
  { id: 'butterflies', label: 'Cyber Butterflies', count: 3 },
  { id: 'stars', label: 'Korean Starbursts', count: 3 },
  { id: 'abstract', label: 'Abstract Graphics', count: 3 },
  { id: 'korean_typography', label: 'Korean Typography', count: 4 },
  { id: 'minimal_symbols', label: 'Minimal & Monogram', count: 4 },
  { id: 'anime', label: 'Anime & Cyber Ronin', count: 3 },
  { id: 'geometric', label: 'Geometric Grids', count: 3 },
  { id: 'motivational', label: 'Manifesto Typography', count: 4 },
];

export const ARTWORK_LIBRARY: ArtworkGraphic[] = [
  // Statement Pink Edition Angel Wings
  {
    id: 'art-angel-wings',
    name: 'Iconic White Angel Wings',
    category: 'abstract',
    defaultScale: 1.4,
    tags: ['angel', 'wings', 'white', 'feather', 'back', 'pink edition'],
    svgContent: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 80 C80 20 20 10 10 60 C5 90 25 120 40 140 C55 160 80 170 95 180 C85 160 70 140 70 120 C70 100 85 90 100 80 Z" fill="#FFFFFF" fill-opacity="0.95" stroke="#F0E6D8" stroke-width="2"/>
      <path d="M100 80 C120 20 180 10 190 60 C195 90 175 120 160 140 C145 160 120 170 105 180 C115 160 130 140 130 120 C130 100 115 90 100 80 Z" fill="#FFFFFF" fill-opacity="0.95" stroke="#F0E6D8" stroke-width="2"/>
      <path d="M80 60 Q40 50 30 80 Q60 90 85 85" stroke="#E50924" stroke-width="2" stroke-linecap="round"/>
      <path d="M120 60 Q160 50 170 80 Q140 90 115 85" stroke="#E50924" stroke-width="2" stroke-linecap="round"/>
      <circle cx="100" cy="50" r="4" fill="#FFFFFF"/>
    </svg>`
  },
  // 1. Dragons
  {
    id: 'art-dragon-imperial',
    name: 'Imperial Silver Dragon',
    category: 'dragons',
    defaultScale: 1.2,
    tags: ['dragon', 'silver', 'mythic', 'japanese', 'back'],
    svgContent: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 20 C120 40 150 30 160 60 C170 90 140 110 160 140 C170 155 180 180 140 180 C110 180 120 150 90 140 C60 130 50 160 30 140 C10 120 30 90 40 70 C50 50 80 0 100 20 Z" stroke="#E2E8F0" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M90 40 Q130 60 110 90 Q150 120 120 160" stroke="#E50924" stroke-width="3" stroke-dasharray="4 4"/>
      <circle cx="150" cy="55" r="4" fill="#E50924"/>
      <path d="M155 52 L175 45 M152 60 L170 70" stroke="#FFFFFF" stroke-width="2"/>
      <path d="M80 80 L65 70 M85 100 L70 105 M125 120 L140 125" stroke="#94A3B8" stroke-width="2"/>
    </svg>`
  },
  {
    id: 'art-dragon-ouroboros',
    name: 'Cyber Ouroboros Coil',
    category: 'dragons',
    defaultScale: 1.0,
    tags: ['dragon', 'circle', 'snake'],
    svgContent: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="75" stroke="#FFFFFF" stroke-width="4" stroke-dasharray="12 6"/>
      <circle cx="100" cy="100" r="60" stroke="#E50924" stroke-width="2"/>
      <path d="M100 25 C140 25 175 60 175 100 C175 140 140 175 100 175 C60 175 25 140 25 100 C25 80 40 50 70 35" stroke="#E2E8F0" stroke-width="6" stroke-linecap="round"/>
      <polygon points="100,15 115,25 100,35" fill="#E50924"/>
    </svg>`
  },
  {
    id: 'art-dragon-tribal',
    name: 'Tribal Neo Dragon',
    category: 'dragons',
    defaultScale: 1.1,
    tags: ['dragon', 'tribal', 'streetwear'],
    svgContent: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 100 L70 90 L90 120 L110 70 L130 110 L160 100 L140 130 L170 150 L120 160 L100 130 L80 170 L50 140 L70 120 Z" fill="#F0E6D8" stroke="#090909" stroke-width="2"/>
      <circle cx="110" cy="70" r="3" fill="#E50924"/>
    </svg>`
  },

  // 2. Flames
  {
    id: 'art-flame-tribal',
    name: 'Chrome Tribal Fire',
    category: 'flames',
    defaultScale: 1.0,
    tags: ['flame', 'chrome', 'hot', 'y2k'],
    svgContent: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 20 C110 50 140 70 130 110 C150 90 160 120 140 150 C160 140 170 160 160 180 C140 180 130 160 120 170 C100 190 70 190 60 170 C40 180 30 150 50 130 C30 140 20 110 50 90 C40 60 80 50 100 20 Z" fill="#FFFFFF" stroke="#E50924" stroke-width="3"/>
      <path d="M100 60 C110 80 125 100 115 130 C125 120 130 140 110 165 C85 165 75 140 85 120 C75 125 70 110 85 95 C80 80 95 70 100 60 Z" fill="#E50924"/>
    </svg>`
  },
  {
    id: 'art-flame-cyber',
    name: 'Digital Neo Flames',
    category: 'flames',
    defaultScale: 1.0,
    tags: ['flame', 'digital', 'cyber'],
    svgContent: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 170 L50 90 L70 130 L90 50 L110 120 L130 70 L150 140 L170 110 L160 180 L30 180 Z" fill="none" stroke="#FFFFFF" stroke-width="4"/>
      <path d="M50 170 L70 110 L90 140 L110 80 L130 130 L150 170 Z" fill="#E50924"/>
    </svg>`
  },
  {
    id: 'art-flame-cuff',
    name: 'Sleeve Edge Flame Bar',
    category: 'flames',
    defaultScale: 1.2,
    tags: ['flame', 'sleeve', 'border'],
    svgContent: `<svg viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M0 60 L15 20 L30 45 L50 10 L70 40 L90 15 L110 50 L130 5 L150 40 L170 20 L185 45 L200 15 L200 60 Z" fill="#E50924"/>
      <path d="M0 60 L15 35 L30 50 L50 25 L70 48 L90 30 L110 55 L130 20 L150 48 L170 35 L185 50 L200 30 L200 60 Z" fill="#FFFFFF"/>
    </svg>`
  },

  // 3. Butterflies
  {
    id: 'art-butterfly-gothic',
    name: 'Barbed Wire Gothic Moth',
    category: 'butterflies',
    defaultScale: 1.0,
    tags: ['butterfly', 'gothic', 'barbed', 'y2k'],
    svgContent: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 100 C70 40 10 30 20 90 C30 130 80 130 100 150 C120 130 170 130 180 90 C190 30 130 40 100 100 Z" stroke="#FFFFFF" stroke-width="3" fill="none"/>
      <path d="M100 100 C80 60 30 60 40 100 C50 130 90 120 100 140 C110 120 150 130 160 100 C170 60 120 60 100 100 Z" fill="#E50924" fill-opacity="0.3" stroke="#E50924" stroke-width="2"/>
      <line x1="100" y1="50" x2="100" y2="160" stroke="#FFFFFF" stroke-width="4"/>
      <circle cx="100" cy="50" r="4" fill="#E50924"/>
      <path d="M90 40 Q100 25 80 15 M110 40 Q100 25 120 15" stroke="#FFFFFF" stroke-width="2"/>
    </svg>`
  },
  {
    id: 'art-butterfly-cyber',
    name: 'Mecha Cyber Wing',
    category: 'butterflies',
    defaultScale: 1.0,
    tags: ['butterfly', 'cyber', 'mech'],
    svgContent: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="100,100 30,50 10,100 40,150 100,120" stroke="#FFFFFF" stroke-width="3" fill="none"/>
      <polygon points="100,100 170,50 190,100 160,150 100,120" stroke="#FFFFFF" stroke-width="3" fill="none"/>
      <polygon points="100,90 60,65 50,90 70,120 100,110" fill="#E50924"/>
      <polygon points="100,90 140,65 150,90 130,120 100,110" fill="#E50924"/>
      <line x1="100" y1="30" x2="100" y2="170" stroke="#F0E6D8" stroke-width="3"/>
    </svg>`
  },
  {
    id: 'art-butterfly-morpho',
    name: 'Sub-Zero Dark Morpho',
    category: 'butterflies',
    defaultScale: 1.0,
    tags: ['butterfly', 'dark', 'minimal'],
    svgContent: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="65" stroke="#929292" stroke-width="1" stroke-dasharray="2 2"/>
      <path d="M100 95 C60 30 20 50 35 110 C45 140 85 130 100 145 C115 130 155 140 165 110 C180 50 140 30 100 95 Z" fill="#F0E6D8" stroke="#171717" stroke-width="2"/>
      <circle cx="65" cy="85" r="8" fill="#E50924"/>
      <circle cx="135" cy="85" r="8" fill="#E50924"/>
    </svg>`
  },

  // 4. Stars
  {
    id: 'art-star-korean',
    name: 'Korean Starburst 8-Point',
    category: 'stars',
    defaultScale: 0.9,
    tags: ['star', 'korean', 'signature', 'chest'],
    svgContent: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 10 L108 80 L180 88 L120 108 L160 170 L100 125 L40 170 L80 108 L20 88 L92 80 Z" fill="#FFFFFF"/>
      <circle cx="100" cy="100" r="10" fill="#E50924"/>
      <circle cx="100" cy="100" r="28" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="4 4"/>
    </svg>`
  },
  {
    id: 'art-star-y2k',
    name: 'Y2K Cyber Flare Star',
    category: 'stars',
    defaultScale: 1.0,
    tags: ['star', 'y2k', 'chrome'],
    svgContent: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 10 Q100 90 20 100 Q100 100 100 190 Q100 100 180 100 Q100 90 100 10 Z" fill="#F0E6D8" stroke="#090909" stroke-width="3"/>
      <path d="M100 50 Q100 90 60 100 Q100 100 100 150 Q100 100 140 100 Q100 90 100 50 Z" fill="#E50924"/>
    </svg>`
  },
  {
    id: 'art-star-constellation',
    name: 'Sub-Zero Constellation Cluster',
    category: 'stars',
    defaultScale: 1.0,
    tags: ['star', 'cluster', 'astronomy'],
    svgContent: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="40" y1="60" x2="100" y2="40" stroke="#FFFFFF" stroke-width="2"/>
      <line x1="100" y1="40" x2="160" y2="70" stroke="#FFFFFF" stroke-width="2"/>
      <line x1="160" y1="70" x2="140" y2="140" stroke="#FFFFFF" stroke-width="2"/>
      <line x1="140" y1="140" x2="70" y2="160" stroke="#FFFFFF" stroke-width="2"/>
      <line x1="70" y1="160" x2="40" y2="60" stroke="#FFFFFF" stroke-width="2"/>
      <circle cx="40" cy="60" r="7" fill="#E50924"/>
      <circle cx="100" cy="40" r="10" fill="#FFFFFF"/>
      <circle cx="160" cy="70" r="6" fill="#F0E6D8"/>
      <circle cx="140" cy="140" r="8" fill="#E50924"/>
      <circle cx="70" cy="160" r="9" fill="#FFFFFF"/>
    </svg>`
  },

  // 5. Abstract Graphics
  {
    id: 'art-abstract-monolith',
    name: 'Architectural Glitch Monolith',
    category: 'abstract',
    defaultScale: 1.0,
    tags: ['abstract', 'glitch', 'monolith'],
    svgContent: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="50" y="30" width="100" height="140" stroke="#FFFFFF" stroke-width="4"/>
      <line x1="30" y1="60" x2="170" y2="60" stroke="#E50924" stroke-width="4"/>
      <line x1="40" y1="110" x2="160" y2="110" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="6 4"/>
      <rect x="70" y="80" width="60" height="40" fill="#E50924"/>
      <line x1="50" y1="140" x2="150" y2="140" stroke="#94A3B8" stroke-width="3"/>
    </svg>`
  },
  {
    id: 'art-abstract-acidwaves',
    name: 'Acid Distortion Waveform',
    category: 'abstract',
    defaultScale: 1.1,
    tags: ['abstract', 'acid', 'waves'],
    svgContent: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 70 Q60 20 100 70 T180 70" stroke="#FFFFFF" stroke-width="4" fill="none"/>
      <path d="M20 100 Q60 50 100 100 T180 100" stroke="#E50924" stroke-width="5" fill="none"/>
      <path d="M20 130 Q60 80 100 130 T180 130" stroke="#F0E6D8" stroke-width="4" fill="none"/>
      <path d="M20 160 Q60 110 100 160 T180 160" stroke="#929292" stroke-width="3" fill="none"/>
    </svg>`
  },
  {
    id: 'art-abstract-portal',
    name: 'Warp Kinetic Vortex',
    category: 'abstract',
    defaultScale: 1.0,
    tags: ['abstract', 'vortex', 'warp'],
    svgContent: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="100" cy="100" rx="80" ry="40" stroke="#FFFFFF" stroke-width="3" transform="rotate(-30 100 100)"/>
      <ellipse cx="100" cy="100" rx="80" ry="40" stroke="#E50924" stroke-width="3" transform="rotate(30 100 100)"/>
      <ellipse cx="100" cy="100" rx="80" ry="40" stroke="#F0E6D8" stroke-width="3" transform="rotate(90 100 100)"/>
      <circle cx="100" cy="100" r="12" fill="#FFFFFF"/>
    </svg>`
  },

  // 6. Korean Typography
  {
    id: 'art-korean-seoul',
    name: '서울 특별시 (Seoul Syndicate)',
    category: 'korean_typography',
    defaultScale: 1.0,
    tags: ['korean', 'seoul', 'typography'],
    svgContent: `<svg viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="100" y="65" font-family="'Noto Sans KR', sans-serif" font-weight="900" font-size="52" fill="#FFFFFF" text-anchor="middle" letter-spacing="8">서울</text>
      <text x="100" y="88" font-family="'Courier New', monospace" font-size="12" fill="#E50924" text-anchor="middle" letter-spacing="4">SEOUL SYNDICATE</text>
    </svg>`
  },
  {
    id: 'art-korean-overdrive',
    name: '과부하 (Overdrive / Chaos)',
    category: 'korean_typography',
    defaultScale: 1.0,
    tags: ['korean', 'overdrive', 'heavy'],
    svgContent: `<svg viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="100" y="65" font-family="'Noto Sans KR', sans-serif" font-weight="900" font-size="48" fill="#E50924" text-anchor="middle" letter-spacing="6">과부하</text>
      <line x1="20" y1="80" x2="180" y2="80" stroke="#FFFFFF" stroke-width="2"/>
    </svg>`
  },
  {
    id: 'art-korean-rebel',
    name: '반역 (Rebellion / Deviant)',
    category: 'korean_typography',
    defaultScale: 1.0,
    tags: ['korean', 'rebel'],
    svgContent: `<svg viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="25" y="15" width="150" height="70" stroke="#FFFFFF" stroke-width="3" fill="#090909"/>
      <text x="100" y="62" font-family="'Noto Sans KR', sans-serif" font-weight="900" font-size="44" fill="#F0E6D8" text-anchor="middle">반역</text>
    </svg>`
  },
  {
    id: 'art-korean-freedom',
    name: '해방 (Liberation / Free)',
    category: 'korean_typography',
    defaultScale: 1.0,
    tags: ['korean', 'liberation'],
    svgContent: `<svg viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="100" y="65" font-family="'Noto Sans KR', sans-serif" font-weight="900" font-size="50" fill="#FFFFFF" text-anchor="middle">해방</text>
      <circle cx="100" cy="50" r="45" stroke="#E50924" stroke-width="2" stroke-dasharray="6 6"/>
    </svg>`
  },

  // 7. Minimal Symbols
  {
    id: 'art-symbol-fitxxx-monogram',
    name: 'FitXxx Triple-X Insignia',
    category: 'minimal_symbols',
    defaultScale: 0.9,
    tags: ['fitxxx', 'logo', 'xxx', 'minimal'],
    svgContent: `<svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="100" y="58" font-family="Arial, sans-serif" font-weight="900" font-size="44" fill="#FFFFFF" text-anchor="middle" letter-spacing="4">FIT<tspan fill="#E50924">XXX</tspan></text>
      <line x1="20" y1="72" x2="180" y2="72" stroke="#FFFFFF" stroke-width="2"/>
    </svg>`
  },
  {
    id: 'art-symbol-crosshair',
    name: 'Tactical Precision Crosshair',
    category: 'minimal_symbols',
    defaultScale: 0.8,
    tags: ['crosshair', 'tactical', 'target'],
    svgContent: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="70" stroke="#FFFFFF" stroke-width="3"/>
      <circle cx="100" cy="100" r="40" stroke="#E50924" stroke-width="2"/>
      <circle cx="100" cy="100" r="4" fill="#FFFFFF"/>
      <line x1="100" y1="15" x2="100" y2="185" stroke="#FFFFFF" stroke-width="2"/>
      <line x1="15" y1="100" x2="185" y2="100" stroke="#FFFFFF" stroke-width="2"/>
    </svg>`
  },
  {
    id: 'art-symbol-barcode',
    name: 'Industrial SKU Barcode',
    category: 'minimal_symbols',
    defaultScale: 1.0,
    tags: ['barcode', 'industrial', 'minimal'],
    svgContent: `<svg viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="20" width="8" height="50" fill="#FFFFFF"/>
      <rect x="34" y="20" width="4" height="50" fill="#FFFFFF"/>
      <rect x="44" y="20" width="12" height="50" fill="#FFFFFF"/>
      <rect x="62" y="20" width="4" height="50" fill="#FFFFFF"/>
      <rect x="72" y="20" width="8" height="50" fill="#FFFFFF"/>
      <rect x="86" y="20" width="16" height="50" fill="#E50924"/>
      <rect x="108" y="20" width="4" height="50" fill="#FFFFFF"/>
      <rect x="118" y="20" width="10" height="50" fill="#FFFFFF"/>
      <rect x="134" y="20" width="6" height="50" fill="#FFFFFF"/>
      <rect x="146" y="20" width="14" height="50" fill="#FFFFFF"/>
      <rect x="166" y="20" width="6" height="50" fill="#FFFFFF"/>
      <text x="100" y="85" font-family="'Courier New', monospace" font-size="12" fill="#F0E6D8" text-anchor="middle" letter-spacing="4">890400192801</text>
    </svg>`
  },
  {
    id: 'art-symbol-null-box',
    name: 'Heavy Null Bracket',
    category: 'minimal_symbols',
    defaultScale: 0.9,
    tags: ['null', 'box', 'bracket'],
    svgContent: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M60 40 L30 40 L30 160 L60 160" stroke="#FFFFFF" stroke-width="8" stroke-linecap="square"/>
      <path d="M140 40 L170 40 L170 160 L140 160" stroke="#FFFFFF" stroke-width="8" stroke-linecap="square"/>
      <line x1="50" y1="150" x2="150" y2="50" stroke="#E50924" stroke-width="6"/>
    </svg>`
  },

  // 8. Anime
  {
    id: 'art-anime-mecha-eye',
    name: 'Mecha Cybernetic Visor Eye',
    category: 'anime',
    defaultScale: 1.0,
    tags: ['anime', 'eye', 'cyber', 'mecha'],
    svgContent: `<svg viewBox="0 0 200 120" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 60 Q100 0 180 60 Q100 120 20 60 Z" stroke="#FFFFFF" stroke-width="4" fill="none"/>
      <circle cx="100" cy="60" r="30" stroke="#E50924" stroke-width="4" fill="#090909"/>
      <circle cx="100" cy="60" r="14" fill="#E50924"/>
      <circle cx="95" cy="55" r="4" fill="#FFFFFF"/>
      <line x1="20" y1="60" x2="70" y2="60" stroke="#E50924" stroke-width="2"/>
      <line x1="130" y1="60" x2="180" y2="60" stroke="#E50924" stroke-width="2"/>
    </svg>`
  },
  {
    id: 'art-anime-oni-mask',
    name: 'Neo-Tokyo Cyber Oni',
    category: 'anime',
    defaultScale: 1.1,
    tags: ['anime', 'oni', 'mask', 'tokyo'],
    svgContent: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="100,20 125,70 165,60 145,100 170,140 125,140 100,185 75,140 30,140 55,100 35,60 75,70" stroke="#FFFFFF" stroke-width="4" fill="#090909"/>
      <polygon points="65,100 85,115 85,90" fill="#E50924"/>
      <polygon points="135,100 115,115 115,90" fill="#E50924"/>
      <line x1="75" y1="135" x2="125" y2="135" stroke="#FFFFFF" stroke-width="3"/>
    </svg>`
  },
  {
    id: 'art-anime-kanji-blade',
    name: 'Void Ronin Blade Cut',
    category: 'anime',
    defaultScale: 1.0,
    tags: ['anime', 'blade', 'slash'],
    svgContent: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="180" x2="180" y2="20" stroke="#E50924" stroke-width="6"/>
      <line x1="30" y1="190" x2="190" y2="30" stroke="#FFFFFF" stroke-width="2"/>
      <circle cx="100" cy="100" r="50" stroke="#FFFFFF" stroke-width="2" stroke-dasharray="8 8"/>
    </svg>`
  },

  // 9. Geometric
  {
    id: 'art-geom-sacred-hex',
    name: 'Sacred Isometric Cube',
    category: 'geometric',
    defaultScale: 1.0,
    tags: ['geometric', 'isometric', 'cube'],
    svgContent: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="100,30 170,70 100,110 30,70" fill="#F0E6D8" stroke="#090909" stroke-width="2"/>
      <polygon points="30,70 100,110 100,180 30,140" fill="#929292" stroke="#090909" stroke-width="2"/>
      <polygon points="170,70 100,110 100,180 170,140" fill="#E50924" stroke="#090909" stroke-width="2"/>
    </svg>`
  },
  {
    id: 'art-geom-torus-grid',
    name: 'Hyper-Dimensional Wiregrid',
    category: 'geometric',
    defaultScale: 1.0,
    tags: ['geometric', 'grid', 'wireframe'],
    svgContent: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="100" cy="100" r="70" stroke="#FFFFFF" stroke-width="2"/>
      <ellipse cx="100" cy="100" rx="70" ry="25" stroke="#E50924" stroke-width="2"/>
      <ellipse cx="100" cy="100" rx="25" ry="70" stroke="#F0E6D8" stroke-width="2"/>
      <line x1="30" y1="100" x2="170" y2="100" stroke="#FFFFFF" stroke-width="2"/>
      <line x1="100" y1="30" x2="100" y2="170" stroke="#FFFFFF" stroke-width="2"/>
    </svg>`
  },
  {
    id: 'art-geom-fractal-triangle',
    name: 'Fractal Delta Trinity',
    category: 'geometric',
    defaultScale: 1.0,
    tags: ['geometric', 'triangle', 'delta'],
    svgContent: `<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <polygon points="100,20 180,170 20,170" stroke="#FFFFFF" stroke-width="4" fill="none"/>
      <polygon points="100,170 140,95 60,95" stroke="#E50924" stroke-width="3" fill="#E50924" fill-opacity="0.3"/>
    </svg>`
  },

  // 10. Motivational Typography
  {
    id: 'art-manifesto-discipline',
    name: 'DISCIPLINE / GRIND / EVOLVE',
    category: 'motivational',
    defaultScale: 1.2,
    tags: ['manifesto', 'discipline', 'signature', 'back'],
    svgContent: `<svg viewBox="0 0 240 140" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="120" y="38" font-family="'Impact', 'Arial Black', sans-serif" font-size="34" fill="#FFFFFF" text-anchor="middle" letter-spacing="6">DISCIPLINE</text>
      <text x="120" y="78" font-family="'Impact', 'Arial Black', sans-serif" font-size="34" fill="#E50924" text-anchor="middle" letter-spacing="6">GRIND</text>
      <text x="120" y="118" font-family="'Impact', 'Arial Black', sans-serif" font-size="34" fill="#FFFFFF" text-anchor="middle" letter-spacing="6">EVOLVE</text>
      <line x1="20" y1="130" x2="220" y2="130" stroke="#F0E6D8" stroke-width="2"/>
    </svg>`
  },
  {
    id: 'art-manifesto-neverconform',
    name: 'NEVER CONFORM // FITXXX',
    category: 'motivational',
    defaultScale: 1.1,
    tags: ['manifesto', 'never conform', 'rebel'],
    svgContent: `<svg viewBox="0 0 240 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="10" y="10" width="220" height="60" fill="#E50924"/>
      <text x="120" y="48" font-family="'Arial Black', sans-serif" font-size="22" fill="#FFFFFF" text-anchor="middle" letter-spacing="4">NEVER CONFORM</text>
      <text x="120" y="62" font-family="'Courier New', monospace" font-size="9" fill="#090909" text-anchor="middle" letter-spacing="2">FITXXX STREETWEAR LAB</text>
    </svg>`
  },
  {
    id: 'art-manifesto-chaos',
    name: 'MADE IN CHAOS',
    category: 'motivational',
    defaultScale: 1.0,
    tags: ['manifesto', 'chaos', 'streetwear'],
    svgContent: `<svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="100" y="42" font-family="Arial, sans-serif" font-weight="900" font-size="28" fill="#FFFFFF" text-anchor="middle" letter-spacing="3">MADE IN</text>
      <text x="100" y="72" font-family="Arial, sans-serif" font-weight="900" font-size="32" fill="#E50924" text-anchor="middle" letter-spacing="6">CHAOS</text>
    </svg>`
  },
  {
    id: 'art-manifesto-order',
    name: 'RAW POWER // ZERO APOLOGY',
    category: 'motivational',
    defaultScale: 1.0,
    tags: ['manifesto', 'power'],
    svgContent: `<svg viewBox="0 0 220 70" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text x="110" y="32" font-family="'Courier New', monospace" font-weight="700" font-size="16" fill="#F0E6D8" text-anchor="middle" letter-spacing="3">RAW POWER</text>
      <line x1="30" y1="40" x2="190" y2="40" stroke="#E50924" stroke-width="2"/>
      <text x="110" y="58" font-family="'Courier New', monospace" font-weight="700" font-size="14" fill="#929292" text-anchor="middle" letter-spacing="4">ZERO APOLOGY</text>
    </svg>`
  }
];

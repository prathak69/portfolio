export interface ProjectAccent {
  name: string;
  fill: string;       // Bright solid colour (buttons, badges, card accents)
  onAccent: string;   // Text on fill ('#FFFFFF' or '#0C0C0C')
  textSafe: string;   // Darker text-safe colour on white (>4.5:1 contrast)
}

export const PALETTE_ACCENTS: Record<string, ProjectAccent> = {
  red: { name: 'red', fill: '#E5252A', onAccent: '#FFFFFF', textSafe: '#E5252A' },
  orange: { name: 'orange', fill: '#FF7A00', onAccent: '#0C0C0C', textSafe: '#C74A00' },
  yellow: { name: 'yellow', fill: '#FFC400', onAccent: '#0C0C0C', textSafe: '#0C0C0C' },
  green: { name: 'green', fill: '#22C55E', onAccent: '#0C0C0C', textSafe: '#0A7F3A' },
  cyan: { name: 'cyan', fill: '#06B6D4', onAccent: '#0C0C0C', textSafe: '#0A7C9C' },
  blue: { name: 'blue', fill: '#1F5BFF', onAccent: '#FFFFFF', textSafe: '#1F5BFF' },
  purple: { name: 'purple', fill: '#6D3BFF', onAccent: '#FFFFFF', textSafe: '#6D3BFF' },
  pink: { name: 'pink', fill: '#FF4D94', onAccent: '#0C0C0C', textSafe: '#D91E75' },
};

export interface ProjectCard {
  category: string;
  name: string;
  liveUrl?: string;
  images: [string, string, string]; // [left-top, left-bottom, right-tall]
  description?: string;
  accent?: ProjectAccent;
}

export const DEFAULT_PROJECTS: ProjectCard[] = [
  {
    category: 'Client / 3D Motion',
    name: 'Nextlevel Studio',
    liveUrl: '#',
    description: 'High-end 3D environments, kinetic typography, and interactive spatial experiences for creative studios.',
    accent: PALETTE_ACCENTS['red'],
    images: [
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85'
    ]
  },
  {
    category: 'Personal / Visual Identity',
    name: 'Aura Brand Identity',
    liveUrl: '#',
    description: 'Minimalist editorial branding, metallic foil textures, and procedural lighting studies.',
    accent: PALETTE_ACCENTS['green'],
    images: [
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85'
    ]
  },
  {
    category: 'Client / Spatial UI',
    name: 'Solaris Digital',
    liveUrl: '#',
    description: 'Futuristic design systems, holographic user interfaces, and generative motion graphics.',
    accent: PALETTE_ACCENTS['blue'],
    images: [
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85',
      'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85'
    ]
  }
];

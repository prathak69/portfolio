export interface ProjectAccent {
  name: string;
  fill: string;       // Bright solid colour (buttons, badges, card accents)
  onAccent: string;   // Text on fill ('#FFFFFF' or '#0C0C0C')
  textSafe: string;   // Darker text-safe colour on white (>4.5:1 contrast)
}

export const PALETTE_ACCENTS: Record<string, ProjectAccent> = {
  red: { name: 'red', fill: '#E5392F', onAccent: '#FFFFFF', textSafe: '#E5392F' },
  orange: { name: 'orange', fill: '#FF7A00', onAccent: '#0C0C0C', textSafe: '#C74A00' },
  yellow: { name: 'yellow', fill: '#FFC93C', onAccent: '#0C0C0C', textSafe: '#0C0C0C' },
  green: { name: 'green', fill: '#5CC46B', onAccent: '#0C0C0C', textSafe: '#0A7F3A' },
  cyan: { name: 'cyan', fill: '#38BDF8', onAccent: '#0C0C0C', textSafe: '#0A7C9C' },
  blue: { name: 'blue', fill: '#2F5BFF', onAccent: '#FFFFFF', textSafe: '#2F5BFF' },
  purple: { name: 'purple', fill: '#8B5CF6', onAccent: '#FFFFFF', textSafe: '#6D3BFF' },
  pink: { name: 'pink', fill: '#FF8FB1', onAccent: '#0C0C0C', textSafe: '#D91E75' },
};

export interface ProjectCard {
  category: string;
  name: string;
  liveUrl?: string;
  githubUrl?: string;
  problem?: string;
  role?: string;
  stack?: string[];
  widgetType?: 'line-chart' | 'chat-typing' | 'spatial-3d';
  images: [string, string, string]; // [left-top, left-bottom, right-tall]
  description?: string;
  accent?: ProjectAccent;
  videoUrl?: string;
  previewImage?: string;
}

export const DEFAULT_PROJECTS: ProjectCard[] = [
  {
    category: 'Tech Startup, UI Design, Framer Development',
    name: 'Investor-Ready Website for Mobility Tech Startup',
    liveUrl: 'https://www.marcuslorenzet.com/glide',
    githubUrl: 'https://github.com',
    role: 'Lead Designer & Developer',
    problem: 'Creating an investor-ready visual presence for a next-gen micromobility startup.',
    description: 'Investor-Ready Website for Mobility Tech Startup with interactive 3D fleet map.',
    accent: PALETTE_ACCENTS['red'],
    stack: ['Framer Motion', 'WebGL', 'React', 'Design System'],
    widgetType: 'line-chart',
    videoUrl: 'https://video.gumlet.io/69b2fa33dc37184fc7650c73/6a6b58a6731270e6e79b1c78/download.mp4',
    previewImage: 'https://framerusercontent.com/images/f7ePAyOXTqkV0ObfQxJQOQa8M.png',
    images: [
      'https://framerusercontent.com/images/f7ePAyOXTqkV0ObfQxJQOQa8M.png',
      'https://framerusercontent.com/images/f7ePAyOXTqkV0ObfQxJQOQa8M.png',
      'https://framerusercontent.com/images/f7ePAyOXTqkV0ObfQxJQOQa8M.png'
    ]
  },
  {
    category: 'Saas Product, UI Design, Design System',
    name: 'Dashboard design helping artists manage their careers like a business',
    liveUrl: 'https://www.marcuslorenzet.com/genesis',
    githubUrl: 'https://github.com',
    role: 'Product Designer & Architect',
    problem: 'Empowering independent musicians with automated royalty splits and booking telemetry.',
    description: 'Dashboard design helping artists manage their careers like a business.',
    accent: PALETTE_ACCENTS['blue'],
    stack: ['Angular', 'TypeScript', 'Analytics', 'Design System'],
    widgetType: 'spatial-3d',
    videoUrl: 'https://video.gumlet.io/69b2fa33dc37184fc7650c73/6a6b59de731270e6e79b45cf/download.mp4',
    previewImage: 'https://framerusercontent.com/images/jLnEmpGObvOqFM6ogldzZSnlp7I.jpg',
    images: [
      'https://framerusercontent.com/images/jLnEmpGObvOqFM6ogldzZSnlp7I.jpg',
      'https://framerusercontent.com/images/jLnEmpGObvOqFM6ogldzZSnlp7I.jpg',
      'https://framerusercontent.com/images/jLnEmpGObvOqFM6ogldzZSnlp7I.jpg'
    ]
  },
  {
    category: 'Small Business, UI Design, Framer Development',
    name: 'Website that transformed a teacher into a recognized language school',
    liveUrl: 'https://www.marcuslorenzet.com/ateachersandra',
    githubUrl: 'https://github.com',
    role: 'Creative Developer',
    problem: 'Repositioning an independent tutor into a top-tier digital language institution.',
    description: 'Website that transformed a teacher into a recognized language school.',
    accent: PALETTE_ACCENTS['green'],
    stack: ['Framer', 'Brand Identity', 'Conversion Funnel', 'Motion Design'],
    widgetType: 'chat-typing',
    videoUrl: 'https://video.gumlet.io/69b2fa33dc37184fc7650c73/6a6b5af7731270e6e79b69e7/download.mp4',
    previewImage: 'https://framerusercontent.com/images/5ILRvlYXf72kHSVHqpa3snGzjU.jpg',
    images: [
      'https://framerusercontent.com/images/5ILRvlYXf72kHSVHqpa3snGzjU.jpg',
      'https://framerusercontent.com/images/5ILRvlYXf72kHSVHqpa3snGzjU.jpg',
      'https://framerusercontent.com/images/5ILRvlYXf72kHSVHqpa3snGzjU.jpg'
    ]
  }
];

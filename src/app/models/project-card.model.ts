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
    category: 'Enterprise, Data Visualisation, Angular, D3.js',
    name: 'Causal & Impact Dashboards (SPC)',
    liveUrl: 'https://github.com/prathaksoni',
    githubUrl: 'https://github.com/prathaksoni',
    role: 'Frontend Architect & Data Specialist',
    problem: 'Engineers across 20+ manufacturing sites needed real-time statistical process control and causal variance telemetry.',
    description: 'Causal & Impact dashboards used by 500+ quality engineers across 20+ manufacturing sites in 190 countries.',
    accent: PALETTE_ACCENTS['red'],
    stack: ['Angular 18', 'D3.js', 'RxJS', 'TypeScript', 'WebSockets'],
    widgetType: 'line-chart',
    previewImage: '/assets/projects/spc-preview.webp',
    images: [
      '/assets/projects/spc-1.webp',
      '/assets/projects/spc-2.webp',
      '/assets/projects/spc-3.webp'
    ]
  },
  {
    category: 'Full-stack, MERN, Socket.io',
    name: 'Talk-A-Tive: Real-Time Chat Platform',
    liveUrl: 'https://github.com/prathaksoni',
    githubUrl: 'https://github.com/prathaksoni',
    role: 'Full-Stack Developer',
    problem: 'Traditional polling suffered high packet overhead and noticeable message latency under peak concurrent loads.',
    description: 'Talk-A-Tive: real-time chat with sub-100ms delivery, typing indicators, and group chat management.',
    accent: PALETTE_ACCENTS['blue'],
    stack: ['React', 'Node.js', 'Express', 'Socket.io', 'MongoDB'],
    widgetType: 'chat-typing',
    previewImage: '/assets/projects/talk-preview.webp',
    images: [
      '/assets/projects/talk-1.webp',
      '/assets/projects/talk-2.webp',
      '/assets/projects/talk-3.webp'
    ]
  },
  {
    category: 'Game, Unreal Engine 4, Blender',
    name: 'Dead by Shot: Unreal Engine FPS',
    liveUrl: 'https://github.com/prathaksoni',
    githubUrl: 'https://github.com/prathaksoni',
    role: 'Game Developer & 3D Artist',
    problem: 'Designing responsive hit detection, fluid weapon kinematics, and dynamic atmospheric lighting.',
    description: 'Dead by Shot: an Unreal Engine FPS played by 100+ people featuring custom 3D asset modeling in Blender.',
    accent: PALETTE_ACCENTS['green'],
    stack: ['Unreal Engine 4', 'C++', 'Blueprints', 'Blender'],
    widgetType: 'spatial-3d',
    previewImage: '/assets/projects/deadbyshot-preview.webp',
    images: [
      '/assets/projects/deadbyshot-1.webp',
      '/assets/projects/deadbyshot-2.webp',
      '/assets/projects/deadbyshot-3.webp'
    ]
  },
  {
    category: 'Machine Learning, Python, Scikit-Learn',
    name: 'Gold Price Prediction on 13 Years of Market Data',
    liveUrl: 'https://github.com/prathaksoni',
    githubUrl: 'https://github.com/prathaksoni',
    role: 'Machine Learning Engineer',
    problem: 'Predicting precious metal fluctuations through cross-asset regression and volatility analysis.',
    description: 'Gold Price Prediction on 13 years of market data using Random Forest regression with sub-2% MAPE.',
    accent: PALETTE_ACCENTS['yellow'],
    stack: ['Python', 'Scikit-Learn', 'Pandas', 'NumPy', 'Matplotlib'],
    widgetType: 'line-chart',
    previewImage: '/assets/projects/gold-preview.webp',
    images: [
      '/assets/projects/gold-1.webp',
      '/assets/projects/gold-2.webp',
      '/assets/projects/gold-3.webp'
    ]
  }
];

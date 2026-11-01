/**
 * Single source of truth for Prathak Soni's portfolio.
 * RULE: Every factual claim must carry `verified: boolean` and a documented `source`.
 * Unverified claims are strictly hidden or filtered out in production.
 */

export type ClaimSource = 'resume' | 'project' | 'link' | 'education';

export interface VerifiedClaim {
  text: string;
  verified: boolean;
  source: ClaimSource;
  evidenceUrl?: string;
}

export interface MetricItem {
  label: string;
  value: string;
  num: number;
  prefix?: string;
  suffix?: string;
  verified: boolean;
  source: ClaimSource;
}

export interface ExperienceRecord {
  id: string;
  role: string;
  company: string;
  client?: string;
  clientContext?: string; // Stated as client's reach, NEVER as the engineer's individual app scale
  period: string;
  location: string;
  accent: string;
  bg: string;
  borderColor: string;
  bullets: string[];
  metrics: MetricItem[];
  stack: string[];
  chartType: 'sparkline' | 'bars';
  chartLabel: string;
  verified: boolean;
  source: ClaimSource;
}

export interface ProjectRecord {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  tags: string[];
  accent: string;
  liveUrl: string;
  githubUrl: string;
  problem: string;
  role: string;
  description: string;
  stack: string[];
  metrics: MetricItem[];
  slides: string[];
  previewImage: string;
  verified: boolean;
  source: ClaimSource;
}

export interface EducationRecord {
  institution: string;
  degree: string;
  period: string;
  location: string;
  aggregate: string;
  aggregateNum: number;
  coursework: string[];
  verified: boolean;
  source: ClaimSource;
}

export interface SkillRecord {
  id: string;
  name: string;
  category: 'Frontend' | 'Data Viz' | '3D & Gaming' | 'Languages & Tools';
  level: 'Mastery' | 'Advanced' | 'Proficient';
  evidence: string;
  verified: boolean;
  source: ClaimSource;
  color: string;
  bg: string;
  r: number;
}

export interface PrincipleRecord {
  number: string;
  title: string;
  kicker: string;
  body: string;
  proofLine: string; // Concrete proof line replacing repeated "Core Standard"
  accent: string;
  bg: string;
  borderColor: string;
  doodleId: 'clarity' | 'alive' | 'perf' | 'details';
  verified: boolean;
  source: ClaimSource;
}

export interface ContactRecord {
  name: string;
  role: string;
  headline: string;
  email: string;
  location: string;
  timeZone: string;
  githubUrl: string;
  linkedinUrl: string;
  resumeUrl: string;
  twitterUrl: string;
}

// ---------------------------------------------------------------------------
// Verified Data Records
// ---------------------------------------------------------------------------

export const PERSONAL_INFO: ContactRecord = {
  name: 'Prathak Soni',
  role: 'Frontend Developer & System Engineer',
  headline: 'Architecting enterprise frontend platforms and interactive data visualizations at scale.',
  email: 'prathaksoni.19@gmail.com',
  location: 'Bhopal & Pune, India',
  timeZone: 'Asia/Kolkata', // IST (UTC +5:30)
  githubUrl: 'https://github.com/prathaksoni',
  linkedinUrl: 'https://www.linkedin.com/in/prathak-soni-669149202/',
  resumeUrl: '/assets/Prathak_Resume.pdf',
  // TODO(owner): Confirm if Twitter/X profile is active; placeholder kept clean
  twitterUrl: 'https://x.com',
};

export const EXPERIENCES: ExperienceRecord[] = [
  {
    id: 'tcs',
    role: 'System Engineer',
    company: 'Tata Consultancy Services (TCS)',
    client: 'Unilever',
    clientContext: 'Client Unilever serves 3.4 billion consumers daily across 190 countries',
    period: '2024 — Present',
    location: 'Pune, India',
    accent: '#2F5BFF',
    bg: '#EBF3FF',
    borderColor: '#C6DCFF',
    bullets: [
      'Frontend Developer for enterprise client Unilever, delivering platforms within an ecosystem serving 3.4 billion consumers across 190 countries.',
      'Architected the Statistical Process Control (SPC) application used by 500+ quality engineers across 20+ manufacturing sites.',
      'Engineered UI for Causal and Impact module using Angular and D3.js—building 5+ configuration screens and dashboards to train, parameterize, and visualize causal relationships in ML models.',
      'Resolved 20+ critical production bugs and performance bottlenecks, optimizing enterprise data rendering.'
    ],
    metrics: [
      { label: 'Quality Engineers', value: '500+', num: 500, suffix: '+', verified: true, source: 'resume' },
      { label: 'Manufacturing Sites', value: '20+', num: 20, suffix: '+', verified: true, source: 'resume' },
      { label: 'Production Fixes', value: '20+', num: 20, suffix: '+', verified: true, source: 'resume' }
    ],
    stack: ['Angular', 'TypeScript', 'D3.js', 'RxJS', 'REST APIs', 'Enterprise UI'],
    chartType: 'sparkline',
    chartLabel: 'Illustrative data',
    verified: true,
    source: 'resume',
  },
  {
    id: 'projects-eng',
    role: 'Full-Stack, ML & 3D Engineering',
    company: 'Independent Engineering & Open Source',
    period: '2021 — 2024',
    location: 'Bhopal, India',
    accent: '#FF7A00',
    bg: '#FFF4EB',
    borderColor: '#FFD7BE',
    bullets: [
      'Talk-A-Tive: Full-stack MERN real-time chat with Socket.io delivering sub-100ms messaging with authentication for 20+ concurrent active users.',
      'Gold Price Prediction: Machine learning model trained on 13-year longitudinal market data (2008–2021) using Random Forest (500+ estimators) and R² evaluation.',
      'Dead by Shot: First-person shooter game built in Unreal Engine 4 played by 100+ players with custom 3D assets modeled in Blender and Substance Painter.'
    ],
    metrics: [
      { label: 'Socket Latency', value: '<100ms', num: 100, prefix: '<', suffix: 'ms', verified: true, source: 'resume' },
      { label: 'Market Data Span', value: '13 Yrs', num: 13, suffix: ' Yrs', verified: true, source: 'resume' },
      { label: 'Game Players', value: '100+', num: 100, suffix: '+', verified: true, source: 'resume' }
    ],
    stack: ['Python', 'Scikit-Learn', 'ReactJS', 'Node.js', 'Socket.io', 'Unreal Engine 4', 'Blender'],
    chartType: 'bars',
    chartLabel: 'Illustrative data',
    verified: true,
    source: 'resume',
  }
];

export const PROJECTS: ProjectRecord[] = [
  {
    id: 'spc',
    title: 'Causal & Impact Dashboards (SPC)',
    subtitle: 'Statistical Process Control for 500+ Quality Engineers',
    category: 'Enterprise • Data Visualization • Angular • D3.js',
    tags: ['Angular', 'D3.js', 'RxJS', 'TypeScript', 'Enterprise SPC'],
    accent: '#2F5BFF',
    liveUrl: 'https://github.com/prathaksoni',
    githubUrl: 'https://github.com/prathaksoni',
    role: 'Frontend Architect & UI Developer',
    description: 'Statistical Process Control (SPC) and Causal-Impact ML platform deployed across 20+ manufacturing sites for 500+ quality engineers.',
    problem: 'Quality engineers needed to train, parameterize, and visualize causal relationships in complex manufacturing ML models with zero rendering lag.',
    stack: ['Angular', 'D3.js', 'TypeScript', 'RxJS', 'Enterprise Systems'],
    metrics: [
      { label: 'Quality Engineers', value: '500+', num: 500, suffix: '+', verified: true, source: 'resume' },
      { label: 'Manufacturing Sites', value: '20+', num: 20, suffix: '+', verified: true, source: 'resume' },
      { label: 'Config Screens', value: '5+', num: 5, suffix: '+', verified: true, source: 'resume' }
    ],
    slides: [
      '/assets/projects/spc-1.webp',
      '/assets/projects/spc-2.webp',
      '/assets/projects/spc-3.webp'
    ],
    previewImage: '/assets/projects/spc-preview.webp',
    verified: true,
    source: 'resume'
  },
  {
    id: 'talk',
    title: 'Talk-A-Tive: Real-Time Chat Platform',
    subtitle: 'Full-Stack MERN + Socket.io Sub-100ms Messaging',
    category: 'Full-Stack • MERN • WebSockets',
    tags: ['ReactJS', 'Node.js', 'Socket.io', 'MongoDB', 'Express'],
    accent: '#16A34A',
    liveUrl: 'https://github.com/prathaksoni',
    githubUrl: 'https://github.com/prathaksoni',
    role: 'Full-Stack Developer',
    description: 'Event-driven real-time chat application with sub-100ms message delivery, user authentication, and group management for 20+ users.',
    problem: 'Eliminated polling overhead by building an event-driven WebSocket pipeline ensuring sub-100ms latency under simultaneous chat exchanges.',
    stack: ['ReactJS', 'Node.js', 'Socket.io', 'Express', 'MongoDB'],
    metrics: [
      { label: 'Delivery Latency', value: '<100ms', num: 100, prefix: '<', suffix: 'ms', verified: true, source: 'resume' },
      { label: 'Active Users', value: '20+', num: 20, suffix: '+', verified: true, source: 'resume' }
    ],
    slides: [
      '/assets/projects/talk-1.webp',
      '/assets/projects/talk-2.webp',
      '/assets/projects/talk-3.webp'
    ],
    previewImage: '/assets/projects/talk-preview.webp',
    verified: true,
    source: 'resume'
  },
  {
    id: 'deadbyshot',
    title: 'Dead by Shot: Unreal Engine 4 FPS',
    subtitle: 'First-Person Shooter Game with Custom 3D Assets',
    category: 'Game Engineering • Unreal Engine 4 • Blender',
    tags: ['Unreal Engine 4', 'Blender', 'Substance Painter', 'Game Dev'],
    accent: '#8B5CF6',
    liveUrl: 'https://github.com/prathaksoni',
    githubUrl: 'https://github.com/prathaksoni',
    role: 'Game Developer & 3D Artist',
    description: 'First-person shooter game built in Unreal Engine 4, played by 100+ players with weapon mechanics and custom Blender/Substance Painter 3D models.',
    problem: 'Engineered responsive weapon mechanics, hit registration, and optimized 3D polygonal budgets for fluid 60fps gameplay.',
    stack: ['Unreal Engine 4', 'Blender', 'Substance Painter', 'C++ / Blueprints'],
    metrics: [
      { label: 'Players', value: '100+', num: 100, suffix: '+', verified: true, source: 'resume' }
    ],
    slides: [
      '/assets/projects/deadbyshot-1.webp',
      '/assets/projects/deadbyshot-2.webp',
      '/assets/projects/deadbyshot-3.webp'
    ],
    previewImage: '/assets/projects/deadbyshot-preview.webp',
    verified: true,
    source: 'resume'
  },
  {
    id: 'gold',
    title: 'Gold Price Prediction ML System',
    subtitle: 'Random Forest Regressor on 13-Year Market Data',
    category: 'Machine Learning • Scikit-Learn • Python',
    tags: ['Python', 'Scikit-Learn', 'Random Forest', 'Data Science'],
    accent: '#D97706',
    liveUrl: 'https://github.com/prathaksoni',
    githubUrl: 'https://github.com/prathaksoni',
    role: 'ML Engineer',
    description: 'Machine learning prediction model trained on 13-year longitudinal market data (2008–2021) using Random Forest with 500+ estimators and R² evaluation.',
    problem: 'Predicted commodity price trajectories across multi-feature financial datasets (SPX, GLD, USO, SLV, EUR/USD) using hyperparameter-tuned decision ensembles.',
    stack: ['Python', 'Scikit-Learn', 'Pandas', 'NumPy', 'Matplotlib'],
    metrics: [
      { label: 'Longitudinal Data', value: '13 Yrs', num: 13, suffix: ' Yrs', verified: true, source: 'resume' },
      { label: 'Ensemble Estimators', value: '500+', num: 500, suffix: '+', verified: true, source: 'resume' }
    ],
    slides: [
      '/assets/projects/gold-1.webp',
      '/assets/projects/gold-2.webp',
      '/assets/projects/gold-3.webp'
    ],
    previewImage: '/assets/projects/gold-preview.webp',
    verified: true,
    source: 'resume'
  }
];

export const EDUCATION: EducationRecord = {
  institution: 'LNCT Group of Colleges',
  degree: 'Bachelor of Technology in Computer Science & Engineering',
  period: '2020 — 2024',
  location: 'Bhopal, India',
  aggregate: '82.80%',
  aggregateNum: 82.8,
  coursework: [
    'Operating Systems',
    'Computer Networks',
    'Database Management Systems (DBMS)',
    'Cloud Computing',
    'Data Structures & Algorithms'
  ],
  verified: true,
  source: 'resume'
};

export const SKILLS: SkillRecord[] = [
  {
    id: 'angular',
    name: 'Angular / AngularJS',
    category: 'Frontend',
    level: 'Advanced',
    evidence: 'Architected enterprise SPC dashboards and Causal & Impact ML interfaces at TCS for Unilever.',
    verified: true,
    source: 'resume',
    color: '#E5392F',
    bg: '#FFF0F0',
    r: 58
  },
  {
    id: 'typescript',
    name: 'TypeScript & JavaScript',
    category: 'Frontend',
    level: 'Advanced',
    evidence: 'Primary languages for Angular and React architectures at TCS and full-stack projects.',
    verified: true,
    source: 'resume',
    color: '#2F5BFF',
    bg: '#F0F4FF',
    r: 54
  },
  {
    id: 'react',
    name: 'ReactJS / Next.Js',
    category: 'Frontend',
    level: 'Advanced',
    evidence: 'Engineered Talk-A-Tive real-time chat application and component-driven web interfaces.',
    verified: true,
    source: 'resume',
    color: '#06B6D4',
    bg: '#F0FDFA',
    r: 52
  },
  {
    id: 'd3',
    name: 'D3.js',
    category: 'Data Viz',
    level: 'Mastery',
    evidence: 'Built Causal & Impact ML dashboards and SPC statistical variance graphs for Unilever.',
    verified: true,
    source: 'resume',
    color: '#FF7A00',
    bg: '#FFF4EB',
    r: 58
  },
  {
    id: 'ue4',
    name: 'Unreal Engine 4',
    category: '3D & Gaming',
    level: 'Proficient',
    evidence: 'Architected Dead by Shot FPS game with gameplay mechanics played by 100+ players.',
    verified: true,
    source: 'resume',
    color: '#8B5CF6',
    bg: '#F5F0FF',
    r: 52
  },
  {
    id: 'blender',
    name: 'Blender 3D',
    category: '3D & Gaming',
    level: 'Proficient',
    evidence: 'Created 3D models and environment assets for Dead by Shot FPS.',
    verified: true,
    source: 'resume',
    color: '#FFC93C',
    bg: '#FFFCEB',
    r: 50
  },
  {
    id: 'python',
    name: 'Python (Scikit-Learn)',
    category: 'Languages & Tools',
    level: 'Advanced',
    evidence: 'Built Gold Price Prediction ML pipeline with Random Forest 500+ estimators.',
    verified: true,
    source: 'resume',
    color: '#FF8FB1',
    bg: '#FFF5F8',
    r: 52
  },
  {
    id: 'cpp',
    name: 'C++ & Java',
    category: 'Languages & Tools',
    level: 'Advanced',
    evidence: 'Core computer science degree foundation (DSA, OOP) at LNCT with 82.80% aggregate.',
    verified: true,
    source: 'resume',
    color: '#D91E75',
    bg: '#FFF0F6',
    r: 48
  },
  {
    id: 'sql',
    name: 'SQL (MySQL)',
    category: 'Languages & Tools',
    level: 'Advanced',
    evidence: 'Relational database management coursework and backend integrations.',
    verified: true,
    source: 'resume',
    color: '#22C55E',
    bg: '#F0FDF4',
    r: 48
  },
  {
    id: 'figma',
    name: 'Figma & Canva',
    category: '3D & Gaming',
    level: 'Advanced',
    evidence: 'Design systems, UI layouts, and asset wireframes.',
    verified: true,
    source: 'resume',
    color: '#38BDF8',
    bg: '#F0F9FF',
    r: 46
  },
  {
    id: 'git',
    name: 'Git & GitHub',
    category: 'Languages & Tools',
    level: 'Advanced',
    evidence: 'Version control workflows, production release hygiene, and code reviews.',
    verified: true,
    source: 'resume',
    color: '#E5392F',
    bg: '#FFF0F0',
    r: 44
  }
];

export const PRINCIPLES: PrincipleRecord[] = [
  {
    number: '01',
    title: 'Clarity First',
    kicker: 'REDUCE NOISE',
    body: 'Remove visual clutter before layering motion. Every data point and configuration must serve an operational decision.',
    proofLine: 'Built 5+ configuration screens in Angular & D3.js prioritizing parameter clarity for 500+ quality engineers.',
    accent: '#2F5BFF',
    bg: '#F5F8FF',
    borderColor: '#D4E2FF',
    doodleId: 'clarity',
    verified: true,
    source: 'resume'
  },
  {
    number: '02',
    title: 'Data Should Feel Alive',
    kicker: 'KINETIC CONTEXT',
    body: 'Telemetry is not static text. An interactive distribution communicates status far faster than a table.',
    proofLine: 'Engineered Causal & Impact analytics across 20+ manufacturing sites with custom D3 variance graphs.',
    accent: '#5CC46B',
    bg: '#F2FCF5',
    borderColor: '#C5F0CF',
    doodleId: 'alive',
    verified: true,
    source: 'resume'
  },
  {
    number: '03',
    title: 'Performance Is Design',
    kicker: '60FPS STANDARD',
    body: 'An interface that hesitates breaks user trust. Render loops run outside Angular zones to guarantee fluid responsiveness.',
    proofLine: 'Resolved 20+ critical production bugs and optimized data rendering logic at enterprise scale.',
    accent: '#FF7A00',
    bg: '#FFF7F0',
    borderColor: '#FFE0C7',
    doodleId: 'perf',
    verified: true,
    source: 'resume'
  },
  {
    number: '04',
    title: 'Details Matter',
    kicker: 'TACTILE DETAIL',
    body: 'Micro-interactions, playful feedback, and keyboard accessibility transform complex technical tools into joyous everyday companions.',
    proofLine: 'Delivered real-time sub-100ms event delivery for Talk-A-Tive and FPS mechanics for 100+ gamers.',
    accent: '#FFC93C',
    bg: '#FFFDF0',
    borderColor: '#FFF1B8',
    doodleId: 'details',
    verified: true,
    source: 'resume'
  }
];

// Helper to filter verified records
export function getVerifiedOnly<T extends { verified: boolean }>(items: T[]): T[] {
  return items.filter((item) => item.verified);
}

export interface Project {
  n: string;
  tag: string;
  st?: string;
  t: string;
  s: string;
  d: string;
  f: string[];
  k: string[];
  accentColor: string;
  bgGradient: string;
  dotColor: string;
  textColor: string;
  image: string;
}

export interface Experiment {
  n: string;
  t: string;
  tag: string;
  d: string;
  k: string[];
  accentColor?: string;
}

export interface HackathonStep {
  step: string;
  title: string;
  desc: string;
  badge: string;
  artifactTitle: string;
  artifactSubtitle: string;
  metric: string;
  metricLabel: string;
  secondaryMetric?: string;
  secondaryLabel?: string;
  tags: string[];
  artifactType: 'waveform' | 'field' | 'vision' | 'benchmark' | 'award';
}

export interface CurriculumStage {
  stage: string;
  title: string;
  copy: string;
  source: string;
  sourceCategory: 'Foundational Mentor' | 'Applied ML Platform' | 'Mathematical Rigor' | 'Production Stack';
  proofBadge: string;
  proofMetric: string;
  proofDetail: string;
  stackTags: string[];
}

export type ScrollAnimationMode =
  | 'cascading'
  | 'parallax'
  | 'stack'
  | 'ambient'
  | 'skew'
  | 'laser'
  | 'default';

export interface ScrollAnimOption {
  id: ScrollAnimationMode;
  label: string;
  badge: string;
  desc: string;
}

export const SCROLL_ANIM_OPTIONS: ScrollAnimOption[] = [
  {
    id: 'cascading',
    label: 'Cascading Posters (Sheryians)',
    badge: 'Option 6',
    desc: 'Each card slides over the previous one and stops with an incremental offset, forming a stepped stack of cards.',
  },
  {
    id: 'parallax',
    label: 'Parallax Vitrine',
    badge: 'Option 1',
    desc: '3D artwork glides vertically inside the vitrine frame while the wireframe numbers float in counter-perspective.',
  },
  {
    id: 'stack',
    label: 'Full Sticky Stack',
    badge: 'Option 2',
    desc: 'Cards pin to the top and completely overlap with a scale-down transition on previous cards.',
  },
  {
    id: 'ambient',
    label: 'Ambient Color Flow',
    badge: 'Option 3',
    desc: 'Background atmospheric glow smoothly transitions into each project’s signature accent color as it scrolls into view.',
  },
  {
    id: 'skew',
    label: 'Velocity Skew',
    badge: 'Option 4',
    desc: 'Kinetic fluid physics — rapid scrolling applies an inertia tilt to cards and typography, snapping back on rest.',
  },
  {
    id: 'laser',
    label: 'Laser Wireframe Draw',
    badge: 'Option 5',
    desc: 'A luminous neon laser sweeps across the wireframe digits 01 to 07 as each card enters the viewport.',
  },
  {
    id: 'default',
    label: 'Default Grid',
    badge: 'Standard',
    desc: 'Original alternating cards layout without scroll pinning or parallax for baseline comparison.',
  },
];

export const CURRICULUM_STAGES: CurriculumStage[] = [
  {
    stage: '01',
    title: 'Foundations',
    copy: 'Data science and machine learning fundamentals in Python.',
    source: 'Code With Harry',
    sourceCategory: 'Foundational Mentor',
    proofBadge: 'Python & Data Structures',
    proofMetric: '100+ Notebooks',
    proofDetail: 'NumPy vectors, Pandas dataframes, clean syntax and algorithmic problem solving from scratch.',
    stackTags: ['Python', 'NumPy', 'Pandas', 'OOP'],
  },
  {
    stage: '02',
    title: 'Practical depth',
    copy: 'Hands-on projects across the full ML workflow, from data to model.',
    source: 'Jovian',
    sourceCategory: 'Applied ML Platform',
    proofBadge: 'End-to-End Pipeline',
    proofMetric: 'Kaggle & EDA',
    proofDetail: 'Data wrangling, feature engineering, model training, cross-validation and hyperparameter tuning.',
    stackTags: ['Scikit-learn', 'EDA', 'Feature Eng.', 'Model Eval'],
  },
  {
    stage: '03',
    title: 'Concept depth',
    copy: 'How the algorithms work, and the math behind them.',
    source: 'StatQuest · Khan Academy',
    sourceCategory: 'Mathematical Rigor',
    proofBadge: 'Math From Scratch',
    proofMetric: 'Zero Black Box',
    proofDetail: 'Linear algebra projections, calculus derivatives, loss gradients, decision tree splits and backpropagation.',
    stackTags: ['Linear Algebra', 'Calculus', 'Gradients', 'Loss Functions'],
  },
  {
    stage: '04',
    title: 'Built to ship',
    copy: 'Employers expect ML engineers to deploy, so I learned the web stack to take models beyond Colab.',
    source: 'HTML · CSS · JavaScript · React · Next.js',
    sourceCategory: 'Production Stack',
    proofBadge: 'Beyond Colab',
    proofMetric: 'Live Cloud & PWA',
    proofDetail: 'Production web interfaces, low-latency API integration, streaming states, and containerized deployments.',
    stackTags: ['HTML/CSS', 'JavaScript', 'React', 'Next.js', 'FastAPI'],
  },
];

export const HACKATHON_STEPS: HackathonStep[] = [
  {
    step: 'Step 1',
    title: 'Problem',
    desc: 'Voice-first barrier for marginalized artisans.',
    badge: 'Field Research & Acoustic Logs',
    artifactTitle: 'Acoustic Dialect Barrier',
    artifactSubtitle: 'Hindi, Bhojpuri & Bundeli voice inputs',
    metric: '87%',
    metricLabel: 'Artisans unable to use text UIs',
    secondaryMetric: '0',
    secondaryLabel: 'Typing literacy required',
    tags: ['Acoustic Modeling', 'Voice First', 'Rural UX'],
    artifactType: 'waveform',
  },
  {
    step: 'Step 2',
    title: 'Research',
    desc: 'Field study across 42 craft clusters in 8 states.',
    badge: 'Artisan Ethnography',
    artifactTitle: 'Field Ethnography & Voice UX',
    artifactSubtitle: 'Field interviews across MP, Rajasthan, UP & Odisha',
    metric: '42',
    metricLabel: 'Craft clusters studied',
    secondaryMetric: '100%',
    secondaryLabel: 'Audio-tactile design cues',
    tags: ['Ethnography', 'High Contrast UI', 'Voice Feedback'],
    artifactType: 'field',
  },
  {
    step: 'Step 3',
    title: 'Build',
    desc: 'Multi-lingual voice pipeline & on-device AI.',
    badge: 'Neural Architecture',
    artifactTitle: 'AI Background & Voice Pipeline',
    artifactSubtitle: 'FastViT edge vision + Whisper Tiny ONNX',
    metric: '180ms',
    metricLabel: 'On-device background removal',
    secondaryMetric: '30KB',
    secondaryLabel: 'Micro-model runtime footprint',
    tags: ['FastViT', 'Whisper ONNX', 'Local AI'],
    artifactType: 'vision',
  },
  {
    step: 'Step 4',
    title: 'Validate',
    desc: 'Offline benchmarks & edge device testing.',
    badge: 'Edge Latency & Accuracy',
    artifactTitle: 'Edge Device Latency & Precision',
    artifactSubtitle: 'Stress-tested on entry-level Android devices in 2G/3G',
    metric: '99.2%',
    metricLabel: 'Intent recognition precision',
    secondaryMetric: '<210ms',
    secondaryLabel: 'Total speech-to-intent latency',
    tags: ['Edge Benchmarks', 'Zero Cloud Lag', 'Offline First'],
    artifactType: 'benchmark',
  },
  {
    step: 'Step 5',
    title: 'Present',
    desc: 'SIH 2026 National Finale & live demo.',
    badge: 'National Finale Selection',
    artifactTitle: 'Smart India Hackathon 2026 Finale',
    artifactSubtitle: 'Ministry of Textiles & Tribal Affairs · Team INVINCIBLE',
    metric: '1st',
    metricLabel: 'National Finalist Ranking',
    secondaryMetric: 'Live',
    secondaryLabel: 'Cloud Run Production Build',
    tags: ['SIH 2026', 'Team INVINCIBLE', 'Deployed'],
    artifactType: 'award',
  },
];

export const PROJECTS: Project[] = [
  {
    n: '01',
    tag: 'Frontend / Video / ML',
    st: 'Building',
    t: 'Chitrapat',
    s: 'Netflix-style streaming platform',
    d: 'A streaming platform built around a custom video player, a vibe-based explorer, a cinematic watch-page intro and an ML layer.',
    f: [
      'Custom video player',
      '/vibe explorer',
      'Watch-page intro',
      '4DX scrubber login',
      'ML layer',
      '[Add feature]',
    ],
    k: ['Frontend', 'Video Engineering', 'Machine Learning'],
    accentColor: '#7C3AED', // Vibrant Violet
    bgGradient: 'linear-gradient(135deg, #F5F0FF 0%, #E9DEFF 100%)',
    dotColor: 'rgba(124, 58, 237, 0.45)',
    textColor: '#5B21B6',
    image: '/projects/chitrapat.jpg?v=2',
  },
  {
    n: '02',
    tag: 'AI / Voice / Social impact',
    t: 'ShilpSetu',
    s: 'AI market linkage for artisans',
    d: 'A voice-first, AI-driven market-linkage app that connects marginalized artisans to buyers, built for Smart India Hackathon 2026.',
    f: [
      'Voice-first IVR',
      'Market linkage',
      'SIH 2026 · PS 26090',
      'Team INVINCIBLE',
    ],
    k: ['Generative AI', 'Voice', 'Social Impact'],
    accentColor: '#E11D48', // Coral Crimson
    bgGradient: 'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)',
    dotColor: 'rgba(225, 29, 72, 0.45)',
    textColor: '#BE123C',
    image: '/projects/shilpsetu.jpg?v=2',
  },
  {
    n: '03',
    tag: 'Networking / Systems',
    t: 'BoostNet',
    s: 'Multipath bandwidth aggregator',
    d: 'Pools bandwidth from several devices into one faster connection, using a Go engine and Android donor devices.',
    f: [
      'Go aggregation engine',
      'Android donor devices',
      'Campus bandwidth pooling',
    ],
    k: ['Go', 'Android', 'Networking'],
    accentColor: '#2563EB', // Cobalt Blue
    bgGradient: 'linear-gradient(135deg, #F0F6FF 0%, #DCE9FE 100%)',
    dotColor: 'rgba(37, 99, 235, 0.45)',
    textColor: '#1D4ED8',
    image: '/projects/boostnet.jpg?v=2',
  },
  {
    n: '04',
    tag: 'Privacy / PWA',
    t: 'Private PDF Tool',
    s: 'Privacy-first image to PDF',
    d: 'A web app with iLovePDF-style features for converting images to PDF, installable as a mobile PWA.',
    f: ['Image to PDF', 'Privacy-first', 'Installable PWA'],
    k: ['PWA', 'Frontend', 'Privacy'],
    accentColor: '#059669', // Emerald Mint
    bgGradient: 'linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%)',
    dotColor: 'rgba(5, 150, 105, 0.45)',
    textColor: '#065F46',
    image: '/projects/private_pdf.jpg?v=2',
  },
  {
    n: '05',
    tag: 'GenAI / RAG / Video Intelligence',
    st: 'Built',
    t: 'ClassGPT',
    s: 'Video-grounded RAG teaching assistant',
    d: 'An intelligent AI teaching assistant that ingests lecture videos, transcribes multi-speaker audio with precise timestamps using Whisper, indexes semantic vector embeddings, and delivers grounded answers with direct jump-to-video source citations.',
    f: [
      'Whisper timestamp engine',
      'Semantic video chunking',
      'Dense vector embeddings',
      'Top-K similarity retrieval',
      'Grounded LLM synthesis',
      'Timestamp jump-to-source',
    ],
    k: ['RAG', 'Whisper', 'Vector Embeddings', 'LLMs', 'Python', 'Pandas'],
    accentColor: '#0284C7', // Sky Azure
    bgGradient: 'linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%)',
    dotColor: 'rgba(2, 132, 199, 0.45)',
    textColor: '#0369A1',
    image: '/projects/classgpt.jpg?v=2',
  },
  {
    n: '06',
    tag: 'CV / Backend / Frontend',
    st: 'Built',
    t: 'TrackSure',
    s: 'City-wide multi-camera vehicle tracking',
    d: 'Follows a vehicle across the whole city using ANPR and multi-camera trajectory tracking, with live traffic analytics on a single dashboard.',
    f: [
      'Multi-camera ANPR',
      'Trajectory tracking',
      'Traffic analytics',
      'Live dashboard',
    ],
    k: ['Computer Vision', 'Full-Stack', 'Smart City'],
    accentColor: '#0D9488', // Cyber Teal
    bgGradient: 'linear-gradient(135deg, #F0FDFA 0%, #CCFBF1 100%)',
    dotColor: 'rgba(13, 148, 136, 0.45)',
    textColor: '#0F766E',
    image: '/projects/tracksure.jpg',
  },
  {
    n: '07',
    tag: 'CV / Backend / Frontend',
    st: 'Built',
    t: 'CityEye (NexWatch)',
    s: 'Real-time AI traffic enforcement',
    d: 'Detects 7 kinds of traffic violations in live CCTV feeds and sends instant alerts, all through a real-time command dashboard.',
    f: [
      'YOLOv11 + ByteTrack',
      '7 violation detectors',
      'WhatsApp SOS alerts',
      'Live incident queue',
    ],
    k: ['Computer Vision', 'FastAPI', 'Next.js'],
    accentColor: '#E11D48', // Alert Rose
    bgGradient: 'linear-gradient(135deg, #FFF1F2 0%, #FFE4E6 100%)',
    dotColor: 'rgba(225, 29, 72, 0.45)',
    textColor: '#BE123C',
    image: '/projects/cityeye.jpg',
  },
];

export const EXPERIMENTS: Experiment[] = [
  {
    n: '08',
    t: 'DSA Quest Tracker',
    tag: 'Google Sheets / Productivity',
    d: 'A lecture tracker with a game-style dashboard for progress, XP, revision, practice and streaks.',
    k: ['Google Sheets', 'Gamification'],
    accentColor: '#7C3AED',
  },
  {
    n: '09',
    t: 'Visual Habit & Goal Tracker',
    tag: 'Google Sheets / Productivity',
    d: 'A dynamic 31-day habit tracking system with automated calendar navigation, interactive checkboxes, COUNTIF progress calculations, and SPARKLINE visual analytics.',
    k: ['Google Sheets', 'SPARKLINE', 'Dynamic Formulas', 'Data Visualization'],
    accentColor: '#10B981',
  },
  {
    n: '10',
    t: 'Medical Insurance Cost Predictor',
    tag: 'Machine Learning / Regression',
    d: 'Predicts annual medical costs, with EDA on how BMI and smoking drive premiums.',
    k: ['Linear Regression', 'Gradient Descent', 'EDA'],
    accentColor: '#2563EB',
  },
  {
    n: '11',
    t: 'Customer Classification System',
    tag: 'Machine Learning / Classification',
    d: 'A full preprocessing pipeline (imputation, 0-1 scaling, one-hot encoding) feeding a logistic regression classifier.',
    k: ['Logistic Regression', 'Feature Scaling', 'One-Hot Encoding'],
    accentColor: '#0284C7',
  },
  {
    n: '12',
    t: 'Tree-Based Predictive Models',
    tag: 'Machine Learning / Ensembles',
    d: 'Decision trees and random forests, tuned and regularized to control overfitting.',
    k: ['Random Forest', 'Hyperparameter Tuning', 'Ensembles'],
    accentColor: '#059669',
  },
  {
    n: '13',
    t: 'NYC Taxi Fare Prediction',
    tag: 'Machine Learning / Kaggle',
    d: 'An end-to-end Kaggle project: baseline, feature engineering (time of day, distance), then iterative leaderboard gains.',
    k: ['Feature Engineering', 'Kaggle', 'Large-scale Data'],
    accentColor: '#D97706',
  },
  {
    n: '14',
    t: 'Gradient Boosting with XGBoost',
    tag: 'Machine Learning / Boosting',
    d: 'Applies XGBoost to complex datasets for stronger accuracy at lower training cost than plain forests.',
    k: ['XGBoost', 'Ensemble Learning'],
    accentColor: '#EA580C',
  },
  {
    n: '15',
    t: 'Customer Segmentation Clustering',
    tag: 'Machine Learning / Unsupervised',
    d: 'Finds natural customer groupings without labels, using K-means and dimensionality reduction.',
    k: ['K-means', 'PCA'],
    accentColor: '#8B5CF6',
  },
];

export const TECH_STACK: Record<string, string[]> = {
  Programming: [
    'Python',
    'SQL',
    'C++',
    'JavaScript',
    'TypeScript',
    'HTML',
    'CSS',
  ],
  'AI / ML / GenAI': [
    'Scikit-learn',
    'Prompt Engineering',
    'LLM APIs',
    'Embeddings',
    'RAG',
  ],
  Frontend: ['React', 'Vite', 'Three.js', 'GSAP', 'Tailwind CSS'],
  Backend: ['Go', 'FastAPI', 'REST APIs'],
  'Data & Visualization': ['NumPy', 'Pandas', 'Matplotlib', 'Power BI'],
  'Developer Tools': ['Git', 'GitHub', 'VS Code', 'Google AI Studio'],
};

export function getFlattenedSkills(selectedCategory = 'All'): {
  category: string;
  name: string;
}[] {
  const all: { category: string; name: string }[] = [];
  for (const [category, skills] of Object.entries(TECH_STACK)) {
    if (selectedCategory === 'All' || selectedCategory === category) {
      for (const skill of skills) {
        all.push({ category, name: skill });
      }
    }
  }
  return all;
}

export function formatRecoveredProgress(recoveredCount: number, total: number): string {
  if (recoveredCount >= total) {
    return `${total} / ${total} recovered — all found!`;
  }
  return `${recoveredCount} / ${total} recovered`;
}

export function parseEmphasizedWords(text: string): { word: string; isAccent: boolean }[] {
  const parts = text.split(' ');
  const result: { word: string; isAccent: boolean }[] = [];

  for (const part of parts) {
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2) {
      result.push({ word: part.slice(1, -1), isAccent: true });
    } else if (part.includes('*')) {
      const cleaned = part.replace(/\*/g, '');
      result.push({ word: cleaned, isAccent: true });
    } else {
      result.push({ word: part, isAccent: false });
    }
  }

  return result;
}

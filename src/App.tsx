/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import {
  Sun,
  Moon,
  Mic,
  Cpu,
  Award,
  Sparkles,
  ArrowRight,
  Activity,
  Volume2,
  TrendingUp,
  CheckCircle2,
  ArrowUpRight,
} from 'lucide-react';
import {
  PROJECTS,
  EXPERIMENTS,
  TECH_STACK,
  HACKATHON_STEPS,
  CURRICULUM_STAGES,
  getFlattenedSkills,
  formatRecoveredProgress,
} from './data/portfolioData';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const ROTATING_HERO_WORDS = ['experiences.', 'interfaces.', 'architectures.', 'systems.'];

export default function App() {
  const [theme, setTheme] = useState<'light' | 'midnight'>('light');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [recoveredSet, setRecoveredSet] = useState<Set<number>>(new Set());
  const [activeProjectCard, setActiveProjectCard] = useState<typeof PROJECTS[0] | null>(null);

  // Curriculum Lineage States: Stepper for desktop/tablet, Proof breakdown for mobile
  const [activeTimelineStep, setActiveTimelineStep] = useState<number>(0);
  const [timelineDirection, setTimelineDirection] = useState<'next' | 'prev'>('next');
  const [expandedProofStage, setExpandedProofStage] = useState<string | null>(null);
  const desktopStepperRef = useRef<HTMLDivElement>(null);

  const handleStepChange = (targetIndex: number) => {
    if (targetIndex === activeTimelineStep) return;
    setTimelineDirection(targetIndex > activeTimelineStep ? 'next' : 'prev');
    setActiveTimelineStep(targetIndex);
  };

  // Desktop Horizontal Scroll / Wheel / Swipe for Milestone Stepper
  useEffect(() => {
    const el = desktopStepperRef.current;
    if (!el) return;

    let lastScrollTime = 0;
    const cooldownMs = 380;

    const handleWheel = (e: WheelEvent) => {
      // Check both vertical scroll (deltaY) and horizontal gestures (deltaX)
      const absY = Math.abs(e.deltaY);
      const absX = Math.abs(e.deltaX);
      const delta = absY >= absX ? e.deltaY : e.deltaX;

      if (Math.abs(delta) > 12) {
        const now = Date.now();
        if (now - lastScrollTime < cooldownMs) return;

        if (delta > 0) {
          // Scroll downward / forward -> 1 -> 2 -> 3 -> 4
          setActiveTimelineStep((prev) => {
            if (prev < CURRICULUM_STAGES.length - 1) {
              e.preventDefault();
              setTimelineDirection('next');
              lastScrollTime = now;
              return prev + 1;
            }
            return prev;
          });
        } else if (delta < 0) {
          // Scroll upward / backward -> 4 -> 3 -> 2 -> 1
          setActiveTimelineStep((prev) => {
            if (prev > 0) {
              e.preventDefault();
              setTimelineDirection('prev');
              lastScrollTime = now;
              return prev - 1;
            }
            return prev;
          });
        }
      }
    };

    // Keyboard navigation when stepper has focus
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        setActiveTimelineStep((prev) => {
          if (prev < CURRICULUM_STAGES.length - 1) {
            setTimelineDirection('next');
            return prev + 1;
          }
          return prev;
        });
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setActiveTimelineStep((prev) => {
          if (prev > 0) {
            setTimelineDirection('prev');
            return prev - 1;
          }
          return prev;
        });
      }
    };

    // Horizontal touch/pointer swipe for desktop trackpads & touch devices
    let pointerStartX = 0;
    let pointerStartY = 0;
    let isPointerActive = false;

    const handlePointerDown = (e: PointerEvent) => {
      pointerStartX = e.clientX;
      pointerStartY = e.clientY;
      isPointerActive = true;
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!isPointerActive) return;
      isPointerActive = false;
      const diffX = pointerStartX - e.clientX;
      const diffY = pointerStartY - e.clientY;

      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 40) {
        const now = Date.now();
        if (now - lastScrollTime < cooldownMs) return;

        if (diffX > 0) {
          setActiveTimelineStep((prev) => {
            if (prev < CURRICULUM_STAGES.length - 1) {
              setTimelineDirection('next');
              lastScrollTime = now;
              return prev + 1;
            }
            return prev;
          });
        } else {
          setActiveTimelineStep((prev) => {
            if (prev > 0) {
              setTimelineDirection('prev');
              lastScrollTime = now;
              return prev - 1;
            }
            return prev;
          });
        }
      }
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('keydown', handleKeyDown);
    el.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      el.removeEventListener('wheel', handleWheel);
      el.removeEventListener('keydown', handleKeyDown);
      el.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, []);

  // Rotating Hero Word Interval
  const [rotatingWordIndex, setRotatingWordIndex] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRotatingWordIndex((prev) => (prev + 1) % ROTATING_HERO_WORDS.length);
    }, 2600);
    return () => clearInterval(interval);
  }, []);

  // Footer Signature Torchlight State with Liquid Spring-Inertia Wobble (Word: "Samyak")
  const signatureRef = useRef<HTMLDivElement>(null);
  const wordmarkRef = useRef<HTMLDivElement>(null);

  // High-performance physics refs for 60-120fps direct DOM manipulation (no React re-render lag)
  const torchPhysicsRef = useRef({
    targetX: 300,
    targetY: 100,
    currentX: 300,
    currentY: 100,
    prevTargetX: 300,
    wobbleX: 0,
    wobbleVx: 0,
    opacity: 0,
    targetOpacity: 0,
    rafId: 0,
  });

  const animateTorchPhysics = () => {
    const p = torchPhysicsRef.current;
    const el = wordmarkRef.current;
    if (!el) return;

    // 1. Smooth lerp toward mouse cursor coordinates
    p.currentX += (p.targetX - p.currentX) * 0.16;
    p.currentY += (p.targetY - p.currentY) * 0.16;

    // 2. Spring-mass-damper physics for the X-axis liquid wobble inside the color fill
    // Spring constant k = 0.18 (elastic tension), damping c = 0.82 (smooth decay)
    const springK = 0.18;
    const damping = 0.82;
    const springForce = -springK * p.wobbleX;
    p.wobbleVx = (p.wobbleVx + springForce) * damping;
    p.wobbleX += p.wobbleVx;

    // 3. Smooth opacity transition
    p.opacity += (p.targetOpacity - p.opacity) * 0.14;

    // Apply to DOM directly via CSS variables
    const spotlightX = p.currentX + p.wobbleX;
    const spotlightY = p.currentY;

    el.style.setProperty('--spotlight-x', `${spotlightX.toFixed(2)}px`);
    el.style.setProperty('--spotlight-y', `${spotlightY.toFixed(2)}px`);
    el.style.setProperty('--wobble-x', `${p.wobbleX.toFixed(2)}px`);
    el.style.setProperty('--spotlight-opacity', p.opacity.toFixed(3));

    // Keep RAF running while cursor is moving, color is wobbling, or light is fading
    const isMoving = Math.abs(p.targetX - p.currentX) > 0.1 || Math.abs(p.targetY - p.currentY) > 0.1;
    const isWobbling = Math.abs(p.wobbleX) > 0.05 || Math.abs(p.wobbleVx) > 0.05;
    const isFading = Math.abs(p.targetOpacity - p.opacity) > 0.01;

    if (p.targetOpacity > 0 || isMoving || isWobbling || isFading) {
      p.rafId = requestAnimationFrame(animateTorchPhysics);
    } else {
      p.rafId = 0;
    }
  };

  useEffect(() => {
    return () => {
      if (torchPhysicsRef.current.rafId) {
        cancelAnimationFrame(torchPhysicsRef.current.rafId);
      }
    };
  }, []);

  const handleSignatureMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!signatureRef.current) return;
    const rect = signatureRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left;
    const newY = e.clientY - rect.top;

    const p = torchPhysicsRef.current;
    const deltaX = newX - p.prevTargetX;
    p.prevTargetX = newX;

    p.targetX = newX;
    p.targetY = newY;
    p.targetOpacity = 1;

    // Velocity-based horizontal impulse: moving cursor pushes color with elastic momentum
    const impulse = Math.max(-26, Math.min(26, deltaX * 0.42));
    p.wobbleVx += impulse;

    if (!p.rafId) {
      p.rafId = requestAnimationFrame(animateTorchPhysics);
    }
  };

  const handleSignatureMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!signatureRef.current) return;
    const rect = signatureRef.current.getBoundingClientRect();
    const newX = e.clientX - rect.left;
    const newY = e.clientY - rect.top;

    const p = torchPhysicsRef.current;
    p.targetX = newX;
    p.targetY = newY;
    p.currentX = newX;
    p.currentY = newY;
    p.prevTargetX = newX;
    p.wobbleX = 0;
    p.wobbleVx = 0;
    p.targetOpacity = 1;

    if (!p.rafId) {
      p.rafId = requestAnimationFrame(animateTorchPhysics);
    }
  };

  const handleSignatureMouseLeave = () => {
    const p = torchPhysicsRef.current;
    p.targetOpacity = 0;

    if (!p.rafId) {
      p.rafId = requestAnimationFrame(animateTorchPhysics);
    }
  };

  // Hackathon Pipeline Interactive States
  const [hackathonActiveStep, setHackathonActiveStep] = useState<number>(0);
  const [hackathonHoveredStep, setHackathonHoveredStep] = useState<number | null>(null);
  const [hackathonBgWipe, setHackathonBgWipe] = useState<'raw' | 'processed'>('processed');

  const hackathonRef = useRef<HTMLElement>(null);

  // Certificate Lightbox State
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCertificateOpen(false);
      }
    };
    if (isCertificateOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isCertificateOpen]);

  // Auto-cycle FastViT background wipe preview
  useEffect(() => {
    const timer = setInterval(() => {
      setHackathonBgWipe((prev) => (prev === 'processed' ? 'raw' : 'processed'));
    }, 2600);
    return () => clearInterval(timer);
  }, []);

  const effectiveHackathonStep = hackathonHoveredStep !== null ? hackathonHoveredStep : hackathonActiveStep;
  const currentHackathonStepData = HACKATHON_STEPS[effectiveHackathonStep] || HACKATHON_STEPS[0];
  const hackathonFillPercent = (effectiveHackathonStep / (HACKATHON_STEPS.length - 1)) * 100;

  const containerRef = useRef<HTMLDivElement>(null);
  const dreamRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dCardRef = useRef<HTMLDivElement>(null);
  const curRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const preRef = useRef<HTMLDivElement>(null);
  const preCountRef = useRef<HTMLElement>(null);

  // Initialize theme from storage
  useEffect(() => {
    const savedTheme = localStorage.getItem('portfolio-theme') as 'light' | 'midnight' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'midnight');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'midnight' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    document.documentElement.classList.toggle('dark', nextTheme === 'midnight');
    localStorage.setItem('portfolio-theme', nextTheme);

    // Update 3D scene if initialized
    if (dreamState.current.scene) {
      if (dreamState.current.scene.fog instanceof THREE.FogExp2) {
        dreamState.current.scene.fog.color.set(nextTheme === 'midnight' ? 0x05060A : 0xF5EFEB);
      }
    }
  };

  // Three.js and animation runtime refs
  const dreamState = useRef<{
    renderer: THREE.WebGLRenderer | null;
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    particles: THREE.Points | null;
    meshes: THREE.Mesh[];
    isRunning: boolean;
    mouseX: number;
    mouseY: number;
    spinX: number;
    spinY: number;
    velX: number;
    velY: number;
    isDragging: boolean;
    lastX: number;
    lastY: number;
    animFrameId: number;
  }>({
    renderer: null,
    scene: null,
    camera: null,
    particles: null,
    meshes: [],
    isRunning: false,
    mouseX: 0,
    mouseY: 0,
    spinX: 0,
    spinY: 0,
    velX: 0,
    velY: 0,
    isDragging: false,
    lastX: 0,
    lastY: 0,
    animFrameId: 0,
  });

  // Helper for split text
  const splitTextIntoWords = (text: string) => {
    return text.split(' ').map((word, i) => {
      const isAccent = word.startsWith('*') && word.endsWith('*');
      const cleanWord = word.replace(/\*/g, '');
      return (
        <span key={i} className="w" style={{ marginRight: '0.26em' }}>
          <span>
            {isAccent ? <em>{cleanWord}</em> : cleanWord}
          </span>
        </span>
      );
    });
  };

  // Helper for interactive say characters
  const splitSayCharacters = (text: string) => {
    return text.split(' ').map((word, wIdx) => (
      <span key={wIdx} style={{ display: 'inline-block', whiteSpace: 'nowrap', marginRight: '0.3em' }}>
        {[...word].map((char, cIdx) => (
          <span key={cIdx} className="c">
            {char}
          </span>
        ))}
      </span>
    ));
  };

  // Preloader & Intro Animation
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const preEl = preRef.current;
    const cntEl = preCountRef.current;
    const navEl = navRef.current;

    const runIntro = () => {
      gsap.from('#h1 .w > span', {
        yPercent: 115,
        duration: 1.3,
        stagger: 0.09,
        ease: 'expo.out',
      });
      gsap.from('.hr', {
        y: 30,
        opacity: 0,
        duration: 1.2,
        stagger: 0.1,
        delay: 0.5,
        ease: 'expo.out',
      });
      if (navEl) {
        gsap.fromTo(
          navEl,
          { y: -80, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, delay: 0.8, ease: 'expo.out' }
        );
      }
    };

    if (preEl && cntEl && !prefersReducedMotion) {
      const counterObj = { v: 0 };
      gsap.to(counterObj, {
        v: 100,
        duration: 1.8,
        ease: 'power2.inOut',
        onUpdate: () => {
          if (cntEl) {
            cntEl.textContent = String(Math.round(counterObj.v)).padStart(3, '0');
          }
        },
        onComplete: () => {
          gsap.to(preEl, {
            clipPath: 'inset(0 0 100% 0)',
            duration: 0.9,
            ease: 'expo.inOut',
            onStart: runIntro,
            onComplete: () => {
              if (preEl) preEl.style.display = 'none';
            },
          });
        },
      });
    } else {
      if (preEl) preEl.style.display = 'none';
      runIntro();
    }
  }, []);

  // Smooth scroll (Lenis) & ScrollTrigger animations
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    let lenis: Lenis | null = null;
    try {
      lenis = new Lenis({ lerp: 0.08 });
      lenis.on('scroll', (e: { direction: number; scroll: number; velocity?: number }) => {
        ScrollTrigger.update();
        if (navRef.current) {
          navRef.current.classList.toggle('hide', e.direction === 1 && e.scroll > 200);
        }
      });

      const updateLenis = (time: number) => {
        lenis?.raf(time * 1000);
      };
      gsap.ticker.add(updateLenis);
      gsap.ticker.lagSmoothing(0);

      // Section split reveals (excluding work which has dedicated sequence)
      const splitHeadings = document.querySelectorAll('[data-split]:not(#h1):not(#work [data-split])');
      splitHeadings.forEach((el) => {
        const spans = el.querySelectorAll('.w > span');
        if (spans.length) {
          gsap.from(spans, {
            yPercent: 115,
            duration: 1.2,
            stagger: 0.06,
            ease: 'expo.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              once: true,
            },
          });
        }
      });

      // About Section Orchestrated Micro-Delayed Reveal Sequence
      const aboutEl = document.querySelector('#about');
      if (aboutEl) {
        const aboutTl = gsap.timeline({
          scrollTrigger: {
            trigger: '#about',
            start: 'top 82%',
            once: true,
          },
        });

        // 1. Eyebrow badge
        aboutTl.fromTo(
          '#about .eyebrow',
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out' }
        );

        // 2. Micro-delayed Word-by-word reveal for big statement
        const bigpSpans = document.querySelectorAll('#bigp span');
        if (bigpSpans.length) {
          aboutTl.fromTo(
            bigpSpans,
            { y: 28, opacity: 0, filter: 'blur(5px)' },
            {
              y: 0,
              opacity: 1,
              filter: 'blur(0px)',
              duration: 0.85,
              stagger: 0.038,
              ease: 'power3.out',
            },
            '-=0.35'
          );
        }

        // 3. Bio subtext paragraph
        aboutTl.fromTo(
          '.about-subtext',
          { y: 22, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.85, ease: 'power3.out' },
          '-=0.55'
        );

        // 4. Standalone certificate vitrine card
        aboutTl.fromTo(
          '.cert-standalone-card',
          { y: 36, opacity: 0, scale: 0.94 },
          { y: 0, opacity: 1, scale: 1, duration: 1.05, ease: 'expo.out' },
          '-=0.7'
        );

        // 5. Staggered stats boxes
        const statBoxes = document.querySelectorAll('.about-stats > div');
        if (statBoxes.length) {
          aboutTl.fromTo(
            statBoxes,
            { y: 24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.75, stagger: 0.08, ease: 'expo.out' },
            '-=0.45'
          );
        }
      }

      // Selected Work Section Orchestrated Micro-Delayed Reveal
      const workEl = document.querySelector('#work');
      if (workEl) {
        const workTl = gsap.timeline({
          scrollTrigger: {
            trigger: '#work',
            start: 'top 82%',
            once: true,
          },
        });

        workTl.fromTo(
          '#work .head .eyebrow',
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, ease: 'expo.out' }
        );

        const workSpans = document.querySelectorAll('#work [data-split] .w > span');
        if (workSpans.length) {
          workTl.fromTo(
            workSpans,
            { yPercent: 110, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 0.9,
              stagger: 0.045,
              ease: 'expo.out',
            },
            '-=0.35'
          );
        }

        workTl.fromTo(
          '#work .head .work-lead',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' },
          '-=0.55'
        );
      }

      // Fade-up elements
      const reveals = document.querySelectorAll('.rv');
      reveals.forEach((el) => {
        gsap.from(el, {
          y: 40,
          opacity: 0,
          duration: 1.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            once: true,
          },
        });
      });

      // Steps line scale
      const stepLines = document.querySelectorAll('.steps-line');
      stepLines.forEach((el) => {
        gsap.from(el, {
          scaleX: 0,
          transformOrigin: 'left',
          duration: 1.6,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
            once: true,
          },
        });
      });

      // Cards scrub and entrance
      const cards = document.querySelectorAll('.card');
      cards.forEach((c) => {
        gsap.from(c, {
          y: 60,
          opacity: 0,
          duration: 1.1,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: c,
            start: 'top 88%',
            once: true,
          },
        });
        const num = c.querySelector('.num');
        if (num) {
          gsap.to(num, {
            yPercent: -35,
            ease: 'none',
            scrollTrigger: {
              trigger: c,
              scrub: true,
            },
          });
        }
      });

      // Mobile Lineage cards entrance & parallax (one after another like the 7 projects)
      const lineageCards = document.querySelectorAll('.lineage-mobile-proof .lineage-card-c');
      lineageCards.forEach((c) => {
        gsap.from(c, {
          y: 55,
          opacity: 0,
          duration: 1.0,
          ease: 'expo.out',
          scrollTrigger: {
            trigger: c,
            start: 'top 88%',
            once: true,
          },
        });
        const num = c.querySelector('.lineage-num');
        if (num) {
          gsap.to(num, {
            yPercent: -28,
            ease: 'none',
            scrollTrigger: {
              trigger: c,
              scrub: true,
            },
          });
        }
      });

      // Desktop Lineage: Pinned Sticky Scrub with Dwell Zones (Approach 1)
      const mm = gsap.matchMedia();
      mm.add('(min-width: 900px)', () => {
        const lineageEl = document.querySelector('#lineage');
        if (!lineageEl) return;

        ScrollTrigger.create({
          trigger: '#lineage',
          start: 'top 8%',
          end: '+=2200',
          pin: true,
          anticipatePin: 1,
          scrub: 0.3,
          onUpdate: (self) => {
            const p = self.progress; // 0.0 to 1.0
            // Dwell zones:
            // 01 Foundations:      0.00 <= p < 0.25 (locked & readable)
            // 02 Practical depth:  0.25 <= p < 0.50 (dwell buffer)
            // 03 Concept depth:    0.50 <= p < 0.75 (dwell buffer)
            // 04 Built to ship:    0.75 <= p <= 1.00 (dwell buffer)
            let targetStep = 0;
            if (p >= 0.75) targetStep = 3;
            else if (p >= 0.50) targetStep = 2;
            else if (p >= 0.25) targetStep = 1;
            else targetStep = 0;

            setActiveTimelineStep((prev) => {
              if (prev !== targetStep) {
                setTimelineDirection(targetStep > prev ? 'next' : 'prev');
                return targetStep;
              }
              return prev;
            });
          },
        });
      });

      // Refresh ScrollTrigger calculations after all triggers are registered
      ScrollTrigger.refresh();
      const refreshTimer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 400);

      // Hero rings rotation and mouse parallax
      const handleMouseMove = (e: MouseEvent) => {
        gsap.to('#rings', {
          x: (e.clientX / window.innerWidth - 0.5) * -30,
          y: (e.clientY / window.innerHeight - 0.5) * -30,
          duration: 1.2,
          ease: 'power3.out',
        });
      };
      window.addEventListener('mousemove', handleMouseMove);

      gsap.to('#rings', {
        rotate: 360,
        duration: 240,
        repeat: -1,
        ease: 'none',
        svgOrigin: '400 400',
      });

      return () => {
        clearTimeout(refreshTimer);
        window.removeEventListener('mousemove', handleMouseMove);
        gsap.ticker.remove(updateLenis);
        mm.revert();
        lenis?.destroy();
      };
    } catch (err) {
      console.warn('Scroll animation initialization fallback', err);
    }
  }, []);

  // Custom magnetic cursor
  useEffect(() => {
    const cur = curRef.current;
    if (!cur || !window.matchMedia('(pointer: fine)').matches) return;

    const quickX = gsap.quickTo(cur, 'x', { duration: 0.3 });
    const quickY = gsap.quickTo(cur, 'y', { duration: 0.3 });

    const handleMouseMove = (e: MouseEvent) => {
      quickX(e.clientX);
      quickY(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Hover scale listeners
    const handleInteractEnter = (e: Event) => {
      const target = e.currentTarget as HTMLElement;
      gsap.to(cur, { scale: target.classList.contains('card') ? 5 : 3, duration: 0.4 });
    };
    const handleInteractLeave = () => {
      gsap.to(cur, { scale: 1, duration: 0.4 });
    };

    const interactives = document.querySelectorAll('[data-cur], a, button');
    interactives.forEach((el) => {
      el.addEventListener('mouseenter', handleInteractEnter);
      el.addEventListener('mouseleave', handleInteractLeave);
    });

    // Magnetic buttons
    const handleMagneticMove = (e: MouseEvent) => {
      const el = e.currentTarget as HTMLElement;
      const rect = el.getBoundingClientRect();
      gsap.to(el, {
        x: (e.clientX - rect.left - rect.width / 2) * 0.3,
        y: (e.clientY - rect.top - rect.height / 2) * 0.4,
        duration: 0.4,
      });
    };
    const handleMagneticLeave = (e: MouseEvent) => {
      const el = e.currentTarget as HTMLElement;
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'elastic.out(1, 0.4)',
      });
    };

    const magnets = document.querySelectorAll('.mag');
    magnets.forEach((el) => {
      el.addEventListener('mousemove', handleMagneticMove as EventListener);
      el.addEventListener('mouseleave', handleMagneticLeave as EventListener);
    });

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      interactives.forEach((el) => {
        el.removeEventListener('mouseenter', handleInteractEnter);
        el.removeEventListener('mouseleave', handleInteractLeave);
      });
      magnets.forEach((el) => {
        el.removeEventListener('mousemove', handleMagneticMove as EventListener);
        el.removeEventListener('mouseleave', handleMagneticLeave as EventListener);
      });
    };
  }, []);

  // Smooth navigation click
  const handleNavClick = (e: React.MouseEvent<HTMLElement>, targetId: string) => {
    e.preventDefault();
    const target = document.querySelector(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Dream Mode Three.js Implementation
  const initDreamScene = () => {
    const canvas = canvasRef.current;
    if (!canvas || dreamState.current.renderer) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const isDark = document.documentElement.getAttribute('data-theme') === 'midnight';
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(isDark ? 0x05060A : 0xF5EFEB, 0.04);

    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 9;

    // Colorful stardust particles
    const particleGeo = new THREE.BufferGeometry();
    const particleCount = 800;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
      particlePositions[i] = (Math.random() - 0.5) * 40;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particles = new THREE.Points(
      particleGeo,
      new THREE.PointsMaterial({
        color: 0xF59E0B,
        size: 0.07,
        transparent: true,
        opacity: 0.65,
      })
    );
    scene.add(particles);

    const ambientLight = new THREE.AmbientLight(0xFFFFFF, isDark ? 0.7 : 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.PointLight(0xF59E0B, 2.5, 45);
    keyLight.position.set(4, 4, 6);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0x8B5CF6, 2.0, 45);
    fillLight.position.set(-4, -3, 5);
    scene.add(fillLight);

    const geometries = [
      new THREE.IcosahedronGeometry(1.2, 0),
      new THREE.TorusKnotGeometry(0.9, 0.28, 100, 12),
      new THREE.OctahedronGeometry(1.3),
      new THREE.TorusGeometry(1, 0.38, 16, 40),
      new THREE.DodecahedronGeometry(1.2),
      new THREE.ConeGeometry(1.1, 2.0, 16),
      new THREE.CylinderGeometry(0.9, 0.9, 1.8, 16),
    ];

    const jewelColors = [
      0x8B5CF6,
      0xF59E0B,
      0x2563EB,
      0x059669,
      0x0284C7,
      0x0D9488,
      0xE11D48,
    ];

    const meshes: THREE.Mesh[] = [];
    PROJECTS.forEach((p, idx) => {
      const meshColor = jewelColors[idx % jewelColors.length];
      const mainMat = new THREE.MeshPhysicalMaterial({
        color: meshColor,
        transparent: true,
        opacity: 0.35,
        roughness: 0.1,
        metalness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
      });

      const wireMat = new THREE.MeshBasicMaterial({
        color: isDark ? 0x9A968A : 0x333336,
        wireframe: true,
        transparent: true,
        opacity: 0.5,
      });

      const mesh = new THREE.Mesh(geometries[idx % geometries.length], mainMat);
      mesh.add(new THREE.Mesh(geometries[idx % geometries.length], wireMat));

      mesh.position.set(
        Math.cos(idx * 1.7) * 4.2,
        (idx % 2 ? 1 : -1) * 1.5,
        -idx * 2.4
      );
      mesh.userData = { index: idx, basePosY: mesh.position.y };
      scene.add(mesh);
      meshes.push(mesh);
    });

    dreamState.current = {
      ...dreamState.current,
      renderer,
      scene,
      camera,
      particles,
      meshes,
    };

    const handleResize = () => {
      if (!renderer || !camera) return;
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);
  };

  const startDreamLoop = () => {
    dreamState.current.isRunning = true;

    const animate = (timestamp: number) => {
      if (!dreamState.current.isRunning) return;
      dreamState.current.animFrameId = requestAnimationFrame(animate);

      const t = timestamp * 0.001;
      const { camera, particles, meshes, renderer, scene } = dreamState.current;

      if (camera) {
        camera.position.x += (dreamState.current.mouseX * 5 - camera.position.x) * 0.04;
        camera.position.y += (-dreamState.current.mouseY * 3 - camera.position.y) * 0.04;
        camera.lookAt(0, 0, -4);
      }

      if (particles) {
        particles.rotation.y = t * 0.02;
      }

      dreamState.current.spinX += dreamState.current.velX;
      dreamState.current.spinY += dreamState.current.velY;
      dreamState.current.velX *= 0.94;
      dreamState.current.velY *= 0.94;

      meshes.forEach((mesh) => {
        mesh.rotation.x = t * 0.3 + mesh.userData.index + dreamState.current.spinX;
        mesh.rotation.y = t * 0.4 + dreamState.current.spinY;
        mesh.position.y = mesh.userData.basePosY + Math.sin(t + mesh.userData.index) * 0.3;
      });

      if (renderer && scene && camera) {
        renderer.render(scene, camera);
      }
    };

    dreamState.current.animFrameId = requestAnimationFrame(animate);
  };

  const openDream = (e: React.MouseEvent<HTMLButtonElement>) => {
    const dr = dreamRef.current;
    if (!dr) return;

    if (!dreamState.current.renderer) {
      initDreamScene();
    }

    dr.style.visibility = 'visible';
    dr.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    startDreamLoop();

    const clientX = e.clientX || window.innerWidth / 2;
    const clientY = e.clientY || window.innerHeight / 2;

    gsap.fromTo(
      dr,
      { clipPath: `circle(0px at ${clientX}px ${clientY}px)` },
      { clipPath: `circle(150% at ${clientX}px ${clientY}px)`, duration: 1.4, ease: 'expo.inOut' }
    );
  };

  const closeDream = () => {
    const dr = dreamRef.current;
    if (!dr) return;

    const onDone = () => {
      dr.style.visibility = 'hidden';
      dr.setAttribute('aria-hidden', 'true');
      dreamState.current.isRunning = false;
      cancelAnimationFrame(dreamState.current.animFrameId);
      document.body.style.overflow = '';
      if (dCardRef.current) {
        dCardRef.current.classList.remove('on');
      }
    };

    gsap.to(dr, {
      clipPath: 'circle(0px at 50% 50%)',
      duration: 0.9,
      ease: 'expo.inOut',
      onComplete: onDone,
    });
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && dreamState.current.isRunning) {
        closeDream();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { camera, meshes } = dreamState.current;
    if (!camera || !meshes.length) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

    const intersects = raycaster.intersectObjects(meshes, true);
    if (intersects.length > 0) {
      let hitMesh = intersects[0].object as THREE.Mesh;
      if (hitMesh.userData.index === undefined && hitMesh.parent) {
        hitMesh = hitMesh.parent as THREE.Mesh;
      }
      const projectIndex = hitMesh.userData?.index;
      if (projectIndex === undefined) return;

      const targetProject = PROJECTS[projectIndex];

      setRecoveredSet((prev) => {
        const next = new Set(prev);
        next.add(projectIndex);
        return next;
      });

      const mat = hitMesh.material as THREE.MeshPhysicalMaterial;
      if (mat && mat.color) {
        mat.color.set(0xF59E0B);
        if (mat.emissive) mat.emissive.set(0xB45309);
        mat.opacity = 0.85;
      }

      if (hitMesh.children && hitMesh.children[0]) {
        const wire = (hitMesh.children[0] as THREE.Mesh).material as THREE.MeshBasicMaterial;
        if (wire && wire.color) {
          wire.color.set(0xFFDF00);
          wire.opacity = 0.95;
        }
      }

      setActiveProjectCard(targetProject);
      if (dCardRef.current) {
        dCardRef.current.classList.remove('on');
        void dCardRef.current.offsetWidth;
        dCardRef.current.classList.add('on');
      }
    }
  };

  const handleDreamPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    dreamState.current.mouseX = e.clientX / window.innerWidth - 0.5;
    dreamState.current.mouseY = e.clientY / window.innerHeight - 0.5;

    if (dreamState.current.isDragging) {
      dreamState.current.velY += (e.clientX - dreamState.current.lastX) * 0.0006;
      dreamState.current.velX += (e.clientY - dreamState.current.lastY) * 0.0006;
      dreamState.current.lastX = e.clientX;
      dreamState.current.lastY = e.clientY;
    }
  };

  const handleDreamPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    dreamState.current.isDragging = true;
    dreamState.current.lastX = e.clientX;
    dreamState.current.lastY = e.clientY;
  };

  const handleDreamPointerUp = () => {
    dreamState.current.isDragging = false;
  };

  const displayedSkills = getFlattenedSkills(selectedCategory);

  const marqueeSkills = Object.values(TECH_STACK).flat();
  const halfLength = Math.ceil(marqueeSkills.length / 2);
  const marqueeFirstHalf = marqueeSkills.slice(0, halfLength);
  const marqueeSecondHalf = marqueeSkills.slice(halfLength);

  // Replicate array 4 times for seamless continuous looping in reverse directions
  const loopRow1 = [...marqueeFirstHalf, ...marqueeFirstHalf, ...marqueeFirstHalf, ...marqueeFirstHalf];
  const loopRow2 = [...marqueeSecondHalf, ...marqueeSecondHalf, ...marqueeSecondHalf, ...marqueeSecondHalf];

  return (
    <div ref={containerRef}>
      {/* Preloader */}
      <div id="pre" ref={preRef}>
        <b ref={preCountRef}>000</b>
        <span>Loading portfolio</span>
      </div>

      {/* Custom magnetic cursor */}
      <div id="cur" ref={curRef} />

      {/* Centered Floating Pill Nav with Theme Switcher */}
      <nav id="nav" ref={navRef}>
        <a className="logo" href="#top" onClick={(e) => handleNavClick(e, '#top')}>
          Samyak Bhatkar<i>.</i>
        </a>
        <ul>
          <li>
            <a className="roll" href="#top" onClick={(e) => handleNavClick(e, '#top')}>
              <i>Home</i>
              <i>Home</i>
            </a>
          </li>
          <li>
            <a className="roll" href="#about" onClick={(e) => handleNavClick(e, '#about')}>
              <i>About</i>
              <i>About</i>
            </a>
          </li>
          <li>
            <a className="roll" href="#work" onClick={(e) => handleNavClick(e, '#work')}>
              <i>Work</i>
              <i>Work</i>
            </a>
          </li>
          <li>
            <a className="roll" href="#stack" onClick={(e) => handleNavClick(e, '#stack')}>
              <i>Stack</i>
              <i>Stack</i>
            </a>
          </li>
          <li>
            <a className="roll" href="#journey" onClick={(e) => handleNavClick(e, '#journey')}>
              <i>Journey</i>
              <i>Journey</i>
            </a>
          </li>
          <li>
            <a className="roll" href="#contact" onClick={(e) => handleNavClick(e, '#contact')}>
              <i>Contact</i>
              <i>Contact</i>
            </a>
          </li>
        </ul>
        <div className="nav-actions">
          {/* Theme switcher toggle */}
          <button
            type="button"
            className="theme-btn mag"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'Deep Midnight' : 'Modern Light'} mode`}
            title={`Switch to ${theme === 'light' ? 'Deep Midnight' : 'Modern Light'} mode`}
            data-cur
          >
            {theme === 'light' ? (
              <Moon size={18} className="text-amber-600" />
            ) : (
              <Sun size={18} className="text-amber-400" />
            )}
          </button>
          <a
            className="btn mag"
            href="#contact"
            data-cur
            onClick={(e) => handleNavClick(e, '#contact')}
          >
            Let&apos;s talk ↗
          </a>
        </div>
      </nav>

      {/* Hero Header */}
      <header className="hero" id="top">
        <div className="bg" />
        <svg
          className="rings"
          id="rings"
          viewBox="0 0 800 800"
          aria-hidden="true"
        >
          <circle cx="400" cy="400" r="70" />
          <circle cx="400" cy="400" r="170" />
          <circle cx="400" cy="400" r="270" />
          <circle cx="400" cy="400" r="380" />
          <line className="ax" x1="0" y1="400" x2="800" y2="400" />
          <line className="ax" x1="400" y1="0" x2="400" y2="800" />
          <circle className="dot" cx="400" cy="20" r="5" />
          <circle className="dot" cx="130" cy="400" r="4" style={{ fill: '#8B5CF6' }} />
        </svg>

        <div className="wrap">
          <span className="eyebrow hr">AI · GenAI · ML · Frontend · Video</span>
          <h1 data-split id="h1">
            <span className="w" style={{ marginRight: '0.26em' }}>
              <span>Intelligence,</span>
            </span>
            <span className="w" style={{ marginRight: '0.26em' }}>
              <span>shaped</span>
            </span>
            <span className="w" style={{ marginRight: '0.26em' }}>
              <span>into</span>
            </span>
            <span className="w hero-rotating-word-slot" style={{ marginRight: '0.26em' }}>
              <span className="hero-rotating-word-inner">
                <em key={rotatingWordIndex} className="hero-rotating-word-animated">
                  {ROTATING_HERO_WORDS[rotatingWordIndex]}
                </em>
              </span>
            </span>
          </h1>
          <p className="lead hr">
            AI &amp; Data Science engineer building intelligent systems and cinematic web experiences.
          </p>
          <p className="sub hr">
            B.Tech student in Artificial Intelligence &amp; Data Science, focused on machine learning,
            frontend engineering and video player engineering.
          </p>
          <div className="cta hr">
            <a
              className="btn gold mag"
              href="#work"
              data-cur
              onClick={(e) => handleNavClick(e, '#work')}
            >
              Explore projects ↓
            </a>
            <a
              className="btn mag"
              href="#contact"
              data-cur
              onClick={(e) => handleNavClick(e, '#contact')}
            >
              Let&apos;s connect ↗
            </a>
          </div>
          <div className="facts hr">
            <div>
              <small>Based in</small>
              <span>Amravati, India</span>
            </div>
            <div>
              <small>B.Tech</small>
              <span>AI &amp; Data Science</span>
            </div>
            <div>
              <small>Focus</small>
              <span>Frontend · Video · ML</span>
            </div>
            <div>
              <small>Building</small>
              <span>Chitrapat</span>
            </div>
          </div>
        </div>

        <div className="scroll">SCROLL</div>
      </header>

      {/* About Section */}
      <section id="about">
        <div className="wrap">
          <span className="eyebrow">About</span>
          <div className="two about-grid">
            <div className="about-bio-col">
              <p className="big" id="bigp">
                {'I turn raw intelligence into interfaces people actually feel.'.split(' ').map((w, idx) => (
                  <span key={idx}>{w}</span>
                ))}
              </p>
              <p className="about-subtext">
                Samyak Bhatkar is a B.Tech student specializing in Artificial Intelligence &amp; Data
                Science, with a strong focus on frontend and video player engineering.
              </p>
            </div>
            <div className="cert-col">
              <div
                className="cert-standalone-card"
                role="button"
                tabIndex={0}
                onClick={() => setIsCertificateOpen(true)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setIsCertificateOpen(true);
                  }
                }}
                aria-label="View Code With Harry Data Science Certificate"
                data-cur="zoom"
              >
                <img
                  src="/certificates/cwh_data_science.svg"
                  alt="Code With Harry — The Ultimate Job Ready Data Science Course Certificate for Samyak Anil Bhatkar"
                  className="cert-standalone-img"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
          <div className="stats about-stats">
            <div>
              <b>{PROJECTS.length}</b>
              <small>Featured projects</small>
            </div>
            <div>
              <b>2</b>
              <small>Live applications</small>
            </div>
            <div>
              <b>8.80</b>
              <small>CGPA</small>
            </div>
            <div>
              <b>2026</b>
              <small>Smart India Hackathon</small>
            </div>
          </div>
        </div>
      </section>

      {/* Selected Work Section */}
      <section id="work" className="work-section">
        <div className="wrap">
          <div className="head">
            <span className="eyebrow">Selected work</span>
            <h2 data-split>
              {splitTextIntoWords('Seven projects, *built* end to end.')}
            </h2>
            <p className="work-lead">
              A streaming platform, an artisan AI, a bandwidth aggregator, a privacy tool, a video RAG assistant, city-wide tracking, and traffic enforcement.
            </p>
          </div>

          <div id="works" className="works-deck">
            {PROJECTS.map((p, idx) => (
              <article
                key={p.n}
                className={`card ${idx % 2 ? 'alt' : ''}`}
                data-cur
                style={{
                  '--card-index': idx,
                  '--card-total': PROJECTS.length,
                  '--card-accent': p.accentColor,
                  '--card-dot': p.dotColor,
                } as React.CSSProperties}
              >
                <div
                  className="art"
                  style={{
                    background: p.bgGradient,
                  }}
                >
                  <img
                    src={p.image}
                    alt={`${p.t} — ${p.s}`}
                    className="art-img"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.opacity = '0';
                    }}
                  />
                  <div className="art-fallback-graphic" aria-hidden="true">
                    <div
                      className="art-fallback-orb"
                      style={{
                        background: `radial-gradient(circle, ${p.accentColor} 0%, transparent 70%)`,
                      }}
                    />
                    <div className="art-fallback-badge">
                      <span className="art-fallback-code">{p.n} // {p.t}</span>
                    </div>
                  </div>
                  <div className="art-scrim" />
                  <b className="num">{p.n}</b>
                  <div
                    className="dots"
                    style={
                      {
                        '--dot-color': p.dotColor,
                      } as React.CSSProperties
                    }
                  />
                </div>
                <div className="info">
                  <div className="tag" style={{ color: p.textColor }}>
                    {p.tag}
                    {p.st && <em className="badge">{p.st}</em>}
                  </div>
                  <h3>{p.t}</h3>
                  <p className="sub">{p.s}</p>
                  <p>{p.d}</p>
                  <ul>
                    {p.f.map((feature, fIdx) => (
                      <li key={fIdx}>{feature}</li>
                    ))}
                  </ul>
                  <div className="pills">
                    {p.k.map((keyword, kIdx) => (
                      <span key={kIdx}>{keyword}</span>
                    ))}
                  </div>
                  <div className="btns">
                    <a className="btn" href="#contact" data-cur>
                      GitHub ↗
                    </a>
                    <a className="btn gold" href="#contact" data-cur>
                      Live demo ↗
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="more">
            <h3 data-split>
              {splitTextIntoWords('More experiments')}
            </h3>
            <div className="rows" id="rows">
              {EXPERIMENTS.map((r) => (
                <div key={r.n} className="row">
                  <span className="mut">{r.n}</span>
                  <div>
                    <h4>{r.t}</h4>
                    <span className="tag" style={{ color: r.accentColor }}>{r.tag}</span>
                  </div>
                  <div>
                    <p>{r.d}</p>
                    <div className="pills">
                      {r.k.map((item, iIdx) => (
                        <span key={iIdx}>{item}</span>
                      ))}
                    </div>
                  </div>
                  <span>↗</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Section with Moving Reverse Tool Marquee */}
      <section id="stack">
        <div className="wrap">
          <span className="eyebrow">Technology</span>
          <h2 data-split>
            {splitTextIntoWords('The tools behind the work.')}
          </h2>

          <div className="marq">
            {/* Top row moves continuously to the right */}
            <div className="marq-row move-right">
              {loopRow1.map((name, i) => (
                <span key={i}>{name}</span>
              ))}
            </div>
            {/* Bottom row moves in reverse continuously to the left */}
            <div className="marq-row move-left">
              {loopRow2.map((name, i) => (
                <span key={i}>{name}</span>
              ))}
            </div>
          </div>

          <div className="chips" id="chips">
            {['All', ...Object.keys(TECH_STACK)].map((cat) => (
              <button
                key={cat}
                type="button"
                className={selectedCategory === cat ? 'on' : ''}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid" id="grid">
            {displayedSkills.map((item, idx) => (
              <div key={idx}>
                <small>{item.category}</small>
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hackathon Section with Step Dots Placed Exactly On The Line & Interactive Pipeline */}
      <section id="hackathon" ref={hackathonRef}>
        <div className="wrap">
          <span className="eyebrow">Hackathon</span>
          <h2 data-split>
            {splitTextIntoWords('From idea to *deployed* intelligence.')}
          </h2>
          <div className="hk rv">
            <div>
              <div className="hk-heading-group">
                <h3>Smart India Hackathon 2026 — ShilpSetu</h3>
                <div className="sih-finalist-showcase-pill">
                  <Award size={15} className="sih-ribbon-icon" />
                  <span>SIH Finalist</span>
                  <span className="sih-status-dot" />
                </div>
              </div>
            </div>
          </div>

          <div
            className="steps-container rv"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              e.currentTarget.style.setProperty('--spotlight-x', `${e.clientX - rect.left}px`);
              e.currentTarget.style.setProperty('--spotlight-y', `${e.clientY - rect.top}px`);
            }}
          >
            <div className="steps-line">
              <div
                className="steps-line-fill"
                style={{
                  '--fill-percent': `${hackathonFillPercent}%`,
                } as React.CSSProperties}
              />
            </div>
            <div className="steps">
              {HACKATHON_STEPS.map((s, idx) => {
                const isActive = idx === effectiveHackathonStep;
                const isCompleted = idx <= effectiveHackathonStep;

                return (
                  <div
                    key={idx}
                    className={`step-item ${isActive ? 'is-active' : ''} ${isCompleted ? 'is-completed' : ''}`}
                    onMouseEnter={() => setHackathonHoveredStep(idx)}
                    onMouseLeave={() => setHackathonHoveredStep(null)}
                    onClick={() => setHackathonActiveStep(idx)}
                    style={{ cursor: 'pointer' }}
                  >
                    <div className="step-dot-wrapper">
                      <div className={`step-dot ${isActive ? 'is-active' : ''}`} />
                    </div>
                    <div className="step-content-col">
                      <div className="step-tag-row">
                        <small>{s.step}</small>
                        <span className="step-status-chip">
                          {isActive ? 'Active' : isCompleted ? 'Done' : 'Next'}
                        </span>
                      </div>
                      <h4>{s.title}</h4>
                      <p>{s.desc}</p>

                      {/* Mobile Inline Accordion Artifact with Smooth Height Transition */}
                      <div className="mobile-step-artifact">
                        <div className="mobile-artifact-inner">
                          <div className="mobile-artifact-body">
                            <span className="artifact-pill-sm">{s.badge}</span>
                            <h5>{s.artifactTitle}</h5>
                            <p className="artifact-sub-sm">{s.artifactSubtitle}</p>
                            <div className="mobile-metric-row">
                              <span className="mobile-metric-val">{s.metric}</span>
                              <span className="mobile-metric-lbl">{s.metricLabel}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Live Artifact Peek Drawer (The Trust Builder) */}
            <div className="desktop-artifact-drawer">
              <div className="artifact-card-top">
                <div className="artifact-step-indicator">
                  <span className="indicator-dot" />
                  <span>{currentHackathonStepData.step} · {currentHackathonStepData.title}</span>
                </div>
                <div className="artifact-live-chip">
                  <Sparkles size={12} style={{ color: 'var(--gold)' }} />
                  <span>Live Case Proof</span>
                </div>
              </div>

              <div className="artifact-card-content">
                <div className="artifact-meta-col">
                  <span className="artifact-badge-tag">{currentHackathonStepData.badge}</span>
                  <h4 className="artifact-headline">{currentHackathonStepData.artifactTitle}</h4>
                  <p className="artifact-caption">{currentHackathonStepData.artifactSubtitle}</p>

                  <div className="artifact-chips-row">
                    {currentHackathonStepData.tags.map((t, ti) => (
                      <span key={ti} className="artifact-tag-pill">{t}</span>
                    ))}
                  </div>

                  {effectiveHackathonStep === 4 && (
                    <a
                      href="#work"
                      className="artifact-cta-link"
                      onClick={(e) => {
                        handleNavClick(e, '#work');
                      }}
                    >
                      Inspect ShilpSetu in Work <ArrowRight size={13} />
                    </a>
                  )}
                </div>

                <div className="artifact-visual-col">
                  {/* Visual 1: Waveform */}
                  {currentHackathonStepData.artifactType === 'waveform' && (
                    <div className="visual-panel waveform-panel">
                      <div className="visual-panel-hdr">
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <Volume2 size={13} style={{ color: 'var(--gold)' }} />
                          <span>Speech Acoustic Analysis</span>
                        </div>
                        <span className="sample-rate-pill">PCM 16kHz</span>
                      </div>
                      <div className="waveform-spectrum">
                        {[22, 48, 72, 36, 88, 96, 54, 78, 42, 92, 64, 48, 95, 70, 38, 52, 82, 44].map((h, bi) => (
                          <div
                            key={bi}
                            className="spectrum-bar"
                            style={{ height: `${h}%`, animationDelay: `${bi * 0.07}s` }}
                          />
                        ))}
                      </div>
                      <div className="voice-prompt-box">
                        &quot;हमार 50 हाथ से बुनी टोकरी हई, बाजार भाव का मिली?&quot;
                      </div>
                    </div>
                  )}

                  {/* Visual 2: Field Ethnography */}
                  {currentHackathonStepData.artifactType === 'field' && (
                    <div className="visual-panel field-panel">
                      <div className="field-stats-cluster">
                        <div className="field-stat-item">
                          <span className="stat-number">{currentHackathonStepData.metric}</span>
                          <span className="stat-label">{currentHackathonStepData.metricLabel}</span>
                        </div>
                        <div className="field-stat-item">
                          <span className="stat-number">{currentHackathonStepData.secondaryMetric}</span>
                          <span className="stat-label">{currentHackathonStepData.secondaryLabel}</span>
                        </div>
                      </div>
                      <div className="field-note-pill">
                        <CheckCircle2 size={13} style={{ color: 'var(--gold)' }} />
                        <span>Field-tested across MP, Rajasthan, UP &amp; Odisha craft clusters</span>
                      </div>
                    </div>
                  )}

                  {/* Visual 3: AI Vision Wipe */}
                  {currentHackathonStepData.artifactType === 'vision' && (
                    <div className="visual-panel vision-panel">
                      <div className="visual-panel-hdr">
                        <span>FastViT Cutout Engine</span>
                        <button
                          type="button"
                          className="wipe-switch-btn"
                          onClick={() => setHackathonBgWipe(prev => prev === 'processed' ? 'raw' : 'processed')}
                        >
                          {hackathonBgWipe === 'processed' ? 'Processed (180ms)' : 'Raw Workshop Input'}
                        </button>
                      </div>
                      <div className="vision-stage">
                        <div className={`pottery-display ${hackathonBgWipe === 'processed' ? 'is-clean' : 'is-raw'}`}>
                          <svg viewBox="0 0 100 100" width="56" height="56" style={{ filter: 'drop-shadow(0 4px 10px rgba(0,0,0,0.18))' }}>
                            <path
                              d="M35 15 L65 15 Q68 25 60 35 Q80 55 68 85 L32 85 Q20 55 40 35 Q32 25 35 15 Z"
                              fill="#E11D48"
                              opacity="0.94"
                            />
                            <ellipse cx="50" cy="15" rx="15" ry="3" fill="#BE123C" />
                            <path d="M38 45 Q50 50 62 45" stroke="#FFE4E6" strokeWidth="2" fill="none" />
                            <path d="M34 60 Q50 66 66 60" stroke="#FFE4E6" strokeWidth="2" fill="none" />
                          </svg>
                          {hackathonBgWipe === 'raw' && (
                            <div className="raw-tag-overlay">[Cluttered Artisan Room]</div>
                          )}
                        </div>
                        <div className="latency-indicator">
                          <Activity size={12} style={{ color: 'var(--gold)' }} />
                          <span>Neural background segmentation: 180ms</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Visual 4: Benchmarks */}
                  {currentHackathonStepData.artifactType === 'benchmark' && (
                    <div className="visual-panel benchmark-panel">
                      <div className="bm-grid">
                        <div className="bm-card">
                          <span className="bm-metric">{currentHackathonStepData.metric}</span>
                          <span className="bm-text">{currentHackathonStepData.metricLabel}</span>
                        </div>
                        <div className="bm-card">
                          <span className="bm-metric">{currentHackathonStepData.secondaryMetric}</span>
                          <span className="bm-text">{currentHackathonStepData.secondaryLabel}</span>
                        </div>
                      </div>
                      <div className="bm-progress-track">
                        <div className="bm-progress-bar" style={{ width: '99.2%' }} />
                      </div>
                      <div className="bm-summary">
                        <TrendingUp size={12} style={{ color: 'var(--gold)' }} />
                        <span>On-device speech parser with zero cloud latency</span>
                      </div>
                    </div>
                  )}

                  {/* Visual 5: SIH Award */}
                  {currentHackathonStepData.artifactType === 'award' && (
                    <div className="visual-panel award-panel">
                      <div className="award-badge-icon">
                        <Award size={32} style={{ color: 'var(--gold)' }} />
                      </div>
                      <div className="award-texts">
                        <span className="award-title">Smart India Hackathon 2026 Winner</span>
                        <p className="award-description">
                          1st Place in Problem Statement PS 26090. Team INVINCIBLE.
                        </p>
                      </div>
                      <div className="live-status-pill">
                        <span className="status-green-dot" />
                        <span>Production Build Deployed</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Journey Section */}
      <section id="journey">
        <div className="wrap">
          <span className="eyebrow">Journey</span>
          <h2 data-split>
            {splitTextIntoWords('The path so far.')}
          </h2>
          <div style={{ height: '6vh' }} />
          <div className="rows">
            <div className="jr">
              <b>2022</b>
              <span>10th</span>
              <span>89.80%</span>
            </div>
            <div className="jr">
              <b>2024</b>
              <span>MHT-CET</span>
              <span>90.99 percentile</span>
            </div>
            <div className="jr">
              <b>2024 – Present</b>
              <span>B.Tech, Artificial Intelligence &amp; Data Science</span>
              <span>CGPA 8.80 · Prof. Ram Meghe Institute of Technology and Research, Amravati</span>
            </div>
            <div className="jr">
              <b>Continuous</b>
              <span>Foundations</span>
              <span>Code With Harry</span>
            </div>
          </div>
        </div>
      </section>

      {/* Engineering Lineage & Curriculum Section */}
      <section id="lineage" className="lineage-section">
        <div className="wrap">
          <div className="lineage-header">
            <div>
              <span className="eyebrow">Engineering Lineage</span>
              <h2 data-split style={{ marginBottom: '1.2rem' }}>
                {splitTextIntoWords('From first principles to production.')}
              </h2>
              <p className="lineage-lead">
                A deliberate self-directed curriculum — grounding theoretical math and practical ML before mastering deployment beyond Colab.
              </p>
            </div>
          </div>

          {/* DESKTOP & TABLET VIEW: True Horizontal Sliding Stepper Track */}
          <div
            className="lineage-desktop-stepper"
            ref={desktopStepperRef}
            tabIndex={0}
            aria-label="Engineering Lineage Stepper - Scroll vertically or horizontally to explore milestones"
          >
            {/* Connected Stepper Navigation Bar */}
            <div className="stepper-nav-bar">
              <div className="stepper-track-line" />
              <div
                className="stepper-progress-line"
                style={{
                  width: `${(activeTimelineStep / (CURRICULUM_STAGES.length - 1)) * 100}%`,
                }}
              />
              <div className="stepper-nav-nodes">
                {CURRICULUM_STAGES.map((item, idx) => {
                  const isActive = idx === activeTimelineStep;
                  const isPassed = idx < activeTimelineStep;
                  return (
                    <button
                      key={item.stage}
                      type="button"
                      className={`stepper-node ${isActive ? 'active' : ''} ${isPassed ? 'passed' : ''}`}
                      onClick={() => handleStepChange(idx)}
                    >
                      <span className="node-num">{item.stage}</span>
                      <span className="node-title">{item.title}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* True Horizontal Sliding Carousel Track */}
            <div className="stepper-carousel-viewport">
              <div
                className="stepper-carousel-track"
                style={{
                  transform: `translateX(-${activeTimelineStep * 25}%)`,
                }}
              >
                {CURRICULUM_STAGES.map((item, idx) => {
                  const isCurrent = idx === activeTimelineStep;
                  return (
                    <div
                      key={item.stage}
                      className={`stepper-carousel-slide ${isCurrent ? 'is-active-slide' : ''}`}
                    >
                      <div className="stepper-spotlight-card">
                        <div className={`sheryians-riser ${isCurrent ? 'active-riser' : ''}`} />

                        <div className="spotlight-top">
                          <div className="spotlight-badge-row">
                            <span className="spotlight-step-indicator">
                              Milestone {item.stage} of 04
                            </span>
                            <span className="spotlight-category">
                              {item.sourceCategory}
                            </span>
                          </div>
                          <b className="spotlight-num">{item.stage}</b>
                        </div>

                        <div className="spotlight-content">
                          <h3 className="spotlight-title">{item.title}</h3>
                          <div className="spotlight-source-bar">
                            <span className="source-label">Direct Curriculum &amp; Mentorship:</span>
                            <span className="source-value-pill">{item.source}</span>
                          </div>
                          <p className="spotlight-copy">{item.copy}</p>

                          <div className="spotlight-footer">
                            <div className="spotlight-chips">
                              <span className="chips-label">Key competencies:</span>
                              {item.stackTags.map((tag) => (
                                <span key={tag} className="lineage-chip">
                                  {tag}
                                </span>
                              ))}
                            </div>

                            <div className="stepper-controls">
                              <button
                                type="button"
                                disabled={idx === 0}
                                className="stepper-btn prev"
                                onClick={() => handleStepChange(Math.max(0, idx - 1))}
                              >
                                Previous Milestone
                              </button>
                              <button
                                type="button"
                                disabled={idx === CURRICULUM_STAGES.length - 1}
                                className="stepper-btn next"
                                onClick={() => handleStepChange(Math.min(CURRICULUM_STAGES.length - 1, idx + 1))}
                              >
                                Next Milestone <ArrowRight size={14} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Desktop Vertical Scroll Stepper Hint */}
            <div className="stepper-scroll-hint">
              <span className="hint-indicator">Scroll down to explore milestones (01 → 04) · Click or arrow keys to navigate</span>
            </div>
          </div>

          {/* MOBILE VIEW: Proof of Credibility Design (Option C) */}
          <div className="lineage-mobile-proof">
            {CURRICULUM_STAGES.map((item) => {
              const isExpanded = expandedProofStage === item.stage;
              return (
                <div
                  key={item.stage}
                  className={`lineage-card lineage-card-c ${isExpanded ? 'expanded' : ''}`}
                >
                  <div className="sheryians-riser" />

                  <div className="lineage-card-top">
                    <b className="lineage-num">{item.stage}</b>
                    <div className="proof-metric-pill">
                      <CheckCircle2 size={13} style={{ color: 'var(--gold)' }} />
                      <span>{item.proofMetric}</span>
                    </div>
                  </div>

                  <div className="lineage-card-mid">
                    <h3 className="lineage-title">{item.title}</h3>
                    <div className="lineage-source">
                      <span className="source-label">Source</span>
                      <span className="source-dot">·</span>
                      <span className="source-name">{item.source}</span>
                    </div>
                  </div>

                  <div className="lineage-card-bottom">
                    <p className="lineage-copy">{item.copy}</p>

                    <div className="proof-expand-box">
                      <button
                        type="button"
                        className="proof-toggle-btn"
                        onClick={() => setExpandedProofStage(isExpanded ? null : item.stage)}
                      >
                        <span>{isExpanded ? 'Collapse Rigor Breakdown' : 'View Rigor Breakdown'}</span>
                        <span className="proof-toggle-symbol">{isExpanded ? '−' : '+'}</span>
                      </button>
                      {isExpanded && (
                        <div className="proof-detail-pane">
                          <p className="proof-detail-text">{item.proofDetail}</p>
                          <div className="proof-chips">
                            {item.stackTags.map((tag) => (
                              <span key={tag} className="lineage-chip proof-chip">
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{ height: '12vh' }} />

          <span className="eyebrow">Approach</span>
          <h2 data-split style={{ marginBottom: '6vh' }}>
            {splitTextIntoWords('How I work.')}
          </h2>
          <div className="appr rv">
            <div>
              <b>01</b>
              <h4>Understand</h4>
              <p>Start with the problem.</p>
            </div>
            <div>
              <b>02</b>
              <h4>Analyze</h4>
              <p>Study the data and the users.</p>
            </div>
            <div>
              <b>03</b>
              <h4>Engineer</h4>
              <p>Build something maintainable.</p>
            </div>
            <div>
              <b>04</b>
              <h4>Validate</h4>
              <p>Test models, APIs and flows.</p>
            </div>
            <div>
              <b>05</b>
              <h4>Ship</h4>
              <p>Turn prototypes into usable products.</p>
            </div>
          </div>

          <div className="str rv">
            <span>Problem solving</span>
            <span>Communication</span>
            <span>Teamwork</span>
            <span>Quick learning</span>
            <span>Time management</span>
          </div>
        </div>
      </section>

      {/* Dream Mode Teaser */}
      <section id="dream-teaser">
        <div className="wrap" style={{ textAlign: 'center' }}>
          <span className="eyebrow">Dream mode</span>
          <h2 data-split>
            {splitTextIntoWords('Prefer to wander? *Float* through the work.')}
          </h2>
          <p className="mut rv" style={{ margin: '2rem auto', maxWidth: '44ch' }}>
            Seven projects are lost in the dark. Drift around in 3D and click each form to recover it.
          </p>
          <button
            type="button"
            className="btn gold mag rv"
            id="enterDream"
            data-cur
            style={{
              cursor: 'pointer',
              font: 'inherit',
              fontSize: '1rem',
              padding: '1rem 2rem',
            }}
            onClick={openDream}
          >
            Enter the dream ↗
          </button>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact">
        <div className="wrap">
          <span className="eyebrow">Contact</span>
          <h2 className="say" id="say">
            {splitSayCharacters("Let's build something intelligent.")}
          </h2>
          <p className="mut rv" style={{ marginTop: '2rem', maxWidth: '46ch' }}>
            Have an AI idea, project, internship or collaboration in mind? Say hello.
          </p>
          <div className="cta rv">
            <a className="btn mag" href="https://github.com" target="_blank" rel="noreferrer" data-cur>
              GitHub ↗
            </a>
            <a className="btn mag" href="https://linkedin.com" target="_blank" rel="noreferrer" data-cur>
              LinkedIn ↗
            </a>
            <a className="btn gold mag" href="mailto:samyakbhatkar9@gmail.com" data-cur>
              Email ↗
            </a>
          </div>

          <form
            className="cform rv"
            onSubmit={(e) => {
              e.preventDefault();
              setFormSubmitted(true);
            }}
          >
            <label>
              Name
              <input placeholder="Your name" required />
            </label>
            <label>
              Email
              <input type="email" placeholder="you@example.com" required />
            </label>
            <label className="full">
              Message
              <textarea rows={3} placeholder="Tell me about your idea" required />
            </label>
            <button
              type="submit"
              className="btn gold full"
              style={{ justifySelf: 'start', cursor: 'pointer' }}
            >
              {formSubmitted ? 'Message ready to send ✓' : 'Send message'}
            </button>
          </form>
        </div>
      </section>

      {/* Footer Meta Bar (Above the signature wordmark) */}
      <footer>
        <span>Samyak Bhatkar.</span>
        <span>© 2026 Samyak Bhatkar</span>
        <a className="roll" href="#top" onClick={(e) => handleNavClick(e, '#top')}>
          <i>Back to top ↑</i>
          <i>Back to top ↑</i>
        </a>
      </footer>

      {/* Giant Interactive Torchlight Signature Wordmark: "Samyak" (At very bottom of page) */}
      <div
        className="footer-signature-stage"
        ref={signatureRef}
        onMouseMove={handleSignatureMouseMove}
        onMouseEnter={handleSignatureMouseEnter}
        onMouseLeave={handleSignatureMouseLeave}
        onClick={(e) => handleNavClick(e, '#top')}
        title="Samyak — Click to scroll to top"
      >
        <div
          ref={wordmarkRef}
          className="signature-wordmark font-serif"
          style={{
            '--spotlight-x': '50%',
            '--spotlight-y': '50%',
            '--wobble-x': '0px',
            '--spotlight-opacity': 0,
          } as React.CSSProperties}
        >
          {/* Base Layer: Hollow outline wireframe (Static, 100% rock-solid anchored) */}
          <span className="signature-layer outline" aria-hidden="true">
            Samyak
          </span>

          {/* Top Layer: Illuminated spotlight fill (Shakes & settles on X axis with liquid spring momentum) */}
          <span className="signature-layer fill" aria-label="Samyak">
            Samyak
          </span>

          {/* Torchlight ambient radial glow tracking the cursor */}
          <div className="signature-torch-glow" />
        </div>
      </div>

      {/* Dream Mode Fullscreen Overlay */}
      <div
        id="dream"
        ref={dreamRef}
        aria-hidden="true"
        onPointerMove={handleDreamPointerMove}
        onPointerDown={handleDreamPointerDown}
        onPointerUp={handleDreamPointerUp}
      >
        <canvas id="dc" ref={canvasRef} onClick={handleCanvasClick} />
        <div className="dh">
          <span id="dcount">
            {formatRecoveredProgress(recoveredSet.size, PROJECTS.length)}
          </span>
          <button
            type="button"
            className="btn"
            id="dexit"
            style={{
              cursor: 'pointer',
              font: 'inherit',
              fontSize: '.85rem',
              background: 'var(--dream-hud-bg)',
              color: 'var(--ink)',
            }}
            onClick={closeDream}
          >
            Exit dream ✕
          </button>
        </div>
        <div className="dhint">Drag to spin · tap a form to recover it</div>
        <div id="dcard" ref={dCardRef}>
          {activeProjectCard && (
            <>
              <small style={{ color: activeProjectCard.textColor }}>{activeProjectCard.tag}</small>
              <h3>{activeProjectCard.t}</h3>
              <p>{activeProjectCard.s}</p>
              <a
                className="btn gold"
                href="#work"
                id="dgo"
                onClick={(e) => {
                  closeDream();
                  handleNavClick(e, '#work');
                }}
              >
                See in Work ↓
              </a>
            </>
          )}
        </div>
      </div>

      {/* Certificate Lightbox Modal */}
      {isCertificateOpen && (
        <div
          className="cert-modal-backdrop"
          onClick={() => setIsCertificateOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Code With Harry Course Certificate"
        >
          <div className="cert-modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="cert-modal-bar">
              <div className="cert-modal-title-box">
                <span className="cert-modal-status-dot" />
                <span className="cert-modal-heading">Code With Harry · Course Certificate</span>
              </div>
              <button
                type="button"
                className="cert-modal-close"
                onClick={() => setIsCertificateOpen(false)}
                aria-label="Close certificate preview"
              >
                ✕
              </button>
            </div>
            <div className="cert-modal-img-wrap">
              <img
                src="/certificates/cwh_data_science.svg"
                alt="Code With Harry — The Ultimate Job Ready Data Science Course Certificate for Samyak Anil Bhatkar"
                className="cert-modal-img"
              />
            </div>
            <div className="cert-modal-footer">
              <p className="cert-modal-caption">
                <strong>Recipient:</strong> Samyak Anil Bhatkar · <strong>Course:</strong> The Ultimate Job Ready Data Science Course
              </p>
              <span className="cert-modal-id">
                ID: CWH-THE-ULTIMATE-JOB-READY-DATA-SCIENCE-COURSE-7A9HPNG7
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

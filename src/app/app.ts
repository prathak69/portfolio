import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
  computed,
  inject,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRipple } from '@angular/material/core';
import { annotate } from 'rough-notation';
import gsap from 'gsap';
import confetti from 'canvas-confetti';

import { Typewriter } from './services/typewriter';
import { ToastService } from './services/toast.service';
import { SmoothScrollService } from './services/smooth-scroll.service';
import { AccentThemeService } from './services/accent-theme.service';
import { AvatarGazeService } from './services/avatar-gaze.service';
import { DEFAULT_PROJECTS } from './models/project-card.model';

import { CustomCursorComponent } from './components/custom-cursor/custom-cursor.component';
import { CurtainLoaderComponent } from './components/curtain-loader/curtain-loader.component';
import { AboutBentoComponent } from './components/about-bento/about-bento.component';
import { DesignApproachComponent } from './components/design-approach/design-approach.component';
import { SkillsPlaygroundComponent } from './components/skills-playground/skills-playground.component';
import { ExperienceTimelineComponent } from './components/experience-timeline/experience-timeline.component';
import { ProjectStackComponent } from './components/sticky-stacking-cards/project-stack.component';
import { CertificationsCardsComponent } from './components/certifications-cards/certifications-cards.component';
import { ContactSectionComponent } from './components/contact-section/contact-section.component';
import { AriaAssistantComponent } from './components/aria-assistant/aria-assistant.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    MatRipple,
    CustomCursorComponent,
    CurtainLoaderComponent,
    AboutBentoComponent,
    DesignApproachComponent,
    SkillsPlaygroundComponent,
    ExperienceTimelineComponent,
    ProjectStackComponent,
    CertificationsCardsComponent,
    ContactSectionComponent,
    AriaAssistantComponent
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, AfterViewInit, OnDestroy {
  readonly projects = DEFAULT_PROJECTS;

  @ViewChild('bgVideo', { static: true }) bgVideoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('wordMe') wordMeRef?: ElementRef<HTMLElement>;
  @ViewChild('wordBuild') wordBuildRef?: ElementRef<HTMLElement>;

  readonly typewriter = inject(Typewriter);
  readonly toast = inject(ToastService);
  readonly smoothScroll = inject(SmoothScrollService);
  readonly accentTheme = inject(AccentThemeService);
  readonly avatarGaze = inject(AvatarGazeService);
  private readonly zone = inject(NgZone);

  // Navigation items
  readonly navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Approach', href: '#approach' },
    { label: 'Skills', href: '#skills' },
    { label: 'Experience', href: '#experience' },
    { label: 'Projects', href: '#projects' },
    { label: 'Certifications', href: '#certifications' },
    { label: 'Contact', href: '#contact' }
  ];

  // Action pill buttons
  readonly heroPills = [
    { label: 'Explore Works', icon: '↗', target: '#projects' },
    { label: 'Test D3 Skills', icon: '⚡️', target: '#skills' },
    { label: 'View Career', icon: '📍', target: '#experience' },
    { label: 'Design Philosophy', icon: '✳︎', target: '#approach' }
  ];

  // UI state signals
  readonly isMobileMenuOpen = signal<boolean>(false);
  readonly showPills = signal<boolean>(false);
  readonly isScrolled = signal<boolean>(false);
  readonly isOverLightSection = signal<boolean>(false);
  readonly parallaxX = signal<number>(0);
  readonly parallaxY = signal<number>(0);

  // Dynamic theme for the fixed navbar based on scroll position / section
  readonly navbarTheme = computed(() => {
    const isLight = this.isOverLightSection();
    const isMenuOpen = this.isMobileMenuOpen();

    if (isLight) {
      return {
        isLight: true,
        bg: 'rgba(255, 248, 240, 0.94)',
        backdropBlur: 'blur(12px)',
        border: 'rgba(20, 17, 15, 0.12)',
        shadow: '0 4px 20px -2px rgba(20, 17, 15, 0.05)',
        textColor: '#14110F',
        textHoverColor: 'var(--accent)',
        separatorColor: 'rgba(20, 17, 15, 0.25)',
        asteriskColor: 'var(--accent)',
        hamburgerColor: isMenuOpen ? '#FFFFFF' : '#14110F'
      };
    }

    // Hero section: transparent with crisp white text
    return {
      isLight: false,
      bg: 'transparent',
      backdropBlur: 'none',
      border: 'transparent',
      shadow: 'none',
      textColor: '#FFFFFF',
      textHoverColor: '#FF8FB1',
      separatorColor: 'rgba(255, 255, 255, 0.35)',
      asteriskColor: '#E5392F',
      hamburgerColor: '#FFFFFF'
    };
  });

  // Video mouse-scrubbing state
  private targetTime = 0;
  private currentRenderTime = 0.001;
  private isRafRunning = false;
  private rafId: number | null = null;
  private gazeCheckInterval: any = null;
  private pillsTimeoutId?: ReturnType<typeof setTimeout>;

  readonly videoUrl =
    'https://res.cloudinary.com/prathaksoni/video/upload/ki_0.05/v1792591379/0e97306f-2b09-43d8-9101-c6d03ef9c936_ndhdmu.mp4';

  readonly fullText =
    'Glad you stopped in. Good taste tends to find me. Now, what should we build together?';

  ngOnInit(): void {
    // 1. Initialize Lenis smooth scrolling & GSAP ticker outside zone
    this.smoothScroll.init();

    // 2. Initialize dynamic section accent takeover, selection palette & easter eggs
    this.accentTheme.init();

    // 3. Start typewriter
    this.typewriter.start(this.fullText, 36, 500);

    // 4. Reveal hero pill buttons
    this.pillsTimeoutId = setTimeout(() => {
      this.showPills.set(true);
    }, 450);

    // 5. Connect avatar gaze coordination with video scrub tracking
    this.initAvatarGazeBridge();
  }

  private lenisScrollListener: any = null;

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;

    // Run initial scroll check to set navbar theme correctly even on refreshed scrolled state
    this.checkScrollPosition();
    setTimeout(() => this.checkScrollPosition(), 100);

    // Sync with Lenis smooth scroll updates
    this.lenisScrollListener = () => this.checkScrollPosition();
    window.addEventListener('lenis-scroll', this.lenisScrollListener);

    // Initialize Rough Notation highlights on hero headline keywords ("me" & "build")
    setTimeout(() => {
      if (this.wordMeRef?.nativeElement) {
        const annotMe = annotate(this.wordMeRef.nativeElement, {
          type: 'circle',
          color: '#E5392F',
          strokeWidth: 2.2,
          padding: 8,
          iterations: 2
        });
        annotMe.show();
      }

      if (this.wordBuildRef?.nativeElement) {
        const annotBuild = annotate(this.wordBuildRef.nativeElement, {
          type: 'highlight',
          color: 'rgba(255, 201, 60, 0.4)',
          padding: 3
        });
        annotBuild.show();
      }
    }, 1800);
  }

  ngOnDestroy(): void {
    this.typewriter.cleanup();
    this.smoothScroll.destroy();
    this.accentTheme.destroy();
    this.avatarGaze.destroy();

    if (this.lenisScrollListener && typeof window !== 'undefined') {
      window.removeEventListener('lenis-scroll', this.lenisScrollListener);
    }
    if (this.pillsTimeoutId) clearTimeout(this.pillsTimeoutId);
    if (this.gazeCheckInterval) clearInterval(this.gazeCheckInterval);
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.isRafRunning = false;
  }

  /**
   * Bridges AvatarGazeService with Cloudinary keyframe scrubbing.
   * When avatar reacts to selection, contact form typing, or A.R.I.A chat,
   * the video head physically rotates towards the target!
   */
  private initAvatarGazeBridge(): void {
    this.zone.runOutsideAngular(() => {
      let lastMood = this.avatarGaze.mood();

      this.gazeCheckInterval = setInterval(() => {
        const mood = this.avatarGaze.mood();
        if (mood === 'approving' || mood === 'typing' || mood === 'curious') {
          const target = this.avatarGaze.targetGaze();
          const clientX = (target.x * (window.innerWidth * 0.5)) + (window.innerWidth * 0.5);
          const clientY = (target.y * (window.innerHeight * 0.5)) + (window.innerHeight * 0.42);
          this.updateTargetByCursor(clientX, clientY);
        }
        lastMood = mood;
      }, 50);
    });
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  scrollToSection(href: string, e?: Event): void {
    if (e) e.preventDefault();
    this.closeMobileMenu();
    this.smoothScroll.scrollTo(href);
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.checkScrollPosition();
  }

  private checkScrollPosition(): void {
    if (typeof window === 'undefined') return;
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    this.isScrolled.set(scrollY > 20);

    const lightEl = document.getElementById('about');
    if (lightEl) {
      const rect = lightEl.getBoundingClientRect();
      this.isOverLightSection.set(rect.top <= 80 || scrollY > 200);
    } else {
      this.isOverLightSection.set(scrollY > 200);
    }
  }

  // Safe zone tracking around character's face
  private isInsideSafeZone = false;

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.updateTargetByCursor(event.clientX, event.clientY);

    // Parallax drifting values (-1 to 1)
    const px = (event.clientX / window.innerWidth) - 0.5;
    const py = (event.clientY / window.innerHeight) - 0.5;
    this.parallaxX.set(px);
    this.parallaxY.set(py);
  }

  @HostListener('window:touchmove', ['$event'])
  onTouchMove(event: TouchEvent): void {
    if (event.touches.length > 0) {
      this.updateTargetByCursor(event.touches[0].clientX, event.touches[0].clientY);
    }
  }

  @HostListener('window:mouseleave')
  onMouseLeave(): void {
    this.isInsideSafeZone = true;
    this.targetTime = 0.0;
    this.startSmoothLoop();
  }

  private updateTargetByCursor(clientX: number, clientY: number): void {
    const video = this.bgVideoRef?.nativeElement;
    if (!video || !video.duration || isNaN(video.duration)) {
      return;
    }

    const centerX = window.innerWidth * 0.5;
    const centerY = window.innerHeight * 0.42;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const dist = Math.hypot(dx, dy);

    const baseSafeRadius = Math.max(125, Math.min(window.innerWidth, window.innerHeight) * 0.18);
    const enterRadius = baseSafeRadius;
    const exitRadius = baseSafeRadius + 25;

    if (this.isInsideSafeZone) {
      if (dist < exitRadius) {
        this.targetTime = 0.0;
        this.startSmoothLoop();
        return;
      }
      this.isInsideSafeZone = false;
    } else {
      if (dist <= enterRadius) {
        this.isInsideSafeZone = true;
        this.targetTime = 0.0;
        this.startSmoothLoop();
        return;
      }
    }

    const angleFromUp = (Math.atan2(dx, -dy) * 180) / Math.PI;

    let angleTime = 0;
    if (Math.abs(angleFromUp) <= 32) {
      angleTime = 1.0 + (angleFromUp / 32) * 0.25;
    } else if (angleFromUp > 32 && angleFromUp <= 90) {
      angleTime = 1.25 + ((angleFromUp - 32) / 58) * 2.55;
    } else if (angleFromUp > 90) {
      angleTime = 3.8 + ((angleFromUp - 90) / 90) * 1.7;
    } else if (angleFromUp < -32 && angleFromUp >= -90) {
      angleTime = 9.2 - ((Math.abs(angleFromUp) - 32) / 58) * 1.2;
    } else {
      angleTime = 8.0 - ((Math.abs(angleFromUp) - 90) / 90) * 2.5;
    }

    this.targetTime = angleTime;
    this.startSmoothLoop();
  }

  private startSmoothLoop(): void {
    if (this.isRafRunning) return;
    this.isRafRunning = true;

    const tick = () => {
      const video = this.bgVideoRef?.nativeElement;
      if (!video) {
        this.isRafRunning = false;
        this.rafId = null;
        return;
      }

      const duration = video.duration || 10.005;

      let diff = this.targetTime - this.currentRenderTime;
      while (diff > duration / 2) diff -= duration;
      while (diff < -duration / 2) diff += duration;

      if (Math.abs(diff) < 0.015) {
        this.currentRenderTime = this.targetTime;
        video.currentTime = this.currentRenderTime;
        this.isRafRunning = false;
        this.rafId = null;
        return;
      }

      const proportionalStep = Math.abs(diff) * 0.12;
      const stepMagnitude = Math.min(Math.max(proportionalStep, 0.015), 0.08);
      const step = Math.sign(diff) * Math.min(stepMagnitude, Math.abs(diff));

      let nextTime = this.currentRenderTime + step;
      while (nextTime >= duration) nextTime -= duration;
      while (nextTime < 0) nextTime += duration;

      this.currentRenderTime = nextTime;
      video.currentTime = this.currentRenderTime;

      this.rafId = requestAnimationFrame(tick);
    };

    this.rafId = requestAnimationFrame(tick);
  }

  onVideoSeeked(): void {
    if (!this.isRafRunning) {
      const video = this.bgVideoRef?.nativeElement;
      if (video) {
        const duration = video.duration || 10.005;
        let diff = this.targetTime - this.currentRenderTime;
        while (diff > duration / 2) diff -= duration;
        while (diff < -duration / 2) diff += duration;
        if (Math.abs(diff) > 0.03) {
          this.startSmoothLoop();
        }
      }
    }
  }

  onMetadataLoaded(): void {
    const video = this.bgVideoRef?.nativeElement;
    if (video) {
      this.currentRenderTime = 0.001;
      this.targetTime = 0.0;
      video.currentTime = 0.001;
    }
  }

  copyEmail(): void {
    navigator.clipboard.writeText('prathaksoni.19@gmail.com').then(() => {
      this.toast.show('Copied to clipboard ✂️', '🎉', 2400);
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.8 },
        colors: ['#E5392F', '#2F5BFF', '#5CC46B', '#FFC93C', '#FF8FB1']
      });
      this.avatarGaze.triggerWink();
    });
  }
}

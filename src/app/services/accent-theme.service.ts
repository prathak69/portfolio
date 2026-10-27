import { Injectable, NgZone } from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import confetti from 'canvas-confetti';
import { ToastService } from './toast.service';
import { AvatarGazeService } from './avatar-gaze.service';

if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
  gsap.registerPlugin(ScrollTrigger);
}

@Injectable({
  providedIn: 'root'
})
export class AccentThemeService {
  readonly selectionPalette = ['#FFC93C', '#7CF29A', '#7FB2FF', '#FF8FB1', '#5CC46B', '#38BDF8'];
  private paletteIndex = 0;
  private scrollTriggers: ScrollTrigger[] = [];
  private isInitialized = false;

  // Konami code tracker
  private konamiIndex = 0;
  private readonly konamiCode = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'b', 'a'
  ];

  constructor(
    private readonly zone: NgZone,
    private readonly toast: ToastService,
    private readonly avatarGaze: AvatarGazeService
  ) {}

  init(): void {
    if (this.isInitialized || typeof window === 'undefined') return;
    this.isInitialized = true;

    this.zone.runOutsideAngular(() => {
      this.setupSelectionListeners();
      this.setupSectionTakeover();
      this.setupKonamiCode();
    });
  }

  /**
   * Part 2.1: Colourful text selection + Copy Toast + Avatar reaction
   */
  private setupSelectionListeners(): void {
    // 1. Rotate selection colour on pointerdown
    document.addEventListener('pointerdown', () => {
      const color = this.selectionPalette[this.paletteIndex++ % this.selectionPalette.length];
      document.documentElement.style.setProperty('--sel', color);
    }, { passive: true });

    // 2. Signature touch: Avatar reacts to text selection
    document.addEventListener('selectionchange', () => {
      const selection = document.getSelection();
      if (!selection || selection.isCollapsed || selection.toString().trim().length === 0) {
        return;
      }
      try {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        if (rect && (rect.width > 0 || rect.height > 0)) {
          this.avatarGaze.reactToSelection(rect);
        }
      } catch {
        // Range may be unavailable during rapid dom updates
      }
    }, { passive: true });

    // 3. Toast on copy
    document.addEventListener('copy', () => {
      this.toast.show('Copied ✂️');
    }, { passive: true });
  }

  /**
   * Part 2.2: Section accent takeover via GSAP ScrollTrigger
   */
  private setupSectionTakeover(): void {
    const map: [string, string][] = [
      ['#hero', '#E5392F'],          // Red
      ['#about', '#2F5BFF'],         // Blue
      ['#approach', '#2F5BFF'],      // Blue
      ['#skills', '#5CC46B'],        // Green
      ['#experience', '#FFC93C'],    // Yellow
      ['#projects', '#FF8FB1'],      // Pink
      ['#certifications', '#38BDF8'],// Cyan
      ['#contact', '#E5392F']        // Red
    ];

    // Wait for DOM to settle
    setTimeout(() => {
      map.forEach(([sel, color]) => {
        const el = document.querySelector(sel);
        if (!el) return;

        const st = ScrollTrigger.create({
          trigger: el,
          start: 'top 50%',
          end: 'bottom 50%',
          onToggle: (self) => {
            if (self.isActive) {
              gsap.to(document.documentElement, {
                '--accent': color,
                duration: 0.6,
                ease: 'power2.out'
              });
            }
          }
        });
        this.scrollTriggers.push(st);
      });
    }, 200);
  }

  /**
   * Footer Easter Egg: Konami Code triggers Party Mode
   */
  private setupKonamiCode(): void {
    window.addEventListener('keydown', (e) => {
      const key = e.key.toLowerCase();
      const expectedKey = this.konamiCode[this.konamiIndex].toLowerCase();

      if (key === expectedKey) {
        this.konamiIndex++;
        if (this.konamiIndex === this.konamiCode.length) {
          this.activatePartyMode();
          this.konamiIndex = 0;
        }
      } else {
        this.konamiIndex = 0;
      }
    });
  }

  activatePartyMode(): void {
    document.body.classList.toggle('party-mode');
    const isParty = document.body.classList.contains('party-mode');

    if (isParty) {
      this.toast.show('🎉 Party Mode Active!', '🪩', 3000);
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#E5392F', '#2F5BFF', '#5CC46B', '#FFC93C', '#FF8FB1']
      });
      this.avatarGaze.triggerWink();
    } else {
      this.toast.show('Party Mode Off', '✨', 1800);
    }
  }

  destroy(): void {
    this.scrollTriggers.forEach((st) => st.kill());
    this.scrollTriggers = [];
    this.isInitialized = false;
  }
}

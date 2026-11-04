import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import confetti from 'canvas-confetti';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
  gsap.registerPlugin(ScrollTrigger);
}

export interface ManifestoToken {
  text: string;
  isAccent: boolean;
  accentPhrase?: 'creative' | 'our team tight' | 'project gets' | 'from scratch' | 'better';
  badgeKey?: 'overthinkers' | 'nerding' | 'generic';
  badgeText?: string;
  rotation?: number;
}

export interface CharItem {
  id: string;
  char: string;
  globalIndex: number;
  isAccent: boolean;
}

export interface WordItem {
  wordIndex: number;
  text: string;
  isAccent: boolean;
  chars: CharItem[];
}

export interface LineItem {
  lineIndex: number;
  words: WordItem[];
}

@Component({
  selector: 'app-manifesto-reveal',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Scroll Runway: provides vertical scroll travel for smooth scrubbing -->
    <div #runway class="manifesto-runway" id="about">
      <!-- Sticky Centered Viewport (clears top navbar, centers A BIT ABOUT US + 6 lines) -->
      <div class="manifesto-sticky-viewport">
        <div class="manifesto-inner-wrap">
          <!-- Section Tag (Prominently visible below navbar) -->
          <div class="manifesto-header about-text">
            <span class="header-tag">A BIT ABOUT US</span>
          </div>

          <!-- Exact 6-Line Copy Box with Anchored Pills (Matching Two26 Studio) -->
          <div class="manifesto-copy-box">
            <p #manifestoParagraph class="about-para manifesto-paragraph">
              @for (line of linesData; track line.lineIndex) {
                <span class="manifesto-line">
                  @for (word of line.words; track word.text + $index) {
                    <span class="manifesto-word" [class.accent-word]="word.isAccent">
                      @for (c of word.chars; track c.id) {
                        <span
                          class="char"
                          [attr.data-char-idx]="c.globalIndex"
                        >{{ c.char }}</span>
                      }
                    </span><span class="word-spacer">&nbsp;</span>
                  }
                </span>
              }
            </p>

            <!-- Pill 1: "Professional overthinkers" (rested directly over "keep our" on Line 2) -->
            <button
              type="button"
              class="about-pill second badge-overthinkers"
              data-badge="overthinkers"
              (click)="onBadgeClick('Professional overthinkers', $event)"
              data-cursor="STICKER"
              aria-label="Professional overthinkers"
            >
              <span class="hero-pill-text">Professional overthinkers</span>
            </button>

            <!-- Pill 2: "Nerding out on design" (rested directly over "high, so" on Line 4) -->
            <button
              type="button"
              class="about-pill first badge-nerding"
              data-badge="nerding"
              (click)="onBadgeClick('Nerding out on design', $event)"
              data-cursor="STICKER"
              aria-label="Nerding out on design"
            >
              <span class="hero-pill-text">Nerding out on design</span>
            </button>

            <!-- Pill 3: "Allergic to generic" (rested directly over "brands" on Line 5) -->
            <button
              type="button"
              class="about-pill third badge-generic"
              data-badge="generic"
              (click)="onBadgeClick('Allergic to generic', $event)"
              data-cursor="STICKER"
              aria-label="Allergic to generic"
            >
              <span class="hero-pill-text">Allergic to generic</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './manifesto-reveal.component.scss'
})
export class ManifestoRevealComponent implements AfterViewInit, OnDestroy {
  @ViewChild('runway') runwayRef!: ElementRef<HTMLDivElement>;
  @ViewChild('manifestoParagraph') paragraphRef!: ElementRef<HTMLParagraphElement>;

  /**
   * The 6 distinct lines matching Two26 Studio identically.
   */
  readonly lines: ManifestoToken[][] = [
    // Line 1 (5 words)
    [
      { text: 'We', isAccent: false },
      { text: 'believe', isAccent: false },
      { text: 'creative', isAccent: true, accentPhrase: 'creative' },
      { text: 'work', isAccent: false },
      { text: 'needs', isAccent: false }
    ],
    // Line 2 (6 words) - Anchor for Pill 1 'Professional overthinkers'
    [
      { text: 'focus.', isAccent: false },
      { text: "That's", isAccent: false },
      { text: 'why', isAccent: false },
      { text: 'we', isAccent: false },
      {
        text: 'keep',
        isAccent: false,
        badgeKey: 'overthinkers',
        badgeText: 'Professional overthinkers',
        rotation: -4
      },
      { text: 'our', isAccent: true, accentPhrase: 'our team tight' }
    ],
    // Line 3 (5 words)
    [
      { text: 'team', isAccent: true, accentPhrase: 'our team tight' },
      { text: 'tight', isAccent: true, accentPhrase: 'our team tight' },
      { text: 'and', isAccent: false },
      { text: 'our', isAccent: false },
      { text: 'involvement', isAccent: false }
    ],
    // Line 4 (7 words) - Anchor for Pill 2 'Nerding out on design'
    [
      {
        text: 'high,',
        isAccent: false,
        badgeKey: 'nerding',
        badgeText: 'Nerding out on design',
        rotation: 5
      },
      { text: 'so', isAccent: false },
      { text: 'every', isAccent: false },
      { text: 'project', isAccent: true, accentPhrase: 'project gets' },
      { text: 'gets', isAccent: true, accentPhrase: 'project gets' },
      { text: 'our', isAccent: false },
      { text: 'full', isAccent: false }
    ],
    // Line 5 (5 words) - Anchor for Pill 3 'Allergic to generic'
    [
      { text: 'attention.', isAccent: false },
      { text: 'We', isAccent: false },
      { text: 'build', isAccent: false },
      {
        text: 'brands',
        isAccent: false,
        badgeKey: 'generic',
        badgeText: 'Allergic to generic',
        rotation: -4
      },
      { text: 'from', isAccent: true, accentPhrase: 'from scratch' }
    ],
    // Line 6 (5 words)
    [
      { text: 'scratch', isAccent: true, accentPhrase: 'from scratch' },
      { text: 'or', isAccent: false },
      { text: 'make', isAccent: false },
      { text: 'them', isAccent: false },
      { text: 'better.', isAccent: true, accentPhrase: 'better' }
    ]
  ];

  /** Flat list of all tokens for testing and linear traversal */
  get tokens(): ManifestoToken[] {
    return this.lines.flat();
  }

  /**
   * Structured 6 lines with character arrays for kinetic wave rendering.
   */
  readonly linesData: LineItem[] = [];

  private totalCharacters = 0;
  private charElements: HTMLElement[] = [];
  private wordElements: HTMLElement[] = [];
  private pillElements: {
    el: HTMLElement;
    threshold: number;
    activeTransform: string;
    inactiveTransform: string;
  }[] = [];
  private scrollTriggerInstance: ScrollTrigger | null = null;
  private scrollListener: any = null;
  private resizeListener: any = null;

  constructor(private readonly zone: NgZone) {
    let charCounter = 0;
    let wordCounter = 0;

    this.linesData = this.lines.map((lineTokens, lineIdx) => {
      const words: WordItem[] = lineTokens.map((token) => {
        const chars: CharItem[] = token.text.split('').map((c) => ({
          id: `c_${charCounter}`,
          char: c,
          globalIndex: charCounter++,
          isAccent: token.isAccent
        }));

        return {
          wordIndex: wordCounter++,
          text: token.text,
          isAccent: token.isAccent,
          chars
        };
      });

      return {
        lineIndex: lineIdx,
        words
      };
    });

    this.totalCharacters = charCounter;
  }

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;

    this.zone.runOutsideAngular(() => {
      this.initKineticReveal();
    });
  }

  private initKineticReveal(): void {
    const paragraph = this.paragraphRef?.nativeElement;
    const runway = this.runwayRef?.nativeElement;
    if (!paragraph || !runway) return;

    // Cache character and word DOM elements
    this.charElements = Array.from(paragraph.querySelectorAll('.char')) as HTMLElement[];
    this.wordElements = Array.from(paragraph.querySelectorAll('.manifesto-word')) as HTMLElement[];

    this.pillElements = [];
    const pill1 = runway.querySelector('.about-pill.second') as HTMLElement | null;
    const pill2 = runway.querySelector('.about-pill.first') as HTMLElement | null;
    const pill3 = runway.querySelector('.about-pill.third') as HTMLElement | null;

    // Pill 1: "Professional overthinkers" (triggers at Line 2 completion ~35%)
    if (pill1) {
      this.pillElements.push({
        el: pill1,
        threshold: 0.35,
        activeTransform: 'translate(-50%, -50%) rotate(-4deg) scale(1)',
        inactiveTransform: 'translate(-50%, calc(-50% + 22px)) rotate(-4deg) scale(0.6)'
      });
    }

    // Pill 2: "Nerding out on design" (triggers at Line 4 completion ~70%)
    if (pill2) {
      this.pillElements.push({
        el: pill2,
        threshold: 0.70,
        activeTransform: 'translate(-50%, -50%) rotate(5deg) scale(1)',
        inactiveTransform: 'translate(-50%, calc(-50% + 22px)) rotate(5deg) scale(0.6)'
      });
    }

    // Pill 3: "Allergic to generic" (triggers at Line 5 completion ~92%)
    if (pill3) {
      this.pillElements.push({
        el: pill3,
        threshold: 0.92,
        activeTransform: 'translate(-50%, -50%) rotate(-4.5deg) scale(1)',
        inactiveTransform: 'translate(-50%, calc(-50% + 22px)) rotate(-4.5deg) scale(0.6)'
      });
    }

    // Initialize in unrevealed peach state (0% scroll)
    this.updateProgress(0);

    // 1. GSAP ScrollTrigger Scrubbed Timeline
    try {
      this.scrollTriggerInstance = ScrollTrigger.create({
        trigger: runway,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 0.8,
        onUpdate: (self) => {
          this.updateProgress(self.progress);
        }
      });
    } catch {
      // Fallback to rAF scroll listener if ScrollTrigger unavailable
    }

    // 2. Direct fallback listeners for Lenis and native scrolling
    this.scrollListener = () => {
      this.handleScroll();
    };

    window.addEventListener('scroll', this.scrollListener, { passive: true });
    window.addEventListener('lenis-scroll', this.scrollListener, { passive: true });

    this.resizeListener = () => {
      this.handleScroll();
    };
    window.addEventListener('resize', this.resizeListener, { passive: true });

    // Initial check
    this.handleScroll();
    setTimeout(() => this.handleScroll(), 60);
    setTimeout(() => this.handleScroll(), 250);
  }

  private rafId: number | null = null;

  private handleScroll(): void {
    if (this.rafId !== null) return;
    this.rafId = requestAnimationFrame(() => {
      this.rafId = null;
      this.computeAndApplyProgress();
    });
  }

  private computeAndApplyProgress(): void {
    const runway = this.runwayRef?.nativeElement;
    if (!runway) return;

    const rect = runway.getBoundingClientRect();
    const windowH = window.innerHeight;
    const totalDistance = runway.offsetHeight - windowH;

    if (totalDistance <= 0) {
      this.updateProgress(1);
      return;
    }

    // Scrolled distance through the sticky runway:
    const scrolled = -rect.top;
    const progress = Math.min(Math.max(scrolled / totalDistance, 0), 1);
    this.updateProgress(progress);
  }

  /**
   * Two26 Studio Exact Kinetic Character Animation:
   * - Resting before wave: Low-contrast peach rgba(255, 84, 0, 0.45), scale 1, rot 0
   * - Wavefront Active Zoom: Kinetic zoom 1.15x, dynamic ±3.5deg tilt, vibrant Two26 orange (#FF5400) + thick textShadow glow
   * - Wavefront Settle: Smoothly settles down to scale 1, rot 0, solid black #000000
   * - Past wave / 100% progress: Clean solid black #000000 (ZERO permanent orange words!)
   * - Badges pop in at Two26 milestones (35%, 70%, 92%)
   */
  public updateProgress(progress: number): void {
    if (this.charElements.length === 0 && this.paragraphRef?.nativeElement) {
      this.charElements = Array.from(
        this.paragraphRef.nativeElement.querySelectorAll('.char')
      ) as HTMLElement[];
      this.wordElements = Array.from(
        this.paragraphRef.nativeElement.querySelectorAll('.manifesto-word')
      ) as HTMLElement[];
    }

    const totalChars = this.totalCharacters || this.charElements.length;
    if (totalChars === 0) return;

    const clampedProgress = Math.min(Math.max(progress, 0), 1);

    // Update --fill on words for unit test assertions
    for (let w = 0; w < this.wordElements.length; w++) {
      const wordProgress = Math.min(Math.max((clampedProgress - (w / this.wordElements.length)) * 5, 0), 1);
      this.wordElements[w].style.setProperty('--fill', (clampedProgress >= 1 ? 1 : wordProgress).toFixed(3));
    }

    // Two26 Studio exact timeline pacing:
    // letterAnimSpan = 82 (wave sweeps through 0..82% of timeline; remaining 18% is settled hold)
    // Small threshold before letter 0 activates so that at 0% scroll, every letter (including 'W') is faded peach
    const startThreshold = 0.01;
    const effectiveProgress = clampedProgress <= startThreshold
      ? 0
      : (clampedProgress - startThreshold) / (1 - startThreshold);

    const timelinePos = effectiveProgress * 100;
    const letterAnimSpan = 82;

    for (let i = 0; i < this.charElements.length; i++) {
      const charEl = this.charElements[i];
      if (!charEl) continue;

      const startTime = (i / totalChars) * letterAnimSpan;
      const diff = timelinePos - startTime;

      if (effectiveProgress <= 0 || diff <= 0) {
        // Stage 0: Initial state (Muted website accent tint)
        charEl.style.color = 'var(--manifesto-inactive, rgba(229, 57, 47, 0.4))';
        charEl.style.transform = 'scale(1) rotate(0deg)';
        charEl.style.textShadow = 'none';
      } else if (diff > 0 && diff <= 4.5) {
        // Stage 1: Active Wavefront (Kinetic Zoom 1.15x + Website Dynamic Accent + Glow)
        const u = diff / 4.5;
        const scale = 1.0 + 0.15 * Math.sin(u * Math.PI * 0.5);
        const randomTilt = Math.sin((i + 1) * 12.9898) * 3.5;
        const tilt = (randomTilt * Math.sin(u * Math.PI)).toFixed(2);

        charEl.style.color = 'var(--manifesto-accent, #E5392F)';
        charEl.style.transform = `scale(${scale.toFixed(3)}) rotate(${tilt}deg)`;
        charEl.style.textShadow = '0.6px 0.6px 0 var(--manifesto-accent, #E5392F), -0.6px -0.6px 0 var(--manifesto-accent, #E5392F), 0.6px 0.6px 0 var(--manifesto-accent, #E5392F), -0.6px 0.6px 0 var(--manifesto-accent, #E5392F)';
      } else if (diff > 4.5 && diff <= 9.0) {
        // Stage 2: Settling to Solid Ink
        const v = (diff - 4.5) / 4.5;
        const scale = 1.15 - 0.15 * v;
        const randomTilt = Math.sin((i + 1) * 12.9898) * 3.5;
        const tilt = (randomTilt * (1 - v) * 0.3).toFixed(2);
        const pct = Math.round((1 - v) * 100);

        charEl.style.color = `color-mix(in srgb, var(--manifesto-accent, #E5392F) ${pct}%, var(--manifesto-ink, #14110F))`;
        charEl.style.transform = `scale(${scale.toFixed(3)}) rotate(${tilt}deg)`;
        charEl.style.textShadow = v > 0.5 ? 'none' : '0.4px 0.4px 0 color-mix(in srgb, var(--manifesto-accent, #E5392F) 30%, transparent)';
      } else {
        // Stage 3: Fully settled solid ink (#14110F)
        charEl.style.color = 'var(--manifesto-ink, #14110F)';
        charEl.style.transform = 'scale(1) rotate(0deg)';
        charEl.style.textShadow = 'none';
      }
    }

    // Trigger floating micro-pill stickers with exact Two26 Studio transforms & spring physics
    for (const p of this.pillElements) {
      if (clampedProgress >= p.threshold) {
        p.el.classList.add('active');
        p.el.style.transform = p.activeTransform;
        p.el.style.opacity = '1';
        p.el.style.pointerEvents = 'auto';
      } else {
        p.el.classList.remove('active');
        p.el.style.transform = p.inactiveTransform;
        p.el.style.opacity = '0';
        p.el.style.pointerEvents = 'none';
      }
    }
  }

  onBadgeClick(badgeText: string, event: MouseEvent): void {
    if (typeof window === 'undefined') return;

    // Playful tactile celebration confetti explosion
    const x = event.clientX / window.innerWidth;
    const y = event.clientY / window.innerHeight;

    confetti({
      particleCount: 30,
      spread: 55,
      origin: { x, y },
      colors: ['#FF5400', '#FF8FB1', '#FFC93C', '#111111']
    });
  }

  ngOnDestroy(): void {
    if (typeof window !== 'undefined') {
      if (this.scrollTriggerInstance) {
        this.scrollTriggerInstance.kill();
        this.scrollTriggerInstance = null;
      }
      if (this.scrollListener) {
        window.removeEventListener('scroll', this.scrollListener);
        window.removeEventListener('lenis-scroll', this.scrollListener);
      }
      if (this.resizeListener) {
        window.removeEventListener('resize', this.resizeListener);
      }
    }
  }
}

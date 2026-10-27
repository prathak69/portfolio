import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'app-design-approach',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      #sectionRef
      class="approach-section relative z-[2] bg-[var(--bg,#FFFFFF)] text-[var(--ink,#0C0C0C)] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-[5%] pt-20 sm:pt-24 md:pt-28 pb-20 sm:pb-28 shadow-[0_-25px_60px_rgba(12,12,12,0.06)] border-t border-[var(--line,#E4E4E7)]"
      [class.is-revealed]="isRevealed()"
    >
      <!-- Top Utility Header -->
      <div class="flex items-center justify-between mb-12 sm:mb-16 select-none">
        <div class="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#FFF4EB] border border-[#FFD0B0] text-[var(--orange-text,#C74A00)] text-xs font-bold tracking-widest uppercase shadow-xs">
          <span class="w-2 h-2 rounded-full bg-[var(--orange,#FF7A00)] animate-pulse"></span>
          <span>{{ kicker() }}</span>
        </div>
        <span class="text-xs font-mono text-[var(--muted,#5B5F66)] tracking-widest hidden sm:inline-block">
          02 // STATEMENT
        </span>
      </div>

      <!-- Main Statement with Pointer Tracking Hover Image -->
      <div
        #statementContainer
        class="statement-container relative cursor-default"
        (mouseenter)="onPointerEnter()"
        (mouseleave)="onPointerLeave()"
        (mousemove)="onPointerMove($event)"
      >
        <h2 class="statement-heading cabin-sketch-bold m-0 tracking-normal text-[var(--ink,#0C0C0C)] select-text cursor-text">
          @for (line of statementLines(); track $index) {
            <span class="line-mask block overflow-hidden leading-[1.08] pb-1 select-text">
              <span
                class="line-inner block will-change-transform text-[var(--ink,#0C0C0C)] select-text"
                [style.--line-index]="$index"
                (mouseenter)="onLineHover($index)"
              >
                {{ line }}
              </span>
            </span>
          }
        </h2>

        <!-- Interactive Floating Pointer-Follow Artwork (Clay Character Series) -->
        <div
          #artRef
          class="floating-artwork pointer-events-none fixed top-0 left-0 z-30 transition-opacity duration-300 select-none"
          [style.transform]="artTransform()"
          [style.opacity]="artOpacity()"
        >
          <div class="artwork-card relative w-[260px] sm:w-[320px] aspect-[16/9] shadow-[0_24px_60px_rgba(12,12,12,0.22)] rounded-xl overflow-hidden border border-black/10 bg-[#141414]">
            @for (img of hoverImages; track img.url; let idx = $index) {
              <img
                [src]="img.url"
                [alt]="img.alt"
                loading="eager"
                draggable="false"
                class="absolute inset-0 w-full h-full object-cover transition-all duration-300 ease-out select-none"
                [class.opacity-100]="activeImageIndex() === idx"
                [class.opacity-0]="activeImageIndex() !== idx"
                [class.scale-100]="activeImageIndex() === idx"
                [class.scale-105]="activeImageIndex() !== idx"
              />
            }
          </div>
        </div>
      </div>

      <!-- Supporting Metadata & Disciplines (at least 80px separation on desktop) -->
      <div class="metadata-row mt-16 sm:mt-24 md:mt-28 pt-8 border-t border-[var(--line,#E4E4E7)] flex flex-col md:flex-row justify-between items-start gap-10">
        <!-- Left Supporting Copy -->
        <div class="max-w-md">
          <p class="text-[var(--muted,#5B5F66)] text-base sm:text-lg md:text-[18px] leading-relaxed font-normal m-0">
            {{ supportingCopy() }}
          </p>
        </div>

        <!-- Right Disciplines -->
        <div class="flex flex-col items-start md:items-end gap-3 w-full md:w-auto">
          <span class="text-xs font-mono uppercase tracking-widest text-[var(--muted,#5B5F66)] select-none">
            Disciplines
          </span>
          <div class="flex flex-wrap gap-2.5">
            @for (disc of disciplines(); track disc) {
              <span
                class="discipline-pill px-4 py-2 text-xs sm:text-sm font-semibold tracking-tight rounded-full bg-[var(--paper,#F6F6F4)] border border-[var(--line,#E4E4E7)] text-[var(--ink,#0C0C0C)] transition-all duration-200 cursor-default select-none hover:bg-[var(--orange,#FF7A00)] hover:text-white hover:border-[var(--orange,#FF7A00)] hover:scale-105 hover:shadow-md"
              >
                {{ disc }}
              </span>
            }
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Cabin+Sketch:wght@400;700&display=swap');

    :host {
      display: block;
      width: 100%;
      container-type: inline-size;
    }

    .cabin-sketch-regular {
      font-family: "Cabin Sketch", sans-serif;
      font-weight: 400;
      font-style: normal;
    }

    .cabin-sketch-bold {
      font-family: "Cabin Sketch", sans-serif;
      font-weight: 700;
      font-style: normal;
    }

    .statement-heading {
      font-family: "Cabin Sketch", sans-serif;
      font-weight: 700;
      font-style: normal;
      font-size: clamp(30px, 7.2cqw, 98px);
      line-height: 1.05;
      letter-spacing: 0.015em;
      user-select: text;
      -webkit-user-select: text;
      cursor: text;
    }

    /* Mask container for line-by-line reveal */
    .line-mask {
      display: block;
      overflow: hidden;
      padding-bottom: 0.12em;
      user-select: text;
      -webkit-user-select: text;
    }

    .line-inner {
      user-select: text;
      -webkit-user-select: text;
      cursor: text;
      transform: translateY(108%);
      opacity: 0;
      filter: blur(8px);
      transition:
        transform 0.9s cubic-bezier(0.22, 1, 0.36, 1),
        opacity 0.75s ease-out,
        filter 0.85s ease-out;
      transition-delay: calc(var(--line-index, 0) * 110ms);
    }

    /* Revealed state applied via IntersectionObserver */
    :host-context(.is-revealed) .line-inner,
    .is-revealed .line-inner {
      transform: translateY(0%);
      opacity: 1;
      filter: blur(0px);
    }

    /* Floating artwork card following pointer */
    .floating-artwork {
      will-change: transform, opacity;
      transform-origin: center center;
    }

    @media (prefers-reduced-motion: reduce) {
      .line-inner {
        transform: none !important;
        opacity: 1 !important;
        filter: none !important;
        transition: none !important;
      }
      .floating-artwork {
        display: none !important;
      }
      .discipline-pill:hover {
        transform: none !important;
      }
    }
  `]
})
export class DesignApproachComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly sectionRef = viewChild<ElementRef<HTMLElement>>('sectionRef');

  // Configurable inputs
  readonly kicker = input<string>('// DESIGN APPROACH');
  // Hover images series (Clay Character)
  readonly hoverImages = [
    {
      url: 'https://res.cloudinary.com/prathaksoni/image/upload/v1793103627/wave_gxzd6k.jpg',
      alt: 'Clay character waving hello'
    },
    {
      url: 'https://res.cloudinary.com/prathaksoni/image/upload/v1793103624/Clay_man_thinking_thoughtfully_2K_20261027174737_uoglkq.jpg',
      alt: 'Clay character thinking thoughtfully'
    },
    {
      url: 'https://res.cloudinary.com/prathaksoni/image/upload/v1793103626/Clay_man_giving_thumbs_up_2K_20261027174728_eab7ls.jpg',
      alt: 'Clay character giving a thumbs up'
    }
  ] as const;

  readonly activeImageIndex = signal<number>(0);

  readonly statementLines = computed(() => [
    'I’m a frontend engineer',
    'who builds scalable, data-rich',
    'web applications, turning',
    'complex requirements into',
    'clean code and intuitive',
    'user experiences.'
  ]);

  readonly supportingCopy = input<string>(
    'I connect strategy and expression through brand identities, editorial systems, and digital experiences designed to work as a whole.'
  );

  readonly disciplines = input<string[]>([
    'Frontend Architecture',
    '3D & Spatial Web',
    'Kinetic Design Systems',
    'Interactive Experiences'
  ]);

  // Reveal state
  readonly isRevealed = signal<boolean>(false);

  // Floating artwork state
  private targetX = -9999;
  private targetY = -9999;
  private currentX = -9999;
  private currentY = -9999;
  private currentScale = 0.94;
  private targetScale = 0.94;
  private isHovering = false;
  private rafId: number | null = null;
  private lastTime = 0;

  readonly artTransform = signal<string>('translate3d(-9999px, -9999px, 0) scale(0.94)');
  readonly artOpacity = signal<number>(0);

  constructor() {
    afterNextRender(() => {
      this.initIntersectionObserver();
    });

    this.destroyRef.onDestroy(() => {
      if (this.rafId !== null) {
        cancelAnimationFrame(this.rafId);
      }
    });
  }

  private initIntersectionObserver(): void {
    const el = this.sectionRef()?.nativeElement;
    if (!el || typeof IntersectionObserver === 'undefined') {
      this.isRevealed.set(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.isRevealed.set(true);
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: 0.18 }
    );

    observer.observe(el);
    this.destroyRef.onDestroy(() => observer.disconnect());
  }

  onPointerEnter(): void {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(pointer: coarse)').matches) return;
    this.isHovering = true;
    this.targetScale = 1.0;
    this.artOpacity.set(0.95);
    this.lastTime = performance.now();
    this.startRaf();
  }

  onPointerLeave(): void {
    this.isHovering = false;
    this.targetScale = 0.94;
    this.artOpacity.set(0);
  }

  onLineHover(lineIndex: number): void {
    // 6 lines grouped into intervals of 2:
    // Lines 0, 1 -> Wave (0)
    // Lines 2, 3 -> Thinking (1)
    // Lines 4, 5 -> Thumbs up (2)
    const imgIndex = Math.min(2, Math.floor(lineIndex / 2));
    this.activeImageIndex.set(imgIndex);
  }

  onPointerMove(e: MouseEvent): void {
    if (!this.isHovering) return;
    this.targetX = e.clientX - 160;
    this.targetY = e.clientY - 190;

    if (this.currentX < -9000) {
      this.currentX = this.targetX;
      this.currentY = this.targetY;
    }

    // Determine interval of space vertically within the statement container
    const container = e.currentTarget as HTMLElement | null;
    if (container) {
      const rect = container.getBoundingClientRect();
      if (rect.height > 0) {
        const ratio = (e.clientY - rect.top) / rect.height;
        if (ratio < 0.35) {
          this.activeImageIndex.set(0);
        } else if (ratio < 0.68) {
          this.activeImageIndex.set(1);
        } else {
          this.activeImageIndex.set(2);
        }
      }
    }

    this.startRaf();
  }

  private startRaf(): void {
    if (this.rafId !== null) return;
    this.rafId = requestAnimationFrame(this.animateLoop);
  }

  private readonly animateLoop = (now: number): void => {
    this.rafId = null;
    const deltaMs = Math.min(now - (this.lastTime || now), 64);
    this.lastTime = now;

    const factor = 1 - Math.exp(-deltaMs / 140);
    this.currentX += (this.targetX - this.currentX) * factor;
    this.currentY += (this.targetY - this.currentY) * factor;
    this.currentScale += (this.targetScale - this.currentScale) * factor;

    this.artTransform.set(
      `translate3d(${this.currentX.toFixed(2)}px, ${this.currentY.toFixed(2)}px, 0) scale(${this.currentScale.toFixed(3)})`
    );

    const dist = Math.hypot(this.targetX - this.currentX, this.targetY - this.currentY);
    if ((dist > 0.1 || this.isHovering) && this.artOpacity() > 0.001) {
      this.rafId = requestAnimationFrame(this.animateLoop);
    }
  };
}

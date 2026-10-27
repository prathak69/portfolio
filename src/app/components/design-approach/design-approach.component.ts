import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChildren,
  QueryList,
  signal
} from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Principle {
  number: string;
  title: string;
  kicker: string;
  body: string;
  accent: string;
  bg: string;
  borderColor: string;
  doodleId: string;
}

@Component({
  selector: 'app-design-approach',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="approach" class="approach-section relative z-[2] bg-[#FFF8F0] px-5 sm:px-8 md:px-[6%] py-24 sm:py-32 border-t border-[#E8DCCF]">
      <!-- Section Header -->
      <div class="max-w-6xl mx-auto mb-16 sm:mb-20 text-center">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF3FF] border border-[#C2D8FF] text-xs font-mono font-bold uppercase tracking-wider text-[#2F5BFF] shadow-xs mb-5">
          <span class="w-2 h-2 rounded-full bg-[#2F5BFF] animate-pulse"></span>
          <span>02 // PHILOSOPHY &amp; METHODS</span>
        </div>

        <h2 class="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-[#14110F] text-ink m-0">
          Design <span class="cabin-sketch-bold text-[#2F5BFF]">Approach</span>
        </h2>
        <p class="mt-4 text-base sm:text-lg text-[#6B6560] text-muted max-w-xl mx-auto font-normal leading-relaxed">
          Four foundational principles guiding every interface, algorithm, and interactive canvas I build.
        </p>
      </div>

      <!-- Principles Grid / Sticky Cards -->
      <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
        @for (item of principles; track item.number; let idx = $index) {
          <div
            class="principle-card group relative p-8 sm:p-10 rounded-3xl border-2 transition-all duration-300 shadow-[0_14px_36px_rgba(20,17,15,0.04)] hover:-translate-y-1.5 hover:shadow-[0_22px_45px_rgba(20,17,15,0.08)] flex flex-col justify-between"
            [style.background]="item.bg"
            [style.border-color]="item.borderColor"
            [attr.data-cursor]="'0' + (idx + 1)"
          >
            <!-- Top Row: Number & Animated Doodle -->
            <div>
              <div class="flex items-start justify-between mb-8">
                <span class="font-mono text-3xl sm:text-4xl font-black" [style.color]="item.accent">
                  {{ item.number }}
                </span>

                <!-- Self-drawing SVG Doodle -->
                <div class="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center p-2 rounded-2xl bg-white/70 border border-black/5 shadow-xs">
                  @switch (item.doodleId) {
                    @case ('clarity') {
                      <!-- Clarity: Clean compass & focus grid -->
                      <svg #doodleSvg class="w-full h-full" viewBox="0 0 64 64" fill="none" stroke="currentColor" [style.color]="item.accent" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="32" cy="32" r="22" class="doodle-path" />
                        <circle cx="32" cy="32" r="8" class="doodle-path" />
                        <line x1="32" y1="4" x2="32" y2="14" class="doodle-path" />
                        <line x1="32" y1="50" x2="32" y2="60" class="doodle-path" />
                        <line x1="4" y1="32" x2="14" y2="32" class="doodle-path" />
                        <line x1="50" y1="32" x2="60" y2="32" class="doodle-path" />
                      </svg>
                    }
                    @case ('alive') {
                      <!-- Data Alive: Sine wave & pulsing nodes -->
                      <svg #doodleSvg class="w-full h-full" viewBox="0 0 64 64" fill="none" stroke="currentColor" [style.color]="item.accent" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M6 32 C14 16, 22 48, 32 32 C42 16, 50 48, 58 32" class="doodle-path" />
                        <circle cx="19" cy="24" r="3" fill="currentColor" />
                        <circle cx="32" cy="32" r="3" fill="currentColor" />
                        <circle cx="45" cy="40" r="3" fill="currentColor" />
                      </svg>
                    }
                    @case ('perf') {
                      <!-- Performance: Lightning bolt & speed lines -->
                      <svg #doodleSvg class="w-full h-full" viewBox="0 0 64 64" fill="none" stroke="currentColor" [style.color]="item.accent" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <polygon points="36 6 16 34 32 34 28 58 48 30 32 30 36 6" class="doodle-path" />
                        <line x1="8" y1="18" x2="16" y2="18" class="doodle-path" />
                        <line x1="48" y1="46" x2="56" y2="46" class="doodle-path" />
                      </svg>
                    }
                    @case ('details') {
                      <!-- Details: Doodle stars & sparkling cursor -->
                      <svg #doodleSvg class="w-full h-full" viewBox="0 0 64 64" fill="none" stroke="currentColor" [style.color]="item.accent" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <!-- 4-point star -->
                        <path d="M32 10 L36 26 L52 30 L36 34 L32 50 L28 34 L12 30 L28 26 Z" class="doodle-path" />
                        <!-- Tiny sparkle -->
                        <path d="M48 14 L50 20 L56 22 L50 24 L48 30 L46 24 L40 22 L46 20 Z" class="doodle-path" />
                      </svg>
                    }
                  }
                </div>
              </div>

              <!-- Title & Kicker -->
              <span class="inline-block text-xs font-mono font-bold tracking-widest uppercase mb-2" [style.color]="item.accent">
                {{ item.kicker }}
              </span>
              <h3 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#14110F] text-ink mb-4">
                {{ item.title }}
              </h3>

              <!-- Body Description -->
              <p class="text-base text-[#6B6560] text-muted leading-relaxed font-normal">
                {{ item.body }}
              </p>
            </div>

            <!-- Bottom Pill -->
            <div class="mt-8 pt-5 border-t border-black/8 flex items-center justify-between">
              <span class="cabin-sketch-bold text-sm tracking-wide text-[#14110F] text-ink">
                Core Standard
              </span>
              <span class="w-2.5 h-2.5 rounded-full" [style.background]="item.accent"></span>
            </div>
          </div>
        }
      </div>
    </section>
  `
})
export class DesignApproachComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('doodleSvg') doodleSvgs!: QueryList<ElementRef<SVGElement>>;

  readonly principles: Principle[] = [
    {
      number: '01',
      title: 'Clarity First',
      kicker: 'REDUCE NOISE',
      body: 'Remove noise before adding motion. Every element must earn its visual weight and solve a human need before decoration enters.',
      accent: '#2F5BFF',
      bg: '#F5F8FF',
      borderColor: '#D4E2FF',
      doodleId: 'clarity'
    },
    {
      number: '02',
      title: 'Data Should Feel Alive',
      kicker: 'KINETIC INTUITION',
      body: 'Static charts hide the pulse of systems. Spring physics, collision bounds, and organic easing turn abstract numbers into tactile stories.',
      accent: '#5CC46B',
      bg: '#F3FBF5',
      borderColor: '#C6EDD0',
      doodleId: 'alive'
    },
    {
      number: '03',
      title: 'Performance Is Design',
      kicker: '60FPS OR BUST',
      body: "If an animation drops below 60fps, it's not delight—it's friction. Offload heavy loops outside Angular's zone and keep render trees lean.",
      accent: '#FFC93C',
      bg: '#FFFDF0',
      borderColor: '#FFEFA6',
      doodleId: 'perf'
    },
    {
      number: '04',
      title: 'Details Matter',
      kicker: 'MICRO-DELIGHT',
      body: 'The feeling of quality lives in the micro-seconds: the magnetic button resistance, dynamic selection colours, and responsive character gaze.',
      accent: '#FF8FB1',
      bg: '#FFF5F8',
      borderColor: '#FFD3E1',
      doodleId: 'details'
    }
  ];

  private scrollTriggers: ScrollTrigger[] = [];

  constructor(private readonly zone: NgZone) {}

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;

    this.zone.runOutsideAngular(() => {
      this.initSelfDrawingDoodles();
    });
  }

  private initSelfDrawingDoodles(): void {
    setTimeout(() => {
      this.doodleSvgs.forEach((svgRef) => {
        const svg = svgRef.nativeElement;
        const paths = svg.querySelectorAll<SVGGeometryElement>('.doodle-path');

        paths.forEach((path) => {
          const length = path.getTotalLength ? path.getTotalLength() : 120;
          path.style.strokeDasharray = `${length}`;
          path.style.strokeDashoffset = `${length}`;

          const st = ScrollTrigger.create({
            trigger: svg,
            start: 'top 85%',
            once: true,
            onEnter: () => {
              gsap.to(path, {
                strokeDashoffset: 0,
                duration: 1.4,
                ease: 'power2.out'
              });
            }
          });
          this.scrollTriggers.push(st);
        });
      });
    }, 250);
  }

  ngOnDestroy(): void {
    this.scrollTriggers.forEach((st) => st.kill());
    this.scrollTriggers = [];
  }
}

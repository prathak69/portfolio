import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChildren,
  QueryList
} from '@angular/core';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PRINCIPLES, PrincipleRecord } from '../../data/portfolio.data';
import { MonoLabelComponent } from '../ui/mono-label/mono-label.component';

if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
  gsap.registerPlugin(ScrollTrigger);
}

@Component({
  selector: 'app-design-approach',
  standalone: true,
  imports: [MonoLabelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="approach" class="approach-section relative z-[2] bg-[#FFF8F0] px-5 sm:px-8 md:px-[6%] py-24 sm:py-32 border-t border-[#E8DCCF]">
      <!-- Section Header -->
      <div class="max-w-6xl mx-auto mb-16 sm:mb-20 text-center">
        <div class="mb-5 inline-block">
          <app-mono-label [dot]="true" accentColor="#2F5BFF">
            02 // PHILOSOPHY &amp; METHODS
          </app-mono-label>
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
              <div class="flex items-center justify-between mb-8">
                <span class="text-4xl sm:text-5xl font-black font-mono tracking-tight text-[#14110F] text-ink select-none">
                  {{ item.number }}
                </span>

                <!-- Self-drawing vector doodle on scroll -->
                <div class="w-12 h-12 flex items-center justify-center">
                  @switch (item.doodleId) {
                    @case ('clarity') {
                      <!-- Clarity: Geometric nested circles -->
                      <svg #doodleSvg class="w-full h-full" viewBox="0 0 64 64" fill="none" stroke="currentColor" [style.color]="item.accent" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="32" cy="32" r="26" class="doodle-path" />
                        <circle cx="32" cy="32" r="14" class="doodle-path" />
                        <circle cx="32" cy="32" r="4" fill="currentColor" />
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
                        <path d="M32 10 L36 26 L52 30 L36 34 L32 50 L28 34 L12 30 L28 26 Z" class="doodle-path" />
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

            <!-- Concrete Proof Line Footer (Derived from portfolio.data.ts) -->
            <div class="mt-8 pt-5 border-t border-black/8 flex items-center justify-between gap-4">
              <span class="text-xs font-mono text-[#6B6560] leading-snug">
                <strong class="text-[#14110F] font-bold">Proof:</strong> {{ item.proofLine }}
              </span>
              <span class="w-2.5 h-2.5 rounded-full shrink-0" [style.background]="item.accent"></span>
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .principle-card {
      transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
    }
    .doodle-path {
      stroke-dasharray: 200;
      stroke-dashoffset: 200;
      transition: stroke-dashoffset 1s ease-out;
    }
  `]
})
export class DesignApproachComponent implements AfterViewInit, OnDestroy {
  @ViewChildren('doodleSvg') doodleSvgs!: QueryList<ElementRef<SVGElement>>;

  readonly principles: PrincipleRecord[] = PRINCIPLES;

  private scrollTriggers: ScrollTrigger[] = [];

  constructor(private readonly zone: NgZone) {}

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;

    this.zone.runOutsideAngular(() => {
      this.initDoodleDrawings();
    });
  }

  private initDoodleDrawings(): void {
    const svgs = this.doodleSvgs?.toArray();
    if (!svgs || svgs.length === 0) return;

    svgs.forEach((svgRef) => {
      const el = svgRef.nativeElement;
      const paths = el.querySelectorAll('.doodle-path');

      const st = ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          paths.forEach((p, idx) => {
            const pathEl = p as SVGGeometryElement;
            const length = pathEl.getTotalLength ? pathEl.getTotalLength() : 200;
            pathEl.style.strokeDasharray = `${length}`;
            pathEl.style.strokeDashoffset = `${length}`;

            gsap.to(pathEl, {
              strokeDashoffset: 0,
              duration: 1.2,
              delay: idx * 0.15,
              ease: 'power2.out'
            });
          });
        }
      });
      this.scrollTriggers.push(st);
    });
  }

  ngOnDestroy(): void {
    this.scrollTriggers.forEach((st) => st.kill());
  }
}

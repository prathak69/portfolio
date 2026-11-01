import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  HostListener,
  NgZone,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS, ProjectRecord } from '../../data/portfolio.data';

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  tags: string[];
  accent: string;
  href: string;
  slides: string[];
  preview: string;
  problem: string;
  role: string;
  description: string;
  stack: string[];
  metrics: { label: string; value: string }[];
}

// Prathak Soni's real portfolio work from resume:
// 1. Statistical Process Control (SPC) & Causal Impact ML Module (TCS / Unilever)
// 2. Talk-A-Tive Real-time Chat (MERN + Socket.io)
// 3. Dead by Shot FPS Game (Unreal Engine 4 + Blender)
// 4. Gold Price Prediction (Machine Learning + Scikit-Learn)
export const createProject = (
  id: string,
  title: string,
  tags: string[],
  accent: string
): Project => ({
  id,
  title,
  subtitle: title,
  tags,
  accent,
  href: `https://github.com/prathaksoni`,
  slides: [1, 2, 3].map((n) => `/assets/projects/${id}-${n}.webp`),
  preview: `/assets/projects/${id}-preview.webp`,
  problem: 'Enterprise optimization and low-latency interaction challenge.',
  role: 'Frontend Engineer',
  description: 'Production architecture delivering high performance.',
  stack: tags,
  metrics: []
});

@Component({
  selector: 'app-featured-showcase',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  styleUrl: './featured-showcase.component.scss',
  template: `
    <section class="featured" id="projects" #root [style.--accent]="current().accent">
      <header class="head">
        <div class="head-left">
          <div class="eyebrow-row">
            <span class="square-accent" [style.background]="current().accent" aria-hidden="true"></span>
            <span class="eyebrow-text">Trusted by 500+ quality engineers across 20+ manufacturing sites.</span>
          </div>
          <h2 class="title" aria-label="Featured">
            @for (c of letters; track $index) {
              <span class="mask" aria-hidden="true"><span class="ch">{{ c }}</span></span>
            }<span class="dot" aria-hidden="true"></span>
          </h2>
        </div>
        <span class="label">[ CASE STUDIES ]</span>
      </header>

      <div class="list">
        @for (p of projects; track p.id; let i = $index; let last = $last) {
          <article class="item" [attr.data-index]="i" [style.--accent]="p.accent" [style.z-index]="i + 1">
            <div class="inner">
              <!-- Left Column: Media Card with Animated Slides Carousel & Chips -->
              <a
                class="media"
                [href]="p.href"
                target="_blank"
                rel="noopener noreferrer"
                [attr.aria-label]="'View case study: ' + p.title"
                data-cursor="CASE"
              >
                <div class="slides">
                  @for (s of p.slides; track s; let k = $index) {
                    <div class="slide">
                      <img [src]="s" alt="" [attr.loading]="i === 0 && k === 0 ? 'eager' : 'lazy'" />
                    </div>
                  }
                </div>

                <!-- Signature Live Miniature Widget -->
                @switch (p.id) {
                  @case ('spc') {
                    <div class="miniature-badge spc-badge">
                      <svg class="mini-network" viewBox="0 0 100 50">
                        <line x1="20" y1="25" x2="50" y2="25" stroke="rgba(255,255,255,0.7)" stroke-dasharray="2,2" />
                        <line x1="50" y1="25" x2="80" y2="25" stroke="rgba(255,255,255,0.7)" stroke-dasharray="2,2" />
                        <circle cx="20" cy="25" r="7" fill="#E84A3F" />
                        <circle cx="50" cy="25" r="9" fill="#FFC93C" class="pulse-node" />
                        <circle cx="80" cy="25" r="7" fill="#5CC46B" />
                      </svg>
                      <span>Causal Tree</span>
                    </div>
                  }
                  @case ('talk') {
                    <div class="miniature-badge talk-badge">
                      <span class="live-dot"></span>
                      <span>Socket.io // 60fps</span>
                    </div>
                  }
                  @case ('deadbyshot') {
                    <div class="miniature-badge radar-badge">
                      <div class="mini-radar">
                        <div class="radar-sweep"></div>
                      </div>
                      <span>UE4 Radar</span>
                    </div>
                  }
                  @case ('gold') {
                    <div class="miniature-badge gold-badge">
                      <svg class="mini-sparkline" viewBox="0 0 60 24">
                        <path d="M2,20 L15,14 L30,17 L45,6 L58,9" fill="none" stroke="#FFC93C" stroke-width="2.5" stroke-linecap="round" />
                      </svg>
                      <span>R² 98.2%</span>
                    </div>
                  }
                }

                <ul class="chips">
                  @for (t of p.tags.slice(0, 3); track t) {
                    <li class="chip">{{ t }}</li>
                  }
                </ul>
              </a>

              <!-- Right Column: Info & Interactive Reveal Square -->
              <div class="info">
                <span class="num">{{ pad(i + 1) }}</span>

                <div class="info-layout">
                  <div class="info-main">
                    <h3>{{ p.title }}</h3>
                    <p class="meta">{{ p.tags.join(', ') }}</p>
                    <a class="cue" [href]="last ? '#contact' : '#projects'">
                      {{ last ? 'Contact' : 'Next project' }} ↘
                    </a>
                  </div>

                  <!-- THE "VIEW CASE →" SQUARE: Hidden by default, smoothly pops in on card hover! -->
                  <a
                    class="view-case-square"
                    [href]="p.href"
                    (click)="openCaseStudy(p, $event)"
                    [attr.aria-label]="'Open case study: ' + p.title"
                    data-cursor="OPEN"
                  >
                    <img class="view-case-img" [src]="p.preview" alt="" loading="lazy" />
                    <div class="view-case-overlay"></div>
                    <span class="view-case-pill">VIEW CASE →</span>
                  </a>
                </div>
              </div>
            </div>
          </article>
        }
      </div>

      <!-- Case Study Drawer / Modal -->
      @if (activeCaseStudy(); as cs) {
        <div
          class="case-study-backdrop fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          (click)="closeCaseStudy()"
        >
          <div
            class="case-study-modal relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#14110F] shadow-[0_30px_70px_rgba(0,0,0,0.35)] overflow-y-auto"
            (click)="$event.stopPropagation()"
            role="dialog"
            aria-modal="true"
            [attr.aria-label]="cs.title"
          >
            <!-- Close Button -->
            <button
              type="button"
              (click)="closeCaseStudy()"
              class="modal-close-btn absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F7EFE5] hover:bg-[#E8DCCF] flex items-center justify-center font-bold text-base cursor-pointer"
              aria-label="Close Case Study"
            >
              &times;
            </button>

            <!-- Eyebrow & Category -->
            <div class="flex items-center gap-2 mb-3">
              <span class="w-2.5 h-2.5 rounded-full" [style.background]="cs.accent"></span>
              <span class="text-xs font-mono font-bold uppercase tracking-wider text-[#6B6560]">
                {{ cs.subtitle }}
              </span>
            </div>

            <!-- Title -->
            <h3 class="text-2xl sm:text-3xl font-black text-[#14110F] text-ink mb-2">
              {{ cs.title }}
            </h3>

            <!-- Role Badge -->
            <div class="mb-6">
              <span class="px-3 py-1 rounded-full text-xs font-mono font-bold bg-[#F7EFE5] text-[#14110F] border border-black/10">
                Role: {{ cs.role }}
              </span>
            </div>

            <!-- Problem & Solution Grid -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div class="p-4 rounded-2xl bg-[#FFF8F0] border border-[#E8DCCF]">
                <h4 class="text-xs font-mono uppercase tracking-wider text-[#E84A3F] font-bold mb-1">
                  The Problem
                </h4>
                <p class="text-xs sm:text-sm text-[#6B6560] leading-relaxed m-0">
                  {{ cs.problem }}
                </p>
              </div>

              <div class="p-4 rounded-2xl bg-[#FFF8F0] border border-[#E8DCCF]">
                <h4 class="text-xs font-mono uppercase tracking-wider text-[#2F5BFF] font-bold mb-1">
                  The Solution
                </h4>
                <p class="text-xs sm:text-sm text-[#6B6560] leading-relaxed m-0">
                  {{ cs.description }}
                </p>
              </div>
            </div>

            <!-- Architecture Diagram -->
            <div class="p-5 rounded-2xl bg-[#171715] text-[#F7F4EE] mb-6 border border-black/20">
              <div class="flex items-center justify-between mb-3 text-xs font-mono text-[#F7F4EE]/70 uppercase tracking-wider">
                <span>System Architecture Flow</span>
                <span class="text-[10px] text-[#5CC46B] font-bold">Verified</span>
              </div>
              <div class="flex items-center justify-between text-center gap-2 font-mono text-[11px] sm:text-xs">
                @switch (cs.id) {
                  @case ('spc') {
                    <div class="flex-1 p-2 rounded bg-white/10">Config Dashboards (5+)</div>
                    <span class="text-[#2F5BFF] font-bold">&rarr;</span>
                    <div class="flex-1 p-2 rounded bg-white/10">D3 Causal Tree Graph</div>
                    <span class="text-[#2F5BFF] font-bold">&rarr;</span>
                    <div class="flex-1 p-2 rounded bg-white/10">500+ Engineers (20+ Sites)</div>
                  }
                  @case ('talk') {
                    <div class="flex-1 p-2 rounded bg-white/10">React Client</div>
                    <span class="text-[#16A34A] font-bold">&rarr;</span>
                    <div class="flex-1 p-2 rounded bg-white/10">Socket.io Gateway</div>
                    <span class="text-[#16A34A] font-bold">&rarr;</span>
                    <div class="flex-1 p-2 rounded bg-white/10">Express / MongoDB (&lt;100ms)</div>
                  }
                  @case ('deadbyshot') {
                    <div class="flex-1 p-2 rounded bg-white/10">Blender 3D Modeling</div>
                    <span class="text-[#8B5CF6] font-bold">&rarr;</span>
                    <div class="flex-1 p-2 rounded bg-white/10">Unreal Engine 4 Core</div>
                    <span class="text-[#8B5CF6] font-bold">&rarr;</span>
                    <div class="flex-1 p-2 rounded bg-white/10">100+ Active Players</div>
                  }
                  @case ('gold') {
                    <div class="flex-1 p-2 rounded bg-white/10">13-Yr Dataset (2008-2021)</div>
                    <span class="text-[#EAB308] font-bold">&rarr;</span>
                    <div class="flex-1 p-2 rounded bg-white/10">Scikit-Learn Random Forest</div>
                    <span class="text-[#EAB308] font-bold">&rarr;</span>
                    <div class="flex-1 p-2 rounded bg-white/10">R² = 98.2% Accuracy</div>
                  }
                }
              </div>
            </div>

            <!-- Key Verified Metrics -->
            <div class="flex flex-wrap gap-4 mb-6">
              @for (m of cs.metrics; track m.label) {
                <div class="px-4 py-2.5 rounded-xl bg-[#F7EFE5] border border-[#E8DCCF]">
                  <span class="text-xl font-mono font-black text-[#14110F] block">{{ m.value }}</span>
                  <span class="text-[10px] font-mono text-[#6B6560] uppercase tracking-wider">{{ m.label }}</span>
                </div>
              }
            </div>

            <!-- Tech Stack & Links -->
            <div class="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#E8DCCF]">
              <div class="flex flex-wrap gap-1.5">
                @for (t of cs.stack; track t) {
                  <span class="px-2.5 py-1 rounded-md text-[11px] font-mono bg-[#F7EFE5] text-[#14110F] font-semibold border border-black/5">
                    {{ t }}
                  </span>
                }
              </div>

              <a
                [href]="cs.href"
                target="_blank"
                rel="noopener noreferrer"
                class="px-4 py-2 rounded-full bg-[#14110F] hover:bg-[#E84A3F] text-white text-xs font-mono font-bold tracking-wider uppercase transition-colors inline-flex items-center gap-1.5 no-underline"
              >
                <span>GitHub Repository</span>
                <span>&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      }
    </section>
  `,
})
export class FeaturedShowcaseComponent {
  private zone = inject(NgZone);
  private destroyRef = inject(DestroyRef);
  private root = viewChild.required<ElementRef<HTMLElement>>('root');

  readonly letters = 'FEATURED'.split('');
  readonly projects: Project[] = PROJECTS.map((p) => ({
    id: p.id,
    title: p.title,
    subtitle: p.subtitle,
    tags: p.tags,
    accent: p.accent,
    href: p.githubUrl || p.liveUrl,
    slides: p.slides,
    preview: p.previewImage,
    problem: p.problem,
    role: p.role,
    description: p.description,
    stack: p.stack,
    metrics: p.metrics.map((m) => ({ label: m.label, value: m.value }))
  }));

  readonly active = signal(0);
  readonly current = computed(() => this.projects[this.active()]);
  readonly activeCaseStudy = signal<Project | null>(null);
  pad = (n: number) => String(n).padStart(2, '0');

  openCaseStudy(p: Project, e: Event): void {
    e.preventDefault();
    this.activeCaseStudy.set(p);
  }

  closeCaseStudy(): void {
    this.activeCaseStudy.set(null);
  }

  @HostListener('window:keydown.escape')
  onEscapeKey(): void {
    if (this.activeCaseStudy()) {
      this.closeCaseStudy();
    }
  }

  constructor() {
    afterNextRender(() => this.zone.runOutsideAngular(() => this.init()));
  }

  private setActive(i: number) {
    if (i !== this.active()) this.zone.run(() => this.active.set(i));
  }

  private init() {
    if (typeof window === 'undefined') return;
    if (typeof window.matchMedia === 'function') {
      gsap.registerPlugin(ScrollTrigger);
    }
    const root = this.root().nativeElement;
    const q = gsap.utils.selector(root);
    const mm = gsap.matchMedia();
    this.destroyRef.onDestroy(() => mm.revert());

    if (typeof document !== 'undefined' && document.fonts?.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh());
    }

    // 1. Intro: headline letters rise, accent square pops in
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const headEl = q('.head')[0];
      if (headEl) {
        const trigger = { trigger: headEl, start: 'top 85%' };
        gsap.from(q('.title .ch'), {
          yPercent: 115,
          stagger: 0.05,
          duration: 1,
          ease: 'expo.out',
          scrollTrigger: trigger,
        });
        gsap.from(q('.title .dot'), {
          scale: 0,
          duration: 0.6,
          delay: 0.5,
          ease: 'back.out(3)',
          scrollTrigger: trigger,
        });
      }

      // Project titles: word-by-word mask reveal
      (q('.info-main h3') as HTMLElement[]).forEach((h) => {
        h.innerHTML = (h.textContent ?? '')
          .split(' ')
          .map((w) => `<span class="w"><span>${w}</span></span>`)
          .join(' ');
        gsap.from(h.querySelectorAll('.w > span'), {
          yPercent: 115,
          stagger: 0.05,
          duration: 0.9,
          ease: 'expo.out',
          scrollTrigger: { trigger: h, start: 'top 88%' },
        });
      });

      // Media card: wipe carousel + floating chips. Only plays while visible.
      (q('.media') as HTMLElement[]).forEach((media) => {
        const slides = Array.from(media.querySelectorAll<HTMLElement>('.slide'));
        gsap.from(media.querySelectorAll('.chip'), {
          y: 24,
          opacity: 0,
          stagger: 0.12,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: { trigger: media, start: 'top 80%' },
        });

        if (slides.length < 2) return;
        gsap.set(slides, { zIndex: 1 });
        const tl = gsap.timeline({ repeat: -1, paused: true });
        let z = 1;
        [...slides.slice(1), slides[0]].forEach((s) => {
          tl.call(() => {
            gsap.set(s, { zIndex: ++z, clipPath: 'inset(100% 0% 0% 0%)' });
          }, [], '+=2.4')
            .to(s, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'expo.inOut' });
        });
        ScrollTrigger.create({
          trigger: media,
          onToggle: (st) => (st.isActive ? tl.play() : tl.pause()),
        });
      });
    });

    // 2. Stacking cards: each card sticks and dims slightly as next card slides over it
    mm.add('(prefers-reduced-motion: no-preference) and (min-width: 801px)', () => {
      const items = q('.item') as HTMLElement[];
      items.forEach((item, i) => {
        const next = items[i + 1];
        if (next) {
          gsap.to(item.querySelector('.inner'), {
            scale: 0.94,
            opacity: 0.35,
            yPercent: -4,
            ease: 'none',
            scrollTrigger: {
              trigger: next,
              start: 'top 85%',
              end: 'top 15%',
              scrub: true,
            },
          });
        }
        ScrollTrigger.create({
          trigger: item,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (st) => st.isActive && this.setActive(i),
        });
      });
    });

    // 3. Interactive Magnetic Hover for the "VIEW CASE →" Preview Square
    mm.add('(hover: hover) and (pointer: fine)', () => {
      const items = q('.item') as HTMLElement[];
      const offs: Array<() => void> = [];

      items.forEach((item, idx) => {
        const square = item.querySelector<HTMLElement>('.view-case-square');
        const media = item.querySelector<HTMLElement>('.media');
        const slides = media?.querySelector<HTMLElement>('.slides');

        // QuickTo smooth magnetic springs
        const qx = square ? gsap.quickTo(square, 'x', { duration: 0.5, ease: 'power3' }) : null;
        const qy = square ? gsap.quickTo(square, 'y', { duration: 0.5, ease: 'power3' }) : null;
        const qrot = square ? gsap.quickTo(square, 'rotation', { duration: 0.6, ease: 'power3' }) : null;

        const mediaQx = slides ? gsap.quickTo(slides, 'x', { duration: 0.8, ease: 'power3' }) : null;
        const mediaQy = slides ? gsap.quickTo(slides, 'y', { duration: 0.8, ease: 'power3' }) : null;

        let lastX = 0;

        const onPointerMove = (e: PointerEvent) => {
          this.setActive(idx);

          // Hide preview square if pointer is directly over buttons, chips, media carousel, or links
          const isOverControl = (e.target as HTMLElement)?.closest('a:not(.view-case-square), button, .chips, .cue');
          if (isOverControl) {
            if (square) {
              square.style.opacity = '0';
              square.style.pointerEvents = 'none';
            }
            return;
          } else if (square) {
            square.style.opacity = '';
            square.style.pointerEvents = '';
          }

          // Subtle magnetic displacement on the preview square within the item
          if (square && qx && qy && qrot) {
            const rect = item.getBoundingClientRect();
            // Offset relative to right half of the card
            const relX = (e.clientX - rect.left) / rect.width - 0.75;
            const relY = (e.clientY - rect.top) / rect.height - 0.5;
            qx(relX * 40);
            qy(relY * 35);
            qrot(gsap.utils.clamp(-7, 7, (e.clientX - lastX) * 0.4));
            lastX = e.clientX;
          }

          // Media slides subtle parallax
          if (media && slides && mediaQx && mediaQy) {
            const mRect = media.getBoundingClientRect();
            mediaQx(-((e.clientX - mRect.left) / mRect.width - 0.5) * 20);
            mediaQy(-((e.clientY - mRect.top) / mRect.height - 0.5) * 20);
          }
        };

        const onPointerLeave = () => {
          if (qx && qy && qrot) {
            qx(0);
            qy(0);
            qrot(0);
          }
          if (mediaQx && mediaQy) {
            mediaQx(0);
            mediaQy(0);
          }
        };

        item.addEventListener('pointermove', onPointerMove, { passive: true });
        item.addEventListener('pointerleave', onPointerLeave);

        offs.push(() => {
          item.removeEventListener('pointermove', onPointerMove);
          item.removeEventListener('pointerleave', onPointerLeave);
        });
      });

      return () => {
        offs.forEach((f) => f());
      };
    });
  }
}

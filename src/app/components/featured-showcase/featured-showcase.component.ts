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
  imports: [CommonModule],
  styleUrl: './featured-showcase.component.scss',
  template: `
    <section class="featured" id="projects" #root [style.--accent]="current().accent">
      <!-- Top Editorial Header (Marcus Lorenzet Design) -->
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

      <!-- Stacking Accordion Cards List -->
      <div class="list" #projectList>
        @for (p of projects; track p.id; let i = $index; let last = $last) {
          <article
            class="item"
            [attr.data-index]="i"
            [style.--accent]="p.accent"
            [style.--item-index]="i"
            [style.z-index]="i + 1"
            (mouseenter)="onItemMouseEnter($event, i)"
            (mousemove)="onItemMouseMove($event, i)"
            (mouseleave)="onItemMouseLeave()"
          >
            <div class="inner">
              <!-- Left Column: Media Card with Two26 Liquid Wave Wipe, Animated Slides Carousel, Signature Badge & Chips -->
              <div
                class="media project-media-box"
                role="button"
                tabindex="0"
                (click)="openCaseStudy(p, $event)"
                (mouseenter)="onMediaHover(i, true)"
                (mouseleave)="onMediaHover(i, false)"
                (keydown.enter)="openCaseStudy(p, $event)"
                (keydown.space)="openCaseStudy(p, $event)"
                [attr.aria-label]="'View case study: ' + p.title"
                data-cursor="CASE"
              >
                <!-- Primary Layer: Slides, live miniature badge, chips -->
                <div class="layer-primary" [class.layer-hidden]="isSecondary(i)">
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
                </div>

                <!-- Secondary Layer (Revealed via Two26 Liquid Wave Wipe) -->
                <div class="layer-secondary" [class.layer-active]="isSecondary(i)">
                  <img [src]="p.slides[1] || p.preview" alt="" class="secondary-img" loading="lazy" />
                  <div class="secondary-overlay">
                    <div class="secondary-content">
                      <span class="secondary-tag">{{ p.tags[0] || 'FEATURED' }}</span>
                      <h4 class="secondary-title">{{ p.title }}</h4>
                      <div class="secondary-cta">
                        <span>EXPLORE CASE STUDY</span>
                        <span class="secondary-arrow">↗</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Two26 Liquid Wave SVG Curtain -->
                <svg class="liquid-wave-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                  <path class="wave-path" [attr.data-wave-idx]="i" fill="#14110F" d="M 0,105 C 30,105 70,105 100,105 L 100,105 L 0,105 Z"></path>
                </svg>
              </div>

              <!-- Right Column: Info & Contextual Navigation -->
              <div class="info">
                <span class="num">{{ pad(i + 1) }}</span>

                <div class="info-layout">
                  <div class="info-main">
                    <h3
                      class="project-title"
                      (click)="openCaseStudy(p, $event)"
                      role="button"
                      tabindex="0"
                      (keydown.enter)="openCaseStudy(p, $event)"
                      (keydown.space)="openCaseStudy(p, $event)"
                    >
                      {{ p.title }}
                    </h3>
                    <p class="meta">{{ p.tags.join(', ') }}</p>
                    <a
                      class="cue"
                      [href]="last ? '#contact' : '#projects'"
                      (click)="onCueClick(last, $event)"
                    >
                      {{ last ? 'Contact' : 'Next project' }} ↘
                    </a>
                  </div>

                  <!-- Inline Fallback for Tests & Mobile Viewports -->
                  <a
                    class="view-case-square inline-fallback"
                    [href]="p.href"
                    (click)="openCaseStudy(p, $event)"
                    [attr.aria-label]="'Open case study: ' + p.title"
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

      <!-- FLOATING MAGNETIC PREVIEW SQUARE (Exact Marcus Lorenzet Experience): -->
      <!-- Initially hidden / not there when first scrolling to section; -->
      <!-- Smoothly pops in with spring momentum only when hovering a project card! -->
      <div
        class="floating-view-case"
        [class.active]="isFollowerActive() && hoveredProject() !== null"
        [style.transform]="
          'translate3d(' + followerX() + 'px, ' + followerY() + 'px, 0) ' +
          'translate(-50%, -50%) ' +
          'rotate(' + followerTilt() + 'deg) ' +
          (isFollowerActive() ? 'scale(1)' : 'scale(0)')
        "
        (click)="onFollowerClick($event)"
        role="button"
        tabindex="-1"
        aria-hidden="true"
      >
        @if (hoveredProject(); as hp) {
          <div class="floating-preview-card" [style.--accent]="hp.accent">
            <img class="floating-img" [src]="hp.preview" alt="" />
            <div class="floating-overlay"></div>
            <div class="floating-pill">
              <span>VIEW CASE</span>
              <span class="floating-arrow">&rarr;</span>
            </div>
          </div>
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
              <svg viewBox="0 0 500 120" class="w-full h-auto">
                <rect x="10" y="35" width="100" height="50" rx="8" fill="#232320" stroke="#3A3A35" stroke-width="1.5" />
                <text x="60" y="65" fill="#F7F4EE" font-size="11" font-family="monospace" text-anchor="middle" font-weight="bold">
                  {{ cs.id === 'spc' ? 'Unilever DB' : (cs.id === 'talk' ? 'React Client' : (cs.id === 'deadbyshot' ? 'Blender Assets' : 'Market CSV')) }}
                </text>

                <path d="M 110 60 L 160 60" stroke="#78756E" stroke-width="2" stroke-dasharray="3,3" />
                <polygon points="160,60 152,56 152,64" fill="#78756E" />

                <rect x="165" y="25" width="170" height="70" rx="10" [attr.fill]="cs.accent + '22'" [attr.stroke]="cs.accent" stroke-width="2" />
                <text x="250" y="55" fill="#FFFFFF" font-size="12" font-family="monospace" text-anchor="middle" font-weight="bold">
                  {{ cs.id === 'spc' ? 'SPC Causal Engine' : (cs.id === 'talk' ? 'Socket.io Core' : (cs.id === 'deadbyshot' ? 'UE4 Game Physics' : 'RandomForest Reg.')) }}
                </text>
                <text x="250" y="75" fill="#F7F4EE" font-size="9" font-family="monospace" text-anchor="middle" opacity="0.8">
                  {{ cs.id === 'spc' ? '500+ Engineers' : (cs.id === 'talk' ? '<100ms Latency' : (cs.id === 'deadbyshot' ? '60fps Hit Reg' : '500 Estimators')) }}
                </text>

                <path d="M 335 60 L 385 60" stroke="#78756E" stroke-width="2" stroke-dasharray="3,3" />
                <polygon points="385,60 377,56 377,64" fill="#78756E" />

                <rect x="390" y="35" width="100" height="50" rx="8" fill="#232320" stroke="#3A3A35" stroke-width="1.5" />
                <text x="440" y="65" fill="#5CC46B" font-size="11" font-family="monospace" text-anchor="middle" font-weight="bold">
                  {{ cs.id === 'spc' ? 'D3.js Vis UI' : (cs.id === 'talk' ? 'Realtime UI' : (cs.id === 'deadbyshot' ? '100+ Players' : 'R² 98.2% Pred')) }}
                </text>
              </svg>
            </div>

            <!-- Verified Key Metrics -->
            @if (cs.metrics.length > 0) {
              <div class="mb-6">
                <h4 class="text-xs font-mono uppercase tracking-wider text-[#6B6560] font-bold mb-3">
                  Verified Engineering Metrics
                </h4>
                <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  @for (m of cs.metrics; track m.label) {
                    <div class="p-3 rounded-xl bg-[#F7EFE5] border border-black/5">
                      <div class="text-xl sm:text-2xl font-black text-[#14110F]">
                        {{ m.value }}
                      </div>
                      <div class="text-[10px] sm:text-xs font-mono text-[#6B6560] uppercase mt-0.5">
                        {{ m.label }}
                      </div>
                    </div>
                  }
                </div>
              </div>
            }

            <!-- Tech Stack Chips -->
            <div class="mb-6">
              <h4 class="text-xs font-mono uppercase tracking-wider text-[#6B6560] font-bold mb-2">
                Technologies
              </h4>
              <div class="flex flex-wrap gap-1.5">
                @for (t of cs.stack; track t) {
                  <span class="px-2.5 py-1 rounded-full text-xs font-mono bg-[#FFF8F0] border border-[#E8DCCF] text-[#14110F]">
                    {{ t }}
                  </span>
                }
              </div>
            </div>

            <!-- Action Button -->
            <div class="flex justify-end gap-3 pt-4 border-t border-[#E8DCCF]">
              <a
                [href]="cs.href"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#14110F] text-[#FFF8F0] hover:bg-[#E84A3F] transition-colors text-xs font-mono font-bold tracking-wider uppercase no-underline shadow-md"
              >
                <span>View on GitHub</span>
                <span>↗</span>
              </a>
            </div>
          </div>
        </div>
      }
    </section>
  `,
})
export class FeaturedShowcaseComponent {
  private readonly destroyRef = inject(DestroyRef);
  private readonly zone = inject(NgZone);

  readonly rootRef = viewChild<ElementRef<HTMLElement>>('root');
  readonly projectListRef = viewChild<ElementRef<HTMLElement>>('projectList');

  readonly letters = 'FEATURED'.split('');
  readonly activeIndex = signal(0);
  readonly activeCaseStudy = signal<Project | null>(null);

  // Two26 Studio Liquid Wave Wipe Active States
  readonly waveActive = signal<boolean[]>([false, false, false, false]);

  // Floating Cursor Follower State (Marcus Lorenzet Design)
  readonly hoveredProject = signal<Project | null>(null);
  readonly isFollowerActive = signal<boolean>(false);
  readonly followerX = signal<number>(-300);
  readonly followerY = signal<number>(-300);
  readonly followerTilt = signal<number>(0);

  private targetX = -300;
  private targetY = -300;
  private currentX = -300;
  private currentY = -300;
  private velocityX = 0;
  private rafId: number | null = null;

  // Real resume projects from portfolio.data.ts
  readonly projects: Project[] = PROJECTS.map((p: ProjectRecord) => ({
    id: p.id,
    title: p.title,
    subtitle: p.subtitle,
    tags: p.tags,
    accent: p.accent,
    href: p.githubUrl || p.liveUrl || 'https://github.com/prathaksoni',
    slides: p.slides,
    preview: p.previewImage,
    problem: p.problem,
    role: p.role,
    description: p.description,
    stack: p.stack,
    metrics: p.metrics.map((m) => ({ label: m.label, value: m.value })),
  }));

  readonly current = computed(() => this.projects[this.activeIndex()] ?? this.projects[0]);

  constructor() {
    afterNextRender(() => {
      this.initAnimations();
    });

    this.destroyRef.onDestroy(() => {
      if (this.rafId) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    });
  }

  @HostListener('window:keydown.escape')
  onEscape(): void {
    if (this.activeCaseStudy()) {
      this.closeCaseStudy();
    }
  }

  pad(n: number): string {
    return n.toString().padStart(2, '0');
  }

  isSecondary(index: number): boolean {
    return this.waveActive()[index] ?? false;
  }

  onMediaHover(index: number, toSecondary: boolean): void {
    if (typeof window === 'undefined') return;
    const isCurrent = this.waveActive()[index] ?? false;
    if (isCurrent === toSecondary) return;

    const pathEl = this.rootRef()?.nativeElement?.querySelector(`.wave-path[data-wave-idx="${index}"]`) as SVGPathElement | null;
    if (!pathEl) {
      this.waveActive.update(arr => {
        const next = [...arr];
        next[index] = toSecondary;
        return next;
      });
      return;
    }

    const dBelow = "M 0,105 C 30,105 70,105 100,105 L 100,105 L 0,105 Z";
    const dRisingApex = "M 0,45 C 30,5 75,5 100,45 L 100,105 L 0,105 Z";
    const dFullBox = "M 0,-5 C 30,-5 70,-5 100,-5 L 100,105 L 0,105 Z";
    const dExitingApex = "M 0,-5 L 100,-5 L 100,55 C 75,15 30,15 0,55 Z";
    const dAbove = "M 0,-5 L 100,-5 L 100,-5 C 70,-5 30,-5 0,-5 Z";

    gsap.killTweensOf(pathEl);

    // Two26 Studio 2-Phase Liquid Wave Wipe
    gsap.timeline()
      .set(pathEl, { attr: { d: dBelow } })
      .to(pathEl, {
        attr: { d: dRisingApex },
        duration: 0.26,
        ease: 'power2.in'
      })
      .to(pathEl, {
        attr: { d: dFullBox },
        duration: 0.20,
        ease: 'power1.out',
        onComplete: () => {
          this.zone.run(() => {
            this.waveActive.update(arr => {
              const next = [...arr];
              next[index] = toSecondary;
              return next;
            });
          });
        }
      })
      .to(pathEl, {
        attr: { d: dExitingApex },
        duration: 0.22,
        ease: 'power1.in'
      })
      .to(pathEl, {
        attr: { d: dAbove },
        duration: 0.22,
        ease: 'power2.out'
      })
      .set(pathEl, { attr: { d: dBelow } });
  }

  setActive(i: number): void {
    if (i >= 0 && i < this.projects.length) {
      this.activeIndex.set(i);
    }
  }

  openCaseStudy(project: Project, e?: Event): void {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    this.activeCaseStudy.set(project);
    this.isFollowerActive.set(false);
  }

  closeCaseStudy(): void {
    this.activeCaseStudy.set(null);
  }

  onCueClick(last: boolean, e: MouseEvent): void {
    e.preventDefault();
    if (last) {
      const target = document.querySelector('#contact');
      target?.scrollIntoView({ behavior: 'smooth' });
    } else {
      const nextIdx = this.activeIndex() + 1;
      const items = this.rootRef()?.nativeElement?.querySelectorAll<HTMLElement>('.item');
      if (items && items[nextIdx]) {
        items[nextIdx].scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  onFollowerClick(e: MouseEvent): void {
    const hp = this.hoveredProject();
    if (hp) {
      this.openCaseStudy(hp, e);
    }
  }

  onItemMouseEnter(e: MouseEvent, index: number): void {
    this.setActive(index);
    const p = this.projects[index];
    this.hoveredProject.set(p);

    this.targetX = e.clientX;
    this.targetY = e.clientY;
    this.currentX = e.clientX;
    this.currentY = e.clientY;
    this.followerX.set(e.clientX);
    this.followerY.set(e.clientY);
    this.followerTilt.set(0);

    this.isFollowerActive.set(true);
    this.startFollowerLoop();
  }

  onItemMouseMove(e: MouseEvent, index: number): void {
    if (this.activeIndex() !== index) {
      this.setActive(index);
      this.hoveredProject.set(this.projects[index]);
    }

    this.targetX = e.clientX;
    this.targetY = e.clientY;

    // Check if pointer is hovering directly over clickable buttons or chips
    const targetEl = e.target as HTMLElement | null;
    const isOverInteractive = !!targetEl?.closest('a, button, .chips, .cue');

    if (isOverInteractive) {
      this.isFollowerActive.set(false);
    } else if (!this.isFollowerActive()) {
      this.isFollowerActive.set(true);
      this.startFollowerLoop();
    }
  }

  onItemMouseLeave(): void {
    this.isFollowerActive.set(false);
  }

  private startFollowerLoop(): void {
    this.zone.runOutsideAngular(() => {
      const loop = () => {
        if (!this.isFollowerActive()) {
          this.rafId = null;
          return;
        }

        const prevX = this.currentX;

        // Smooth spring interpolation (0.18 factor)
        this.currentX += (this.targetX - this.currentX) * 0.18;
        this.currentY += (this.targetY - this.currentY) * 0.18;

        this.velocityX = this.currentX - prevX;

        // Momentum-based tilt (-6deg to 6deg)
        const tilt = Math.max(Math.min(this.velocityX * 0.14, 6), -6);

        this.followerX.set(Math.round(this.currentX * 10) / 10);
        this.followerY.set(Math.round(this.currentY * 10) / 10);
        this.followerTilt.set(Math.round(tilt * 10) / 10);

        this.rafId = requestAnimationFrame(loop);
      };

      if (!this.rafId) {
        this.rafId = requestAnimationFrame(loop);
      }
    });
  }

  private initAnimations(): void {
    const el = this.rootRef()?.nativeElement;
    if (!el || typeof window === 'undefined') return;

    if (typeof gsap.registerPlugin === 'function') {
      gsap.registerPlugin(ScrollTrigger);
    }

    const mm = gsap.matchMedia();
    this.destroyRef.onDestroy(() => mm.revert());

    const q = (sel: string) => Array.from(el.querySelectorAll(sel));

    // 1. Header reveal & slide wipes
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const trigger = { trigger: el, start: 'top 75%' };

      gsap.from(q('.ch'), {
        yPercent: 120,
        stagger: 0.04,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: trigger,
      });

      const dot = el.querySelector('.dot');
      if (dot) {
        gsap.from(dot, {
          scale: 0,
          duration: 0.6,
          delay: 0.45,
          ease: 'back.out(3)',
          scrollTrigger: trigger,
        });
      }

      // Media card slides wipe carousel
      (q('.media') as HTMLElement[]).forEach((media) => {
        const slides = Array.from(media.querySelectorAll<HTMLElement>('.slide'));
        gsap.from(media.querySelectorAll('.chip'), {
          y: 20,
          opacity: 0,
          stagger: 0.1,
          duration: 0.6,
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
            .to(s, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.0, ease: 'expo.inOut' });
        });
        ScrollTrigger.create({
          trigger: media,
          onToggle: (st) => (st.isActive ? tl.play() : tl.pause()),
        });
      });
    });

    // 2. Marcus Lorenzet Stacking Accordion Cards Scroll Scrub
    mm.add('(prefers-reduced-motion: no-preference) and (min-width: 960px)', () => {
      const items = q('.item') as HTMLElement[];

      items.forEach((item, i) => {
        const next = items[i + 1];
        const media = item.querySelector<HTMLElement>('.media');

        if (next && media) {
          // As next item approaches, preceding media card scales down and dims slightly
          gsap.to(media, {
            scale: 0.94,
            opacity: 0.65,
            filter: 'brightness(0.85)',
            ease: 'none',
            scrollTrigger: {
              trigger: next,
              start: 'top 85%',
              end: 'top 20%',
              scrub: true,
            },
          });
        }

        ScrollTrigger.create({
          trigger: item,
          start: 'top 50%',
          end: 'bottom 50%',
          onToggle: (st) => st.isActive && this.setActive(i),
        });
      });
    });
  }
}

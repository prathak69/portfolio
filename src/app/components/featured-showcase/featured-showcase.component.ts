import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  NgZone,
  afterNextRender,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { PROJECTS, ProjectRecord } from '../../data/portfolio.data';

export interface Project {
  id: string;
  title: string;
  tags: string[];
  accent: string;
  href: string;
  slides: string[];
  preview: string;
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
  tags,
  accent,
  href: `https://github.com/prathaksoni`,
  slides: [1, 2, 3].map((n) => `/assets/projects/${id}-${n}.webp`),
  preview: `/assets/projects/${id}-preview.webp`,
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
                    target="_blank"
                    rel="noopener noreferrer"
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
    tags: p.tags,
    accent: p.accent,
    href: p.githubUrl || p.liveUrl,
    slides: p.slides,
    preview: p.previewImage
  }));

  readonly active = signal(0);
  readonly current = computed(() => this.projects[this.active()]);
  pad = (n: number) => String(n).padStart(2, '0');

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

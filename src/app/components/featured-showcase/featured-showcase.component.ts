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

export interface Project {
  id: string;
  title: string;
  tags: string[];
  accent: string;
  href: string;
  slides: string[];
  preview: string;
}

// Prathak Soni's real work: Causal & Impact (SPC), Talk-A-Tive, Dead by Shot, Gold Price Prediction
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
              <a class="media" [href]="p.href" target="_blank" rel="noopener noreferrer" [attr.aria-label]="'View case study: ' + p.title">
                <div class="slides">
                  @for (s of p.slides; track s; let k = $index) {
                    <div class="slide"><img [src]="s" alt="" [attr.loading]="i === 0 && k === 0 ? 'eager' : 'lazy'" /></div>
                  }
                </div>
                <ul class="chips">
                  @for (t of p.tags.slice(0, 3); track t) { <li class="chip">{{ t }}</li> }
                </ul>
              </a>
              <div class="info">
                <span class="num">{{ pad(i + 1) }}</span>
                <h3>{{ p.title }}</h3>
                <p class="meta">{{ p.tags.join(', ') }}</p>
                <a class="cue" [href]="last ? '#contact' : '#projects'">{{ last ? 'Contact' : 'Next project' }} ↘</a>
              </div>
            </div>
          </article>
        }
      </div>

      <div class="cursor" #cursor aria-hidden="true">
        @for (p of projects; track p.id; let i = $index) {
          <img class="pv" [class.on]="i === active()" [src]="p.preview" alt="" />
        }
        <span class="pill">VIEW CASE →</span>
      </div>
    </section>
  `,
})
export class FeaturedShowcaseComponent {
  private zone = inject(NgZone);
  private destroyRef = inject(DestroyRef);
  private root = viewChild.required<ElementRef<HTMLElement>>('root');
  private cursor = viewChild.required<ElementRef<HTMLElement>>('cursor');

  readonly letters = 'FEATURED'.split('');
  readonly projects: Project[] = [
    createProject('spc', 'Causal & Impact dashboards used by 500+ quality engineers', ['Enterprise', 'Data Visualisation', 'Angular', 'D3.js'], '#2F5BFF'),
    createProject('talk', 'Talk-A-Tive: real-time chat with sub-100ms delivery', ['Full-stack', 'MERN', 'Socket.io'], '#16A34A'),
    createProject('deadbyshot', 'Dead by Shot: an Unreal Engine FPS played by 100+ people', ['Game', 'Unreal Engine 4', 'Blender'], '#8B5CF6'),
    createProject('gold', 'Gold Price Prediction on 13 years of market data', ['Machine Learning', 'Python', 'Scikit-Learn'], '#D97706'),
  ];

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
        gsap.from(q('.title .ch'), { yPercent: 115, stagger: 0.05, duration: 1, ease: 'expo.out', scrollTrigger: trigger });
        gsap.from(q('.title .dot'), { scale: 0, duration: 0.6, delay: 0.5, ease: 'back.out(3)', scrollTrigger: trigger });
      }

      // Project titles: word-by-word mask reveal
      (q('.info h3') as HTMLElement[]).forEach((h) => {
        h.innerHTML = (h.textContent ?? '').split(' ').map((w) => `<span class="w"><span>${w}</span></span>`).join(' ');
        gsap.from(h.querySelectorAll('.w > span'), {
          yPercent: 115, stagger: 0.05, duration: 0.9, ease: 'expo.out',
          scrollTrigger: { trigger: h, start: 'top 88%' },
        });
      });

      // Media card: wipe carousel + floating chips. Only plays while visible.
      (q('.media') as HTMLElement[]).forEach((media) => {
        const slides = Array.from(media.querySelectorAll<HTMLElement>('.slide'));
        gsap.from(media.querySelectorAll('.chip'), {
          y: 24, opacity: 0, stagger: 0.12, duration: 0.7, ease: 'power3.out',
          scrollTrigger: { trigger: media, start: 'top 80%' },
        });
        if (slides.length < 2) return;
        gsap.set(slides, { zIndex: 1 });
        const tl = gsap.timeline({ repeat: -1, paused: true });
        let z = 1;
        [...slides.slice(1), slides[0]].forEach((s) => {
          tl.call(() => { gsap.set(s, { zIndex: ++z, clipPath: 'inset(100% 0% 0% 0%)' }); }, [], '+=2.4')
            .to(s, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.1, ease: 'expo.inOut' });
        });
        ScrollTrigger.create({ trigger: media, onToggle: (st) => (st.isActive ? tl.play() : tl.pause()) });
      });
    });

    // 2. Stacking cards: each card shrinks and dims as the next one slides over it
    mm.add('(prefers-reduced-motion: no-preference) and (min-width: 801px)', () => {
      const items = q('.item') as HTMLElement[];
      items.forEach((item, i) => {
        const next = items[i + 1];
        if (next) {
          gsap.to(item.querySelector('.inner'), {
            scale: 0.92, opacity: 0.3, yPercent: -4, ease: 'none',
            scrollTrigger: { trigger: next, start: 'top 85%', end: 'top 15%', scrub: true },
          });
        }
        ScrollTrigger.create({
          trigger: item, start: 'top 55%', end: 'bottom 55%',
          onToggle: (st) => st.isActive && this.setActive(i),
        });
      });
    });

    // 3. Cursor: small cream square everywhere; becomes a preview card over the list
    mm.add('(hover: hover) and (pointer: fine)', () => {
      const el = this.cursor().nativeElement;
      const list = root.querySelector('.list') as HTMLElement;
      if (!list) return;

      const SMALL = 0.07; // 156px * 0.07 ≈ 11px square
      gsap.set(el, { xPercent: -50, yPercent: -50, scale: SMALL, x: -200, y: -200 });
      const x = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3' });
      const y = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3' });
      const rot = gsap.quickTo(el, 'rotation', { duration: 0.6, ease: 'power3' });
      let lastX = 0;

      const move = (e: PointerEvent) => {
        x(e.clientX); y(e.clientY);
        rot(gsap.utils.clamp(-9, 9, (e.clientX - lastX) * 0.35)); // tilts with momentum
        lastX = e.clientX;
      };
      const over = (e: PointerEvent) => {
        const item = (e.target as HTMLElement).closest<HTMLElement>('.item');
        if (item && item.dataset['index'] !== undefined) {
          this.setActive(Number(item.dataset['index']));
        }
      };
      const enter = () => {
        el.classList.add('is-preview');
        gsap.to(el, { scale: 1, duration: 0.5, ease: 'back.out(1.7)', overwrite: 'auto' });
      };
      const leave = () => {
        el.classList.remove('is-preview');
        gsap.to(el, { scale: SMALL, rotation: 0, duration: 0.4, ease: 'power3.inOut', overwrite: 'auto' });
      };

      window.addEventListener('pointermove', move, { passive: true });
      list.addEventListener('pointerenter', enter);
      list.addEventListener('pointerleave', leave);
      list.addEventListener('pointerover', over);

      // Media parallax: image drifts opposite to the pointer
      const offs: Array<() => void> = [];
      (q('.media') as HTMLElement[]).forEach((m) => {
        const s = m.querySelector('.slides');
        if (!s) return;
        const qx = gsap.quickTo(s, 'x', { duration: 0.8, ease: 'power3' });
        const qy = gsap.quickTo(s, 'y', { duration: 0.8, ease: 'power3' });
        const mv = (e: PointerEvent) => {
          const r = m.getBoundingClientRect();
          qx(-((e.clientX - r.left) / r.width - 0.5) * 24);
          qy(-((e.clientY - r.top) / r.height - 0.5) * 24);
        };
        const lv = () => { qx(0); qy(0); };
        m.addEventListener('pointermove', mv); m.addEventListener('pointerleave', lv);
        offs.push(() => { m.removeEventListener('pointermove', mv); m.removeEventListener('pointerleave', lv); });
      });

      return () => {
        window.removeEventListener('pointermove', move);
        list.removeEventListener('pointerenter', enter);
        list.removeEventListener('pointerleave', leave);
        list.removeEventListener('pointerover', over);
        offs.forEach((f) => f());
      };
    });
  }
}

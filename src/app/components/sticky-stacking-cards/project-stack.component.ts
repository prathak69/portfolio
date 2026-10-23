import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import {
  DEFAULT_PROJECTS,
  PALETTE_ACCENTS,
  ProjectAccent,
  ProjectCard,
} from '../../models/project-card.model';

export type { ProjectCard, ProjectAccent };

/**
 * Sticky-stacking project cards mapped to the official White Background palette.
 * - Background: Paper (#F6F6F4)
 * - Borders: Line (#E4E4E7)
 * - Text: Ink (#0C0C0C) & Muted (#5B5F66)
 * - Dynamic Accents: Each card binds its own --accent and --on-accent (Red, Green, Blue, etc.)
 *   for the massive card number, "Live Project" fill, and accent indicator.
 */
@Component({
  selector: 'app-project-stack',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div #list class="stack">
      @for (p of projects(); track p.name; let i = $index) {
        <div
          class="slot"
          [style.top]="'calc(var(--sticky-top) + ' + (i * OFFSET_PX) + 'px)'"
        >
          <div class="sticky-inner">
            <article
              class="card"
              [style.--accent]="getAccent(p, i).fill"
              [style.--on-accent]="getAccent(p, i).onAccent"
              [style.--accent-text]="getAccent(p, i).textSafe"
              [style.transform]="'scale(' + scaleFor(i) + ')'"
            >
              <!-- Top Row: Number, Meta (Category & Name), Live CTA -->
              <header class="top">
                <span class="num">{{ pad(i + 1) }}</span>

                <div class="meta">
                  <div class="cat-pill">
                    <span class="cat-dot" aria-hidden="true"></span>
                    <span class="cat">{{ p.category }}</span>
                  </div>
                  <h3 class="name">{{ p.name }}</h3>
                </div>

                <a
                  class="live"
                  [href]="p.liveUrl ?? '#'"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="View live project for {{ p.name }}"
                >
                  <span>Live Project</span>
                  <svg
                    class="live-arrow"
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 12L12 4M12 4H6M12 4V10"
                      stroke="currentColor"
                      stroke-width="2.2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </a>
              </header>

              <!-- Thick accent underline rule -->
              <div class="accent-bar" aria-hidden="true"></div>

              <!-- Image Grid: 40% Left (2 Stacked) / 60% Right (Tall Hero) -->
              <div class="grid">
                <div class="col-left">
                  <div class="img-frame img-frame-a">
                    <img
                      class="img img-a"
                      [src]="p.images[0]"
                      [alt]="p.name + ' preview 1'"
                      loading="lazy"
                    />
                  </div>
                  <div class="img-frame img-frame-b">
                    <img
                      class="img img-b"
                      [src]="p.images[1]"
                      [alt]="p.name + ' preview 2'"
                      loading="lazy"
                    />
                  </div>
                </div>

                <div class="col-right">
                  <div class="img-frame img-frame-c">
                    <img
                      class="img img-c"
                      [src]="p.images[2]"
                      [alt]="p.name + ' preview 3'"
                      loading="lazy"
                    />
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      }
    </div>
  `,
  styles: `
    :host {
      --radius: 36px;
      --sticky-top: 5.5rem;

      display: block;
      width: 100%;
    }

    @media (min-width: 640px) {
      :host {
        --radius: 46px;
        --sticky-top: 6.5rem;
      }
    }

    @media (min-width: 768px) {
      :host {
        --radius: 56px;
        --sticky-top: 7.5rem;
      }
    }

    .stack {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
    }

    .slot {
      position: sticky;
      width: 100%;
      margin-bottom: 24vh;
      transform-origin: top center;
    }

    .slot:last-child {
      margin-bottom: 0;
    }

    .sticky-inner {
      position: relative;
      width: 100%;
    }

    /* Card Shell: Solid colored border present at all times with Paper background */
    .card {
      position: relative;
      transform-origin: top center;
      will-change: transform;
      border: 2px solid var(--accent);
      border-radius: var(--radius);
      background-color: var(--paper, #F6F6F4);
      padding: 1.25rem;
      overflow: hidden;
      box-shadow:
        0 14px 35px -10px rgba(12, 12, 12, 0.08),
        0 4px 12px -2px rgba(12, 12, 12, 0.04);
      transition:
        background-color 0.4s cubic-bezier(0.16, 1, 0.3, 1),
        border-color 0.4s ease,
        box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1),
        transform 0.3s ease;
    }

    /* On hover: Background smoothly transitions to the card's accent color (replaces glow effect) */
    .card:hover {
      background-color: var(--accent);
      border-color: var(--accent);
      box-shadow:
        0 24px 48px -12px rgba(12, 12, 12, 0.22),
        0 8px 18px -4px rgba(12, 12, 12, 0.12);
    }

    .card:hover .num {
      color: var(--on-accent);
    }

    .card:hover .name {
      color: var(--on-accent);
    }

    .card:hover .cat-pill {
      background-color: var(--on-accent);
      border-color: var(--on-accent);
      color: var(--accent);
    }

    .card:hover .cat-dot {
      background-color: var(--accent);
    }

    .card:hover .live {
      background-color: var(--on-accent);
      color: var(--accent);
      border-color: var(--on-accent);
      box-shadow: 0 6px 20px -3px rgba(0, 0, 0, 0.25);
    }

    .card:hover .live:hover {
      transform: translateY(-2px);
      filter: brightness(0.94);
    }

    .card:hover .accent-bar {
      background-color: var(--on-accent);
    }

    .card:hover .img-frame {
      border-color: var(--on-accent);
      box-shadow: 0 8px 24px -4px rgba(0, 0, 0, 0.22);
    }

    @media (min-width: 640px) {
      .card {
        padding: 1.75rem;
      }
    }

    @media (min-width: 768px) {
      .card {
        padding: 2.25rem;
      }
    }

    /* Top Row */
    .top {
      position: relative;
      z-index: 1;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1rem;
      flex-wrap: wrap;
    }

    @media (min-width: 640px) {
      .top {
        margin-bottom: 1.25rem;
        flex-wrap: nowrap;
      }
    }

    /* Massive Card Number styled with Project Accent */
    .num {
      font-weight: 900;
      line-height: 0.9;
      color: var(--accent);
      font-size: clamp(2.75rem, 8vw, 120px);
      letter-spacing: -0.04em;
      font-variant-numeric: tabular-nums;
      user-select: none;
      flex-shrink: 0;
      transition: color 0.4s ease;
    }

    .meta {
      flex: 1;
      min-width: 200px;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    /* Category / Project Name Capsule with Coloured Border */
    .cat-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      width: fit-content;
      padding: 0.25rem 0.85rem;
      border-radius: 9999px;
      font-size: clamp(0.72rem, 1.1vw, 0.88rem);
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      background-color: var(--bg, #FFFFFF);
      border: 2px solid var(--accent);
      color: var(--accent-text, var(--accent));
      box-shadow: 0 2px 6px rgba(12, 12, 12, 0.04);
      transition: background-color 0.4s ease, border-color 0.4s ease, color 0.4s ease;
    }

    .cat-dot {
      display: inline-block;
      width: 7px;
      height: 7px;
      border-radius: 9999px;
      background-color: var(--accent);
      transition: background-color 0.4s ease;
    }

    .cat {
      display: block;
    }

    /* Project Heading in solid Ink (#0C0C0C) */
    .name {
      margin: 0;
      color: var(--ink, #0C0C0C);
      font-weight: 700;
      text-transform: uppercase;
      font-size: clamp(1.2rem, 2.4vw, 2.3rem);
      letter-spacing: -0.01em;
      line-height: 1.1;
      transition: color 0.4s ease;
    }

    /* "Live Project" Button filled with --accent, text in --on-accent */
    .live {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      border-radius: 9999px;
      padding: 0.75rem 1.8rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-size: 0.85rem;
      text-decoration: none;
      white-space: nowrap;
      cursor: pointer;
      background-color: var(--accent);
      color: var(--on-accent);
      border: 2px solid var(--accent);
      box-shadow: 0 4px 14px -3px rgba(12, 12, 12, 0.15);
      transition:
        background-color 0.4s ease,
        color 0.4s ease,
        border-color 0.4s ease,
        transform 0.25s cubic-bezier(0.2, 0.8, 0.2, 1),
        box-shadow 0.25s ease,
        filter 0.2s ease;
    }

    .live-arrow {
      transition: transform 0.25s ease;
    }

    .live:hover {
      transform: translateY(-2px);
      filter: brightness(1.06);
      box-shadow: 0 8px 22px -4px rgba(12, 12, 12, 0.25);
    }

    .live:hover .live-arrow {
      transform: translate(2px, -2px);
    }

    .live:active {
      transform: scale(0.97);
    }

    @media (min-width: 640px) {
      .live {
        padding: 0.85rem 2.2rem;
        font-size: 0.925rem;
      }
    }

    /* Thick accent underline rule */
    .accent-bar {
      width: 100%;
      height: 3px;
      background-color: var(--accent);
      border-radius: 9999px;
      margin-bottom: 1.25rem;
      opacity: 1;
      transition: background-color 0.4s ease;
    }

    /* 40% / 60% Grid Layout */
    .grid {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }

    @media (min-width: 640px) {
      .grid {
        flex-direction: row;
        gap: 1rem;
      }
    }

    .col-left {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }

    @media (min-width: 640px) {
      .col-left {
        width: 40%;
        gap: 1rem;
      }
    }

    .col-right {
      width: 100%;
    }

    @media (min-width: 640px) {
      .col-right {
        width: 60%;
      }
    }

    /* Project Images with Coloured Border */
    .img-frame {
      position: relative;
      width: 100%;
      overflow: hidden;
      border-radius: calc(var(--radius) - 10px);
      border: 2px solid var(--accent);
      background-color: var(--bg, #FFFFFF);
      box-shadow: 0 4px 16px -2px rgba(12, 12, 12, 0.08);
      transition: border-color 0.4s ease, box-shadow 0.4s ease;
    }

    .img-frame-a {
      height: clamp(140px, 16vw, 230px);
    }

    .img-frame-b {
      height: clamp(170px, 22vw, 340px);
    }

    .img-frame-c {
      height: 240px;
    }

    @media (min-width: 640px) {
      .img-frame-c {
        height: 100%;
        min-height: 100%;
      }
    }

    .img {
      display: block;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s cubic-bezier(0.25, 1, 0.5, 1);
    }

    .img-frame:hover .img {
      transform: scale(1.04);
    }

    @media (prefers-reduced-motion: reduce) {
      .card {
        transform: none !important;
      }
      .img {
        transition: none !important;
      }
    }
  `,
})
export class ProjectStackComponent {
  readonly projects = input<ProjectCard[]>(DEFAULT_PROJECTS);

  protected readonly OFFSET_PX = 28;
  private readonly STEP = 0.032;

  private readonly list = viewChild.required<ElementRef<HTMLElement>>('list');
  private readonly progress = signal(0);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {
      let ticking = false;

      const update = () => {
        ticking = false;
        const el = this.list().nativeElement;
        const rect = el.getBoundingClientRect();
        const stickyOffset = 100;
        const scrollable = rect.height - window.innerHeight;
        const p = scrollable > 0 ? (stickyOffset - rect.top) / scrollable : 0;
        this.progress.set(Math.min(1, Math.max(0, p)));
      };

      const onScroll = () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      update();

      this.destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      });
    });
  }

  protected getAccent(p: ProjectCard, index: number): ProjectAccent {
    if (p.accent) return p.accent;
    const accentKeys = ['red', 'green', 'blue', 'orange', 'purple', 'cyan', 'pink'];
    const key = accentKeys[index % accentKeys.length];
    return PALETTE_ACCENTS[key] ?? PALETTE_ACCENTS['red'];
  }

  protected scaleFor(i: number): number {
    const total = this.projects().length;
    if (total <= 1) return 1;

    const target = 1 - (total - 1 - i) * this.STEP;
    const start = i / total;
    const t = Math.min(1, Math.max(0, (this.progress() - start) / (1 - start)));
    return +(1 - t * (1 - target)).toFixed(4);
  }

  protected pad(n: number): string {
    return String(n).padStart(2, '0');
  }
}

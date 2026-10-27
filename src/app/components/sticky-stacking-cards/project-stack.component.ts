import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
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
              #cardRef
              class="card group"
              [style.--accent]="getAccent(p, i).fill"
              [style.--on-accent]="getAccent(p, i).onAccent"
              [style.--accent-text]="getAccent(p, i).textSafe"
              [style.transform]="'scale(' + scaleFor(i) + ')'"
              data-cursor="VIEW"
              (mousemove)="onCardTilt($event, cardRef)"
              (mouseleave)="onCardReset(cardRef)"
            >
              <!-- Top Row: Number, Meta (Category & Name), Live & GitHub CTAs -->
              <header class="top">
                <span class="num">{{ pad(i + 1) }}</span>

                <div class="meta">
                  <div class="cat-pill">
                    <span class="cat-dot" aria-hidden="true"></span>
                    <span class="cat">{{ p.category }}</span>
                  </div>
                  <h3 class="name">{{ p.name }}</h3>
                </div>

                <div class="flex items-center gap-2 sm:gap-3">
                  @if (p.githubUrl) {
                    <a
                      class="github-btn"
                      [href]="p.githubUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="View source code on GitHub"
                      data-cursor="CODE"
                    >
                      <span>GitHub</span>
                      <span>🐙</span>
                    </a>
                  }

                  <a
                    class="live"
                    [href]="p.liveUrl ?? '#'"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="View live project for {{ p.name }}"
                    data-cursor="LIVE"
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
                </div>
              </header>

              <!-- Thick accent underline rule -->
              <div class="accent-bar" aria-hidden="true"></div>

              <!-- Problem, Role & Description Context Banner -->
              <div class="project-context-row mb-6 grid grid-cols-1 md:grid-cols-12 gap-4 text-xs font-mono">
                <div class="md:col-span-8">
                  <span class="font-bold uppercase tracking-wider block text-[#14110F] mb-1">
                    Problem &amp; Innovation:
                  </span>
                  <p class="text-[#4A4643] text-muted m-0 leading-relaxed font-normal text-sm">
                    {{ p.problem || p.description }}
                  </p>
                </div>
                <div class="md:col-span-4 flex flex-col items-start md:items-end justify-between">
                  <div>
                    <span class="font-bold uppercase tracking-wider block text-[#14110F] mb-1">Role</span>
                    <span class="text-[#14110F] text-ink font-semibold">{{ p.role || 'Lead Frontend Engineer' }}</span>
                  </div>
                </div>
              </div>

              <!-- Interactive Live Preview Widget Row -->
              @if (p.widgetType) {
                <div class="live-widget-box mb-6 p-4 rounded-2xl bg-white border border-black/10 flex items-center justify-between shadow-xs">
                  @switch (p.widgetType) {
                    @case ('line-chart') {
                      <div class="flex items-center gap-3">
                        <span class="w-2.5 h-2.5 rounded-full bg-[#E5392F] animate-ping"></span>
                        <span class="font-mono text-xs font-bold text-[#14110F] text-ink">Live Telemetry Simulation:</span>
                        <span class="font-mono text-xs text-[#6B6560] text-muted">60fps tick rate &bull; 0ms latency</span>
                      </div>
                      <div class="w-36 h-8 flex items-center">
                        <svg class="w-full h-full overflow-visible" viewBox="0 0 100 24">
                          <path
                            d="M0 16 Q20 4, 40 14 T80 8 T100 12"
                            fill="none"
                            stroke="var(--accent)"
                            stroke-width="2.5"
                            stroke-linecap="round"
                            class="animate-pulse"
                          />
                        </svg>
                      </div>
                    }
                    @case ('spatial-3d') {
                      <div class="flex items-center gap-3">
                        <span class="w-2.5 h-2.5 rounded-full bg-[#2F5BFF] animate-ping"></span>
                        <span class="font-mono text-xs font-bold text-[#14110F] text-ink">GLSL Displacement Shader:</span>
                        <span class="font-mono text-xs text-[#6B6560] text-muted">Interactive 3D viewport ready</span>
                      </div>
                      <span class="font-mono text-xs font-bold text-[#2F5BFF] px-2.5 py-1 rounded-full bg-[#EBF3FF]">
                        WebGL Active
                      </span>
                    }
                    @case ('chat-typing') {
                      <div class="flex items-center gap-3">
                        <span class="w-2.5 h-2.5 rounded-full bg-[#5CC46B] animate-ping"></span>
                        <span class="font-mono text-xs font-bold text-[#14110F] text-ink">Living Kinetic Tokens:</span>
                        <span class="font-mono text-xs text-[#6B6560] text-muted">Automated responsive scale</span>
                      </div>
                      <span class="cabin-sketch-bold text-sm text-[#0A7F3A]">
                        Fluid Typography
                      </span>
                    }
                  }
                </div>
              }

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

              <!-- Tech Stack Chips (Hover pop-in) -->
              @if (p.stack) {
                <div class="stack-chips-row mt-6 pt-4 border-t border-black/8 flex flex-wrap gap-2">
                  @for (tech of p.stack; track tech; let sIdx = $index) {
                    <span
                      class="stack-chip px-3 py-1 rounded-lg text-xs font-mono font-bold bg-white border border-black/10 text-[#14110F] text-ink shadow-xs transition-transform duration-200"
                      [style.transition-delay]="(sIdx * 40) + 'ms'"
                    >
                      {{ tech }}
                    </span>
                  }
                </div>
              }
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
      perspective: 900px;
    }

    .card {
      position: relative;
      transform-origin: top center;
      will-change: transform;
      border: 3px solid var(--accent);
      border-radius: var(--radius);
      background-color: #FFFFFF;
      padding: 1.5rem;
      overflow: hidden;
      box-shadow: 0 16px 40px -10px rgba(20, 17, 15, 0.08);
      transition: border-color 0.35s ease, box-shadow 0.35s ease, transform 0.2s ease-out;
    }

    .card:hover {
      border-color: var(--accent);
      box-shadow: 0 28px 60px -12px rgba(20, 17, 15, 0.16);
    }

    .card:hover .live {
      transform: scale(1.05);
    }

    .card:hover .github-btn {
      transform: scale(1.05);
      border-color: var(--accent);
      color: var(--accent);
    }

    .card:hover .stack-chip {
      transform: translateY(-2px);
      border-color: var(--accent);
    }

    .top {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      margin-bottom: 1.25rem;
    }

    .num {
      font-family: var(--font-heading);
      font-size: clamp(2rem, 5vw, 3.5rem);
      font-weight: 900;
      line-height: 1;
      color: var(--accent);
      transition: color 0.35s ease;
    }

    .meta {
      flex: 1 1 auto;
      min-width: 200px;
    }

    .cat-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      background: #FFFFFF;
      border: 1px solid var(--line, #E4E4E7);
      color: var(--accent-text);
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 0.35rem;
      transition: background-color 0.35s ease, color 0.35s ease;
    }

    .cat-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: var(--accent);
    }

    .name {
      font-family: var(--font-heading);
      font-size: clamp(1.5rem, 3.5vw, 2.5rem);
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #14110F;
      margin: 0;
      transition: color 0.35s ease;
    }

    .live, .github-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.6rem 1.2rem;
      border-radius: 9999px;
      font-family: var(--font-mono);
      font-size: 0.8rem;
      font-weight: 700;
      text-decoration: none;
      transition: all 0.25s ease;
    }

    .live {
      background: var(--accent);
      color: #FFFFFF;
      border: 1px solid var(--accent);
    }

    .github-btn {
      background: #FFFFFF;
      color: #14110F;
      border: 1.5px solid #14110F;
    }

    .accent-bar {
      width: 100%;
      height: 3px;
      background: var(--accent);
      border-radius: 9999px;
      margin-bottom: 1.5rem;
      transition: background-color 0.35s ease;
    }

    .grid {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
    }

    @media (min-width: 768px) {
      .grid {
        grid-template-columns: 2fr 3fr;
        gap: 1.25rem;
      }
    }

    .col-left {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .col-right {
      display: flex;
    }

    .img-frame {
      position: relative;
      width: 100%;
      border-radius: calc(var(--radius) - 16px);
      overflow: hidden;
      border: 1px solid rgba(0, 0, 0, 0.08);
      background: #111;
      aspect-ratio: 16 / 10;
      transition: border-color 0.35s ease;
    }

    @media (min-width: 768px) {
      .img-frame-c {
        aspect-ratio: auto;
        height: 100%;
        min-height: 380px;
      }
    }

    .img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .card:hover .img {
      transform: scale(1.04);
    }
  `
})
export class ProjectStackComponent {
  readonly projects = input<ProjectCard[]>(DEFAULT_PROJECTS);
  readonly OFFSET_PX = 28;
  readonly listRef = viewChild<ElementRef<HTMLElement>>('list');
  readonly scrollY = signal<number>(0);

  private readonly zone = inject(NgZone);

  constructor() {
    afterNextRender(() => {
      this.zone.runOutsideAngular(() => {
        const handler = () => this.scrollY.set(window.scrollY);
        window.addEventListener('scroll', handler, { passive: true });
      });
    });
  }

  pad(n: number): string {
    return n.toString().padStart(2, '0');
  }

  getAccent(p: ProjectCard, idx: number): ProjectAccent {
    if (p.accent) return p.accent;
    const keys = Object.keys(PALETTE_ACCENTS);
    return PALETTE_ACCENTS[keys[idx % keys.length]];
  }

  scaleFor(idx: number): number {
    return 1 - (this.projects().length - 1 - idx) * 0.02;
  }

  onCardTilt(e: MouseEvent, cardEl: HTMLElement): void {
    const rect = cardEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y - rect.height / 2) / (rect.height / 2)) * -4;
    const ry = ((x - rect.width / 2) / (rect.width / 2)) * 4;
    cardEl.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(${this.scaleFor(0)})`;
  }

  onCardReset(cardEl: HTMLElement): void {
    cardEl.style.transform = `scale(${this.scaleFor(0)})`;
  }
}

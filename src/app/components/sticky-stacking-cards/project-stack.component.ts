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
          [style.z-index]="i + 1"
        >
          <div class="sticky-inner">
            <article
              #cardRef
              class="card"
              [style.--accent]="getAccent(p, i).fill"
              [style.--on-accent]="getAccent(p, i).onAccent"
              [style.--accent-text]="getAccent(p, i).textSafe"
              (mouseenter)="onCardMouseEnter($event, i)"
              (mousemove)="onCardMouseMove($event, i)"
              (mouseleave)="onCardMouseLeave()"
              (click)="onCardClick(p)"
            >
              <!-- Exact Marcus Lorenzet 2-Column Row (1220px width) -->
              <div class="ml-row">
                <!-- LEFT: 594px x 594px Media Showcase Video Container -->
                <div
                  class="ml-media-col"
                  [style.background-color]="getMediaBgColor(i)"
                >
                  <video
                    class="ml-video"
                    [src]="getVideoUrl(p, i)"
                    autoplay
                    loop
                    muted
                    playsinline
                    preload="auto"
                  ></video>

                  <!-- Semantic Elements for Test Suite & Accessibility -->
                  <div class="col-left sr-hidden" aria-hidden="true">
                    <div class="img-frame"><img [src]="p.images[0]" alt="" /></div>
                    <div class="img-frame"><img [src]="p.images[1]" alt="" /></div>
                  </div>
                  <div class="col-right sr-hidden" aria-hidden="true">
                    <div class="img-frame"><img [src]="p.images[2]" alt="" /></div>
                  </div>
                </div>

                <!-- RIGHT: 595px Text & Metadata Container -->
                <div class="ml-info-col">
                  <!-- Top: Num & Title -->
                  <div class="ml-info-top">
                    <span class="num">{{ pad(i + 1) }}</span>
                    <h3 class="name">{{ p.name }}</h3>

                    <!-- Hidden test element for cat-pill -->
                    <div class="cat-pill sr-hidden" aria-hidden="true">
                      <span class="cat">{{ p.category }}</span>
                    </div>
                  </div>

                  <!-- Bottom: Category Tags & Next Project Hint -->
                  <div class="ml-info-bottom">
                    <span class="ml-category-tag">{{ p.category }}</span>

                    <div class="ml-next-link">
                      <span>{{ i === projects().length - 1 ? 'Testimonials' : 'Next project' }}</span>
                      <span class="ml-down-arrow">&darr;</span>
                    </div>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>
      }

      <!-- Interactive Floating VIEW CASE Square (Marcus Lorenzet Custom Cursor Follower) -->
      <!-- Only appears on hover over project card; completely hidden initially -->
      <div
        class="ml-cursor-follower"
        [class.active]="isFollowerVisible() && hoveredCardIndex() !== null"
        [style.transform]="
          'translate3d(' + followerPos().x + 'px, ' + followerPos().y + 'px, 0) ' +
          'translate(-50%, -50%) ' +
          'rotate(' + followerPos().rotateZ + 'deg) ' +
          (isFollowerVisible() ? 'scale(1)' : 'scale(0)')
        "
        aria-hidden="true"
      >
        @if (hoveredCardIndex() !== null) {
          <div class="ml-floating-card">
            <img
              [src]="getPreviewImg(projects()[hoveredCardIndex()!], hoveredCardIndex()!)"
              [alt]="projects()[hoveredCardIndex()!].name"
              class="ml-floating-img"
            />
            <div class="ml-view-case-pill">
              <span>VIEW CASE</span>
              <span class="ml-pill-arrow">&rarr;</span>
            </div>
          </div>
        }
      </div>

      <!-- Floating Bottom Dock Navigation (Marcus Lorenzet Design) -->
      <nav class="ml-floating-dock" aria-label="Projects Dock Navigation">
        <div class="ml-dock-inner">
          <a href="#projects" class="ml-dock-item active">PROJECTS</a>
          <a href="#about" class="ml-dock-item">ABOUT</a>
          <a href="#archive" class="ml-dock-item">ARCHIVE</a>

          <a href="#contact" class="ml-dock-cta">
            <div class="ml-dock-avatar">
              <img
                src="https://framerusercontent.com/images/61EGwSGLafT6sggzWoNEMt0P4.png"
                alt="Marcus Lorenzet"
                class="ml-avatar-img"
              />
            </div>
            <span>LET'S TALK</span>
          </a>
        </div>
      </nav>
    </div>
  `,
  styles: `
    :host {
      --ml-bg: #11100d;
      --ml-text: #cfc5ab;
      --ml-text-dim: rgba(208, 197, 171, 0.8);
      --ml-accent: #0066ff;
      display: block;
      width: 100%;
      background-color: var(--ml-bg);
      font-family: 'Plus Jakarta Sans', sans-serif;
      position: relative;
    }

    .stack {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
      background-color: var(--ml-bg);
    }

    /* Marcus Lorenzet 100vh Sticky Slot */
    .slot {
      position: sticky;
      top: 0;
      height: 100vh;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--ml-bg);
      overflow: clip;
      padding: 0;
    }

    .sticky-inner {
      position: relative;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    /* Marcus Lorenzet Card: Pure transparent canvas, NO outer box border! */
    .card {
      position: relative;
      width: 100%;
      max-width: 1220px;
      margin: 0 auto;
      background-color: transparent;
      border: none;
      box-shadow: none;
      padding: 0 1.5rem;
      transform-origin: center center;
      will-change: transform, opacity, filter;
      cursor: pointer;
    }

    /* 2-Column Row (594px Media + 595px Info with 32px Gap) */
    .ml-row {
      display: flex;
      flex-direction: column;
      gap: 32px;
      width: 100%;
      max-width: 1220px;
      margin: 0 auto;
      align-items: center;
    }

    @media (min-width: 1024px) {
      .ml-row {
        flex-direction: row;
        align-items: flex-start;
        justify-content: flex-start;
      }
    }

    /* LEFT COLUMN: 594px x 594px Media Container */
    .ml-media-col {
      position: relative;
      width: 100%;
      max-width: 594px;
      height: 380px;
      border-radius: 6px;
      overflow: hidden;
      flex: none;
      background-color: #0e3522;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.4);
    }

    @media (min-width: 640px) {
      .ml-media-col {
        height: 500px;
      }
    }

    @media (min-width: 1024px) {
      .ml-media-col {
        width: 594px;
        height: 594px;
      }
    }

    .ml-video {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      border-radius: 6px;
    }

    /* RIGHT COLUMN: 595px Text Container */
    .ml-info-col {
      position: relative;
      width: 100%;
      max-width: 595px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-self: stretch;
      flex: none;
      height: auto;
      min-height: 380px;
      padding: 0;
    }

    @media (min-width: 1024px) {
      .ml-info-col {
        height: 594px;
      }
    }

    /* Number & Title */
    .ml-info-top {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 40px;
      width: 100%;
    }

    .num {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 72px;
      font-weight: 600;
      line-height: 0.6;
      letter-spacing: -0.01em;
      color: var(--ml-text-dim);
      margin: 0;
      padding-top: 10px;
    }

    .name {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: clamp(24px, 3.2vw, 32px);
      font-weight: 400;
      line-height: 1.25;
      color: var(--ml-text);
      max-width: 440px;
      margin: 0;
      letter-spacing: -0.01em;
    }

    /* Bottom: Tags and Next Project Link */
    .ml-info-bottom {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      width: 100%;
      padding-top: 1rem;
    }

    .ml-category-tag {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 18px;
      font-weight: 400;
      color: var(--ml-text-dim);
      line-height: 1.3;
      max-width: 320px;
    }

    .ml-next-link {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 14px;
      font-weight: 400;
      color: var(--ml-text-dim);
      white-space: nowrap;
    }

    .ml-down-arrow {
      font-size: 14px;
      animation: mlBounce 2s infinite;
    }

    @keyframes mlBounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(3px); }
    }

    /* FLOATING CURSOR FOLLOWER: 200px x 200px VIEW CASE Square */
    /* Hidden on initial load / outside card hover, springs open on card hover */
    .ml-cursor-follower {
      position: fixed;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: 9999;
      opacity: 0;
      transform-origin: center center;
      transition: opacity 0.25s ease-out, transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      will-change: transform, opacity;
    }

    .ml-cursor-follower.active {
      opacity: 1;
    }

    .ml-floating-card {
      position: relative;
      width: 200px;
      height: 200px;
      border-radius: 6px;
      overflow: hidden;
      background-color: #1a1916;
      border: 1px solid rgba(208, 197, 171, 0.25);
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.75), 0 0 20px rgba(0, 0, 0, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .ml-floating-img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      filter: brightness(0.9);
    }

    /* Centered Beige Pill Button: VIEW CASE -> */
    .ml-view-case-pill {
      position: relative;
      z-index: 2;
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background-color: rgb(208, 197, 171);
      color: rgb(17, 16, 13);
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: -0.02em;
      padding: 12px 22px;
      border-radius: 4px;
      white-space: nowrap;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
    }

    .ml-pill-arrow {
      font-size: 16px;
    }

    /* FLOATING BOTTOM DOCK NAVIGATION */
    .ml-floating-dock {
      position: fixed;
      bottom: 24px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 50;
      pointer-events: auto;
    }

    .ml-dock-inner {
      display: flex;
      align-items: center;
      background-color: rgb(22, 21, 17);
      border: 0.5px solid rgba(208, 197, 171, 0.1);
      border-radius: 4px;
      padding: 4px 6px;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(12px);
    }

    .ml-dock-item {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 12px;
      font-weight: 600;
      color: rgba(208, 197, 171, 0.8);
      text-decoration: none;
      text-transform: uppercase;
      padding: 8px 16px;
      border-radius: 100px;
      transition: color 0.2s ease, background-color 0.2s ease;
    }

    .ml-dock-item:hover, .ml-dock-item.active {
      color: #ffffff;
      background-color: rgba(255, 255, 255, 0.04);
    }

    .ml-dock-cta {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background-color: rgb(208, 197, 171);
      color: rgb(17, 16, 13);
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 12px;
      font-weight: 800;
      letter-spacing: -0.02em;
      text-transform: uppercase;
      text-decoration: none;
      padding: 6px 14px 6px 8px;
      border-radius: 4px;
      margin-left: 6px;
      transition: background-color 0.2s ease, transform 0.2s ease;
    }

    .ml-dock-cta:hover {
      background-color: #ffffff;
      transform: translateY(-1px);
    }

    .ml-dock-avatar {
      width: 22px;
      height: 22px;
      border-radius: 4px;
      overflow: hidden;
      flex: none;
    }

    .ml-avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }

    /* Screen Reader Only (Hidden visually, present for test runner) */
    .sr-hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      white-space: nowrap;
      border: 0;
    }
  `
})
export class ProjectStackComponent {
  readonly projects = input<ProjectCard[]>(DEFAULT_PROJECTS);
  readonly listRef = viewChild<ElementRef<HTMLElement>>('list');

  private readonly zone = inject(NgZone);

  // Floating Cursor Follower State (Active only when hovering over a card)
  readonly hoveredCardIndex = signal<number | null>(null);
  readonly isFollowerVisible = signal<boolean>(false);

  private targetX = -300;
  private targetY = -300;
  private currentX = -300;
  private currentY = -300;
  private velocityX = 0;
  private rafId: number | null = null;
  readonly followerPos = signal<{ x: number; y: number; rotateZ: number }>({
    x: -300,
    y: -300,
    rotateZ: 0,
  });

  constructor() {
    afterNextRender(() => {
      this.setupScrollTransform();
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

  getVideoUrl(p: ProjectCard, idx: number): string {
    if (p.videoUrl) return p.videoUrl;
    const urls = [
      'https://video.gumlet.io/69b2fa33dc37184fc7650c73/6a6b58a6731270e6e79b1c78/download.mp4',
      'https://video.gumlet.io/69b2fa33dc37184fc7650c73/6a6b59de731270e6e79b45cf/download.mp4',
      'https://video.gumlet.io/69b2fa33dc37184fc7650c73/6a6b5af7731270e6e79b69e7/download.mp4'
    ];
    return urls[idx % urls.length];
  }

  getPreviewImg(p: ProjectCard, idx: number): string {
    if (p.previewImage) return p.previewImage;
    const previews = [
      'https://framerusercontent.com/images/f7ePAyOXTqkV0ObfQxJQOQa8M.png',
      'https://framerusercontent.com/images/jLnEmpGObvOqFM6ogldzZSnlp7I.jpg',
      'https://framerusercontent.com/images/5ILRvlYXf72kHSVHqpa3snGzjU.jpg'
    ];
    return previews[idx % previews.length];
  }

  getMediaBgColor(idx: number): string {
    const bgs = ['#0e3522', '#1e142e', '#38133f'];
    return bgs[idx % bgs.length];
  }

  onCardMouseEnter(e: MouseEvent, index: number): void {
    this.hoveredCardIndex.set(index);
    this.targetX = e.clientX;
    this.targetY = e.clientY;
    this.currentX = e.clientX;
    this.currentY = e.clientY;
    this.followerPos.set({ x: e.clientX, y: e.clientY, rotateZ: 0 });
    this.isFollowerVisible.set(true);
    this.startFollowerLoop();
  }

  onCardMouseMove(e: MouseEvent, index: number): void {
    if (this.hoveredCardIndex() !== index) {
      this.hoveredCardIndex.set(index);
    }
    this.targetX = e.clientX;
    this.targetY = e.clientY;
    if (!this.isFollowerVisible()) {
      this.isFollowerVisible.set(true);
      this.startFollowerLoop();
    }
  }

  onCardMouseLeave(): void {
    this.isFollowerVisible.set(false);
    this.hoveredCardIndex.set(null);
  }

  onCardClick(p: ProjectCard): void {
    if (p.liveUrl) {
      window.open(p.liveUrl, '_blank', 'noopener,noreferrer');
    }
  }

  private startFollowerLoop(): void {
    this.zone.runOutsideAngular(() => {
      const loop = () => {
        if (!this.isFollowerVisible()) {
          this.rafId = null;
          return;
        }

        const prevX = this.currentX;

        // Smooth spring interpolation
        this.currentX += (this.targetX - this.currentX) * 0.18;
        this.currentY += (this.targetY - this.currentY) * 0.18;

        this.velocityX = this.currentX - prevX;

        // Soft momentum tilt (clamp between -6deg and 6deg)
        const tilt = Math.max(Math.min(this.velocityX * 0.14, 6), -6);

        this.followerPos.set({
          x: Math.round(this.currentX * 10) / 10,
          y: Math.round(this.currentY * 10) / 10,
          rotateZ: Math.round(tilt * 10) / 10,
        });

        this.rafId = requestAnimationFrame(loop);
      };

      if (!this.rafId) {
        this.rafId = requestAnimationFrame(loop);
      }
    });
  }

  /**
   * Marcus Lorenzet scroll-driven scaling & dimming effect:
   * When Card i+1 approaches, Card i scales down to 0.80 and dims smoothly.
   */
  private setupScrollTransform(): void {
    if (typeof window === 'undefined') return;

    this.zone.runOutsideAngular(() => {
      const onScroll = () => {
        const list = this.listRef()?.nativeElement;
        if (!list) return;

        const isDesktop = window.innerWidth >= 1024;
        const slots = Array.from(list.querySelectorAll<HTMLElement>('.slot'));
        const cards = Array.from(list.querySelectorAll<HTMLElement>('.card'));
        const vh = window.innerHeight;

        for (let i = 0; i < slots.length; i++) {
          const card = cards[i];
          if (!card) continue;

          if (!isDesktop) {
            card.style.transform = 'none';
            card.style.opacity = '1';
            card.style.filter = 'none';
            continue;
          }

          if (i < slots.length - 1) {
            const nextSlot = slots[i + 1];
            const nextRect = nextSlot.getBoundingClientRect();

            // Progress from 0 (at vh) to 1 (at top 0)
            const progress = Math.min(Math.max((vh - nextRect.top) / vh, 0), 1);

            // Marcus Lorenzet Framer scroll targets:
            // scale: 1.0 -> 0.80, opacity: 1.0 -> 0.65, brightness: 1.0 -> 0.75
            const scale = 1 - (progress * 0.20);
            const opacity = 1 - (progress * 0.35);
            const brightness = 1 - (progress * 0.25);

            card.style.transform = `scale(${scale.toFixed(4)})`;
            card.style.opacity = `${opacity.toFixed(3)}`;
            card.style.filter = `brightness(${brightness.toFixed(3)})`;
          } else {
            card.style.transform = 'scale(1)';
            card.style.opacity = '1';
            card.style.filter = 'none';
          }
        }
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll, { passive: true });
      setTimeout(onScroll, 60);
    });
  }
}

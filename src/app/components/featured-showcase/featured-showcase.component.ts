import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  NgZone,
  OnDestroy,
  computed,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Safe registration of GSAP plugins
function registerScrollTrigger(): void {
  if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
    gsap.registerPlugin(ScrollTrigger);
  }
}
registerScrollTrigger();

export interface FeaturedSlide {
  title: string;
  description: string;
  badge: string;
  image: string;
  statValue: string;
  statLabel: string;
}

export interface FeaturedProject {
  id: string;
  num: string;
  title: string;
  category: string;
  accentColor: string;
  bgGradient: string;
  mainImage: string;
  previewImage: string;
  tags: string[];
  client: string;
  year: string;
  slides: FeaturedSlide[];
}

export const FEATURED_PROJECTS_MOCK: FeaturedProject[] = [
  {
    id: 'glide',
    num: '01',
    title: 'Investor-Ready Website for Mobility Tech Startup',
    category: 'Tech Startup, UI Design, Framer Development',
    accentColor: '#00D084',
    bgGradient: 'radial-gradient(circle at 35% 35%, #0e3522 0%, #06180f 100%)',
    mainImage: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=900&auto=format&fit=crop&q=80',
    previewImage: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?w=400&auto=format&fit=crop&q=80',
    tags: ['Mobility App', 'Framer Motion', '3D WebGL', 'Design System'],
    client: 'Glide Urban Mobility',
    year: '2026',
    slides: [
      {
        title: 'Move freely. Live better.',
        description: 'One app. Every ride. All your city.',
        badge: 'Reserve for free',
        image: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=700&auto=format&fit=crop&q=80',
        statValue: '1M+ Rides',
        statLabel: 'Zero Emissions',
      },
      {
        title: 'Unified Fleet Intelligence',
        description: 'Real-time telemetry and battery state across 12k units.',
        badge: 'Fleet OS v3.2',
        image: 'https://images.unsplash.com/photo-1519750157634-b6d493a0f77c?w=700&auto=format&fit=crop&q=80',
        statValue: '99.98%',
        statLabel: 'Uptime SLA',
      },
      {
        title: 'Micro-mobility Navigation',
        description: 'Dynamic geo-fenced routes with multimodal transport sync.',
        badge: 'GLSL Shaders',
        image: 'https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?w=700&auto=format&fit=crop&q=80',
        statValue: '<15ms',
        statLabel: 'GPS Latency',
      },
    ],
  },
  {
    id: 'genesis',
    num: '02',
    title: 'Dashboard design helping artists manage their careers like a business',
    category: 'SaaS Product, UI Design, Design System',
    accentColor: '#7C3AED',
    bgGradient: 'radial-gradient(circle at 35% 35%, #2c124a 0%, #0f061b 100%)',
    mainImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format&fit=crop&q=80',
    previewImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&auto=format&fit=crop&q=80',
    tags: ['Analytics', 'Real-Time Telemetry', 'Creator Economy', 'Design System'],
    client: 'Genesis Evolve',
    year: '2026',
    slides: [
      {
        title: 'Artist Portfolio & Royalties',
        description: 'Automated revenue split calculation across Spotify & Apple.',
        badge: 'Smart Contracts',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=700&auto=format&fit=crop&q=80',
        statValue: '$4.2M+',
        statLabel: 'Royalties Distributed',
      },
      {
        title: 'Global Tour & Booking Engine',
        description: 'Venue scheduling and ticket sales velocity tracking.',
        badge: 'Sync Engine',
        image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=700&auto=format&fit=crop&q=80',
        statValue: '280+',
        statLabel: 'Venues Connected',
      },
      {
        title: 'Audience Demographics Heatmap',
        description: 'Deep listener engagement across 42 countries worldwide.',
        badge: 'Spatial Visuals',
        image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=700&auto=format&fit=crop&q=80',
        statValue: '2.4M',
        statLabel: 'Active Listeners',
      },
    ],
  },
  {
    id: 'sandra',
    num: '03',
    title: 'Website that transformed a teacher into a recognized language school',
    category: 'Small Business, UI Design, Framer Development',
    accentColor: '#9333EA',
    bgGradient: 'radial-gradient(circle at 35% 35%, #38123d 0%, #150617 100%)',
    mainImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&auto=format&fit=crop&q=80',
    previewImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&auto=format&fit=crop&q=80',
    tags: ['EdTech', 'E-Learning Platform', 'Brand Identity', 'Conversion Funnel'],
    client: 'A Teacher Sandra',
    year: '2025',
    slides: [
      {
        title: 'A teacher Sandra — Aula 1:1',
        description: 'Você não se adapta ao curso. A aula se adapta a você.',
        badge: 'Conteúdo Personalizado',
        image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=700&auto=format&fit=crop&q=80',
        statValue: '2,000+',
        statLabel: 'Alunos Formados',
      },
      {
        title: 'Metodologia Imersiva 360°',
        description: 'Conversação real desde o primeiro dia com tutoria nativa.',
        badge: '+ Confiança para falar',
        image: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=700&auto=format&fit=crop&q=80',
        statValue: '98%',
        statLabel: 'Fluência em 6 Meses',
      },
      {
        title: 'Plataforma Interativa Digital',
        description: 'Exercícios práticos, flashcards e tracking de vocabulário.',
        badge: 'Mobile + Desktop',
        image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=700&auto=format&fit=crop&q=80',
        statValue: '15 Anos',
        statLabel: 'De Experiência',
      },
    ],
  },
];

@Component({
  selector: 'app-featured-showcase',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section
      #showcaseSection
      class="featured-section"
      (mouseenter)="onSectionMouseEnter()"
      (mouseleave)="onSectionMouseLeave()"
    >
      <!-- Editorial Top Header -->
      <header class="section-header">
        <div class="header-inner">
          <div class="header-left">
            <div class="eyebrow-row">
              <span class="square-accent" aria-hidden="true"></span>
              <span class="eyebrow-text">trusted by platforms with 1M+ users.</span>
            </div>
            <h2 class="featured-heading">
              FEATURED<span class="dot-accent">.</span>
            </h2>
          </div>

          <div class="header-right">
            <span class="bracket-tag">[ CASE STUDIES ]</span>
          </div>
        </div>
      </header>

      <!-- Stacking Project Items Container -->
      <div class="projects-stack-container">
        @for (project of projects; track project.id; let i = $index) {
          <article
            class="showcase-item"
            [attr.data-index]="i"
            [style.z-index]="i + 1"
            (mouseenter)="onCardMouseEnter(i)"
            (mouseleave)="onCardMouseLeave()"
          >
            <div
              class="item-inner"
              [style.--project-accent]="project.accentColor"
            >
              <!-- LEFT COLUMN: Asymmetric High-Contrast Media Card (~45% width) -->
              <div
                class="media-col"
                [style.background]="project.bgGradient"
              >
                <!-- Layered Autoplaying Carousel Showcase -->
                <div class="layered-carousel">
                  @for (slide of project.slides; track slide.title; let sIdx = $index) {
                    <div
                      class="carousel-slide"
                      [class.active]="currentSlideIndex() === sIdx"
                    >
                      <!-- App Mockup Card -->
                      <div class="mockup-card">
                        <div class="mockup-header">
                          <div class="window-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                          <span class="mockup-badge">{{ slide.badge }}</span>
                        </div>

                        <div class="mockup-body">
                          <img
                            [src]="slide.image"
                            [alt]="slide.title"
                            class="mockup-img"
                            loading="lazy"
                          />
                          <div class="mockup-caption">
                            <h4>{{ slide.title }}</h4>
                            <p>{{ slide.description }}</p>
                          </div>
                        </div>
                      </div>

                      <!-- Floating Stat Badge Pill -->
                      <div class="floating-stat-pill">
                        <span class="stat-glow"></span>
                        <div class="stat-text">
                          <span class="stat-val">{{ slide.statValue }}</span>
                          <span class="stat-lbl">{{ slide.statLabel }}</span>
                        </div>
                      </div>
                    </div>
                  }

                  <!-- Carousel Slide Progress Bar Indicators -->
                  <div class="slide-indicators">
                    @for (slide of project.slides; track $index; let indIdx = $index) {
                      <button
                        type="button"
                        class="indicator-dot"
                        [class.active]="currentSlideIndex() === indIdx"
                        (click)="setSlide(indIdx)"
                        [attr.aria-label]="'Go to slide ' + (indIdx + 1)"
                      ></button>
                    }
                  </div>
                </div>
              </div>

              <!-- RIGHT COLUMN: Project Info (~55% width) -->
              <div class="info-col">
                <div class="info-top">
                  <div class="index-row">
                    <span class="project-num">{{ project.num }}</span>
                    <span class="project-client-badge">{{ project.client }} &bull; {{ project.year }}</span>
                  </div>

                  <h3 class="project-title">{{ project.title }}</h3>

                  <!-- Metadata Tags -->
                  <p class="category-meta">{{ project.category }}</p>

                  <div class="tags-list">
                    @for (tag of project.tags; track tag) {
                      <span class="tag-chip">{{ tag }}</span>
                    }
                  </div>
                </div>

                <!-- Bottom Meta & Contextual Cue -->
                <div class="info-bottom">
                  <div class="bottom-action-row">
                    <a
                      href="#"
                      class="explore-link"
                      (click)="onExploreProject(project, $event)"
                    >
                      <span>Explore Case Study</span>
                      <span class="link-arrow">&rarr;</span>
                    </a>

                    <!-- Contextual Cue (Next project ↘ / Testimonials ↘) -->
                    <div class="contextual-cue">
                      @if (i < projects.length - 1) {
                        <span class="cue-label">Next project</span>
                        <span class="cue-arrow">↘</span>
                      } @else {
                        <span class="cue-label">Testimonials</span>
                        <span class="cue-arrow">↘</span>
                      }
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </article>
        }
      </div>

      <!-- Floating Bottom Dock Navigation -->
      <nav class="floating-dock" aria-label="Quick Navigation">
        <div class="dock-container">
          <a
            href="#projects"
            class="dock-link active"
            (click)="onDockClick('projects', $event)"
          >
            PROJECTS
          </a>
          <a
            href="#about"
            class="dock-link"
            (click)="onDockClick('about', $event)"
          >
            ABOUT
          </a>
          <a
            href="#archive"
            class="dock-link"
            (click)="onDockClick('archive', $event)"
          >
            ARCHIVE
          </a>

          <a
            href="#contact"
            class="dock-cta-btn"
            (click)="onDockClick('contact', $event)"
          >
            <div class="avatar-ring">
              <span class="avatar-fallback">P</span>
            </div>
            <span>LET'S TALK</span>
          </a>
        </div>
      </nav>

      <!-- Interactive Magnetic Cursor & Preview Card -->
      <div
        #magneticCursor
        class="magnetic-cursor-root"
        [class.in-section]="isCursorInsideSection()"
        [class.expanded]="isCursorExpanded()"
        aria-hidden="true"
      >
        <!-- Default collapsed state: subtle cream square -->
        <div class="cursor-square"></div>

        <!-- Expanded floating preview card (~160px x 160px) -->
        <div class="cursor-preview-card">
          <div class="preview-media-frame">
            <img
              [src]="activeProject().previewImage"
              [alt]="activeProject().title"
              class="preview-img"
            />
            <div class="preview-overlay"></div>
          </div>

          <!-- Centered Cream Pill Button labeled "VIEW CASE →" -->
          <div class="view-case-pill">
            <span>VIEW CASE</span>
            <span class="pill-arrow">&rarr;</span>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: `
    :host {
      --color-bg: #121210;
      --color-surface: #181714;
      --color-cream: #D8D2C5;
      --color-muted: #888580;
      --color-border: rgba(216, 210, 197, 0.12);
      display: block;
      width: 100%;
      background: var(--color-bg);
      color: var(--color-cream);
      font-family: 'Inter', system-ui, sans-serif;
    }
    .featured-section {
      position: relative;
      background: var(--color-bg);
      padding: clamp(3rem, 6vw, 6rem) clamp(1rem, 3vw, 3rem);
      min-height: 100vh;
      box-sizing: border-box;
    }
    .section-header { max-width: 1280px; margin: 0 auto 2.5rem; position: relative; z-index: 10; }
    .header-inner {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      border-bottom: 1px solid var(--color-border);
      padding-bottom: 1.5rem;
    }
    @media (min-width: 768px) {
      .header-inner { flex-direction: row; align-items: flex-end; justify-content: space-between; }
    }
    .eyebrow-row { display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.25rem; }
    .square-accent { width: 8px; height: 8px; background: var(--color-cream); border-radius: 2px; }
    .eyebrow-text { font-size: 0.75rem; font-weight: 500; color: var(--color-muted); text-transform: uppercase; font-family: 'Plus Jakarta Sans', sans-serif; }
    .featured-heading {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: clamp(3rem, 8vw, 7.5rem);
      font-weight: 800;
      letter-spacing: -0.04em;
      line-height: 0.9;
      text-transform: uppercase;
      color: var(--color-cream);
      margin: 0;
    }
    .dot-accent { color: #0066ff; }
    .bracket-tag { font-family: 'Space Mono', monospace; font-size: 0.75rem; color: var(--color-muted); text-transform: uppercase; }
    .projects-stack-container { max-width: 1280px; margin: 0 auto; position: relative; display: flex; flex-direction: column; }
    .showcase-item {
      position: sticky;
      top: 3.5rem;
      height: calc(100vh - 5rem);
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 20vh;
      will-change: transform, opacity;
    }
    .showcase-item:last-child { margin-bottom: 0; }
    @media (max-width: 1023px) {
      .showcase-item { position: relative; top: auto; height: auto; margin-bottom: 2.5rem; }
    }
    .item-inner {
      width: 100%;
      height: 100%;
      max-height: 600px;
      background: var(--color-surface);
      border: 1px solid var(--color-border);
      border-radius: 14px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 16px 48px rgba(0,0,0,0.6);
      transition: border-color 0.3s ease;
    }
    @media (min-width: 1024px) {
      .item-inner { flex-direction: row; }
    }
    .media-col {
      width: 100%;
      min-height: 280px;
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.25rem;
      box-sizing: border-box;
    }
    @media (min-width: 1024px) {
      .media-col { width: 46%; min-height: 100%; padding: 2rem; }
    }
    .layered-carousel { width: 100%; height: 100%; position: relative; display: flex; align-items: center; justify-content: center; }
    .carousel-slide {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      pointer-events: none;
      transform: scale(0.95);
      transition: opacity 0.4s ease, transform 0.4s ease;
    }
    .carousel-slide.active { opacity: 1; pointer-events: auto; transform: scale(1); }
    .mockup-card {
      width: 100%;
      max-width: 420px;
      background: rgba(18, 18, 16, 0.9);
      border: 1px solid rgba(216, 210, 197, 0.16);
      border-radius: 10px;
      overflow: hidden;
      backdrop-filter: blur(10px);
      box-shadow: 0 12px 30px rgba(0,0,0,0.5);
    }
    .mockup-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.5rem 0.85rem;
      background: rgba(0, 0, 0, 0.3);
      border-bottom: 1px solid rgba(216, 210, 197, 0.08);
    }
    .window-dots { display: flex; gap: 4px; }
    .window-dots span { width: 6px; height: 6px; border-radius: 50%; background: rgba(216, 210, 197, 0.3); }
    .mockup-badge { font-size: 0.65rem; font-weight: 600; font-family: 'Space Mono', monospace; color: var(--color-cream); background: rgba(255,255,255,0.08); padding: 0.15rem 0.5rem; border-radius: 20px; }
    .mockup-body { padding: 0.75rem; }
    .mockup-img { width: 100%; height: 190px; object-fit: cover; border-radius: 5px; display: block; margin-bottom: 0.65rem; }
    .mockup-caption h4 { margin: 0 0 0.2rem; font-size: 0.9rem; font-weight: 600; color: #fff; }
    .mockup-caption p { margin: 0; font-size: 0.72rem; color: var(--color-muted); line-height: 1.35; }
    .floating-stat-pill {
      position: absolute;
      bottom: 0.75rem;
      right: 0.5rem;
      background: rgba(18, 18, 16, 0.92);
      border: 1px solid var(--project-accent);
      border-radius: 30px;
      padding: 0.4rem 0.8rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      backdrop-filter: blur(8px);
      z-index: 5;
    }
    .stat-glow { width: 6px; height: 6px; border-radius: 50%; background: var(--project-accent); box-shadow: 0 0 8px var(--project-accent); }
    .stat-text { display: flex; flex-direction: column; }
    .stat-val { font-size: 0.75rem; font-weight: 700; color: #fff; line-height: 1.1; }
    .stat-lbl { font-size: 0.6rem; color: var(--color-muted); text-transform: uppercase; }
    .slide-indicators {
      position: absolute;
      bottom: 0.25rem;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 0.4rem;
      z-index: 6;
    }
    .indicator-dot { width: 5px; height: 5px; border-radius: 50%; background: rgba(216,210,197,0.25); border: none; cursor: pointer; padding: 0; }
    .indicator-dot.active { width: 16px; border-radius: 20px; background: var(--color-cream); }
    .info-col {
      width: 100%;
      padding: 1.5rem;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 1.5rem;
    }
    @media (min-width: 1024px) {
      .info-col { width: 54%; padding: 2.5rem 3rem; }
    }
    .info-top { display: flex; flex-direction: column; gap: 1rem; }
    .index-row { display: flex; align-items: center; justify-content: space-between; }
    .project-num {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: clamp(2.5rem, 4.5vw, 4rem);
      font-weight: 600;
      line-height: 0.85;
      color: var(--color-muted);
    }
    .project-client-badge { font-family: 'Space Mono', monospace; font-size: 0.7rem; text-transform: uppercase; color: var(--color-muted); }
    .project-title {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: clamp(1.4rem, 2.4vw, 2.1rem);
      font-weight: 500;
      line-height: 1.22;
      color: var(--color-cream);
      margin: 0;
    }
    .category-meta { font-size: 0.9rem; color: var(--color-muted); margin: 0; }
    .tags-list { display: flex; flex-wrap: wrap; gap: 0.4rem; }
    .tag-chip {
      font-size: 0.7rem;
      font-weight: 500;
      color: var(--color-cream);
      background: rgba(255,255,255,0.04);
      border: 1px solid var(--color-border);
      padding: 0.25rem 0.6rem;
      border-radius: 3px;
    }
    .info-bottom { border-top: 1px solid var(--color-border); padding-top: 1rem; }
    .bottom-action-row { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 0.75rem; }
    .explore-link {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.8rem;
      font-weight: 500;
      color: var(--color-cream);
      text-decoration: none;
    }
    .explore-link:hover { color: #fff; }
    .contextual-cue { display: inline-flex; align-items: center; gap: 0.3rem; font-size: 0.75rem; color: var(--color-muted); font-family: 'Space Mono', monospace; }
    .floating-dock { position: fixed; bottom: 1.5rem; left: 50%; transform: translateX(-50%); z-index: 100; }
    .dock-container {
      display: flex;
      align-items: center;
      gap: 0.2rem;
      background: rgba(22, 21, 17, 0.94);
      border: 1px solid rgba(216, 210, 197, 0.16);
      border-radius: 40px;
      padding: 0.3rem 0.4rem 0.3rem 1rem;
      backdrop-filter: blur(12px);
    }
    .dock-link {
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 0.7rem;
      font-weight: 600;
      color: rgba(216, 210, 197, 0.75);
      text-decoration: none;
      padding: 0.4rem 0.6rem;
      border-radius: 30px;
    }
    .dock-link:hover, .dock-link.active { color: #fff; }
    .dock-cta-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      background: var(--color-cream);
      color: var(--color-bg);
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 0.4rem 0.8rem 0.4rem 0.5rem;
      border-radius: 30px;
      text-decoration: none;
    }
    .avatar-ring { width: 20px; height: 20px; border-radius: 50%; background: #121210; display: flex; align-items: center; justify-content: center; }
    .avatar-fallback { font-size: 0.6rem; font-weight: 800; color: var(--color-cream); }
    .magnetic-cursor-root {
      position: fixed;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: 9999;
      transform: translate(-50%, -50%);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.25s ease;
    }
    .magnetic-cursor-root.in-section { opacity: 1; }
    .cursor-square {
      width: 8px;
      height: 8px;
      background: var(--color-cream);
      border-radius: 2px;
      box-shadow: 0 0 8px rgba(216, 210, 197, 0.5);
      transition: transform 0.3s ease, opacity 0.2s ease;
    }
    .cursor-preview-card {
      position: absolute;
      width: 150px;
      height: 150px;
      border-radius: 10px;
      overflow: hidden;
      background: #1a1916;
      border: 1px solid rgba(216, 210, 197, 0.3);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      transform: scale(0);
      opacity: 0;
      transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.25s ease;
    }
    .magnetic-cursor-root.expanded .cursor-square { transform: scale(0); opacity: 0; }
    .magnetic-cursor-root.expanded .cursor-preview-card { transform: scale(1); opacity: 1; }
    .preview-media-frame { position: absolute; inset: 0; width: 100%; height: 100%; }
    .preview-img { width: 100%; height: 100%; object-fit: cover; filter: brightness(0.7); }
    .preview-overlay { position: absolute; inset: 0; background: radial-gradient(circle, transparent 30%, rgba(0,0,0,0.65) 100%); }
    .view-case-pill {
      position: relative;
      z-index: 2;
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: var(--color-cream);
      color: var(--color-bg);
      font-family: 'Plus Jakarta Sans', sans-serif;
      font-size: 10px;
      font-weight: 700;
      padding: 6px 12px;
      border-radius: 30px;
      white-space: nowrap;
    }
  `,
})
export class FeaturedShowcaseComponent implements AfterViewInit, OnDestroy {
  readonly showcaseSection = viewChild<ElementRef<HTMLElement>>('showcaseSection');
  readonly magneticCursor = viewChild<ElementRef<HTMLElement>>('magneticCursor');

  readonly projects: FeaturedProject[] = FEATURED_PROJECTS_MOCK;

  // Signal State
  readonly activeProjectIndex = signal<number>(0);
  readonly currentSlideIndex = signal<number>(0);
  readonly isCursorInsideSection = signal<boolean>(false);
  readonly isCursorExpanded = signal<boolean>(false);

  readonly activeProject = computed(() => this.projects[this.activeProjectIndex()]);

  private readonly zone = inject(NgZone);

  // GSAP quickTo refs for magnetic lerp follower
  private xTo?: (value: number) => void;
  private yTo?: (value: number) => void;
  private ctx?: gsap.Context;
  private carouselInterval?: any;

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;

    this.zone.runOutsideAngular(() => {
      // 1. Initialize GSAP quickTo for smooth cursor follower
      const cursorEl = this.magneticCursor()?.nativeElement;
      if (cursorEl) {
        gsap.set(cursorEl, { xPercent: -50, yPercent: -50 });
        this.xTo = gsap.quickTo(cursorEl, 'x', { duration: 0.35, ease: 'power3.out' });
        this.yTo = gsap.quickTo(cursorEl, 'y', { duration: 0.35, ease: 'power3.out' });
      }

      // 2. Setup ScrollTrigger stacking cards with parallax & scaling
      this.initScrollAnimations();

      // 3. Start autoplaying layered carousel in left media card
      this.startCarousel();
    });
  }

  ngOnDestroy(): void {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
    if (this.ctx) {
      this.ctx.revert();
    }
    if (typeof window !== 'undefined') {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    }
  }

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(e: MouseEvent): void {
    if (this.xTo && this.yTo) {
      this.xTo(e.clientX);
      this.yTo(e.clientY);
    }
  }

  onSectionMouseEnter(): void {
    this.isCursorInsideSection.set(true);
  }

  onSectionMouseLeave(): void {
    this.isCursorInsideSection.set(false);
    this.isCursorExpanded.set(false);
  }

  onCardMouseEnter(index: number): void {
    this.activeProjectIndex.set(index);
    this.isCursorExpanded.set(true);
  }

  onCardMouseLeave(): void {
    this.isCursorExpanded.set(false);
  }

  setSlide(index: number): void {
    this.currentSlideIndex.set(index);
  }

  onExploreProject(project: FeaturedProject, event: Event): void {
    event.preventDefault();
  }

  onDockClick(target: string, event: Event): void {
    event.preventDefault();
    const el = document.getElementById(target);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }

  private startCarousel(): void {
    this.carouselInterval = setInterval(() => {
      this.zone.run(() => {
        this.currentSlideIndex.update((curr) => (curr + 1) % 3);
      });
    }, 3800);
  }

  private initScrollAnimations(): void {
    const sectionEl = this.showcaseSection()?.nativeElement;
    if (!sectionEl) return;

    this.ctx = gsap.context(() => {
      const items = gsap.utils.toArray<HTMLElement>('.showcase-item', sectionEl);

      items.forEach((item, i) => {
        if (i > 0) {
          // Stacking card enters from bottom with scrubbed parallax
          gsap.fromTo(
            item,
            {
              yPercent: 80,
              scale: 0.92,
              opacity: 0.4,
            },
            {
              yPercent: 0,
              scale: 1,
              opacity: 1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: item,
                start: 'top bottom',
                end: 'top top',
                scrub: 0.8,
                onEnter: () => this.zone.run(() => this.activeProjectIndex.set(i)),
                onEnterBack: () => this.zone.run(() => this.activeProjectIndex.set(i)),
              },
            }
          );

          // Preceding card scales down and dims smoothly
          const prevItem = items[i - 1];
          if (prevItem) {
            gsap.to(prevItem, {
              scale: 0.82,
              opacity: 0.55,
              filter: 'brightness(0.72)',
              scrollTrigger: {
                trigger: item,
                start: 'top bottom',
                end: 'top top',
                scrub: 0.8,
              },
            });
          }
        }
      });
    }, sectionEl);
  }
}

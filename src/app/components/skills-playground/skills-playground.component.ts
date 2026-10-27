import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  ViewChild,
  signal
} from '@angular/core';
import * as d3 from 'd3';

export interface SkillNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  category: 'Frontend' | 'Data Viz' | '3D & Design' | 'Tools';
  level: string;
  note: string;
  color: string;
  bg: string;
  r: number;
  el?: HTMLElement;
}

@Component({
  selector: 'app-skills-playground',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="skills" class="skills-section relative z-[2] bg-[#FFF8F0] px-5 sm:px-8 md:px-[6%] py-24 sm:py-32 border-t border-[#E8DCCF] overflow-hidden">
      <!-- Section Header -->
      <div class="max-w-6xl mx-auto mb-12 sm:mb-16 text-center">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBFBEF] border border-[#BCECC5] text-xs font-mono font-bold uppercase tracking-wider text-[#0A7F3A] shadow-xs mb-5">
          <span class="w-2 h-2 rounded-full bg-[#5CC46B] animate-pulse"></span>
          <span>03 // D3 PHYSICS PLAYGROUND</span>
        </div>

        <h2 class="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-[#14110F] text-ink m-0">
          Skills &amp; <span class="cabin-sketch-bold text-[#5CC46B]">Mastery</span>
        </h2>
        <p class="mt-4 text-base sm:text-lg text-[#6B6560] text-muted max-w-xl mx-auto font-normal leading-relaxed">
          An interactive rigid-body physics arena. Grab bubbles, throw them, or hover to repel.
        </p>

        <!-- Filter Chips -->
        <div class="flex flex-wrap items-center justify-center gap-2.5 mt-8">
          @for (cat of categories; track cat) {
            <button
              type="button"
              (click)="setFilter(cat)"
              class="filter-chip px-4 py-2 rounded-full text-xs sm:text-sm font-mono font-bold tracking-wide transition-all duration-200 cursor-pointer select-none"
              [class.bg-[#14110F]]="selectedCategory() === cat"
              [class.text-[#FFF8F0]]="selectedCategory() === cat"
              [class.shadow-md]="selectedCategory() === cat"
              [class.bg-white]="selectedCategory() !== cat"
              [class.text-[#14110F]]="selectedCategory() !== cat"
              [class.border]="selectedCategory() !== cat"
              [class.border-[#E8DCCF]]="selectedCategory() !== cat"
              [class.hover:border-[#5CC46B]]="selectedCategory() !== cat"
              data-cursor="FILTER"
            >
              {{ cat }}
            </button>
          }
        </div>
      </div>

      <!-- Physics Simulation Container (Desktop & Tablet) -->
      <div
        #playgroundContainer
        class="relative max-w-6xl mx-auto h-[520px] sm:h-[600px] rounded-3xl bg-white border-2 border-[#E8DCCF] shadow-[0_20px_50px_rgba(20,17,15,0.06)] overflow-hidden hidden md:block select-none"
        data-cursor="DRAG"
        (mousemove)="onContainerMouseMove($event)"
        (mouseleave)="onContainerMouseLeave()"
      >
        <!-- Floating hint -->
        <div class="absolute top-4 left-6 pointer-events-none z-10 flex items-center gap-2 text-xs font-mono text-[#6B6560] text-muted">
          <span class="w-2 h-2 rounded-full bg-[#5CC46B]"></span>
          <span>Collide &bull; Drag &bull; Click bubble for experience breakdown</span>
        </div>

        <!-- Rendered HTML Bubble Nodes -->
        @for (node of nodes; track node.id) {
          <div
            #bubbleEl
            [id]="'node-' + node.id"
            class="skill-bubble absolute top-0 left-0 rounded-full flex flex-col items-center justify-center text-center cursor-grab active:cursor-grabbing border-2 transition-[opacity,scale] duration-300 shadow-sm hover:shadow-lg hover:z-20 will-change-transform"
            [style.width.px]="node.r * 2"
            [style.height.px]="node.r * 2"
            [style.margin-left.px]="-node.r"
            [style.margin-top.px]="-node.r"
            [style.background]="node.bg"
            [style.border-color]="node.color"
            [style.color]="node.color"
            [class.opacity-25]="selectedCategory() !== 'All' && selectedCategory() !== node.category"
            [class.scale-75]="selectedCategory() !== 'All' && selectedCategory() !== node.category"
            [class.scale-105]="selectedCategory() === node.category"
            (click)="selectSkill(node)"
          >
            <span class="font-extrabold text-sm tracking-tight text-[#14110F] text-ink pointer-events-none">
              {{ node.name }}
            </span>
            <span class="text-[10px] font-mono opacity-80 pointer-events-none" [style.color]="node.color">
              {{ node.category }}
            </span>
          </div>
        }
      </div>

      <!-- Fallback Clean Responsive Grid (Mobile / Touch) -->
      <div class="max-w-6xl mx-auto md:hidden grid grid-cols-1 sm:grid-cols-2 gap-4">
        @for (node of filteredMobileNodes(); track node.id) {
          <div
            class="p-5 rounded-2xl border-2 transition-all duration-200 cursor-pointer"
            [style.background]="node.bg"
            [style.border-color]="node.color"
            (click)="selectSkill(node)"
          >
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-mono font-bold uppercase tracking-wider" [style.color]="node.color">
                {{ node.category }}
              </span>
              <span class="text-xs font-mono text-[#6B6560] text-muted">{{ node.level }}</span>
            </div>
            <h4 class="text-lg font-bold text-[#14110F] text-ink mb-1">{{ node.name }}</h4>
            <p class="text-xs text-[#6B6560] text-muted leading-relaxed m-0">{{ node.note }}</p>
          </div>
        }
      </div>

      <!-- Skill Detail Drawer / Modal -->
      @if (activeSkill(); as skill) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            class="relative w-full max-w-md bg-white rounded-3xl p-7 border-2 border-[#14110F] shadow-[0_24px_60px_rgba(0,0,0,0.25)]"
            (click)="$event.stopPropagation()"
          >
            <!-- Close Button -->
            <button
              type="button"
              (click)="activeSkill.set(null)"
              class="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#F7EFE5] hover:bg-[#E8DCCF] flex items-center justify-center font-bold text-sm cursor-pointer"
            >
              &times;
            </button>

            <div class="flex items-center gap-3 mb-4">
              <span class="w-4 h-4 rounded-full" [style.background]="skill.color"></span>
              <span class="text-xs font-mono font-bold uppercase tracking-wider text-[#6B6560] text-muted">
                {{ skill.category }} &bull; {{ skill.level }}
              </span>
            </div>

            <h3 class="text-2xl font-black text-[#14110F] text-ink mb-3">
              {{ skill.name }}
            </h3>

            <p class="text-sm text-[#6B6560] text-muted leading-relaxed mb-6 font-normal">
              {{ skill.note }}
            </p>

            <div class="p-4 rounded-2xl bg-[#FFF8F0] border border-[#E8DCCF] flex items-center justify-between">
              <span class="text-xs font-mono text-[#14110F] text-ink font-semibold">Production Status</span>
              <span class="text-xs font-mono font-bold text-[#0A7F3A]">Battle Tested &bull; 60fps</span>
            </div>
          </div>
        </div>
      }
    </section>
  `
})
export class SkillsPlaygroundComponent implements AfterViewInit, OnDestroy {
  @ViewChild('playgroundContainer') containerRef!: ElementRef<HTMLDivElement>;

  readonly categories = ['All', 'Frontend', 'Data Viz', '3D & Design', 'Tools'] as const;
  readonly selectedCategory = signal<string>('All');
  readonly activeSkill = signal<SkillNode | null>(null);

  readonly nodes: SkillNode[] = [
    {
      id: 'angular',
      name: 'Angular 21',
      category: 'Frontend',
      level: 'Advanced',
      note: 'Engineered signal-based reactive state architectures, deferred views, standalone components, and high-performance micro-frontends.',
      color: '#E5392F',
      bg: '#FFF0F0',
      r: 58
    },
    {
      id: 'typescript',
      name: 'TypeScript',
      category: 'Frontend',
      level: 'Advanced',
      note: 'Strict type designs, mapped generics, AST tooling, and zero-runtime-overhead abstractions across all web applications.',
      color: '#2F5BFF',
      bg: '#F0F4FF',
      r: 54
    },
    {
      id: 'd3',
      name: 'D3.js',
      category: 'Data Viz',
      level: 'Mastery',
      note: 'Custom force simulations, hierarchical tree layouts, geographic chloropleths, kinetic SVG paths, and WebGL canvas acceleration.',
      color: '#FF7A00',
      bg: '#FFF4EB',
      r: 60
    },
    {
      id: 'threejs',
      name: 'Three.js / WebGL',
      category: '3D & Design',
      level: 'Proficient',
      note: 'Scene graphs, GLTF model optimization, procedural GLSL vertex/fragment shaders, and interactive spatial camera controllers.',
      color: '#8B5CF6',
      bg: '#F5F0FF',
      r: 56
    },
    {
      id: 'gsap',
      name: 'GSAP',
      category: 'Frontend',
      level: 'Advanced',
      note: 'Complex choreographed timelines, ScrollTrigger pin scrollytelling, FLIP layout morphing, and elastic physics tweens.',
      color: '#5CC46B',
      bg: '#F0FAF2',
      r: 52
    },
    {
      id: 'rxjs',
      name: 'RxJS',
      category: 'Frontend',
      level: 'Advanced',
      note: 'Multi-stream event pipelines, switchMap race-condition guards, websocket sync, and custom reactive operators.',
      color: '#D91E75',
      bg: '#FFF0F6',
      r: 48
    },
    {
      id: 'blender',
      name: 'Blender 3D',
      category: '3D & Design',
      level: 'Proficient',
      note: 'Clay mascot sculpting, procedural lighting rigs, hard surface modeling, and sprite atlas rendering for zero-latency web playback.',
      color: '#FFC93C',
      bg: '#FFFCEB',
      r: 52
    },
    {
      id: 'figma',
      name: 'Figma',
      category: '3D & Design',
      level: 'Advanced',
      note: 'End-to-end design systems, token variables, responsive auto-layout components, and motion interaction specifications.',
      color: '#38BDF8',
      bg: '#F0F9FF',
      r: 46
    },
    {
      id: 'tailwind',
      name: 'Tailwind CSS',
      category: 'Frontend',
      level: 'Advanced',
      note: 'Tailwind v4 architectures, custom CSS design tokens, container queries, and sub-millisecond compile pipelines.',
      color: '#06B6D4',
      bg: '#F0FDFA',
      r: 48
    },
    {
      id: 'python',
      name: 'Python',
      category: 'Tools',
      level: 'Intermediate',
      note: 'Data transformation, statistical analysis with Pandas/NumPy, synthetic dataset generation, and automation scripts.',
      color: '#FF8FB1',
      bg: '#FFF5F8',
      r: 46
    },
    {
      id: 'nodejs',
      name: 'Node.js',
      category: 'Tools',
      level: 'Advanced',
      note: 'SSR streaming servers, lightweight microservices, WebSocket sync backends, and custom CLI developer utilities.',
      color: '#22C55E',
      bg: '#F0FDF4',
      r: 48
    },
    {
      id: 'git',
      name: 'Git & CI/CD',
      category: 'Tools',
      level: 'Advanced',
      note: 'Automated test runners, GitHub Actions deployment pipelines, semantic releases, and clean trunk-based branch hygiene.',
      color: '#E5392F',
      bg: '#FFF0F0',
      r: 44
    }
  ];

  private simulation: d3.Simulation<SkillNode, undefined> | null = null;
  private mouseX = -9999;
  private mouseY = -9999;

  constructor(private readonly zone: NgZone) {}

  filteredMobileNodes(): SkillNode[] {
    const cat = this.selectedCategory();
    if (cat === 'All') return this.nodes;
    return this.nodes.filter((n) => n.category === cat);
  }

  setFilter(category: string): void {
    this.selectedCategory.set(category);
    // Wake up simulation slightly so bubbles re-settle gracefully
    this.simulation?.alpha(0.3).restart();
  }

  selectSkill(node: SkillNode): void {
    this.activeSkill.set(node);
  }

  onContainerMouseMove(e: MouseEvent): void {
    const rect = this.containerRef?.nativeElement?.getBoundingClientRect();
    if (!rect) return;
    this.mouseX = e.clientX - rect.left;
    this.mouseY = e.clientY - rect.top;
  }

  onContainerMouseLeave(): void {
    this.mouseX = -9999;
    this.mouseY = -9999;
  }

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;

    this.zone.runOutsideAngular(() => {
      this.initPhysicsSimulation();
    });
  }

  private initPhysicsSimulation(): void {
    const container = this.containerRef?.nativeElement;
    if (!container) return;

    const width = container.clientWidth || 900;
    const height = container.clientHeight || 560;

    // Cache DOM elements for each node
    this.nodes.forEach((node) => {
      node.x = width / 2 + (Math.random() - 0.5) * 200;
      node.y = height / 2 + (Math.random() - 0.5) * 160;
      node.el = container.querySelector('#node-' + node.id) as HTMLElement;
    });

    // Setup D3 Force Simulation
    this.simulation = d3.forceSimulation<SkillNode>(this.nodes)
      .velocityDecay(0.24)
      .force('centerX', d3.forceX(width / 2).strength(0.045))
      .force('centerY', d3.forceY(height / 2).strength(0.045))
      .force('collide', d3.forceCollide<SkillNode>((d) => d.r + 6).iterations(3))
      .force('repel', () => {
        // Custom cursor repel force as requested
        this.nodes.forEach((n) => {
          if (n.x === undefined || n.y === undefined) return;
          const dx = n.x - this.mouseX;
          const dy = n.y - this.mouseY;
          const dist = Math.hypot(dx, dy);
          if (dist < 140 && dist > 0) {
            const force = ((140 - dist) / 140) * 1.8;
            n.vx = (n.vx || 0) + (dx / dist) * force;
            n.vy = (n.vy || 0) + (dy / dist) * force;
          }

          // Container boundary bounds
          const pad = n.r + 4;
          if (n.x < pad) { n.x = pad; n.vx = Math.abs(n.vx || 0) * 0.5; }
          if (n.x > width - pad) { n.x = width - pad; n.vx = -Math.abs(n.vx || 0) * 0.5; }
          if (n.y < pad) { n.y = pad; n.vy = Math.abs(n.vy || 0) * 0.5; }
          if (n.y > height - pad) { n.y = height - pad; n.vy = -Math.abs(n.vy || 0) * 0.5; }
        });
      })
      .on('tick', () => {
        this.nodes.forEach((node) => {
          if (node.el && node.x !== undefined && node.y !== undefined) {
            node.el.style.transform = `translate3d(${node.x}px, ${node.y}px, 0)`;
          }
        });
      });

    // Setup Drag behaviors on bubbles
    this.nodes.forEach((node) => {
      if (!node.el) return;

      const drag = d3.drag<HTMLElement, SkillNode>()
        .on('start', (event) => {
          if (!event.active) this.simulation?.alphaTarget(0.3).restart();
          node.fx = node.x;
          node.fy = node.y;
        })
        .on('drag', (event) => {
          node.fx = event.x;
          node.fy = event.y;
        })
        .on('end', (event) => {
          if (!event.active) this.simulation?.alphaTarget(0);
          node.fx = null;
          node.fy = null;
        });

      d3.select(node.el).call(drag as any);
    });
  }

  ngOnDestroy(): void {
    if (this.simulation) {
      this.simulation.stop();
      this.simulation = null;
    }
  }
}

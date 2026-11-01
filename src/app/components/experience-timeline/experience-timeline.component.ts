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
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import * as d3 from 'd3';

if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  accent: string;
  bg: string;
  borderColor: string;
  bullets: string[];
  metrics: { label: string; value: string; num: number; prefix?: string; suffix?: string }[];
  stack: string[];
  chartType: 'sparkline' | 'bars';
}

@Component({
  selector: 'app-experience-timeline',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="experience" class="experience-section relative z-[2] bg-[#FFF8F0] px-5 sm:px-8 md:px-[6%] py-24 sm:py-32 border-t border-[#E8DCCF]">
      <!-- Section Header -->
      <div class="max-w-6xl mx-auto mb-16 sm:mb-20 text-center">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FFFCEB] border border-[#FFE885] text-xs font-mono font-bold uppercase tracking-wider text-[#A87900] shadow-xs mb-5">
          <span class="w-2 h-2 rounded-full bg-[#FFC93C] animate-pulse"></span>
          <span>04 // CAREER TRAJECTORY</span>
        </div>

        <h2 class="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-[#14110F] text-ink m-0">
          Career <span class="cabin-sketch-bold text-[#A87900]">Experience</span>
        </h2>
        <p class="mt-4 text-base sm:text-lg text-[#6B6560] text-muted max-w-xl mx-auto font-normal leading-relaxed">
          Engineering mission-critical enterprise platforms, high-throughput data visualizations, and production systems.
        </p>
      </div>

      <!-- Timeline Canvas Container with Walking Avatar Path -->
      <div class="relative max-w-5xl mx-auto">
        <!-- Self-drawing SVG Spine Line (Visible on md+) -->
        <div class="absolute left-6 md:left-8 top-12 bottom-12 w-6 hidden md:block pointer-events-none z-10">
          <svg class="w-full h-full overflow-visible" preserveAspectRatio="none">
            <!-- Background faint track -->
            <line x1="12" y1="0" x2="12" y2="100%" stroke="#E8DCCF" stroke-width="4" stroke-linecap="round" />
            <!-- Active self-drawing stroke -->
            <line #timelinePath x1="12" y1="0" x2="12" y2="100%" stroke="var(--accent)" stroke-width="4" stroke-linecap="round" />
          </svg>

          <!-- Walking Avatar Marker along the path -->
          <div
            #walkingMarker
            class="walking-avatar absolute left-3 top-0 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border-2 border-[#14110F] shadow-[0_4px_14px_rgba(0,0,0,0.18)] flex items-center justify-center transition-transform duration-75 will-change-transform z-20"
          >
            <span class="text-xs">🚶</span>
          </div>
        </div>

        <!-- Experience Stacked Cards -->
        <div class="space-y-10 sm:space-y-14 md:pl-20">
          @for (item of experiences; track item.id; let idx = $index) {
            <div
              class="experience-card relative p-7 sm:p-10 rounded-3xl border-2 transition-all duration-300 shadow-[0_16px_40px_rgba(20,17,15,0.04)] hover:shadow-[0_24px_50px_rgba(20,17,15,0.08)] bg-white"
              [style.border-color]="item.borderColor"
              [attr.data-cursor]="item.company"
            >
              <!-- Card Header -->
              <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <span class="text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full" [style.background]="item.bg" [style.color]="item.accent">
                    {{ item.company }}
                  </span>
                  <h3 class="text-2xl sm:text-3xl font-extrabold text-[#14110F] text-ink mt-2">
                    {{ item.role }}
                  </h3>
                </div>

                <div class="text-left sm:text-right">
                  <span class="text-xs font-mono font-bold text-[#14110F] text-ink block">{{ item.period }}</span>
                  <span class="text-xs font-mono text-[#6B6560] text-muted">{{ item.location }}</span>
                </div>
              </div>

              <!-- Impact Bullets -->
              <ul class="space-y-2.5 mb-8 list-none p-0">
                @for (bullet of item.bullets; track bullet) {
                  <li class="flex items-start gap-3 text-sm sm:text-base text-[#6B6560] text-muted leading-relaxed">
                    <span class="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" [style.background]="item.accent"></span>
                    <span>{{ bullet }}</span>
                  </li>
                }
              </ul>

              <!-- Live D3 Mini Chart & Numbers Counter Row -->
              <div class="grid grid-cols-1 md:grid-cols-12 gap-6 p-5 rounded-2xl bg-[#FFF8F0] border border-[#E8DCCF] mb-6 items-center">
                <!-- Numbers Counters (Col 1-7) -->
                <div class="md:col-span-7 flex flex-wrap gap-6 sm:gap-8">
                  @for (metric of item.metrics; track metric.label) {
                    <div>
                      <div class="text-2xl sm:text-3xl font-black font-mono text-[#14110F] text-ink tracking-tight">
                        {{ metric.prefix || '' }}<span class="counter-num" [attr.data-target]="metric.num">{{ metric.num }}</span>{{ metric.suffix || '' }}
                      </div>
                      <div class="text-[11px] font-mono uppercase tracking-wider text-[#6B6560] text-muted mt-0.5">
                        {{ metric.label }}
                      </div>
                    </div>
                  }
                </div>

                <!-- Live D3 Mini Chart (Col 8-12) -->
                <div class="md:col-span-5 flex flex-col items-start md:items-end">
                  <span class="text-[10px] font-mono text-[#6B6560] text-muted uppercase tracking-wider mb-1">
                    Live Telemetry Preview
                  </span>
                  <div [id]="'chart-' + item.id" class="mini-chart-container w-full max-w-[200px] h-[55px]"></div>
                </div>
              </div>

              <!-- Tech Chips -->
              <div class="flex flex-wrap gap-2 pt-2 border-t border-[#E8DCCF]">
                @for (tag of item.stack; track tag) {
                  <span class="px-3 py-1 rounded-lg text-xs font-mono font-semibold bg-[#F7EFE5] text-[#14110F] text-ink border border-black/5">
                    {{ tag }}
                  </span>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `
})
export class ExperienceTimelineComponent implements AfterViewInit, OnDestroy {
  @ViewChild('timelinePath') pathRef?: ElementRef<SVGLineElement>;
  @ViewChild('walkingMarker') markerRef?: ElementRef<HTMLDivElement>;

  readonly experiences: ExperienceItem[] = [
    {
      id: 'tcs',
      role: 'System Engineer',
      company: 'Tata Consultancy Services (TCS)',
      period: '2024 — Present',
      location: 'Pune, India',
      accent: '#2F5BFF',
      bg: '#EBF3FF',
      borderColor: '#C6DCFF',
      bullets: [
        'Frontend Developer for Fortune 500 consumer goods giant Unilever, delivering web platforms serving 3.4 billion consumers across 190 countries.',
        'Architected the Statistical Process Control (SPC) application used by 500+ quality engineers across 20+ manufacturing sites.',
        'Engineered UI for Causal and Impact module using Angular and D3.js—building 5+ configuration screens and dashboards to train, parameterize, and visualize causal relationships in ML models.',
        'Resolved 20+ critical production bugs and performance bottlenecks, optimizing real-time data rendering.'
      ],
      metrics: [
        { label: 'Consumers Served', value: '3.4B', num: 3.4, suffix: 'B' },
        { label: 'Quality Engineers', value: '500+', num: 500, suffix: '+' },
        { label: 'Manufacturing Sites', value: '20+', num: 20, suffix: '+' }
      ],
      stack: ['Angular', 'TypeScript', 'D3.js', 'RxJS', 'Unilever SPC', 'Enterprise UI'],
      chartType: 'sparkline'
    },
    {
      id: 'lnct',
      role: 'Bachelor of Technology in CS (82.80%)',
      company: 'LNCT Group of Colleges',
      period: '2020 — 2024',
      location: 'Bhopal, India',
      accent: '#5CC46B',
      bg: '#EBFBEF',
      borderColor: '#BCECC5',
      bullets: [
        'Graduated with 82.80% aggregate, mastering Core Coursework: Data Structures & Algorithms, DBMS, Operating Systems, Computer Networks, and Cloud Computing.',
        'Engineered scalable web applications, real-time socket communication architectures, and predictive machine learning models.',
        'Led technical design and algorithmic problem solving across competitive coding and hackathons.'
      ],
      metrics: [
        { label: 'Degree Aggregate', value: '82.8%', num: 82.8, suffix: '%' },
        { label: 'Core Modules', value: '5+', num: 5, suffix: '+' },
        { label: 'Academic Years', value: '4 Yrs', num: 4, suffix: ' Yrs' }
      ],
      stack: ['C++', 'Java', 'Python', 'DBMS', 'Computer Networks', 'Cloud Computing'],
      chartType: 'bars'
    },
    {
      id: 'projects',
      role: 'Full-Stack, ML & 3D Engineering',
      company: 'High-Impact Systems & Open Source',
      period: '2021 — 2024',
      location: 'Bhopal &bull; Remote',
      accent: '#FF7A00',
      bg: '#FFF4EB',
      borderColor: '#FFD7BE',
      bullets: [
        'Talk-A-Tive: Full-stack MERN real-time chat with Socket.io delivering sub-100ms latency for 20+ concurrent active users.',
        'Gold Price Prediction: Machine learning model trained on 13-year longitudinal market data (2008–2021) using Random Forest (500+ estimators) and R² evaluation.',
        'Dead by Shot: First-person shooter game built in Unreal Engine 4 played by 100+ players with custom 3D assets modeled in Blender.'
      ],
      metrics: [
        { label: 'Chat Latency', value: '<100ms', num: 100, prefix: '<', suffix: 'ms' },
        { label: 'Market Data Span', value: '13 Yrs', num: 13, suffix: ' Yrs' },
        { label: 'Game Players', value: '100+', num: 100, suffix: '+' }
      ],
      stack: ['Python', 'Scikit-Learn', 'ReactJS', 'Node.js', 'Socket.io', 'Unreal Engine 4', 'Blender'],
      chartType: 'sparkline'
    }
  ];

  private scrollTriggers: ScrollTrigger[] = [];

  constructor(private readonly zone: NgZone) {}

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;

    this.zone.runOutsideAngular(() => {
      this.initSelfDrawingTimeline();
      this.initD3MiniCharts();
      this.initNumberCounters();
    });
  }

  private initSelfDrawingTimeline(): void {
    const line = this.pathRef?.nativeElement;
    const marker = this.markerRef?.nativeElement;
    if (!line || !marker) return;

    const totalHeight = line.parentElement?.clientHeight || 800;
    line.style.strokeDasharray = `${totalHeight}`;
    line.style.strokeDashoffset = `${totalHeight}`;

    const st = ScrollTrigger.create({
      trigger: '#experience',
      start: 'top 65%',
      end: 'bottom 80%',
      scrub: 0.8,
      onUpdate: (self) => {
        const offset = totalHeight * (1 - self.progress);
        line.style.strokeDashoffset = `${offset}`;
        const markerY = totalHeight * self.progress;
        marker.style.transform = `translate3d(0, ${markerY}px, 0)`;
      }
    });
    this.scrollTriggers.push(st);
  }

  private initD3MiniCharts(): void {
    this.experiences.forEach((exp) => {
      const el = document.getElementById('chart-' + exp.id);
      if (!el) return;

      const width = el.clientWidth || 180;
      const height = el.clientHeight || 50;

      const svg = d3.select(el)
        .append('svg')
        .attr('width', width)
        .attr('height', height)
        .style('overflow', 'visible');

      if (exp.chartType === 'sparkline') {
        const data = [12, 18, 14, 28, 22, 38, 30, 48, 42, 60];
        const xScale = d3.scaleLinear().domain([0, data.length - 1]).range([0, width]);
        const yScale = d3.scaleLinear().domain([0, 65]).range([height - 4, 4]);

        const line = d3.line<number>()
          .x((_, i) => xScale(i))
          .y((d) => yScale(d))
          .curve(d3.curveMonotoneX);

        svg.append('path')
          .datum(data)
          .attr('fill', 'none')
          .attr('stroke', exp.accent)
          .attr('stroke-width', 2.5)
          .attr('stroke-linecap', 'round')
          .attr('d', line);

        // Terminal glowing dot
        svg.append('circle')
          .attr('cx', xScale(data.length - 1))
          .attr('cy', yScale(data[data.length - 1]))
          .attr('r', 4)
          .attr('fill', exp.accent);
      } else {
        const bars = [14, 28, 45, 32, 58, 48, 62, 54, 75];
        const barW = (width / bars.length) - 3;
        const yScale = d3.scaleLinear().domain([0, 80]).range([0, height - 6]);

        svg.selectAll('rect')
          .data(bars)
          .enter()
          .append('rect')
          .attr('x', (_, i) => i * (barW + 3))
          .attr('y', (d) => height - yScale(d))
          .attr('width', barW)
          .attr('height', (d) => yScale(d))
          .attr('rx', 2)
          .attr('fill', exp.accent)
          .attr('opacity', (_, i) => 0.4 + (i / bars.length) * 0.6);
      }
    });
  }

  private initNumberCounters(): void {
    const counterEls = document.querySelectorAll('.counter-num');
    counterEls.forEach((counter) => {
      const el = counter as HTMLElement;
      const target = parseFloat(el.getAttribute('data-target') || '0');
      const isDecimal = target % 1 !== 0;

      ScrollTrigger.create({
        trigger: el,
        start: 'top 85%',
        once: true,
        onEnter: () => {
          gsap.fromTo(el,
            { innerText: 0 },
            {
              innerText: target,
              duration: 1.8,
              ease: 'power2.out',
              snap: isDecimal ? { innerText: 0.1 } : { innerText: 1 },
              onUpdate: () => {
                const val = parseFloat(el.innerText);
                el.innerText = isDecimal ? val.toFixed(1) : Math.round(val).toString();
              }
            }
          );
        }
      });
    });
  }

  ngOnDestroy(): void {
    this.scrollTriggers.forEach((st) => st.kill());
    this.scrollTriggers = [];
  }
}

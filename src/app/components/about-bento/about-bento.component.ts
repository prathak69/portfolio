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
import { AvatarGazeService } from '../../services/avatar-gaze.service';

if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
  gsap.registerPlugin(ScrollTrigger);
}

@Component({
  selector: 'app-about-bento',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="about" class="about-bento-section relative z-[2] bg-[#FFF8F0] px-5 sm:px-8 md:px-[6%] py-24 sm:py-32 border-t border-[#E8DCCF]">
      <!-- Section Tag Header -->
      <div class="max-w-6xl mx-auto mb-16 flex items-center justify-between select-none">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8DCCF] text-xs font-mono font-bold uppercase tracking-wider text-[#E5392F] shadow-xs">
          <span class="w-2 h-2 rounded-full bg-[#E5392F] animate-ping"></span>
          <span>01 // STATEMENT &amp; CONTEXT</span>
        </div>
        <span class="text-xs font-mono text-[#6B6560] text-muted tracking-widest hidden sm:inline-block">
          BENGALURU, INDIA &bull; 12.9716&deg; N
        </span>
      </div>

      <!-- Scrollytelling Sentence-by-Sentence Text Reveal -->
      <div #statementContainer class="max-w-5xl mx-auto mb-20 sm:mb-28">
        <p class="scrolly-text text-3xl sm:text-4xl md:text-5xl lg:text-[52px] font-extrabold leading-[1.2] tracking-tight">
          @for (word of statementWords; track $index) {
            <span class="scrub-word inline-block mr-[0.26em] transition-colors duration-150 text-[#14110F]/30 select-text" [attr.data-word-index]="$index">
              @if (word === 'craft' || word === 'interactive' || word === 'alive') {
                <span class="cabin-sketch-bold text-[#E5392F] select-text">{{ word }}</span>
              } @else {
                <span class="select-text">{{ word }}</span>
              }
            </span>
          }
        </p>
      </div>

      <!-- 5-Card Bento Grid -->
      <div class="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-5 sm:gap-6">
        <!-- 1. Avatar & Identity Card (Col 1-5) -->
        <div
          class="bento-card md:col-span-5 bg-white rounded-3xl p-7 border-2 border-[#E8DCCF] shadow-[0_12px_32px_rgba(20,17,15,0.04)] flex flex-col justify-between group hover:border-[#2F5BFF] transition-all duration-300 relative overflow-hidden"
          data-cursor="HELLO"
          (mouseenter)="avatarGaze.triggerWink()"
        >
          <!-- Background accent glow -->
          <div class="absolute -right-8 -top-8 w-36 h-36 rounded-full bg-[#2F5BFF]/10 blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>

          <div>
            <div class="flex items-center justify-between mb-6">
              <span class="text-xs font-mono uppercase tracking-wider text-[#6B6560] text-muted">CREATIVE DEV</span>
              <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#EBF3FF] text-[#2F5BFF] text-[11px] font-bold">
                <span class="w-1.5 h-1.5 rounded-full bg-[#2F5BFF] animate-pulse"></span>
                Open for work
              </span>
            </div>

            <h3 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#14110F] text-ink mb-3">
              Prathak Soni
            </h3>
            <p class="text-sm sm:text-base text-[#6B6560] text-muted leading-relaxed font-normal">
              Pairing rigorous frontend engineering with fluid, tactile micro-interactions and spatial motion design.
            </p>
          </div>

          <div class="mt-8 pt-5 border-t border-[#E8DCCF] flex items-center justify-between">
            <span class="text-xs font-mono text-[#14110F] text-ink font-semibold">Frontend &bull; Data Viz &bull; 3D</span>
            <span class="text-xl group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">👋</span>
          </div>
        </div>

        <!-- 2. Live IST Clock & Location Card (Col 6-8) -->
        <div
          class="bento-card md:col-span-4 bg-[#FFF0E8] rounded-3xl p-7 border-2 border-[#FFD5C0] shadow-[0_12px_32px_rgba(20,17,15,0.04)] flex flex-col justify-between hover:border-[#E5392F] transition-all duration-300 relative overflow-hidden"
          data-cursor="TIME"
        >
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="text-xs font-mono uppercase tracking-wider text-[#E5392F] font-semibold">LOCATION &amp; TIME</span>
              <span class="text-lg">📍</span>
            </div>
            <h4 class="text-xl font-bold text-[#14110F] text-ink">Bengaluru, IN</h4>
            <p class="text-xs font-mono text-[#6B6560] text-muted mt-1">UTC +5:30 &bull; India Standard Time</p>
          </div>

          <div class="mt-8">
            <div class="text-3xl sm:text-4xl font-extrabold font-mono text-[#E5392F] tracking-tight">
              {{ liveTime() }}
            </div>
            <div class="text-[11px] font-mono text-[#6B6560] text-muted mt-2 flex items-center gap-1.5">
              <span class="w-2 h-2 rounded-full bg-[#5CC46B] animate-pulse"></span>
              Working hours &bull; Fast response
            </div>
          </div>
        </div>

        <!-- 3. Currently Building Card (Col 9-12) -->
        <div
          class="bento-card md:col-span-3 bg-white rounded-3xl p-7 border-2 border-[#E8DCCF] shadow-[0_12px_32px_rgba(20,17,15,0.04)] flex flex-col justify-between hover:border-[#5CC46B] transition-all duration-300"
          data-cursor="BUILDING"
        >
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="text-xs font-mono uppercase tracking-wider text-[#5CC46B] font-semibold">NOW BUILDING</span>
              <span class="w-2.5 h-2.5 rounded-full bg-[#5CC46B] animate-ping"></span>
            </div>
            <h4 class="text-lg font-bold text-[#14110F] text-ink leading-snug">
              Generative Canvas &amp; 3D Lab
            </h4>
          </div>

          <div class="mt-6">
            <p class="text-xs text-[#6B6560] text-muted leading-relaxed mb-4">
              Exploring low-latency WebGL shaders, SVG kinematic paths, and real-time audio reactivity.
            </p>
            <span class="inline-block px-3 py-1 rounded-full bg-[#EBFBEF] text-[#0A7F3A] text-xs font-mono font-bold">
              v2.4 in progress
            </span>
          </div>
        </div>

        <!-- 4. Core Tech Stack Card (Col 1-7) -->
        <div
          class="bento-card md:col-span-7 bg-[#EBF3FF] rounded-3xl p-7 border-2 border-[#C6DCFF] shadow-[0_12px_32px_rgba(20,17,15,0.04)] flex flex-col justify-between hover:border-[#2F5BFF] transition-all duration-300"
          data-cursor="STACK"
        >
          <div>
            <div class="flex items-center justify-between mb-5">
              <span class="text-xs font-mono uppercase tracking-wider text-[#2F5BFF] font-bold">PRODUCTION ARSENAL</span>
              <span class="text-xs font-mono text-[#2F5BFF]/80">9+ YEARS WEB</span>
            </div>
            <h4 class="text-xl sm:text-2xl font-extrabold text-[#14110F] text-ink mb-4">
              Modern Frameworks, Reactive State &amp; WebGL
            </h4>
          </div>

          <!-- Stack Badges -->
          <div class="flex flex-wrap gap-2 mt-4">
            @for (tech of stackBadges; track tech.name) {
              <div
                class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#BED7FF] text-xs font-mono font-bold text-[#14110F] text-ink hover:scale-105 hover:bg-[#2F5BFF] hover:text-white transition-all cursor-default select-none shadow-xs"
              >
                <span>{{ tech.icon }}</span>
                <span>{{ tech.name }}</span>
              </div>
            }
          </div>
        </div>

        <!-- 5. Fun Fact / Clay Doodle Card (Col 8-12) -->
        <div
          class="bento-card md:col-span-5 bg-[#FFFCEB] rounded-3xl p-7 border-2 border-[#FFE885] shadow-[0_12px_32px_rgba(20,17,15,0.04)] flex flex-col justify-between hover:border-[#FFC93C] transition-all duration-300"
          data-cursor="SMILE"
        >
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="text-xs font-mono uppercase tracking-wider text-[#A87900] font-bold">CURIOSITY &amp; CRAFT</span>
              <span class="text-2xl">⚡️</span>
            </div>
            <h4 class="text-xl font-extrabold text-[#14110F] text-ink mb-2">
              D3 Physics Obsessive
            </h4>
            <p class="text-sm text-[#6B6560] text-muted leading-relaxed">
              Believes every data point deserves a heartbeat. Spends weekends simulating rigid body particle collisions and hand-sculpting clay characters.
            </p>
          </div>

          <div class="mt-6 pt-4 border-t border-[#F5DC6E] flex items-center justify-between">
            <span class="cabin-sketch-bold text-lg text-[#A87900]">"Make it feel alive"</span>
            <span class="text-xs font-mono text-[#6B6560] text-muted">60fps only</span>
          </div>
        </div>
      </div>
    </section>
  `
})
export class AboutBentoComponent implements AfterViewInit, OnDestroy {
  @ViewChild('statementContainer') statementRef!: ElementRef<HTMLDivElement>;

  readonly liveTime = signal<string>('--:--:--');

  readonly statement =
    'I build fast, tactile digital experiences where fluid motion and clear data engineering meet. From dynamic D3 physics to custom WebGL shaders, every interaction is sculpted to feel alive and delightfully human.';

  readonly statementWords = this.statement.split(' ');

  readonly stackBadges = [
    { name: 'Angular 21', icon: '🅰️' },
    { name: 'TypeScript', icon: '🔷' },
    { name: 'D3.js', icon: '📊' },
    { name: 'GSAP', icon: '🟢' },
    { name: 'Three.js / WebGL', icon: '📐' },
    { name: 'Tailwind CSS', icon: '🎨' },
    { name: 'RxJS', icon: '⚡️' },
    { name: 'Node.js', icon: '🌱' }
  ];

  private timeInterval: any = null;
  private scrollTriggerInstance: ScrollTrigger | null = null;

  constructor(
    private readonly zone: NgZone,
    readonly avatarGaze: AvatarGazeService
  ) {}

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;

    this.startClock();

    this.zone.runOutsideAngular(() => {
      this.initScrollytelling();
    });
  }

  private startClock(): void {
    const updateTime = () => {
      const now = new Date();
      // Format as IST time (Asia/Kolkata)
      const istString = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour12: true,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
      this.liveTime.set(istString);
    };

    updateTime();
    this.timeInterval = setInterval(updateTime, 1000);
  }

  private initScrollytelling(): void {
    const el = this.statementRef?.nativeElement;
    if (!el) return;

    const words = el.querySelectorAll('.scrub-word');
    if (!words || words.length === 0) return;

    this.scrollTriggerInstance = ScrollTrigger.create({
      trigger: el,
      start: 'top 75%',
      end: 'bottom 40%',
      scrub: 0.8,
      onUpdate: (self) => {
        const progress = self.progress;
        const total = words.length;
        const activeCount = Math.floor(progress * total);

        words.forEach((w, idx) => {
          const wordEl = w as HTMLElement;
          if (idx <= activeCount) {
            wordEl.style.color = '#14110F';
            wordEl.style.opacity = '1';
          } else {
            wordEl.style.color = 'rgba(20, 17, 15, 0.2)';
            wordEl.style.opacity = '0.4';
          }
        });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.timeInterval) clearInterval(this.timeInterval);
    if (this.scrollTriggerInstance?.kill) this.scrollTriggerInstance.kill();
  }
}

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

interface TrailPoint {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
}

@Component({
  selector: 'app-custom-cursor',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Doodle Ink Trail Canvas -->
    <canvas #trailCanvas id="ink-trail-canvas"></canvas>

    <!-- Custom Accent Cursor Blob -->
    <div
      #cursorRef
      class="custom-cursor"
      [class.cursor-hover]="isHovering()"
      [class.cursor-badge]="!!currentLabel()"
    >
      <span class="cursor-text">{{ currentLabel() }}</span>
    </div>
  `
})
export class CustomCursorComponent implements AfterViewInit, OnDestroy {
  @ViewChild('cursorRef') cursorRef!: ElementRef<HTMLDivElement>;
  @ViewChild('trailCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  readonly isHovering = signal<boolean>(false);
  readonly currentLabel = signal<string>('');

  private x = -100;
  private y = -100;
  private tx = -100;
  private ty = -100;
  private isPointerCoarse = false;

  private points: TrailPoint[] = [];
  private ctx: CanvasRenderingContext2D | null = null;
  private tickerFunc: ((time: number) => void) | null = null;
  private cleanups: (() => void)[] = [];

  constructor(private readonly zone: NgZone) {}

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;

    this.isPointerCoarse = window.matchMedia('(pointer: coarse)').matches;
    if (this.isPointerCoarse) return;

    this.initCanvas();

    this.zone.runOutsideAngular(() => {
      this.initPointerTracking();
      this.initMagneticAndHoverListeners();
      this.startLoop();
    });
  }

  private initCanvas(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      this.ctx = canvas.getContext('2d');
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });
    this.cleanups.push(() => window.removeEventListener('resize', resize));
  }

  private initPointerTracking(): void {
    const onLeave = () => {
      this.points = [];
      this.tx = -100;
      this.ty = -100;
    };

    const onMove = (e: PointerEvent) => {
      // If cursor is off-screen or returning from outside, initialize smoothly
      if (this.tx === -100 && this.ty === -100) {
        this.x = e.clientX;
        this.y = e.clientY;
        this.tx = e.clientX;
        this.ty = e.clientY;
        this.points = [];
        return;
      }

      this.tx = e.clientX;
      this.ty = e.clientY;

      // Skip ink trail when hovering cards with badges (e.g. VIEW) or buttons
      if (this.isHovering() || this.currentLabel()) {
        this.points = [];
        return;
      }

      // If mouse jumped rapidly (e.g. across screen), reset trail instead of drawing long line
      if (this.points.length > 0) {
        const last = this.points[this.points.length - 1];
        const dist = Math.hypot(e.clientX - last.x, e.clientY - last.y);
        if (dist > 35) {
          this.points = [];
        }
      }

      // Add a subtle doodle ink trail point
      const wobbleX = (Math.random() - 0.5) * 1.2;
      const wobbleY = (Math.random() - 0.5) * 1.2;
      this.points.push({
        x: e.clientX + wobbleX,
        y: e.clientY + wobbleY,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        age: 0
      });

      if (this.points.length > 20) {
        this.points.shift();
      }
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerleave', onLeave);
    window.addEventListener('blur', onLeave);

    this.cleanups.push(() => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('blur', onLeave);
    });
  }

  private initMagneticAndHoverListeners(): void {
    // Detect cursor badges and magnetic elements on document delegation
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorTarget = target.closest('[data-cursor]') as HTMLElement | null;
      if (cursorTarget) {
        const label = cursorTarget.getAttribute('data-cursor') || '';
        this.zone.run(() => {
          this.currentLabel.set(label);
          this.isHovering.set(true);
        });
        return;
      }

      const linkOrButton = target.closest('a, button, input, textarea, select, [role="button"]') as HTMLElement | null;
      if (linkOrButton) {
        this.zone.run(() => {
          this.currentLabel.set('');
          this.isHovering.set(true);
        });
      } else {
        if (this.isHovering() || this.currentLabel()) {
          this.zone.run(() => {
            this.currentLabel.set('');
            this.isHovering.set(false);
          });
        }
      }
    };

    const setupMagneticButtons = () => {
      const magneticEls = document.querySelectorAll('.magnetic-btn, [data-magnetic]');
      magneticEls.forEach((btn) => {
        const el = btn as HTMLElement;
        if (el.dataset['magneticInit']) return;
        el.dataset['magneticInit'] = 'true';

        const moveHandler = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          const mx = (e.clientX - r.left - r.width / 2) * 0.32;
          const my = (e.clientY - r.top - r.height / 2) * 0.32;
          gsap.to(el, { x: mx, y: my, duration: 0.3, ease: 'power2.out' });
        };

        const leaveHandler = () => {
          gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.4)' });
        };

        el.addEventListener('mousemove', moveHandler as any);
        el.addEventListener('mouseleave', leaveHandler);

        this.cleanups.push(() => {
          el.removeEventListener('mousemove', moveHandler as any);
          el.removeEventListener('mouseleave', leaveHandler);
        });
      });
    };

    document.addEventListener('mouseover', onOver, { passive: true });
    this.cleanups.push(() => document.removeEventListener('mouseover', onOver));

    // Re-check magnetics periodically when new sections appear
    setupMagneticButtons();
    const interval = setInterval(setupMagneticButtons, 1200);
    this.cleanups.push(() => clearInterval(interval));
  }

  private startLoop(): void {
    const cursor = this.cursorRef?.nativeElement;
    const canvas = this.canvasRef?.nativeElement;

    this.tickerFunc = () => {
      // 1. Cursor smooth interpolation
      this.x += (this.tx - this.x) * 0.18;
      this.y += (this.ty - this.y) * 0.18;

      if (cursor) {
        cursor.style.transform = `translate3d(${this.x}px, ${this.y}px, 0)`;
      }

      // 2. Ink Trail rendering on full-screen canvas (Always clearRect so overlay stays transparent)
      if (this.ctx && canvas) {
        this.ctx.clearRect(0, 0, canvas.width, canvas.height);

        if (this.points.length > 2) {
          this.ctx.save();
          this.ctx.lineCap = 'round';
          this.ctx.lineJoin = 'round';

          for (let i = 1; i < this.points.length; i++) {
            const p = this.points[i];
            const prev = this.points[i - 1];
            p.age += 1;

            const dist = Math.hypot(p.x - prev.x, p.y - prev.y);
            if (dist > 35) continue; // Prevent connecting jump points

            const life = Math.max(0, 1 - p.age / 24);
            this.ctx.strokeStyle = `rgba(229, 57, 47, ${life * 0.45})`;
            this.ctx.lineWidth = 2.2 * life;

            this.ctx.beginPath();
            this.ctx.moveTo(prev.x, prev.y);
            this.ctx.lineTo(p.x, p.y);
            this.ctx.stroke();
          }

          this.ctx.restore();

          // Prune aged points
          this.points = this.points.filter((pt) => pt.age < 24);
        }
      }
    };

    gsap.ticker.add(this.tickerFunc);
  }

  ngOnDestroy(): void {
    if (this.tickerFunc) {
      gsap.ticker.remove(this.tickerFunc);
      this.tickerFunc = null;
    }
    this.cleanups.forEach((c) => c());
    this.cleanups = [];
  }
}

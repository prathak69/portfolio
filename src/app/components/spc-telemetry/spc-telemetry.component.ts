import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  NgZone,
  OnInit,
  inject,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FeatureFlagService } from '../../services/feature-flag.service';

@Component({
  selector: 'app-spc-telemetry',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (featureFlags.isEnabled('spcTelemetry')) {
      <aside
        class="spc-telemetry-container fixed top-0 left-0 w-full z-50 pointer-events-none select-none"
        aria-label="Statistical Process Control Scroll Telemetry"
      >
        <!-- The 3px SPC Control Chart Bar -->
        <div class="spc-chart-track relative w-full h-[3px] bg-black/10 overflow-hidden">
          <!-- Lower Control Limit (LCL) dashed line indicator -->
          <div class="spc-limit lcl" aria-hidden="true"></div>

          <!-- Upper Control Limit (UCL) dashed line indicator -->
          <div class="spc-limit ucl" aria-hidden="true"></div>

          <!-- Active Process Telemetry Progress Bar -->
          <div
            class="spc-progress-bar h-full transition-all duration-75 ease-out"
            [style.width.%]="scrollProgress()"
            [style.background]="isSpike() ? '#E84A3F' : (isElevated() ? '#FFC93C' : '#5CC46B')"
          ></div>
        </div>

        <!-- Floating Micro Telemetry Badge on Velocity Spike -->
        @if (isSpike()) {
          <div
            class="spc-spike-pill pointer-events-auto absolute top-2 right-4 sm:right-10 flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[#171715] text-[#FFF8F0] border border-[#E84A3F] shadow-lg animate-bounce cursor-pointer"
            (click)="toggleTooltip()"
            role="status"
            aria-live="polite"
          >
            <span class="w-2 h-2 rounded-full bg-[#E84A3F] animate-ping"></span>
            <span>Out of Control: scroll velocity spike</span>
            <span class="text-xs text-[#E84A3F]">ℹ</span>
          </div>
        }

        <!-- 1-Sentence Easter Egg Tooltip Modal / Popover -->
        @if (showTooltip()) {
          <div
            class="spc-tooltip pointer-events-auto fixed top-12 right-4 sm:right-10 max-w-sm p-4 rounded-2xl bg-[#171715] text-[#F7F4EE] border border-[#E84A3F] shadow-2xl z-50 text-xs font-mono leading-relaxed"
            role="dialog"
            aria-modal="false"
          >
            <div class="flex items-start justify-between gap-3 mb-2">
              <span class="text-[#E84A3F] font-bold text-[11px] uppercase tracking-wider">Statistical Process Control</span>
              <button
                type="button"
                (click)="toggleTooltip()"
                class="text-white/60 hover:text-white cursor-pointer text-sm leading-none"
                aria-label="Close tooltip"
              >
                &times;
              </button>
            </div>
            <p class="m-0 text-white/90">
              Statistical Process Control (SPC) monitors Unilever manufacturing pipelines. Here, it monitors you.
            </p>
          </div>
        }
      </aside>
    }
  `,
  styles: [`
    .spc-chart-track {
      backdrop-filter: blur(4px);
    }

    .spc-limit {
      position: absolute;
      top: 0;
      bottom: 0;
      width: 100%;
      pointer-events: none;
      border-bottom: 1px dashed;
      opacity: 0.35;

      &.ucl {
        border-color: #E84A3F;
      }
      &.lcl {
        border-color: #5CC46B;
      }
    }

    .spc-progress-bar {
      box-shadow: 0 0 10px currentColor;
    }

    .spc-spike-pill {
      animation: pulseAlert 1.2s infinite;
    }

    @keyframes pulseAlert {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-2px); }
    }
  `]
})
export class SpcTelemetryComponent implements OnInit {
  readonly featureFlags = inject(FeatureFlagService);
  private zone = inject(NgZone);
  private destroyRef = inject(DestroyRef);

  readonly scrollProgress = signal<number>(0);
  readonly currentVelocity = signal<number>(0);
  readonly isElevated = signal<boolean>(false);
  readonly isSpike = signal<boolean>(false);
  readonly showTooltip = signal<boolean>(false);

  private lastScrollY = 0;
  private lastTime = 0;
  private spikeTimeout: any = null;

  ngOnInit(): void {
    if (typeof window === 'undefined') return;

    this.zone.runOutsideAngular(() => {
      this.lastScrollY = window.scrollY;
      this.lastTime = performance.now();

      const onScroll = () => {
        const now = performance.now();
        const currentY = window.scrollY;
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = totalHeight > 0 ? (currentY / totalHeight) * 100 : 0;

        const dt = Math.max(16, now - this.lastTime);
        const dy = Math.abs(currentY - this.lastScrollY);
        // Instantaneous velocity in px/ms scaled + tiny micro-noise
        const rawVel = (dy / dt) * 1000;
        const noise = (Math.random() - 0.5) * 12;
        const velocity = Math.max(0, rawVel + noise);

        this.lastScrollY = currentY;
        this.lastTime = now;

        const isSpikeVel = velocity > 1800; // Frantic scroll velocity
        const isElevatedVel = velocity > 900;

        this.zone.run(() => {
          this.scrollProgress.set(Math.min(100, Math.max(0, progress)));
          this.currentVelocity.set(velocity);
          this.isElevated.set(isElevatedVel);

          if (isSpikeVel) {
            this.isSpike.set(true);
            if (this.spikeTimeout) clearTimeout(this.spikeTimeout);
            this.spikeTimeout = setTimeout(() => {
              this.isSpike.set(false);
            }, 3200);
          }
        });
      };

      window.addEventListener('scroll', onScroll, { passive: true });
      this.destroyRef.onDestroy(() => {
        window.removeEventListener('scroll', onScroll);
        if (this.spikeTimeout) clearTimeout(this.spikeTimeout);
      });
    });
  }

  toggleTooltip(): void {
    this.showTooltip.update((open) => !open);
  }
}

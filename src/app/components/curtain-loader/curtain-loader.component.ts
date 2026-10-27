import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  NgZone,
  Output,
  ViewChild,
  signal
} from '@angular/core';
import gsap from 'gsap';

@Component({
  selector: 'app-curtain-loader',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (!isComplete()) {
      <div #loaderContainer class="curtain-loader-wrapper fixed inset-0 z-[99999] pointer-events-auto">
        <!-- 3 Coloured Wipe Curtains (Red, Blue, Green) -->
        <div class="curtain-panel panel-red absolute inset-0 bg-[#E5392F]"></div>
        <div class="curtain-panel panel-blue absolute inset-0 bg-[#2F5BFF]"></div>
        <div class="curtain-panel panel-green absolute inset-0 bg-[#5CC46B] flex flex-col items-center justify-center">
          <!-- Center Avatar Head and Greeting -->
          <div class="avatar-loader-card flex flex-col items-center gap-4 text-white text-center">
            <!-- Doodle Character SVG with Winking Eye -->
            <div class="clay-avatar-face relative w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-[#FFF8F0] border-4 border-[#14110F] shadow-[0_16px_32px_rgba(0,0,0,0.25)] flex items-center justify-center overflow-hidden">
              <!-- Eyeballs -->
              <div class="eyes-row flex items-center gap-4">
                <!-- Left Eye -->
                <div class="eye w-3.5 h-3.5 rounded-full bg-[#14110F]"></div>
                <!-- Right Eye (Winks) -->
                <div
                  class="eye right-eye w-3.5 h-3.5 rounded-full bg-[#14110F] transition-all duration-200"
                  [class.is-winking]="isWinking()"
                ></div>
              </div>
              <!-- Rosy Cheeks -->
              <div class="absolute left-3 bottom-6 w-3 h-2 rounded-full bg-[#FF8FB1]/70"></div>
              <div class="absolute right-3 bottom-6 w-3 h-2 rounded-full bg-[#FF8FB1]/70"></div>
              <!-- Happy Smile -->
              <div class="absolute bottom-4 w-7 h-3 border-b-3 border-[#14110F] rounded-b-full"></div>
            </div>

            <div class="loader-copy">
              <span class="block cabin-sketch-bold text-2xl sm:text-3xl tracking-wide text-[#14110F]">
                PRATHAK SONI
              </span>
              <span class="block text-xs font-mono tracking-widest uppercase text-[#14110F]/80 mt-1">
                Loading Universe &bull; 60FPS
              </span>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .is-winking {
      height: 3px !important;
      border-radius: 2px !important;
      margin-top: 5px;
    }
  `]
})
export class CurtainLoaderComponent implements AfterViewInit {
  @ViewChild('loaderContainer') containerRef?: ElementRef<HTMLDivElement>;
  @Output() animationComplete = new EventEmitter<void>();

  readonly isComplete = signal<boolean>(false);
  readonly isWinking = signal<boolean>(false);

  constructor(private readonly zone: NgZone) {}

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;

    this.zone.runOutsideAngular(() => {
      // Trigger avatar wink at 400ms
      setTimeout(() => {
        this.zone.run(() => this.isWinking.set(true));
        setTimeout(() => this.zone.run(() => this.isWinking.set(false)), 300);
      }, 500);

      // Safety timeout so screen can NEVER be blocked
      const safetyId = setTimeout(() => {
        this.zone.run(() => {
          if (!this.isComplete()) {
            this.isComplete.set(true);
            this.animationComplete.emit();
          }
        });
      }, 2000);

      // Wipe curtains upward
      const tl = gsap.timeline({
        delay: 0.6,
        onStart: () => {
          const el = this.containerRef?.nativeElement;
          if (el) el.style.pointerEvents = 'none';
        },
        onComplete: () => {
          clearTimeout(safetyId);
          this.zone.run(() => {
            this.isComplete.set(true);
            this.animationComplete.emit();
          });
        }
      });

      tl.to('.avatar-loader-card', {
        scale: 0.9,
        opacity: 0,
        duration: 0.35,
        ease: 'power2.in'
      })
      .to('.curtain-panel.panel-green', {
        yPercent: -100,
        duration: 0.75,
        ease: 'power4.inOut'
      }, '-=0.1')
      .to('.curtain-panel.panel-blue', {
        yPercent: -100,
        duration: 0.75,
        ease: 'power4.inOut'
      }, '-=0.62')
      .to('.curtain-panel.panel-red', {
        yPercent: -100,
        duration: 0.75,
        ease: 'power4.inOut'
      }, '-=0.62');
    });
  }
}

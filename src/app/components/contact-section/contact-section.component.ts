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
import confetti from 'canvas-confetti';
import { ToastService } from '../../services/toast.service';
import { AvatarGazeService } from '../../services/avatar-gaze.service';
import { SmoothScrollService } from '../../services/smooth-scroll.service';
import { AccentThemeService } from '../../services/accent-theme.service';

@Component({
  selector: 'app-contact-section',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="contact" class="contact-section relative z-[2] bg-[#FFF8F0] border-t border-[#E8DCCF] pt-20 pb-16 overflow-hidden">
      <!-- Giant Marquee Header (Speed tied to scroll) -->
      <div class="marquee-wrapper relative overflow-hidden py-4 mb-16 select-none bg-[#F7EFE5] border-y border-[#E8DCCF]">
        <div #marqueeTrack class="marquee-track flex whitespace-nowrap will-change-transform">
          @for (i of [1, 2, 3, 4, 5, 6]; track i) {
            <span class="cabin-sketch-bold text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-[#E5392F] mx-6 tracking-wide">
              LET'S BUILD SOMETHING <span class="text-[#14110F]">✳︎</span>
            </span>
          }
        </div>
      </div>

      <div class="max-w-6xl mx-auto px-5 sm:px-8 md:px-[6%]">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          <!-- Left Column: Copy & Interactive Actions (Col 1-6) -->
          <div class="lg:col-span-6">
            <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#E8DCCF] text-xs font-mono font-bold uppercase tracking-wider text-[#E5392F] shadow-xs mb-6">
              <span class="w-2 h-2 rounded-full bg-[#E5392F] animate-pulse"></span>
              <span>06 // INITIATE TRANSMISSION</span>
            </div>

            <h2 class="text-4xl sm:text-5xl md:text-6xl font-black text-[#14110F] text-ink tracking-tight mb-6">
              Have an idea?<br>
              <span class="cabin-sketch-bold text-[#E5392F]">Let's craft it together.</span>
            </h2>

            <p class="text-base sm:text-lg text-[#6B6560] text-muted leading-relaxed max-w-lg mb-8 font-normal">
              Whether you need high-fidelity 3D web environments, complex telemetry dashboards, or modern frontend architecture—my inbox is always open.
            </p>

            <!-- Copy Email Button with Confetti Explosion -->
            <div class="mb-10">
              <button
                type="button"
                (click)="copyEmail()"
                class="magnetic-btn group relative inline-flex items-center gap-3 px-6 py-4 rounded-full bg-[#14110F] text-[#FFF8F0] font-mono text-sm sm:text-base font-bold shadow-[0_12px_30px_rgba(20,17,15,0.2)] hover:bg-[#E5392F] transition-colors duration-200 cursor-pointer select-none"
                data-cursor="COPY"
              >
                <span>prathaksoni.19&#64;gmail.com</span>
                <span class="text-lg group-hover:scale-125 transition-transform">✂️</span>
              </button>
              <span class="block text-xs font-mono text-[#6B6560] text-muted mt-2">
                Click to copy email &amp; trigger confetti explosion
              </span>
            </div>

            <!-- Social Pill Links -->
            <div class="space-y-3">
              <span class="text-xs font-mono uppercase tracking-widest text-[#6B6560] text-muted block font-semibold">
                Elsewhere on the web
              </span>
              <div class="flex flex-wrap gap-2.5">
                @for (social of socialLinks; track social.label) {
                  <a
                    [href]="social.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="magnetic-btn inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E8DCCF] text-xs sm:text-sm font-mono font-bold text-[#14110F] text-ink hover:border-[#E5392F] hover:text-[#E5392F] hover:shadow-xs transition-all duration-200"
                    data-cursor="LINK"
                  >
                    <span>{{ social.icon }}</span>
                    <span>{{ social.label }}</span>
                  </a>
                }
              </div>
            </div>
          </div>

          <!-- Right Column: Interactive Contact Form (Avatar Eyes follow typing) -->
          <div class="lg:col-span-6 bg-white rounded-3xl p-8 sm:p-10 border-2 border-[#E8DCCF] shadow-[0_20px_50px_rgba(20,17,15,0.06)] relative">
            <div class="flex items-center justify-between mb-8">
              <span class="text-xs font-mono uppercase tracking-wider text-[#6B6560] text-muted font-bold">DIRECT DISPATCH</span>
              <!-- Waving Avatar Face Mini -->
              <div class="flex items-center gap-2 text-xs font-mono text-[#6B6560] text-muted">
                <span>Avatar tracking</span>
                <span class="text-base animate-bounce">👀</span>
              </div>
            </div>

            <form (submit)="onSubmit($event)" class="space-y-6">
              <div>
                <label for="name" class="block text-xs font-mono uppercase tracking-wider text-[#14110F] text-ink font-bold mb-2">
                  Your Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  placeholder="Ada Lovelace"
                  class="w-full px-4 py-3 rounded-xl bg-[#F7EFE5] border border-[#E8DCCF] text-sm sm:text-base text-[#14110F] placeholder:text-[#6B6560]/60 focus:outline-none focus:border-[#E5392F] focus:bg-white transition-all font-mono"
                  (input)="onTextInput($event)"
                  (focus)="onInputFocus()"
                  (blur)="onInputBlur()"
                />
              </div>

              <div>
                <label for="email" class="block text-xs font-mono uppercase tracking-wider text-[#14110F] text-ink font-bold mb-2">
                  Your Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  placeholder="ada@computing.org"
                  class="w-full px-4 py-3 rounded-xl bg-[#F7EFE5] border border-[#E8DCCF] text-sm sm:text-base text-[#14110F] placeholder:text-[#6B6560]/60 focus:outline-none focus:border-[#E5392F] focus:bg-white transition-all font-mono"
                  (input)="onTextInput($event)"
                  (focus)="onInputFocus()"
                  (blur)="onInputBlur()"
                />
              </div>

              <div>
                <label for="message" class="block text-xs font-mono uppercase tracking-wider text-[#14110F] text-ink font-bold mb-2">
                  Project Details
                </label>
                <textarea
                  id="message"
                  rows="4"
                  required
                  placeholder="Tell me about what you're building..."
                  class="w-full px-4 py-3 rounded-xl bg-[#F7EFE5] border border-[#E8DCCF] text-sm sm:text-base text-[#14110F] placeholder:text-[#6B6560]/60 focus:outline-none focus:border-[#E5392F] focus:bg-white transition-all font-mono resize-none"
                  (input)="onTextInput($event)"
                  (focus)="onInputFocus()"
                  (blur)="onInputBlur()"
                ></textarea>
              </div>

              <button
                type="submit"
                [disabled]="isSending()"
                class="magnetic-btn w-full py-4 rounded-xl bg-[#E5392F] text-white font-mono text-sm font-bold uppercase tracking-wider hover:opacity-90 active:scale-98 transition-all duration-200 cursor-pointer shadow-md disabled:opacity-50 select-none"
                data-cursor="SEND"
              >
                @if (isSending()) {
                  <span>Transmitting...</span>
                } @else {
                  <span>Send Message &nearr;</span>
                }
              </button>
            </form>
          </div>
        </div>

        <!-- Integrated Footer -->
        <div class="mt-24 pt-10 border-t border-[#E8DCCF] flex flex-col md:flex-row items-center justify-between gap-6 text-xs font-mono text-[#6B6560] text-muted">
          <div class="flex items-center gap-2">
            <span class="font-bold text-[#14110F] text-ink">Prathak Soni</span>
            <span>&bull;</span>
            <span>{{ liveTime() }} IST</span>
            <span>&bull;</span>
            <span class="text-[#0A7F3A] font-semibold">Status: Available</span>
          </div>

          <!-- Secret Party Mode Hint & Back to Top -->
          <div class="flex items-center gap-6">
            <button
              type="button"
              (click)="themeService.activatePartyMode()"
              class="hover:text-[#E5392F] transition-colors cursor-pointer select-none"
              title="Click or press: Up Up Down Down Left Right Left Right B A"
            >
              🎉 Party Mode
            </button>

            <!-- Back to top button where avatar climbs up -->
            <button
              type="button"
              (click)="scrollToTop()"
              class="magnetic-btn inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E8DCCF] hover:border-[#E5392F] text-[#14110F] hover:text-[#E5392F] transition-colors cursor-pointer"
              data-cursor="TOP"
            >
              <span>Back to top</span>
              <span class="text-sm">🧗</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .marquee-track {
      animation: marquee 28s linear infinite;
    }
    @keyframes marquee {
      0% { transform: translateX(0); }
      100% { transform: translateX(-50%); }
    }
  `]
})
export class ContactSectionComponent implements AfterViewInit, OnDestroy {
  @ViewChild('marqueeTrack') marqueeRef?: ElementRef<HTMLDivElement>;

  readonly isSending = signal<boolean>(false);
  readonly liveTime = signal<string>('--:--:--');

  readonly socialLinks = [
    { label: 'LinkedIn', icon: '💼', url: 'https://linkedin.com' },
    { label: 'GitHub', icon: '🐙', url: 'https://github.com' },
    { label: 'Resume (PDF)', icon: '📄', url: '#' },
    { label: 'Twitter / X', icon: '🐦', url: 'https://x.com' }
  ];

  private timeInterval: any = null;
  private scrollVelocityListener: any = null;

  constructor(
    private readonly zone: NgZone,
    private readonly toast: ToastService,
    private readonly avatarGaze: AvatarGazeService,
    private readonly smoothScroll: SmoothScrollService,
    readonly themeService: AccentThemeService
  ) {}

  ngAfterViewInit(): void {
    if (typeof window === 'undefined') return;

    this.startClock();

    // Speed up marquee according to scroll velocity
    this.zone.runOutsideAngular(() => {
      let lastScroll = window.scrollY;
      let lastTime = Date.now();

      this.scrollVelocityListener = () => {
        const now = Date.now();
        const dt = now - lastTime || 16;
        const dy = Math.abs(window.scrollY - lastScroll);
        const velocity = dy / dt;

        const track = this.marqueeRef?.nativeElement;
        if (track) {
          const speedFactor = Math.max(1, Math.min(4, 1 + velocity * 1.5));
          track.style.animationDuration = `${28 / speedFactor}s`;
        }

        lastScroll = window.scrollY;
        lastTime = now;
      };

      window.addEventListener('scroll', this.scrollVelocityListener, { passive: true });
    });
  }

  private startClock(): void {
    const updateTime = () => {
      const now = new Date();
      const istString = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Kolkata',
        hour12: true,
        hour: '2-digit',
        minute: '2-digit'
      });
      this.liveTime.set(istString);
    };
    updateTime();
    this.timeInterval = setInterval(updateTime, 1000);
  }

  /**
   * Signature move: while someone types in the form, the avatar's eyes follow the text caret position
   */
  onTextInput(event: Event): void {
    const input = event.target as HTMLInputElement | HTMLTextAreaElement;
    const progress = Math.min(input.value.length / 32, 1);
    this.avatarGaze.trackTypingProgress(progress);
  }

  onInputFocus(): void {
    this.avatarGaze.trackTypingProgress(0.2);
  }

  onInputBlur(): void {
    this.avatarGaze.stopTyping();
  }

  copyEmail(): void {
    navigator.clipboard.writeText('prathaksoni.19@gmail.com').then(() => {
      this.toast.show('Copied to clipboard ✂️', '🎉', 2500);

      // Trigger confetti explosion in our exact palette!
      confetti({
        particleCount: 85,
        spread: 80,
        origin: { y: 0.75 },
        colors: ['#E5392F', '#2F5BFF', '#5CC46B', '#FFC93C', '#FF8FB1']
      });

      this.avatarGaze.triggerWink();
    });
  }

  onSubmit(e: Event): void {
    e.preventDefault();
    this.isSending.set(true);

    setTimeout(() => {
      this.isSending.set(false);
      this.toast.show('Message dispatched! Will reply within 24h', '🚀', 3500);
      confetti({
        particleCount: 100,
        spread: 100,
        origin: { y: 0.5 },
        colors: ['#2F5BFF', '#5CC46B', '#FFC93C']
      });
      this.avatarGaze.triggerWink();
      (e.target as HTMLFormElement).reset();
    }, 1200);
  }

  scrollToTop(): void {
    this.smoothScroll.scrollTo(0);
    this.avatarGaze.setTarget(0, -1, 'curious');
  }

  ngOnDestroy(): void {
    if (this.timeInterval) clearInterval(this.timeInterval);
    if (this.scrollVelocityListener) {
      window.removeEventListener('scroll', this.scrollVelocityListener);
    }
  }
}

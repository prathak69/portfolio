import { Injectable, NgZone, signal } from '@angular/core';

export interface GazeCoordinates {
  x: number; // -1 to 1 (left to right)
  y: number; // -1 to 1 (up to down)
}

export type AvatarMood = 'neutral' | 'curious' | 'approving' | 'typing' | 'shocked' | 'party';

@Injectable({
  providedIn: 'root'
})
export class AvatarGazeService {
  // Current normalized gaze coordinates
  readonly targetGaze = signal<GazeCoordinates>({ x: 0, y: 0 });
  readonly currentGaze = signal<GazeCoordinates>({ x: 0, y: 0 });
  readonly mood = signal<AvatarMood>('neutral');
  readonly isWinking = signal<boolean>(false);
  readonly thumbsUp = signal<boolean>(false);

  private lastMoveTime = Date.now();
  private idleIntervalId: any = null;
  private approvalTimeoutId: any = null;
  private isUserTyping = false;

  constructor(private readonly zone: NgZone) {
    this.initIdleChecker();
    this.initScrollVelocityObserver();
  }

  /**
   * Set target gaze manually in normalized coordinates (-1 to 1)
   */
  setTarget(x: number, y: number, mood: AvatarMood = 'neutral'): void {
    const clampedX = Math.max(-1, Math.min(1, x));
    const clampedY = Math.max(-1, Math.min(1, y));
    this.targetGaze.set({ x: clampedX, y: clampedY });
    if (!this.isUserTyping && this.mood() !== 'approving') {
      this.mood.set(mood);
    }
    this.lastMoveTime = Date.now();
  }

  /**
   * Update gaze according to screen pixel position (e.g. mouse or element rect)
   */
  setPixelTarget(clientX: number, clientY: number): void {
    if (typeof window === 'undefined') return;
    const centerX = window.innerWidth * 0.5;
    const centerY = window.innerHeight * 0.45;
    const nx = (clientX - centerX) / (window.innerWidth * 0.5);
    const ny = (clientY - centerY) / (window.innerHeight * 0.5);
    this.setTarget(nx, ny);
  }

  /**
   * Signature touch: React when text is selected anywhere on the page
   */
  reactToSelection(rangeRect: DOMRect): void {
    if (typeof window === 'undefined') return;
    const centerX = window.innerWidth * 0.5;
    const centerY = window.innerHeight * 0.45;
    const targetX = (rangeRect.left + rangeRect.width / 2 - centerX) / (window.innerWidth * 0.5);
    const targetY = (rangeRect.top + rangeRect.height / 2 - centerY) / (window.innerHeight * 0.5);

    this.setTarget(targetX, targetY, 'approving');
    this.thumbsUp.set(true);

    if (this.approvalTimeoutId) {
      clearTimeout(this.approvalTimeoutId);
    }
    this.approvalTimeoutId = setTimeout(() => {
      this.thumbsUp.set(false);
      this.mood.set('neutral');
    }, 2400);
  }

  /**
   * Track caret typing in the contact form
   */
  trackTypingProgress(progress0to1: number): void {
    this.isUserTyping = true;
    const lookX = -0.6 + progress0to1 * 1.2;
    const lookY = 0.5; // Look down toward form input
    this.setTarget(lookX, lookY, 'typing');
  }

  stopTyping(): void {
    this.isUserTyping = false;
    this.mood.set('neutral');
    this.setTarget(0, 0);
  }

  /**
   * Trigger a friendly wink
   */
  triggerWink(): void {
    this.isWinking.set(true);
    setTimeout(() => this.isWinking.set(false), 380);
  }

  /**
   * Idle loop: If no mouse move for > 4s, look around naturally
   */
  private initIdleChecker(): void {
    if (typeof window === 'undefined') return;
    this.zone.runOutsideAngular(() => {
      this.idleIntervalId = setInterval(() => {
        const idleFor = Date.now() - this.lastMoveTime;
        if (idleFor > 4000 && !this.isUserTyping && this.mood() === 'neutral') {
          // Subtle natural saccade
          const randomX = (Math.random() - 0.5) * 0.5;
          const randomY = (Math.random() - 0.5) * 0.4;
          this.zone.run(() => {
            this.setTarget(randomX, randomY, 'curious');
          });
        }
      }, 3500);
    });
  }

  /**
   * Fast scroll detector: eyes widen when scrolling fast
   */
  private initScrollVelocityObserver(): void {
    if (typeof window === 'undefined') return;
    let lastScrollY = window.scrollY;
    let lastTime = Date.now();

    this.zone.runOutsideAngular(() => {
      window.addEventListener('scroll', () => {
        const now = Date.now();
        const dt = now - lastTime || 16;
        const dy = Math.abs(window.scrollY - lastScrollY);
        const velocity = dy / dt;

        if (velocity > 1.8 && this.mood() !== 'approving') {
          this.zone.run(() => {
            this.mood.set('shocked');
          });
          setTimeout(() => {
            if (this.mood() === 'shocked') {
              this.zone.run(() => this.mood.set('neutral'));
            }
          }, 600);
        }

        lastScrollY = window.scrollY;
        lastTime = now;
      }, { passive: true });
    });
  }

  destroy(): void {
    if (this.idleIntervalId) clearInterval(this.idleIntervalId);
    if (this.approvalTimeoutId) clearTimeout(this.approvalTimeoutId);
  }
}

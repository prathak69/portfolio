import { Injectable, NgZone } from '@angular/core';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined' && typeof window.matchMedia === 'function') {
  gsap.registerPlugin(ScrollTrigger);
}

@Injectable({
  providedIn: 'root'
})
export class SmoothScrollService {
  private lenis: Lenis | null = null;
  private tickerCallback: ((time: number) => void) | null = null;
  private isInitialized = false;

  constructor(private readonly zone: NgZone) {}

  init(): void {
    if (this.isInitialized || typeof window === 'undefined') return;
    this.isInitialized = true;

    this.zone.runOutsideAngular(() => {
      // 1. Initialize Lenis smooth scroll
      this.lenis = new Lenis({
        duration: 1.1,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        orientation: 'vertical',
        gestureOrientation: 'vertical',
        smoothWheel: true,
        wheelMultiplier: 0.95,
        touchMultiplier: 1.8,
      });

      // 2. Connect Lenis to ScrollTrigger & window scroll events
      this.lenis.on('scroll', (e: any) => {
        ScrollTrigger.update();
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('lenis-scroll', { detail: e }));
        }
      });

      // 3. Sync GSAP ticker with Lenis raf
      this.tickerCallback = (time: number) => {
        this.lenis?.raf(time * 1000);
      };
      gsap.ticker.add(this.tickerCallback);
      gsap.ticker.lagSmoothing(0);
    });
  }

  scrollTo(target: string | HTMLElement | number, offset = 0): void {
    if (this.lenis) {
      this.lenis.scrollTo(target as any, { offset, duration: 1.2 });
    } else if (typeof document !== 'undefined') {
      if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'smooth' });
      } else if (typeof target === 'string') {
        const el = document.querySelector(target);
        el?.scrollIntoView({ behavior: 'smooth' });
      } else {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  getLenisInstance(): Lenis | null {
    return this.lenis;
  }

  destroy(): void {
    if (this.tickerCallback) {
      gsap.ticker.remove(this.tickerCallback);
      this.tickerCallback = null;
    }
    if (this.lenis) {
      this.lenis.destroy();
      this.lenis = null;
    }
    this.isInitialized = false;
  }
}

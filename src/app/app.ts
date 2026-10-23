import { Component, ElementRef, HostListener, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatRipple } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Typewriter } from './services/typewriter';
import { MASCOT_IMAGE_DATA } from './mascot-data';

import { ProjectStackComponent } from './components/sticky-stacking-cards';
import { DEFAULT_PROJECTS } from './models/project-card.model';

@Component({
  selector: 'app-root',
  imports: [MatRipple, ProjectStackComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy{
  readonly projects = DEFAULT_PROJECTS;
  @ViewChild('bgVideo', { static: true }) bgVideoRef!: ElementRef<HTMLVideoElement>;

  readonly mascotImage = MASCOT_IMAGE_DATA;

  readonly typewriter = inject(Typewriter);
  private readonly clipboard = inject(Clipboard);
  private readonly snackBar = inject(MatSnackBar);

  // Navigation items
  readonly navLinks = ['Labs', 'Studio', 'Openings', 'Shop'];

  // Action pill buttons
  readonly pillButtons = [
    'Pitch us an idea',
    'Come work here',
    'Send a brief hello',
    'See how we operate'
  ];

  // UI state signals
  readonly isMobileMenuOpen = signal<boolean>(false);
  readonly showPills = signal<boolean>(false);

  // Video mouse-scrubbing state
  private targetTime = 0;
  private currentRenderTime = 0.001;
  private isRafRunning = false;
  private rafId: number | null = null;
  private pillsTimeoutId?: ReturnType<typeof setTimeout>;

  // Head tracking mode:
  // true = natural gaze tracking (center = forward, right = look right, left = look left)
  // false = linear scrub from start (0s) to end (10s) across screen
  readonly headTrackingMode = true;

  // Optimized Cloudinary URL with keyframe-interval transformation (ki_0.05).
  // Generates keyframes on every frame so video scrubbing follows cursor instantly without decoder lag.
  readonly videoUrl =
    'https://res.cloudinary.com/prathaksoni/video/upload/ki_0.05/v1792591379/0e97306f-2b09-43d8-9101-c6d03ef9c936_ndhdmu.mp4';
    
  readonly fullText =
    'Glad you stopped in. Good taste tends to find us. Now, what are we building?';

  ngOnInit(): void {
    // Start typewriter (speed: 38ms, startDelay: 600ms)
    this.typewriter.start(this.fullText, 38, 600);

    // Reveal action pill buttons 400ms after load (independent of typewriter)
    this.pillsTimeoutId = setTimeout(() => {
      this.showPills.set(true);
    }, 400);
  }

  ngOnDestroy(): void {
    this.typewriter.cleanup();
    if (this.pillsTimeoutId) {
      clearTimeout(this.pillsTimeoutId);
    }
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
    this.isRafRunning = false;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  // Safe zone tracking around character's face
  private isInsideSafeZone = false;

  // Listen to 2D mouse movement to steer character gaze direction in real time
  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    this.updateTargetByCursor(event.clientX, event.clientY);
  }

  @HostListener('window:touchmove', ['$event'])
  onTouchMove(event: TouchEvent): void {
    if (event.touches.length > 0) {
      this.updateTargetByCursor(event.touches[0].clientX, event.touches[0].clientY);
    }
  }

  // When cursor leaves the browser window, character calmly looks straight ahead
  @HostListener('window:mouseleave')
  onMouseLeave(): void {
    this.isInsideSafeZone = true;
    this.targetTime = 0.0;
    this.startSmoothLoop();
  }

  private updateTargetByCursor(clientX: number, clientY: number): void {
    const video = this.bgVideoRef?.nativeElement;
    if (!video || !video.duration || isNaN(video.duration)) {
      return;
    }

    // Character's face center on screen:
    // Horizontally centered (50%), vertically around eyes/nose level (42% from top)
    const centerX = window.innerWidth * 0.5;
    const centerY = window.innerHeight * 0.42;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const dist = Math.hypot(dx, dy);

    // Safe distance around the face: inside this radius, the character looks straight/front at the user.
    // Scales with viewport size (minimum 125px, up to ~18% of smaller screen dimension).
    const baseSafeRadius = Math.max(125, Math.min(window.innerWidth, window.innerHeight) * 0.18);
    const enterRadius = baseSafeRadius;
    const exitRadius = baseSafeRadius + 25; // Hysteresis buffer to completely eliminate edge jitter

    if (this.isInsideSafeZone) {
      if (dist < exitRadius) {
        this.targetTime = 0.0;
        this.startSmoothLoop();
        return;
      }
      this.isInsideSafeZone = false;
    } else {
      if (dist <= enterRadius) {
        this.isInsideSafeZone = true;
        this.targetTime = 0.0;
        this.startSmoothLoop();
        return;
      }
    }

    // Outside the safe distance: head follows the cursor
    // Angle in degrees relative to STRAIGHT UP (12 o'clock = 0°, RIGHT = +90°, DOWN = ±180°, LEFT = -90°)
    const angleFromUp = (Math.atan2(dx, -dy) * 180) / Math.PI;

    let angleTime = 0;
    if (Math.abs(angleFromUp) <= 32) {
      // UP cone (-32° to +32°): Navbar links (Labs, Studio, Openings, Shop)
      // Character looks straight UP at ~1.0s (chin raised, eyes up towards navbar)
      angleTime = 1.0 + (angleFromUp / 32) * 0.25;
    } else if (angleFromUp > 32 && angleFromUp <= 90) {
      // UP-RIGHT to RIGHT (+32° to +90°): 1.25s -> 3.8s
      angleTime = 1.25 + ((angleFromUp - 32) / 58) * 2.55;
    } else if (angleFromUp > 90) {
      // RIGHT to DOWN (+90° to +180°): 3.8s -> 5.5s
      angleTime = 3.8 + ((angleFromUp - 90) / 90) * 1.7;
    } else if (angleFromUp < -32 && angleFromUp >= -90) {
      // UP-LEFT to LEFT (-32° to -90°): 9.2s -> 8.0s
      angleTime = 9.2 - ((Math.abs(angleFromUp) - 32) / 58) * 1.2;
    } else {
      // LEFT to DOWN (-90° to -180°): 8.0s -> 5.5s
      angleTime = 8.0 - ((Math.abs(angleFromUp) - 90) / 90) * 2.5;
    }

    this.targetTime = angleTime;
    this.startSmoothLoop();
  }

  /**
   * Silky smooth circular head rotation loop.
   * Interpolates current video time towards targetTime along the shortest circular path
   * on the 10-second loop with organic human-like easing.
   */
  private startSmoothLoop(): void {
    if (this.isRafRunning) return;
    this.isRafRunning = true;

    const tick = () => {
      const video = this.bgVideoRef?.nativeElement;
      if (!video) {
        this.isRafRunning = false;
        this.rafId = null;
        return;
      }

      const duration = video.duration || 10.005;

      // Shortest circular delta on the 10-second loop
      let diff = this.targetTime - this.currentRenderTime;
      while (diff > duration / 2) diff -= duration;
      while (diff < -duration / 2) diff += duration;

      if (Math.abs(diff) < 0.015) {
        // Settled exactly at target position
        this.currentRenderTime = this.targetTime;
        video.currentTime = this.currentRenderTime;
        this.isRafRunning = false;
        this.rafId = null;
        return;
      }

      // Smooth exponential easing with speed clamp for silky smooth head rotation
      // 0.12 factor gives ~250-300ms natural easing transition
      const proportionalStep = Math.abs(diff) * 0.12;
      const stepMagnitude = Math.min(Math.max(proportionalStep, 0.015), 0.08);
      const step = Math.sign(diff) * Math.min(stepMagnitude, Math.abs(diff));

      let nextTime = this.currentRenderTime + step;
      while (nextTime >= duration) nextTime -= duration;
      while (nextTime < 0) nextTime += duration;

      this.currentRenderTime = nextTime;
      video.currentTime = this.currentRenderTime;

      this.rafId = requestAnimationFrame(tick);
    };

    this.rafId = requestAnimationFrame(tick);
  }

  onVideoSeeked(): void {
    if (!this.isRafRunning) {
      const video = this.bgVideoRef?.nativeElement;
      if (video) {
        const duration = video.duration || 10.005;
        let diff = this.targetTime - this.currentRenderTime;
        while (diff > duration / 2) diff -= duration;
        while (diff < -duration / 2) diff += duration;
        if (Math.abs(diff) > 0.03) {
          this.startSmoothLoop();
        }
      }
    }
  }

  onMetadataLoaded(): void {
    const video = this.bgVideoRef?.nativeElement;
    if (video) {
      // Paint forward-facing frame immediately on load
      this.currentRenderTime = 0.001;
      this.targetTime = 0.0;
      video.currentTime = 0.001;
    }
  }

  copyEmail(): void {
    const email = 'prathaksoni.19@gmail.com';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email);
    } else {
      this.clipboard.copy(email);
    }

    this.snackBar.open('Copied prathaksoni.19@gmail.com to clipboard', '', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}

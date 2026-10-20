import { Component, ElementRef, HostListener, inject, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { MatRipple } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Typewriter } from './services/typewriter';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, MatRipple],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit, OnDestroy{
  @ViewChild('bgVideo', { static: true }) bgVideoRef!: ElementRef<HTMLVideoElement>;

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
  private readonly SENSITIVITY = 0.8;
  private prevX: number | null = null;
  private targetTime = 0;
  private isSeeking = false;
  private pendingSeek = false;
  private pillsTimeoutId?: ReturnType<typeof setTimeout>;

  readonly videoUrl =
    'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260826_041744_63efcd78-bf7d-4039-99e2-2461e8a61903.mp4';

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
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((open) => !open);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }

  // Listen to horizontal mouse movement on window to scrub video
  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    const video = this.bgVideoRef?.nativeElement;
    if (!video || !video.duration || isNaN(video.duration)) {
      this.prevX = event.clientX;
      return;
    }

    if (this.prevX === null) {
      this.prevX = event.clientX;
      this.targetTime = video.currentTime;
      return;
    }

    const delta = event.clientX - this.prevX;
    this.prevX = event.clientX;

    const timeOffset = (delta / window.innerWidth) * this.SENSITIVITY * video.duration;
    this.targetTime = Math.max(0, Math.min(video.duration, this.targetTime + timeOffset));

    this.seekVideo(video);
  }

  private seekVideo(video: HTMLVideoElement): void {
    if (!this.isSeeking) {
      this.isSeeking = true;
      video.currentTime = this.targetTime;
    } else {
      // Queue next seek if currently seeking to prevent seek-flooding
      this.pendingSeek = true;
    }
  }

  onVideoSeeked(): void {
    const video = this.bgVideoRef?.nativeElement;
    this.isSeeking = false;

    if (this.pendingSeek && video) {
      this.pendingSeek = false;
      if (Math.abs(video.currentTime - this.targetTime) > 0.01) {
        this.seekVideo(video);
      }
    }
  }

  copyEmail(): void {
    const email = 'hello@mainframe.co';
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(email);
    } else {
      this.clipboard.copy(email);
    }

    this.snackBar.open('Copied hello@mainframe.co to clipboard', '', {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}

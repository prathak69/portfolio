import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class Typewriter {

  readonly displayed = signal<string>('');
  readonly done = signal<boolean>(false);

  private timeoutId?: ReturnType<typeof setTimeout>;
  private intervalId?: ReturnType<typeof setInterval>;

  start(text: string, speed = 38, startDelay = 600): void {
    this.cleanup();
    this.displayed.set('');
    this.done.set(false);

    this.timeoutId = setTimeout(() => {
      let currentIndex = 0;

      this.intervalId = setInterval(() => {
        currentIndex++;
        this.displayed.set(text.slice(0, currentIndex));

        if (currentIndex >= text.length) {
          this.done.set(true);
          if (this.intervalId) {
            clearInterval(this.intervalId);
          }
        }
      }, speed);
    }, startDelay);
  }

  cleanup(): void {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    if (this.intervalId) clearInterval(this.intervalId);
  }
}

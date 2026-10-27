import { Injectable, signal } from '@angular/core';

export interface ToastMessage {
  text: string;
  icon?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  readonly message = signal<string | null>(null);
  readonly icon = signal<string>('✂️');
  readonly isVisible = signal<boolean>(false);

  private timeoutId: any = null;

  show(text: string, icon = '✂️', durationMs = 2200): void {
    this.message.set(text);
    this.icon.set(icon);
    this.isVisible.set(true);

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      this.isVisible.set(false);
      setTimeout(() => this.message.set(null), 300);
    }, durationMs);
  }
}

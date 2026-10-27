import { Injectable } from '@angular/core';

export interface SelectionHighlightColor {
  readonly name: string;
  readonly bg: string;
  readonly text: string;
}

export const SELECTION_HIGHLIGHT_PALETTE: readonly SelectionHighlightColor[] = [
  { name: 'orange', bg: '#FF7A00', text: '#0C0C0C' },
  { name: 'red', bg: '#E5252A', text: '#FFFFFF' },
  { name: 'blue', bg: '#1F5BFF', text: '#FFFFFF' },
  { name: 'purple', bg: '#6D3BFF', text: '#FFFFFF' },
  { name: 'pink', bg: '#FF4D94', text: '#0C0C0C' },
  { name: 'green', bg: '#22C55E', text: '#0C0C0C' },
  { name: 'cyan', bg: '#06B6D4', text: '#0C0C0C' },
  { name: 'yellow', bg: '#FFC400', text: '#0C0C0C' },
  { name: 'emerald', bg: '#10B981', text: '#0C0C0C' },
  { name: 'rose', bg: '#F43F5E', text: '#FFFFFF' },
  { name: 'indigo', bg: '#4F46E5', text: '#FFFFFF' },
] as const;

/**
 * Service that changes the text selection highlight to a random accent colour
 * every time a user makes a text selection anywhere across the application.
 */
@Injectable({
  providedIn: 'root'
})
export class RandomSelectionHighlightService {
  private lastIndex = -1;
  private isSelecting = false;
  private styleElement: HTMLStyleElement | null = null;
  private initialized = false;

  private onPointerDownBound?: () => void;
  private onSelectStartBound?: () => void;
  private onSelectionChangeBound?: () => void;
  private onPointerUpBound?: () => void;

  init(): void {
    if (this.initialized || typeof document === 'undefined') {
      return;
    }
    this.initialized = true;

    // Ensure style tag exists in head
    this.ensureStyleElement();

    // Pick an initial random accent
    this.applyRandomAccent();

    // Event Listeners:
    // 1. pointerdown: marks start of a user interaction (clears isSelecting flag)
    this.onPointerDownBound = () => {
      this.isSelecting = false;
    };

    // 2. selectstart: fires when text drag / double-click selection begins
    this.onSelectStartBound = () => {
      this.isSelecting = true;
      this.applyRandomAccent();
    };

    // 3. selectionchange: handles keyboard selection (Cmd+A, Shift+Arrows) and collapsed selections
    this.onSelectionChangeBound = () => {
      const sel = document.getSelection();
      const hasSelection = !!sel && !sel.isCollapsed && sel.toString().trim().length > 0;

      if (hasSelection) {
        if (!this.isSelecting) {
          // Triggered via keyboard or external selection
          this.isSelecting = true;
          this.applyRandomAccent();
        }
      } else {
        this.isSelecting = false;
      }
    };

    this.onPointerUpBound = () => {
      // Completed drag gesture
    };

    document.addEventListener('pointerdown', this.onPointerDownBound, { passive: true });
    document.addEventListener('selectstart', this.onSelectStartBound, { passive: true });
    document.addEventListener('selectionchange', this.onSelectionChangeBound, { passive: true });
    window.addEventListener('pointerup', this.onPointerUpBound, { passive: true });
  }

  destroy(): void {
    if (typeof document === 'undefined') return;

    if (this.onPointerDownBound) {
      document.removeEventListener('pointerdown', this.onPointerDownBound);
    }
    if (this.onSelectStartBound) {
      document.removeEventListener('selectstart', this.onSelectStartBound);
    }
    if (this.onSelectionChangeBound) {
      document.removeEventListener('selectionchange', this.onSelectionChangeBound);
    }
    if (this.onPointerUpBound) {
      window.removeEventListener('pointerup', this.onPointerUpBound);
    }

    if (this.styleElement && this.styleElement.parentNode) {
      this.styleElement.parentNode.removeChild(this.styleElement);
      this.styleElement = null;
    }

    this.initialized = false;
  }

  getRandomColor(): SelectionHighlightColor {
    const palette = SELECTION_HIGHLIGHT_PALETTE;
    let nextIndex: number;
    do {
      nextIndex = Math.floor(Math.random() * palette.length);
    } while (nextIndex === this.lastIndex && palette.length > 1);

    this.lastIndex = nextIndex;
    return palette[nextIndex];
  }

  applyRandomAccent(): SelectionHighlightColor {
    const color = this.getRandomColor();
    this.applyColor(color);
    return color;
  }

  applyColor(color: SelectionHighlightColor): void {
    if (typeof document === 'undefined') return;

    // 1. Update CSS custom properties on :root
    document.documentElement.style.setProperty('--selection-bg', color.bg);
    document.documentElement.style.setProperty('--selection-text', color.text);

    // 2. Update dynamic style tag for instant, guaranteed cross-browser rendering
    this.ensureStyleElement();
    if (this.styleElement) {
      this.styleElement.textContent = `
        ::selection, *::selection {
          background-color: ${color.bg} !important;
          color: ${color.text} !important;
        }
        ::-moz-selection, *::-moz-selection {
          background-color: ${color.bg} !important;
          color: ${color.text} !important;
        }
      `;
    }
  }

  private ensureStyleElement(): void {
    if (typeof document === 'undefined') return;

    if (!this.styleElement) {
      const existing = document.getElementById('dynamic-selection-style') as HTMLStyleElement | null;
      if (existing) {
        this.styleElement = existing;
      } else {
        this.styleElement = document.createElement('style');
        this.styleElement.id = 'dynamic-selection-style';
        document.head.appendChild(this.styleElement);
      }
    }
  }
}

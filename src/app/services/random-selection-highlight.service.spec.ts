import { TestBed } from '@angular/core/testing';
import {
  RandomSelectionHighlightService,
  SELECTION_HIGHLIGHT_PALETTE
} from './random-selection-highlight.service';

describe('RandomSelectionHighlightService', () => {
  let service: RandomSelectionHighlightService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RandomSelectionHighlightService);
  });

  afterEach(() => {
    service.destroy();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have a palette of distinct accent colors', () => {
    expect(SELECTION_HIGHLIGHT_PALETTE.length).toBeGreaterThanOrEqual(8);
    for (const color of SELECTION_HIGHLIGHT_PALETTE) {
      expect(color.bg).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(color.text).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  it('should not pick the same color consecutively when multiple colors exist', () => {
    const first = service.getRandomColor();
    const second = service.getRandomColor();
    expect(first.bg).not.toBe(second.bg);
  });

  it('should apply random accent color to document root and dynamic style element', () => {
    const applied = service.applyRandomAccent();
    expect(applied).toBeTruthy();

    const rootBg = document.documentElement.style.getPropertyValue('--selection-bg');
    const rootText = document.documentElement.style.getPropertyValue('--selection-text');

    expect(rootBg).toBe(applied.bg);
    expect(rootText).toBe(applied.text);

    const styleEl = document.getElementById('dynamic-selection-style');
    expect(styleEl).toBeTruthy();
    expect(styleEl?.textContent).toContain(applied.bg);
  });

  it('should initialize and clean up event listeners and style element', () => {
    service.init();
    expect(document.getElementById('dynamic-selection-style')).toBeTruthy();

    service.destroy();
    expect(document.getElementById('dynamic-selection-style')).toBeNull();
  });

  it('should trigger new color on selectstart event', () => {
    service.init();
    const initialBg = document.documentElement.style.getPropertyValue('--selection-bg');

    // Simulate selectstart event
    document.dispatchEvent(new Event('selectstart'));
    const nextBg = document.documentElement.style.getPropertyValue('--selection-bg');

    expect(nextBg).not.toBe(initialBg);
  });
});

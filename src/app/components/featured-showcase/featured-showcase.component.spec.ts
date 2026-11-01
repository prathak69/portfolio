// Polyfill window.matchMedia and ResizeObserver for JSDOM / Vitest
if (typeof window !== 'undefined') {
  if (!window.matchMedia) {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: (query: string) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: () => {},
        removeListener: () => {},
        addEventListener: () => {},
        removeEventListener: () => {},
        dispatchEvent: () => false,
      }),
    });
  }
  if (!(window as any).ResizeObserver) {
    (window as any).ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    };
  }
}

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FeaturedShowcaseComponent } from './featured-showcase.component';

describe('FeaturedShowcaseComponent', () => {
  let component: FeaturedShowcaseComponent;
  let fixture: ComponentFixture<FeaturedShowcaseComponent>;

  beforeEach(async () => {
    vi.spyOn(ScrollTrigger, 'create').mockImplementation(
      () => ({ kill: vi.fn(), refresh: vi.fn() } as any)
    );

    await TestBed.configureTestingModule({
      imports: [FeaturedShowcaseComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeaturedShowcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render editorial top header with letters mask and [ CASE STUDIES ]', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const title = compiled.querySelector('.title');
    const label = compiled.querySelector('.label');

    expect(title?.textContent?.trim()).toContain('FEATURED');
    expect(label?.textContent?.trim()).toBe('[ CASE STUDIES ]');
  });

  it('should render 4 real resume projects', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const items = compiled.querySelectorAll('.item');
    expect(items.length).toBe(4);
    expect(component.projects.length).toBe(4);
  });

  it('should render asymmetric split view with media and info for each item', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const medias = compiled.querySelectorAll('.media');
    const infos = compiled.querySelectorAll('.info');

    expect(medias.length).toBe(4);
    expect(infos.length).toBe(4);
  });

  it('should display padded numerals and project titles', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const nums = compiled.querySelectorAll('.num');
    const headings = compiled.querySelectorAll('.info h3');

    expect(nums[0]?.textContent?.trim()).toBe('01');
    expect(nums[1]?.textContent?.trim()).toBe('02');
    expect(nums[2]?.textContent?.trim()).toBe('03');
    expect(nums[3]?.textContent?.trim()).toBe('04');

    expect(headings[0]?.textContent).toContain('Causal & Impact');
    expect(headings[1]?.textContent).toContain('Talk-A-Tive');
    expect(headings[2]?.textContent).toContain('Dead by Shot');
    expect(headings[3]?.textContent).toContain('Gold Price Prediction');
  });

  it('should render contextual cues with next link and contact on last item', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const cues = compiled.querySelectorAll('.cue');

    expect(cues.length).toBe(4);
    expect(cues[0]?.textContent).toContain('Next project');
    expect(cues[3]?.textContent).toContain('Contact');
  });

  it('should render preview cursor with VIEW CASE pill', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const cursor = compiled.querySelector('.cursor');
    const previews = compiled.querySelectorAll('.pv');
    const pill = compiled.querySelector('.pill');

    expect(cursor).toBeTruthy();
    expect(previews.length).toBe(4);
    expect(pill?.textContent).toContain('VIEW CASE →');
  });
});

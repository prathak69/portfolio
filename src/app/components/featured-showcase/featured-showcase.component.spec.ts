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
import {
  FeaturedShowcaseComponent,
  FEATURED_PROJECTS_MOCK,
} from './featured-showcase.component';

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

  it('should render editorial top header with FEATURED. and [ CASE STUDIES ]', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const heading = compiled.querySelector('.featured-heading');
    const bracketTag = compiled.querySelector('.bracket-tag');

    expect(heading?.textContent?.trim()).toContain('FEATURED.');
    expect(bracketTag?.textContent?.trim()).toBe('[ CASE STUDIES ]');
  });

  it('should render 3 showcase items based on mock data', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const items = compiled.querySelectorAll('.showcase-item');
    expect(items.length).toBe(FEATURED_PROJECTS_MOCK.length);
  });

  it('should render asymmetric split view with media-col and info-col for each item', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const mediaCols = compiled.querySelectorAll('.media-col');
    const infoCols = compiled.querySelectorAll('.info-col');

    expect(mediaCols.length).toBe(FEATURED_PROJECTS_MOCK.length);
    expect(infoCols.length).toBe(FEATURED_PROJECTS_MOCK.length);
  });

  it('should display padded numerals and project titles', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const nums = compiled.querySelectorAll('.project-num');
    const titles = compiled.querySelectorAll('.project-title');

    expect(nums[0]?.textContent?.trim()).toBe('01');
    expect(nums[1]?.textContent?.trim()).toBe('02');
    expect(nums[2]?.textContent?.trim()).toBe('03');

    expect(titles[0]?.textContent?.trim()).toBe(FEATURED_PROJECTS_MOCK[0].title);
  });

  it('should render floating bottom dock navigation with links and LET\'S TALK CTA', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const dock = compiled.querySelector('.floating-dock');
    const links = compiled.querySelectorAll('.dock-link');
    const ctaBtn = compiled.querySelector('.dock-cta-btn');

    expect(dock).toBeTruthy();
    expect(links.length).toBe(3);
    expect(ctaBtn?.textContent).toContain("LET'S TALK");
  });

  it('should render contextual cue with arrow (Next project ↘ / Testimonials ↘)', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const cues = compiled.querySelectorAll('.contextual-cue');

    expect(cues.length).toBe(FEATURED_PROJECTS_MOCK.length);
    expect(cues[0]?.textContent).toContain('Next project');
    expect(cues[0]?.textContent).toContain('↘');
    expect(cues[2]?.textContent).toContain('Testimonials');
  });

  it('should render magnetic cursor root with collapsed square and VIEW CASE preview card', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const cursorRoot = compiled.querySelector('.magnetic-cursor-root');
    const cursorSquare = compiled.querySelector('.cursor-square');
    const previewCard = compiled.querySelector('.cursor-preview-card');
    const viewCasePill = compiled.querySelector('.view-case-pill');

    expect(cursorRoot).toBeTruthy();
    expect(cursorSquare).toBeTruthy();
    expect(previewCard).toBeTruthy();
    expect(viewCasePill?.textContent).toContain('VIEW CASE');
  });
});

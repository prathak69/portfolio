// Polyfill window.matchMedia for JSDOM / Vitest
if (typeof window !== 'undefined' && !window.matchMedia) {
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

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
gsap.registerPlugin(ScrollTrigger);

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManifestoRevealComponent } from './manifesto-reveal.component';

describe('ManifestoRevealComponent', () => {
  let fixture: ComponentFixture<ManifestoRevealComponent>;
  let component: ManifestoRevealComponent;

  beforeEach(async () => {
    vi.spyOn(ScrollTrigger, 'create').mockImplementation(
      () => ({ kill: vi.fn(), refresh: vi.fn() } as any)
    );

    await TestBed.configureTestingModule({
      imports: [ManifestoRevealComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ManifestoRevealComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the clean editorial header without top strip', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const archBand = compiled.querySelector('.curved-arch-band');
    expect(archBand).toBeNull();

    const header = compiled.querySelector('.manifesto-header');
    expect(header).toBeTruthy();
    expect(header?.textContent).toContain('A BIT ABOUT US');
  });

  it('should contain the full manifesto text in tokens', () => {
    const fullText = component.tokens.map((t) => t.text).join(' ');
    expect(fullText).toContain('We believe creative work needs focus.');
    expect(fullText).toContain("That's why we keep our team tight");
    expect(fullText).toContain('so every project gets our full attention.');
    expect(fullText).toContain('We build brands from scratch or make them better.');
  });

  it('should highlight key accent phrases in orange', () => {
    const accentTokens = component.tokens.filter((t) => t.isAccent);
    const accentPhrases = Array.from(new Set(accentTokens.map((t) => t.accentPhrase)));

    expect(accentPhrases).toContain('creative');
    expect(accentPhrases).toContain('our team tight');
    expect(accentPhrases).toContain('project gets');
    expect(accentPhrases).toContain('from scratch');
    expect(accentPhrases).toContain('better');
  });

  it('should configure the 3 floating micro-pill badges on their exact Two26 anchor words', () => {
    const badges = component.tokens.filter((t) => t.badgeKey);
    expect(badges.length).toBe(3);

    const badgeTexts = badges.map((b) => b.badgeText);
    expect(badgeTexts).toContain('Professional overthinkers');
    expect(badgeTexts).toContain('Nerding out on design');
    expect(badgeTexts).toContain('Allergic to generic');

    // Verify exact anchor tokens
    const overthinkersToken = component.tokens.find((t) => t.badgeKey === 'overthinkers');
    const nerdingToken = component.tokens.find((t) => t.badgeKey === 'nerding');
    const genericToken = component.tokens.find((t) => t.badgeKey === 'generic');

    expect(overthinkersToken?.text).toBe('keep');
    expect(nerdingToken?.text).toBe('high,');
    expect(genericToken?.text).toBe('brands');
  });

  it('should render the micro-pill badge elements in the DOM', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    const badgeOverthinkers = compiled.querySelector('.badge-overthinkers');
    const badgeNerding = compiled.querySelector('.badge-nerding');
    const badgeGeneric = compiled.querySelector('.badge-generic');

    expect(badgeOverthinkers).toBeTruthy();
    expect(badgeNerding).toBeTruthy();
    expect(badgeGeneric).toBeTruthy();

    expect(badgeOverthinkers?.textContent?.trim()).toContain('Professional overthinkers');
    expect(badgeNerding?.textContent?.trim()).toContain('Nerding out on design');
    expect(badgeGeneric?.textContent?.trim()).toContain('Allergic to generic');
  });

  it('should update progress on updateProgress call', () => {
    component.updateProgress(0);
    const compiled = fixture.nativeElement as HTMLElement;
    const firstWord = compiled.querySelector('.manifesto-word') as HTMLElement;
    expect(firstWord).toBeTruthy();

    component.updateProgress(1);
    expect(firstWord.style.getPropertyValue('--fill')).toBe('1.000');
  });
});

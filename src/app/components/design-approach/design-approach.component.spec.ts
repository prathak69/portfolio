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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DesignApproachComponent } from './design-approach.component';

describe('DesignApproachComponent', () => {
  let component: DesignApproachComponent;
  let fixture: ComponentFixture<DesignApproachComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DesignApproachComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DesignApproachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should define the 4 foundational design principles', () => {
    expect(component.principles.length).toBe(4);
    expect(component.principles[0].title).toBe('Clarity First');
    expect(component.principles[1].title).toBe('Data Should Feel Alive');
    expect(component.principles[2].title).toBe('Performance Is Design');
    expect(component.principles[3].title).toBe('Details Matter');
  });

  it('should render 4 principle cards in the template', () => {
    const cards = fixture.nativeElement.querySelectorAll('.principle-card');
    expect(cards.length).toBe(4);
  });

  it('should have section header with Design Approach title', () => {
    const heading = fixture.nativeElement.querySelector('h2');
    expect(heading).toBeTruthy();
    expect(heading.textContent).toContain('Design');
    expect(heading.textContent).toContain('Approach');
  });
});

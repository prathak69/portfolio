import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardComponent } from './card/card.component';
import { ChipComponent } from './chip/chip.component';
import { PillComponent } from './pill/pill.component';
import { MonoLabelComponent } from './mono-label/mono-label.component';
import { SectionHeadingComponent } from './section-heading/section-heading.component';

describe('UI System Components', () => {
  describe('CardComponent', () => {
    let fixture: ComponentFixture<CardComponent>;
    let component: CardComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [CardComponent]
      }).compileComponents();

      fixture = TestBed.createComponent(CardComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create and default to cream variant', () => {
      expect(component).toBeTruthy();
      expect(component.variant()).toBe('cream');
      const el = fixture.nativeElement.querySelector('.ui-card');
      expect(el.classList.contains('variant-cream')).toBe(true);
    });
  });

  describe('ChipComponent', () => {
    let fixture: ComponentFixture<ChipComponent>;
    let component: ChipComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ChipComponent]
      }).compileComponents();

      fixture = TestBed.createComponent(ChipComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should create and render label', () => {
      fixture.componentRef.setInput('label', 'Angular');
      fixture.detectChanges();
      expect(component).toBeTruthy();
      const el = fixture.nativeElement.querySelector('.ui-chip');
      expect(el.textContent).toContain('Angular');
    });
  });

  describe('PillComponent', () => {
    let fixture: ComponentFixture<PillComponent>;
    let component: PillComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [PillComponent]
      }).compileComponents();

      fixture = TestBed.createComponent(PillComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render button when no href is supplied', () => {
      fixture.detectChanges();
      const btn = fixture.nativeElement.querySelector('button.ui-pill');
      expect(btn).toBeTruthy();
    });

    it('should render anchor when href is supplied', () => {
      fixture.componentRef.setInput('href', 'https://example.com');
      fixture.detectChanges();
      const a = fixture.nativeElement.querySelector('a.ui-pill');
      expect(a).toBeTruthy();
      expect(a.getAttribute('href')).toBe('https://example.com');
    });
  });

  describe('MonoLabelComponent', () => {
    let fixture: ComponentFixture<MonoLabelComponent>;
    let component: MonoLabelComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [MonoLabelComponent]
      }).compileComponents();

      fixture = TestBed.createComponent(MonoLabelComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should render bracketed text when bracketed is true', () => {
      fixture.componentRef.setInput('text', 'CASE STUDIES');
      fixture.componentRef.setInput('bracketed', true);
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('.ui-mono-label');
      expect(el.textContent).toContain('[');
      expect(el.textContent).toContain('CASE STUDIES');
      expect(el.textContent).toContain(']');
    });
  });

  describe('SectionHeadingComponent', () => {
    let fixture: ComponentFixture<SectionHeadingComponent>;
    let component: SectionHeadingComponent;

    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [SectionHeadingComponent]
      }).compileComponents();

      fixture = TestBed.createComponent(SectionHeadingComponent);
      component = fixture.componentInstance;
    });

    it('should render heading title and dot', () => {
      fixture.componentRef.setInput('title', 'Featured');
      fixture.componentRef.setInput('bracketedLabel', 'CASE STUDIES');
      fixture.detectChanges();
      const titleEl = fixture.nativeElement.querySelector('.heading-title');
      expect(titleEl.textContent).toContain('Featured');
    });
  });
});

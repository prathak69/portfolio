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

  it('should render statement lines', () => {
    const lines = component.statementLines();
    expect(lines.length).toBeGreaterThanOrEqual(1);
    expect(lines[0]).toContain('frontend engineer');
  });

  it('should reveal content and apply is-revealed class', () => {
    component.isRevealed.set(true);
    fixture.detectChanges();
    const section = fixture.nativeElement.querySelector('.approach-section');
    expect(section.classList.contains('is-revealed')).toBe(true);
  });

  it('should have selectable text styling on statement heading', () => {
    const heading = fixture.nativeElement.querySelector('.statement-heading');
    expect(heading).toBeTruthy();
    expect(heading.classList.contains('select-text')).toBe(true);
    expect(heading.classList.contains('cursor-text')).toBe(true);
  });

  it('should contain the 3 clay character hover images', () => {
    expect(component.hoverImages.length).toBe(3);
    expect(component.hoverImages[0].url).toContain('wave_gxzd6k.jpg');
    expect(component.hoverImages[1].url).toContain('Clay_man_thinking_thoughtfully');
    expect(component.hoverImages[2].url).toContain('Clay_man_giving_thumbs_up');
  });

  it('should switch hover image index based on hovered line interval', () => {
    // Lines 0, 1 -> image 0 (Wave)
    component.onLineHover(0);
    expect(component.activeImageIndex()).toBe(0);
    component.onLineHover(1);
    expect(component.activeImageIndex()).toBe(0);

    // Lines 2, 3 -> image 1 (Thinking)
    component.onLineHover(2);
    expect(component.activeImageIndex()).toBe(1);
    component.onLineHover(3);
    expect(component.activeImageIndex()).toBe(1);

    // Lines 4, 5 -> image 2 (Thumbs Up)
    component.onLineHover(4);
    expect(component.activeImageIndex()).toBe(2);
    component.onLineHover(5);
    expect(component.activeImageIndex()).toBe(2);
  });

  it('should apply is-image-visible class on statement container when hovering', () => {
    component.isHovering.set(true);
    fixture.detectChanges();
    const container = fixture.nativeElement.querySelector('.statement-container');
    expect(container.classList.contains('is-image-visible')).toBe(true);
  });
});

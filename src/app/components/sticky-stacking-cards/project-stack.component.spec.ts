import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProjectStackComponent } from './project-stack.component';
import { DEFAULT_PROJECTS } from '../../models/project-card.model';

describe('ProjectStackComponent', () => {
  let component: ProjectStackComponent;
  let fixture: ComponentFixture<ProjectStackComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectStackComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ProjectStackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render all project cards', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll('.card');
    expect(cards.length).toBe(DEFAULT_PROJECTS.length);
  });

  it('should display padded index numbers starting with 01', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const numbers = compiled.querySelectorAll('.num');
    expect(numbers[0]?.textContent?.trim()).toBe('01');
    expect(numbers[1]?.textContent?.trim()).toBe('02');
  });

  it('should render images in 40/60 layout per card', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const colLeft = compiled.querySelectorAll('.col-left');
    const colRight = compiled.querySelectorAll('.col-right');
    expect(colLeft.length).toBe(DEFAULT_PROJECTS.length);
    expect(colRight.length).toBe(DEFAULT_PROJECTS.length);
  });

  it('should map individual accents onto each stacked card', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const cards = compiled.querySelectorAll<HTMLElement>('.card');
    
    // Card 1: Red accent (#E5392F with white text)
    expect(cards[0].style.getPropertyValue('--accent')).toBe('#E5392F');
    expect(cards[0].style.getPropertyValue('--on-accent')).toBe('#FFFFFF');

    // Card 2: Blue accent (#2F5BFF with white text)
    expect(cards[1].style.getPropertyValue('--accent')).toBe('#2F5BFF');
    expect(cards[1].style.getPropertyValue('--on-accent')).toBe('#FFFFFF');

    // Card 3: Green accent (#5CC46B with Ink text)
    expect(cards[2].style.getPropertyValue('--accent')).toBe('#5CC46B');
    expect(cards[2].style.getPropertyValue('--on-accent')).toBe('#0C0C0C');
  });

  it('should render project name capsules and image frames with accent border classes', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const capsules = compiled.querySelectorAll('.cat-pill');
    const imageFrames = compiled.querySelectorAll('.img-frame');
    
    expect(capsules.length).toBe(DEFAULT_PROJECTS.length);
    expect(imageFrames.length).toBe(DEFAULT_PROJECTS.length * 3);
  });
});

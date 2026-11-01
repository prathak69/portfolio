import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerformanceHudComponent } from './performance-hud.component';
import { FeatureFlagService } from '../../services/feature-flag.service';

describe('PerformanceHudComponent', () => {
  let component: PerformanceHudComponent;
  let fixture: ComponentFixture<PerformanceHudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerformanceHudComponent],
      providers: [FeatureFlagService]
    }).compileComponents();

    fixture = TestBed.createComponent(PerformanceHudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the PerformanceHudComponent', () => {
    expect(component).toBeTruthy();
    expect(component.isVisible()).toBe(false);
  });

  it('should toggle visibility on "P" keydown', () => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'p' }));
    expect(component.isVisible()).toBe(true);
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'p' }));
    expect(component.isVisible()).toBe(false);
  });
});

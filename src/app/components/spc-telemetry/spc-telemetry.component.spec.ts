import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SpcTelemetryComponent } from './spc-telemetry.component';
import { FeatureFlagService } from '../../services/feature-flag.service';

describe('SpcTelemetryComponent', () => {
  let component: SpcTelemetryComponent;
  let fixture: ComponentFixture<SpcTelemetryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpcTelemetryComponent],
      providers: [FeatureFlagService]
    }).compileComponents();

    fixture = TestBed.createComponent(SpcTelemetryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the SPC telemetry component', () => {
    expect(component).toBeTruthy();
  });

  it('should render the control chart track when enabled', () => {
    const track = fixture.nativeElement.querySelector('.spc-chart-track');
    expect(track).toBeTruthy();
  });

  it('should toggle tooltip on click', () => {
    expect(component.showTooltip()).toBe(false);
    component.toggleTooltip();
    expect(component.showTooltip()).toBe(true);
  });
});


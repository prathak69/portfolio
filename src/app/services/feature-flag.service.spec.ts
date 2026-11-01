import { TestBed } from '@angular/core/testing';
import { FeatureFlagService } from './feature-flag.service';

describe('FeatureFlagService', () => {
  let service: FeatureFlagService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeatureFlagService);
  });

  it('should be created and enable features by default', () => {
    expect(service).toBeTruthy();
    expect(service.isEnabled('spcTelemetry')).toBe(true);
    expect(service.isEnabled('performanceHud')).toBe(true);
  });

  it('should toggle a feature flag cleanly', () => {
    service.toggle('spcTelemetry');
    expect(service.isEnabled('spcTelemetry')).toBe(false);
    service.toggle('spcTelemetry');
    expect(service.isEnabled('spcTelemetry')).toBe(true);
  });
});


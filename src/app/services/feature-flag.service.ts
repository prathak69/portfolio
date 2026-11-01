import { Injectable, signal } from '@angular/core';

export interface FeatureFlags {
  spcTelemetry: boolean;
  avatarStateMachine: boolean;
  nightShiftPalette: boolean;
  ariaPilot: boolean;
  liveMiniatures: boolean;
  linkedSkillsMatrix: boolean;
  performanceHud: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class FeatureFlagService {
  readonly flags = signal<FeatureFlags>({
    spcTelemetry: true,
    avatarStateMachine: true,
    nightShiftPalette: true,
    ariaPilot: true,
    liveMiniatures: true,
    linkedSkillsMatrix: true,
    performanceHud: true
  });

  toggle(key: keyof FeatureFlags): void {
    this.flags.update((f) => ({
      ...f,
      [key]: !f[key]
    }));
  }

  isEnabled(key: keyof FeatureFlags): boolean {
    return this.flags()[key];
  }
}

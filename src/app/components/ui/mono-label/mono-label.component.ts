import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mono-label',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span class="ui-mono-label" [class.is-bracketed]="bracketed()">
      @if (dot()) {
        <span class="label-dot" [style.background]="accentColor()" aria-hidden="true"></span>
      }
      @if (bracketed()) {
        <span class="bracket-open" aria-hidden="true">[ </span>
      }
      <span class="label-text">
        <ng-content />
        @if (text()) {
          {{ text() }}
        }
      </span>
      @if (bracketed()) {
        <span class="bracket-close" aria-hidden="true"> ]</span>
      }
    </span>
  `,
  styles: [`
    @use '../../../../styles/tokens.scss' as *;

    :host {
      display: inline-flex;
      vertical-align: middle;
    }

    .ui-mono-label {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2, 8px);
      font-family: var(--font-mono, monospace);
      font-size: var(--font-size-mono, clamp(0.75rem, 0.9vw, 0.875rem));
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--color-mono, #78756E);
      user-select: none;

      .label-dot {
        width: 8px;
        height: 8px;
        border-radius: 2px;
        flex-shrink: 0;
      }

      &.is-bracketed {
        letter-spacing: 0.16em;
        opacity: 0.85;

        .bracket-open,
        .bracket-close {
          opacity: 0.6;
        }
      }
    }
  `]
})
export class MonoLabelComponent {
  readonly text = input<string>('');
  readonly bracketed = input<boolean>(false);
  readonly dot = input<boolean>(false);
  readonly accentColor = input<string>('var(--color-red, #E84A3F)');
}

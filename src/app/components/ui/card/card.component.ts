import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type CardVariant = 'sky' | 'mint' | 'butter' | 'lavender' | 'cream' | 'dark' | 'white';
export type CardPadding = 'none' | 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="ui-card"
      [class.has-clay]="clay()"
      [class.has-lift]="hoverLift()"
      [class.is-interactive]="interactive()"
      [ngClass]="['variant-' + variant(), 'padding-' + padding()]"
    >
      <ng-content />
    </div>
  `,
  styles: [`
    @use '../../../../styles/tokens.scss' as *;

    :host {
      display: block;
    }

    .ui-card {
      border-radius: var(--radius-card, 20px);
      border: 1.5px solid rgba(20, 17, 15, 0.08);
      position: relative;
      transition: transform var(--duration-hover, 0.25s) var(--ease-standard, cubic-bezier(0.16, 1, 0.3, 1)),
                  border-color var(--duration-hover, 0.25s) var(--ease-standard, cubic-bezier(0.16, 1, 0.3, 1)),
                  box-shadow var(--duration-hover, 0.25s) var(--ease-standard, cubic-bezier(0.16, 1, 0.3, 1));
      overflow: hidden;

      &.variant-sky {
        background-color: var(--color-sky, #D8E8F5);
        color: var(--color-dark, #171715);
      }
      &.variant-mint {
        background-color: var(--color-mint, #D8EED8);
        color: var(--color-dark, #171715);
      }
      &.variant-butter {
        background-color: var(--color-butter, #FBF1C9);
        color: var(--color-dark, #171715);
      }
      &.variant-lavender {
        background-color: var(--color-lavender, #E7DEEE);
        color: var(--color-dark, #171715);
      }
      &.variant-cream {
        background-color: var(--color-cream, #F7F4EE);
        color: var(--color-dark, #171715);
      }
      &.variant-white {
        background-color: #FFFFFF;
        color: var(--color-dark, #171715);
      }
      &.variant-dark {
        background-color: var(--color-dark, #171715);
        color: var(--color-cream, #F7F4EE);
        border-color: rgba(255, 255, 255, 0.12);
      }

      &.padding-none { padding: 0; }
      &.padding-sm { padding: var(--space-4, 16px); }
      &.padding-md { padding: var(--space-6, 24px); }
      &.padding-lg { padding: var(--space-8, 32px); }

      &.has-clay {
        box-shadow: 0 10px 24px -6px rgba(20, 17, 15, 0.08),
                    0 2px 6px -1px rgba(20, 17, 15, 0.04),
                    inset 0 1px 1px rgba(255, 255, 255, 0.6);
      }

      &.has-lift:hover,
      &.is-interactive:hover {
        transform: translateY(-4px);
        border-color: rgba(20, 17, 15, 0.22);
        box-shadow: 0 16px 32px -8px rgba(20, 17, 15, 0.14),
                    0 4px 12px -2px rgba(20, 17, 15, 0.06);
      }

      &.variant-dark.has-lift:hover,
      &.variant-dark.is-interactive:hover {
        border-color: rgba(255, 255, 255, 0.3);
        box-shadow: 0 16px 36px -8px rgba(0, 0, 0, 0.5);
      }
    }
  `]
})
export class CardComponent {
  readonly variant = input<CardVariant>('cream');
  readonly clay = input<boolean>(true);
  readonly hoverLift = input<boolean>(true);
  readonly interactive = input<boolean>(false);
  readonly padding = input<CardPadding>('md');
}

import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type PillVariant = 'cream' | 'white' | 'dark' | 'outline' | 'accent';
export type PillSize = 'sm' | 'md' | 'lg';

@Component({
  selector: 'app-pill',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (href()) {
      <a
        [href]="href()"
        [target]="target()"
        [rel]="target() === '_blank' ? 'noopener noreferrer' : null"
        [attr.aria-label]="ariaLabel()"
        [attr.data-cursor]="dataCursor()"
        class="ui-pill"
        [class]="'variant-' + variant() + ' size-' + size()"
        (click)="onClick($event)"
      >
        <ng-container *ngTemplateOutlet="pillContent" />
      </a>
    } @else {
      <button
        type="button"
        [attr.aria-label]="ariaLabel()"
        [attr.data-cursor]="dataCursor()"
        class="ui-pill"
        [class]="'variant-' + variant() + ' size-' + size()"
        (click)="onClick($event)"
      >
        <ng-container *ngTemplateOutlet="pillContent" />
      </button>
    }

    <ng-template #pillContent>
      @if (icon()) {
        <span class="pill-icon" aria-hidden="true">{{ icon() }}</span>
      }
      <span class="pill-label">
        <ng-content />
        @if (label()) {
          {{ label() }}
        }
      </span>
      @if (suffixIcon()) {
        <span class="pill-suffix-icon" aria-hidden="true">{{ suffixIcon() }}</span>
      }
    </ng-template>
  `,
  styles: [`
    @use '../../../../styles/tokens.scss' as *;

    :host {
      display: inline-block;
      vertical-align: middle;
    }

    .ui-pill {
      display: inline-flex;
      align-items: center;
      gap: var(--space-2, 8px);
      border-radius: var(--radius-pill, 999px);
      font-family: var(--font-mono, monospace);
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      text-decoration: none;
      white-space: nowrap;
      cursor: pointer;
      user-select: none;
      transition: all var(--duration-hover, 0.25s) var(--ease-standard, cubic-bezier(0.16, 1, 0.3, 1));

      &.size-sm {
        font-size: 11px;
        padding: 6px 14px;
      }
      &.size-md {
        font-size: 13px;
        padding: 9px 20px;
      }
      &.size-lg {
        font-size: 14px;
        padding: 12px 26px;
      }

      &.variant-white {
        background: #FFFFFF;
        color: var(--color-dark, #171715);
        border: 1px solid rgba(20, 17, 15, 0.12);
        box-shadow: 0 2px 6px rgba(20, 17, 15, 0.06);

        &:hover {
          background: var(--color-red, #E84A3F);
          color: #FFFFFF;
          border-color: var(--color-red, #E84A3F);
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(232, 74, 63, 0.25);
        }
      }

      &.variant-cream {
        background: var(--color-cream, #F7F4EE);
        color: var(--color-dark, #171715);
        border: 1px solid rgba(20, 17, 15, 0.12);

        &:hover {
          background: #FFFFFF;
          border-color: rgba(20, 17, 15, 0.25);
          transform: translateY(-2px);
        }
      }

      &.variant-dark {
        background: var(--color-dark, #171715);
        color: var(--color-cream, #F7F4EE);
        border: 1px solid var(--color-dark, #171715);

        &:hover {
          background: var(--color-red, #E84A3F);
          border-color: var(--color-red, #E84A3F);
          color: #FFFFFF;
          transform: translateY(-2px);
        }
      }

      &.variant-accent {
        background: var(--color-red, #E84A3F);
        color: #FFFFFF;
        border: 1px solid var(--color-red, #E84A3F);

        &:hover {
          background: #d4382e;
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(232, 74, 63, 0.3);
        }
      }

      &.variant-outline {
        background: transparent;
        color: inherit;
        border: 1.5px solid currentColor;

        &:hover {
          background: currentColor;
          transform: translateY(-2px);
        }
      }

      .pill-suffix-icon {
        display: inline-block;
        transition: transform 0.2s ease;
      }

      &:hover .pill-suffix-icon {
        transform: translate(2px, -2px);
      }
    }
  `]
})
export class PillComponent {
  readonly href = input<string | null>(null);
  readonly target = input<string>('_self');
  readonly label = input<string>('');
  readonly icon = input<string | null>(null);
  readonly suffixIcon = input<string | null>(null);
  readonly variant = input<PillVariant>('white');
  readonly size = input<PillSize>('md');
  readonly ariaLabel = input<string>('');
  readonly dataCursor = input<string>('CLICK');

  readonly action = output<Event>();

  onClick(e: Event): void {
    this.action.emit(e);
  }
}

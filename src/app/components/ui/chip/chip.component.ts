import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

export type ChipVariant = 'subtle' | 'pastel' | 'outline' | 'filled';
export type ChipColor = 'sky' | 'mint' | 'butter' | 'lavender' | 'cream' | 'dark' | 'accent' | 'default';
export type ChipSize = 'sm' | 'md';

@Component({
  selector: 'app-chip',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <span
      class="ui-chip"
      [class]="'variant-' + variant() + ' color-' + color() + ' size-' + size()"
      [class.interactive]="interactive()"
    >
      <ng-content />
      @if (label()) {
        <span>{{ label() }}</span>
      }
    </span>
  `,
  styles: [`
    @use '../../../../styles/tokens.scss' as *;

    :host {
      display: inline-block;
      vertical-align: middle;
    }

    .ui-chip {
      display: inline-flex;
      align-items: center;
      gap: var(--space-1, 4px);
      border-radius: var(--radius-chip, 12px);
      font-family: var(--font-mono, monospace);
      font-weight: 600;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      white-space: nowrap;
      transition: all var(--duration-hover, 0.25s) var(--ease-standard, cubic-bezier(0.16, 1, 0.3, 1));
      user-select: none;

      &.size-sm {
        font-size: 10.5px;
        padding: 2px 8px;
        line-height: 1.4;
      }
      &.size-md {
        font-size: 12px;
        padding: 4px 12px;
        line-height: 1.5;
      }

      &.variant-subtle {
        background: rgba(20, 17, 15, 0.04);
        border: 1px solid rgba(20, 17, 15, 0.1);
        color: var(--color-dark, #171715);
      }
      &.variant-outline {
        background: transparent;
        border: 1px solid rgba(20, 17, 15, 0.2);
        color: var(--color-dark, #171715);
      }
      &.variant-filled {
        background: var(--color-dark, #171715);
        color: var(--color-cream, #F7F4EE);
        border: 1px solid var(--color-dark, #171715);
      }
      &.variant-pastel {
        border: 1px solid rgba(20, 17, 15, 0.08);
      }

      &.color-sky { background: var(--color-sky, #D8E8F5); color: #171715; }
      &.color-mint { background: var(--color-mint, #D8EED8); color: #171715; }
      &.color-butter { background: var(--color-butter, #FBF1C9); color: #171715; }
      &.color-lavender { background: var(--color-lavender, #E7DEEE); color: #171715; }
      &.color-accent { background: var(--color-red, #E84A3F); color: #FFFFFF; border-color: transparent; }
      &.color-dark { background: var(--color-dark, #171715); color: #FFFFFF; }

      &.interactive:hover {
        transform: translateY(-1px);
        border-color: rgba(20, 17, 15, 0.3);
      }
    }
  `]
})
export class ChipComponent {
  readonly label = input<string>('');
  readonly variant = input<ChipVariant>('subtle');
  readonly color = input<ChipColor>('default');
  readonly size = input<ChipSize>('sm');
  readonly interactive = input<boolean>(false);
}

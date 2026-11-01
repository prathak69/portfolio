import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MonoLabelComponent } from '../mono-label/mono-label.component';

@Component({
  selector: 'app-section-heading',
  standalone: true,
  imports: [CommonModule, MonoLabelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="ui-section-heading">
      <div class="heading-main">
        @if (eyebrow()) {
          <div class="heading-eyebrow">
            <app-mono-label [dot]="true" [accentColor]="accentColor()">
              {{ eyebrow() }}
            </app-mono-label>
          </div>
        }
        <h2 class="heading-title">
          {{ title() }}<span class="title-dot" [style.color]="accentColor()">.</span>
        </h2>
      </div>

      @if (bracketedLabel() || aside()) {
        <div class="heading-aside">
          @if (bracketedLabel()) {
            <app-mono-label [bracketed]="true">
              {{ bracketedLabel() }}
            </app-mono-label>
          }
          @if (aside()) {
            <p class="aside-text">{{ aside() }}</p>
          }
        </div>
      }
    </header>
  `,
  styles: [`
    @use '../../../../styles/tokens.scss' as *;

    :host {
      display: block;
      width: 100%;
    }

    .ui-section-heading {
      display: flex;
      flex-direction: column;
      gap: var(--space-4, 16px);
      margin-bottom: var(--space-8, 32px);

      @media (min-width: 768px) {
        flex-direction: row;
        align-items: flex-end;
        justify-content: space-between;
        margin-bottom: var(--space-12, 48px);
      }

      .heading-main {
        display: flex;
        flex-direction: column;
        gap: var(--space-2, 8px);
      }

      .heading-title {
        font-family: var(--font-heading, system-ui, sans-serif);
        font-size: var(--font-size-h1, clamp(2.25rem, 5vw, 4.5rem));
        font-weight: 800;
        letter-spacing: -0.03em;
        line-height: 1.05;
        margin: 0;
        color: var(--color-dark, #171715);
        text-transform: uppercase;

        .title-dot {
          display: inline-block;
          margin-left: 2px;
        }
      }

      .heading-aside {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: var(--space-2, 8px);

        @media (min-width: 768px) {
          align-items: flex-end;
          text-align: right;
          max-width: 380px;
        }

        .aside-text {
          font-family: var(--font-mono, monospace);
          font-size: var(--font-size-mono, clamp(0.75rem, 0.9vw, 0.875rem));
          color: var(--color-mono, #78756E);
          margin: 0;
          line-height: 1.5;
        }
      }
    }
  `]
})
export class SectionHeadingComponent {
  readonly eyebrow = input<string>('');
  readonly title = input.required<string>();
  readonly aside = input<string>('');
  readonly bracketedLabel = input<string>('');
  readonly accentColor = input<string>('var(--color-red, #E84A3F)');
}

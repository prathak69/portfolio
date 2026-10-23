# 3D Creator Portfolio ("Jack") — Angular 21 Architecture & Component Specification

This document provides a comprehensive technical breakdown of all components, directives, styles, and animation patterns required to build the **"Jack — 3D Creator"** portfolio landing page using **Angular 21**, translating the original React + Framer Motion specification into modern, idiomatic Angular standards.

---

## 1. Paradigm Shift: React + Framer Motion to Angular 21

| React + Framer Motion Paradigm | Angular 21 Modern Equivalent | Why in Angular 21 |
| :--- | :--- | :--- |
| **Components** (`export function Hero()`) | **Standalone Components** (`@Component({ standalone: true, ... })`) | Native standalone architecture is the default in modern Angular. |
| **Props** (`interface Props { ... }`) | **Signal Inputs** (`input<string>()`, `input.required<number>()`) | Fine-grained reactivity, type-safe, no dirty checking overhead. |
| **Events** (`onClick={() => ...}`) | **Signal Outputs** (`output<void>()`) | Replaces `@Output()` + `EventEmitter` with native signal outputs. |
| **`framer-motion` `whileInView`** | **`[appFadeIn]` Directive or `@defer (on viewport)`** | Lightweight `IntersectionObserver` directive or Angular's native viewport deferral. |
| **`framer-motion` `useScroll` / `useTransform`** | **Native CSS Scroll-Driven Animations or Angular Directive + Signals** | Modern CSS `animation-timeline: view() / scroll()` for 120fps hardware acceleration, or Angular `ScrollDispatcher` + Signals. |
| **Mouse magnet effect component** | **`[appMagnet]` Attribute Directive** | Directives in Angular are ideal for attaching custom DOM/mouse physics behavior to any element or image. |
| **Character reveal (`motion.span`)** | **`AnimatedTextComponent` (`<app-animated-text>`)** | Splits text into character spans with calculated scroll progress or CSS view timeline offsets. |
| **`lucide-react`** | **`lucide-angular`** | Official Lucide icons packaged as Angular components. |

---

## 2. Global Setup & Design Tokens

### 2.1 Typography & Google Fonts
In `src/index.html` or `src/styles.scss`:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Kanit:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,300;1,400&display=swap" rel="stylesheet">
```

### 2.2 Global CSS Tokens (`src/styles.scss`)
```scss
@import "tailwindcss";

:root {
  --bg-dark: #0C0C0C;
  --text-muted: #D7E2EA;
  --font-kanit: 'Kanit', sans-serif;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body, app-root {
  background-color: var(--bg-dark);
  color: var(--text-muted);
  font-family: var(--font-kanit);
  min-height: 100vh;
  width: 100%;
  overflow-x: clip;
}

/* Gradient text utility class */
.hero-heading {
  background: linear-gradient(180deg, #646973 0%, #BBCCD7 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

---

## 3. Core Reusable Directives & UI Components

### 3.1 `ContactButtonComponent` (`<app-contact-button>`)
* **Role**: Primary call-to-action button with a multi-stop diagonal gradient and inset neon purple glow.
* **Angular 21 Features**: Standalone component, Signal input for label and size, Signal output for click action.
* **Styles**:
  * Gradient: `linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)`
  * Box Shadow: `0px 4px 4px rgba(181, 1, 167, 0.25)`
  * Inset Shadow: `4px 4px 12px #7721B1 inset`
  * Outline: `2px solid white` with `outline-offset: -3px`
  * Pill shape: `rounded-full`

```typescript
// contact-button.component.ts
import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-contact-button',
  standalone: true,
  template: `
    <button
      (click)="buttonClick.emit()"
      class="group relative inline-flex items-center justify-center rounded-full font-medium uppercase tracking-widest text-white transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer outline outline-2 outline-white -outline-offset-3"
      [class]="sizeClasses()"
      [style.background]="'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)'"
      [style.box-shadow]="'0px 4px 4px rgba(181, 1, 167, 0.25), 4px 4px 12px #7721B1 inset'"
    >
      <span>{{ label() }}</span>
    </button>
  `
})
export class ContactButtonComponent {
  readonly label = input<string>('Contact Me');
  readonly size = input<'sm' | 'md' | 'lg'>('md');
  readonly buttonClick = output<void>();

  sizeClasses(): string {
    switch (this.size()) {
      case 'sm': return 'px-6 py-2.5 text-xs';
      case 'lg': return 'px-12 py-4 text-base';
      default: return 'px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base';
    }
  }
}
```

---

### 3.2 `LiveProjectButtonComponent` (`<app-live-project-button>`)
* **Role**: Secondary ghost outline button used on sticky project cards.
* **Angular 21 Features**: Signal inputs for custom label and target project URL.
* **Styles**: Pill-shaped border `border-2 border-[#D7E2EA]`, uppercase tracking, hover fill `bg-[#D7E2EA]/10`.

```typescript
// live-project-button.component.ts
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-live-project-button',
  standalone: true,
  template: `
    <a
      [href]="href()"
      target="_blank"
      rel="noopener noreferrer"
      class="inline-flex items-center justify-center rounded-full border-2 border-[#D7E2EA] text-[#D7E2EA] font-medium uppercase tracking-widest px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base transition-colors duration-200 hover:bg-[#D7E2EA]/10"
    >
      {{ label() }}
    </a>
  `
})
export class LiveProjectButtonComponent {
  readonly label = input<string>('Live Project');
  readonly href = input<string>('#');
}
```

---

### 3.3 `FadeInDirective` (`[appFadeIn]`)
* **Role**: Replaces Framer Motion's `whileInView={{ opacity: 1, y: 0 }}`.
* **Angular 21 Implementation**:
  * Implemented as an attribute directive rather than an element wrapper for cleaner DOM hierarchy.
  * Uses the browser native `IntersectionObserver` with `rootMargin: '50px'` and `threshold: 0`.
  * Accepts signal inputs: `delay` (default `0`), `duration` (default `0.7`), `x` (default `0`), `y` (default `30`), and bezier easing `cubic-bezier(0.25, 0.1, 0.25, 1)`.

```typescript
// fade-in.directive.ts
import { Directive, ElementRef, inject, input, OnInit, Renderer2, afterNextRender } from '@angular/core';

@Directive({
  selector: '[appFadeIn]',
  standalone: true
})
export class FadeInDirective implements OnInit {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);

  readonly delay = input<number>(0);
  readonly duration = input<number>(0.7);
  readonly x = input<number>(0);
  readonly y = input<number>(30);

  constructor() {
    afterNextRender(() => {
      this.initObserver();
    });
  }

  ngOnInit(): void {
    const node = this.el.nativeElement;
    this.renderer.setStyle(node, 'opacity', '0');
    this.renderer.setStyle(
      node,
      'transform',
      `translate3d(${this.x()}px, ${this.y()}px, 0)`
    );
    this.renderer.setStyle(node, 'will-change', 'opacity, transform');
    this.renderer.setStyle(
      node,
      'transition',
      `opacity ${this.duration()}s cubic-bezier(0.25, 0.1, 0.25, 1) ${this.delay()}s, transform ${this.duration()}s cubic-bezier(0.25, 0.1, 0.25, 1) ${this.delay()}s`
    );
  }

  private initObserver(): void {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const node = this.el.nativeElement;
            this.renderer.setStyle(node, 'opacity', '1');
            this.renderer.setStyle(node, 'transform', 'translate3d(0, 0, 0)');
            observer.unobserve(node);
          }
        });
      },
      { rootMargin: '50px', threshold: 0 }
    );

    observer.observe(this.el.nativeElement);
  }
}
```

---

### 3.4 `MagnetDirective` (`[appMagnet]`)
* **Role**: Smooth magnetic hover pull tracking cursor distance and applying a spring-like `translate3d` to the hero portrait.
* **Settings**:
  * Activation boundary: `padding = 150px` outside element bounding rect.
  * Damping factor: `strength = 3`.
  * Active state transition: `transform 0.3s ease-out`.
  * Rest state transition: `transform 0.6s ease-in-out`.
  * Performance: `will-change: transform`.

```typescript
// magnet.directive.ts
import { Directive, ElementRef, HostListener, inject, input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appMagnet]',
  standalone: true
})
export class MagnetDirective {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly renderer = inject(Renderer2);

  readonly padding = input<number>(150);
  readonly strength = input<number>(3);
  readonly activeTransition = input<string>('transform 0.3s ease-out');
  readonly inactiveTransition = input<string>('transform 0.6s ease-in-out');

  @HostListener('window:mousemove', ['$event'])
  onMouseMove(event: MouseEvent): void {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distX = event.clientX - centerX;
    const distY = event.clientY - centerY;
    const distance = Math.hypot(distX, distY);

    const threshold = Math.max(rect.width, rect.height) / 2 + this.padding();

    if (distance < threshold) {
      const moveX = distX / this.strength();
      const moveY = distY / this.strength();

      this.renderer.setStyle(this.el.nativeElement, 'transition', this.activeTransition());
      this.renderer.setStyle(this.el.nativeElement, 'transform', `translate3d(${moveX}px, ${moveY}px, 0)`);
    } else {
      this.resetPosition();
    }
  }

  @HostListener('mouseleave')
  onMouseLeave(): void {
    this.resetPosition();
  }

  private resetPosition(): void {
    this.renderer.setStyle(this.el.nativeElement, 'transition', this.inactiveTransition());
    this.renderer.setStyle(this.el.nativeElement, 'transform', 'translate3d(0, 0, 0)');
  }
}
```

---

### 3.5 `AnimatedTextComponent` (`<app-animated-text>`)
* **Role**: Character-by-character scroll-driven opacity reveal.
* **Animation Dynamics**:
  * Text characters animate from `opacity: 0.2` to `opacity: 1` as the user scrolls.
  * Scroll boundary: `['start 0.8', 'end 0.2']` (begins when the top of the text hits 80% of the viewport and ends when the bottom reaches 20%).
* **Angular 21 Approach**:
  * Splits the input text into an array of characters.
  * Calculates progress using scroll events with `requestAnimationFrame` and `IntersectionObserver`.
  * Alternatively supported via modern CSS `animation-timeline: view()` where supported.

```typescript
// animated-text.component.ts
import { Component, ElementRef, HostListener, inject, input, signal, computed, afterNextRender } from '@angular/core';

@Component({
  selector: 'app-animated-text',
  standalone: true,
  template: `
    <p #paragraphContainer class="text-center font-medium leading-relaxed max-w-[560px] text-[#D7E2EA] text-[clamp(1rem,2vw,1.35rem)]">
      @for (char of characters(); track $index; let i = $index) {
        <span
          class="transition-opacity duration-150 inline-block"
          [style.opacity]="getCharOpacity(i)"
          [class.whitespace-pre]="char === ' '"
        >{{ char }}</span>
      }
    </p>
  `
})
export class AnimatedTextComponent {
  private readonly el = inject(ElementRef<HTMLElement>);

  readonly text = input.required<string>();
  readonly characters = computed(() => this.text().split(''));
  readonly scrollProgress = signal<number>(0);

  constructor() {
    afterNextRender(() => {
      this.updateProgress();
    });
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    this.updateProgress();
  }

  private updateProgress(): void {
    const rect = this.el.nativeElement.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    // Range: start at 80% viewport height, end at 20% viewport height
    const startY = windowHeight * 0.8;
    const endY = windowHeight * 0.2;

    const totalDistance = startY - endY;
    const currentPos = startY - rect.top;

    const progress = Math.min(Math.max(currentPos / totalDistance, 0), 1);
    this.scrollProgress.set(progress);
  }

  getCharOpacity(charIndex: number): number {
    const totalChars = this.characters().length;
    const charThreshold = charIndex / totalChars;
    const currentProgress = this.scrollProgress();

    // Linearly interpolate between 0.2 and 1.0
    if (currentProgress <= charThreshold) {
      return 0.2;
    }
    const charRange = 1 / totalChars;
    const relativeProgress = Math.min((currentProgress - charThreshold) / charRange, 1);
    return 0.2 + (0.8 * relativeProgress);
  }
}
```

---

## 4. Section Component Breakdown

### 4.1 Section 1: `HeroSectionComponent` (`<app-hero-section>`)
* **Layout**: Full viewport height (`h-screen`), flex column, `overflow-x: clip`.
* **Sub-components & Elements**:
  1. **Navbar**:
     * 4 uppercase links: "About", "Price", "Projects", "Contact".
     * Spaced with `justify-between`, text `#D7E2EA`, responsive font `text-sm md:text-lg lg:text-[1.4rem]`.
     * Entrance animation: `[appFadeIn] [delay]="0" [y]="-20"`.
  2. **Hero Heading**:
     * Huge `h1` reading `"Hi, i'm jack"` (with curly `&apos;`).
     * Fluid font scaling: `text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw]`.
     * Styled with `.hero-heading` gradient class.
     * Entrance animation: `[appFadeIn] [delay]="0.15" [y]="40"`.
  3. **Centered Hero Portrait**:
     * Absolutely centered with `[appMagnet]`.
     * URL: `https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png`.
     * Responsive sizing: `w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px]`.
     * Positioning: Mobile (`top-1/2 -translate-y-1/2`), Desktop (`sm:top-auto sm:translate-y-0 sm:bottom-0`).
     * Entrance animation: `[appFadeIn] [delay]="0.6" [y]="30"`.
  4. **Bottom Bar**:
     * Left: Paragraph `"a 3d creator driven by crafting striking and unforgettable projects"`, fluid width & typography `clamp(0.75rem, 1.4vw, 1.5rem)`. `[appFadeIn] [delay]="0.35" [y]="20"`.
     * Right: `<app-contact-button>` with `[appFadeIn] [delay]="0.5" [y]="20"`.

```typescript
// hero-section.component.ts
import { Component } from '@angular/core';
import { ContactButtonComponent } from '../ui/contact-button.component';
import { FadeInDirective } from '../directives/fade-in.directive';
import { MagnetDirective } from '../directives/magnet.directive';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [ContactButtonComponent, FadeInDirective, MagnetDirective],
  template: `
    <section class="relative h-screen w-full flex flex-col justify-between overflow-x-clip px-6 md:px-10 pb-7 sm:pb-8 md:pb-10 pt-6 md:pt-8 bg-[#0C0C0C]">
      <!-- Navbar -->
      <header appFadeIn [delay]="0" [y]="-20" class="w-full flex justify-between items-center z-20">
        @for (item of navItems; track item) {
          <a
            [href]="'#' + item.toLowerCase()"
            class="text-[#D7E2EA] font-medium uppercase tracking-wider text-sm md:text-lg lg:text-[1.4rem] transition-opacity duration-200 hover:opacity-70"
          >
            {{ item }}
          </a>
        }
      </header>

      <!-- Center Hero Heading -->
      <div class="relative w-full overflow-hidden mt-6 sm:mt-4 md:-mt-5 z-0">
        <h1
          appFadeIn
          [delay]="0.15"
          [y]="40"
          class="hero-heading font-black uppercase tracking-tight leading-none whitespace-nowrap text-center w-full text-[14vw] sm:text-[15vw] md:text-[16vw] lg:text-[17.5vw] select-none"
        >
          Hi, i&apos;m jack
        </h1>
      </div>

      <!-- Magnetic Hero Portrait -->
      <div
        appFadeIn
        [delay]="0.6"
        [y]="30"
        class="absolute left-1/2 -translate-x-1/2 z-10 w-[280px] sm:w-[360px] md:w-[440px] lg:w-[520px] top-1/2 -translate-y-1/2 sm:top-auto sm:translate-y-0 sm:bottom-0 pointer-events-auto"
      >
        <div appMagnet [padding]="150" [strength]="3" class="w-full h-full flex justify-center items-end">
          <img
            src="https://shrug-person-78902957.figma.site/_components/v2/d24c01ad3a56fc65e942a1f501eb73db42d7cf9a/Rectangle_40443.81459862.png"
            alt="Jack 3D Portrait"
            class="w-full h-auto object-contain select-none pointer-events-none drop-shadow-2xl"
          />
        </div>
      </div>

      <!-- Bottom Bar -->
      <footer class="w-full flex justify-between items-end z-20">
        <p
          appFadeIn
          [delay]="0.35"
          [y]="20"
          class="text-[#D7E2EA] font-light uppercase tracking-wide leading-snug max-w-[160px] sm:max-w-[220px] md:max-w-[260px] text-[clamp(0.75rem,1.4vw,1.5rem)]"
        >
          a 3d creator driven by crafting striking and unforgettable projects
        </p>

        <div appFadeIn [delay]="0.5" [y]="20">
          <app-contact-button />
        </div>
      </footer>
    </section>
  `
})
export class HeroSectionComponent {
  readonly navItems = ['About', 'Price', 'Projects', 'Contact'];
}
```

---

### 4.2 Section 2: `MarqueeSectionComponent` (`<app-marquee-section>`)
* **Role**: Horizontal scroll-driven gallery displaying 21 dynamic GIF tiles across 2 opposing rows.
* **Scroll Offset Formula**:
  $$\text{offset} = (\text{window.scrollY} - \text{sectionTop} + \text{window.innerHeight}) \times 0.3$$
  * Row 1: Moves **RIGHT**: `translateX(offset - 200px)`
  * Row 2: Moves **LEFT**: `translateX(-(offset - 200px))`
* **Tile Specifications**:
  * Dimensions: `420px x 270px`
  * Styling: `rounded-2xl`, `object-cover`, `lazy` loaded.
  * Gap: `gap-3` between tiles and rows.
* **Angular 21 Performance**:
  * Evaluated inside an `afterNextRender()` callback.
  * Employs passive window scroll listener updating a single `scrollOffset` signal through `requestAnimationFrame` to avoid UI thread thrashing.

```typescript
// marquee-section.component.ts
import { Component, ElementRef, HostListener, inject, signal, afterNextRender } from '@angular/core';

@Component({
  selector: 'app-marquee-section',
  standalone: true,
  template: `
    <section class="bg-[#0C0C0C] pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden flex flex-col gap-3">
      <!-- Row 1: Moves RIGHT on scroll -->
      <div
        class="flex gap-3 will-change-transform"
        [style.transform]="'translate3d(' + (scrollOffset() - 200) + 'px, 0, 0)'"
      >
        @for (img of row1Images; track $index) {
          <div class="flex-shrink-0 w-[420px] h-[270px] rounded-2xl overflow-hidden bg-zinc-900">
            <img [src]="img" alt="Work showcase" loading="lazy" class="w-full h-full object-cover select-none" />
          </div>
        }
      </div>

      <!-- Row 2: Moves LEFT on scroll -->
      <div
        class="flex gap-3 will-change-transform"
        [style.transform]="'translate3d(' + (-(scrollOffset() - 200)) + 'px, 0, 0)'"
      >
        @for (img of row2Images; track $index) {
          <div class="flex-shrink-0 w-[420px] h-[270px] rounded-2xl overflow-hidden bg-zinc-900">
            <img [src]="img" alt="Work showcase" loading="lazy" class="w-full h-full object-cover select-none" />
          </div>
        }
      </div>
    </section>
  `
})
export class MarqueeSectionComponent {
  private readonly el = inject(ElementRef<HTMLElement>);
  readonly scrollOffset = signal<number>(0);
  private ticking = false;

  private readonly rawRow1 = [
    'https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif',
    'https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif',
    'https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif',
    'https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif',
    'https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif',
    'https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif',
    'https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif',
    'https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif',
    'https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif',
    'https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif',
    'https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif'
  ];

  private readonly rawRow2 = [
    'https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif',
    'https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif',
    'https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif',
    'https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif',
    'https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif',
    'https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif',
    'https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif',
    'https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif',
    'https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif',
    'https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif'
  ];

  // Tripled for seamless scrolling
  readonly row1Images = [...this.rawRow1, ...this.rawRow1, ...this.rawRow1];
  readonly row2Images = [...this.rawRow2, ...this.rawRow2, ...this.rawRow2];

  constructor() {
    afterNextRender(() => {
      this.calculateOffset();
    });
  }

  @HostListener('window:scroll', [])
  onScroll(): void {
    if (!this.ticking) {
      window.requestAnimationFrame(() => {
        this.calculateOffset();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  private calculateOffset(): void {
    const sectionTop = this.el.nativeElement.offsetTop;
    const offset = (window.scrollY - sectionTop + window.innerHeight) * 0.3;
    this.scrollOffset.set(offset);
  }
}
```

---

### 4.3 Section 3: `AboutSectionComponent` (`<app-about-section>`)
* **Layout**: Centered flex column, `min-h-screen`, `px-5 sm:px-8 md:px-10 py-20`.
* **Four Corner 3D Decorative Assets**:
  1. **Top-Left (Moon Icon)**:
     * URL: `.../moon_icon.11395d36.png`
     * Width: `w-[120px] sm:w-[160px] md:w-[210px]`, `top-[4%] left-[1%] sm:left-[2%] md:left-[4%]`.
     * Animation: `[appFadeIn] [delay]="0.1" [x]="-80" [y]="0" [duration]="0.9"`.
  2. **Bottom-Left (3D Object)**:
     * URL: `.../p59_1.4659672e.png`
     * Width: `w-[100px] sm:w-[140px] md:w-[180px]`, `bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%]`.
     * Animation: `[appFadeIn] [delay]="0.25" [x]="-80" [y]="0" [duration]="0.9"`.
  3. **Top-Right (Lego Icon)**:
     * URL: `.../lego_icon-1.703bb594.png`
     * Width: `w-[120px] sm:w-[160px] md:w-[210px]`, `top-[4%] right-[1%] sm:right-[2%] md:right-[4%]`.
     * Animation: `[appFadeIn] [delay]="0.15" [x]="80" [y]="0" [duration]="0.9"`.
  4. **Bottom-Right (3D Group)**:
     * URL: `.../Group_134-1.2e04f3ce.png`
     * Width: `w-[130px] sm:w-[170px] md:w-[220px]`, `bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%]`.
     * Animation: `[appFadeIn] [delay]="0.3" [x]="80" [y]="0" [duration]="0.9"`.
* **Central Stack**:
  * Heading: `"About me"` in `.hero-heading`, font-black, uppercase, size `clamp(3rem, 12vw, 160px)`.
  * Animated paragraph via `<app-animated-text>`.
  * `<app-contact-button>` separated by `gap-16 sm:gap-20 md:gap-24`.

```typescript
// about-section.component.ts
import { Component } from '@angular/core';
import { AnimatedTextComponent } from '../ui/animated-text.component';
import { ContactButtonComponent } from '../ui/contact-button.component';
import { FadeInDirective } from '../directives/fade-in.directive';

@Component({
  selector: 'app-about-section',
  standalone: true,
  imports: [AnimatedTextComponent, ContactButtonComponent, FadeInDirective],
  template: `
    <section class="relative min-h-screen w-full flex flex-col justify-center items-center px-5 sm:px-8 md:px-10 py-20 bg-[#0C0C0C] overflow-hidden">
      <!-- 1. Top-Left 3D Moon Icon -->
      <div
        appFadeIn
        [delay]="0.1"
        [x]="-80"
        [y]="0"
        [duration]="0.9"
        class="absolute top-[4%] left-[1%] sm:left-[2%] md:left-[4%] w-[120px] sm:w-[160px] md:w-[210px] pointer-events-none select-none z-10"
      >
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png"
          alt="Moon 3D icon"
          class="w-full h-auto drop-shadow-xl"
        />
      </div>

      <!-- 2. Bottom-Left 3D Object -->
      <div
        appFadeIn
        [delay]="0.25"
        [x]="-80"
        [y]="0"
        [duration]="0.9"
        class="absolute bottom-[8%] left-[3%] sm:left-[6%] md:left-[10%] w-[100px] sm:w-[140px] md:w-[180px] pointer-events-none select-none z-10"
      >
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png"
          alt="Abstract 3D object"
          class="w-full h-auto drop-shadow-xl"
        />
      </div>

      <!-- 3. Top-Right 3D Lego Icon -->
      <div
        appFadeIn
        [delay]="0.15"
        [x]="80"
        [y]="0"
        [duration]="0.9"
        class="absolute top-[4%] right-[1%] sm:right-[2%] md:right-[4%] w-[120px] sm:w-[160px] md:w-[210px] pointer-events-none select-none z-10"
      >
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png"
          alt="Lego 3D icon"
          class="w-full h-auto drop-shadow-xl"
        />
      </div>

      <!-- 4. Bottom-Right 3D Group -->
      <div
        appFadeIn
        [delay]="0.3"
        [x]="80"
        [y]="0"
        [duration]="0.9"
        class="absolute bottom-[8%] right-[3%] sm:right-[6%] md:right-[10%] w-[130px] sm:w-[170px] md:w-[220px] pointer-events-none select-none z-10"
      >
        <img
          src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png"
          alt="Group 3D elements"
          class="w-full h-auto drop-shadow-xl"
        />
      </div>

      <!-- Central Content Stack -->
      <div class="relative z-20 flex flex-col items-center gap-10 sm:gap-14 md:gap-16 max-w-3xl text-center">
        <!-- Section Heading -->
        <h2
          appFadeIn
          [delay]="0"
          [y]="40"
          class="hero-heading font-black uppercase tracking-tight leading-none text-[clamp(3rem,12vw,160px)] select-none"
        >
          About me
        </h2>

        <!-- Character-by-character Scroll-revealed Text -->
        <app-animated-text [text]="aboutBio" />

        <!-- CTA Button -->
        <div class="mt-6 sm:mt-10">
          <app-contact-button />
        </div>
      </div>
    </section>
  `
})
export class AboutSectionComponent {
  readonly aboutBio =
    "With more than five years of experience in design, i focus on branding, web design, and user experience, i truly enjoy working with businesses that aim to stand out and present their best image. Let's build something incredible together!";
}
```

---

### 4.4 Section 4: `ServicesSectionComponent` (`<app-services-section>`)
* **Theme Inversion**: High-contrast pure white background (`#FFFFFF`) with dark `#0C0C0C` text.
* **Geometry**: Top rounded corners `rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px]`.
* **5 Service Items** (List with staggered entry animations):
  1. `01` — **3D Modeling**: Creation of detailed objects, characters, or environments...
  2. `02` — **Rendering**: High-quality, photorealistic renders that showcase designs...
  3. `03` — **Motion Design**: Dynamic animations and motion graphics that add energy...
  4. `04` — **Branding**: Crafting cohesive visual identities — from logos to full brand systems...
  5. `05` — **Web Design**: Designing clean, modern, and conversion-focused websites...
* **Item Layout**:
  * Left: Huge number `01` - `05` (`font-black`, `text-[clamp(3rem,10vw,140px)]`).
  * Right: Stacked Title (`font-medium uppercase text-[clamp(1rem,2.2vw,2.1rem)]`) and Description (`font-light max-w-2xl text-[clamp(0.85rem,1.6vw,1.25rem)] opacity-60`).
  * Divider: `1px solid rgba(12, 12, 12, 0.15)`.

```typescript
// services-section.component.ts
import { Component } from '@angular/core';
import { FadeInDirective } from '../directives/fade-in.directive';

interface ServiceItem {
  number: string;
  name: string;
  description: string;
}

@Component({
  selector: 'app-services-section',
  standalone: true,
  imports: [FadeInDirective],
  template: `
    <section class="bg-[#FFFFFF] text-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 py-20 sm:py-24 md:py-32 relative z-0">
      <div class="max-w-5xl mx-auto">
        <h2
          appFadeIn
          [y]="40"
          class="font-black uppercase text-center text-[clamp(3rem,12vw,160px)] leading-none mb-16 sm:mb-20 md:mb-28"
        >
          Services
        </h2>

        <div class="flex flex-col">
          @for (service of services; track service.number; let i = $index) {
            <div
              appFadeIn
              [delay]="i * 0.1"
              [y]="30"
              class="flex flex-col md:flex-row items-start md:items-center justify-between py-8 sm:py-10 md:py-12 border-b border-[rgba(12,12,12,0.15)] gap-6 md:gap-12"
              [class.border-t]="i === 0"
            >
              <!-- Huge Number -->
              <span class="font-black text-[clamp(3rem,10vw,140px)] leading-none text-[#0C0C0C] select-none">
                {{ service.number }}
              </span>

              <!-- Content Column -->
              <div class="flex flex-col gap-2 max-w-2xl">
                <h3 class="font-medium uppercase text-[clamp(1rem,2.2vw,2.1rem)] tracking-wide">
                  {{ service.name }}
                </h3>
                <p class="font-light text-[clamp(0.85rem,1.6vw,1.25rem)] leading-relaxed text-[#0C0C0C]/60">
                  {{ service.description }}
                </p>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `
})
export class ServicesSectionComponent {
  readonly services: ServiceItem[] = [
    {
      number: '01',
      name: '3D Modeling',
      description: 'Creation of detailed objects, characters, or environments tailored to specific client needs, ideal for games, products, and visualizations.'
    },
    {
      number: '02',
      name: 'Rendering',
      description: 'High-quality, photorealistic renders that showcase designs with custom lighting, textures, and materials to bring concepts to life.'
    },
    {
      number: '03',
      name: 'Motion Design',
      description: 'Dynamic animations and motion graphics that add energy and storytelling to brands, products, and digital experiences.'
    },
    {
      number: '04',
      name: 'Branding',
      description: 'Crafting cohesive visual identities — from logos to full brand systems — that communicate a clear and memorable presence.'
    },
    {
      number: '05',
      name: 'Web Design',
      description: 'Designing clean, modern, and conversion-focused websites with attention to layout, typography, and user experience.'
    }
  ];
}
```

---

### 4.5 Section 5: `ProjectsSectionComponent` (`<app-projects-section>`)
* **Geometry**: Dark `#0C0C0C` background, pulled upward with negative margin `-mt-10 sm:-mt-12 md:-mt-14` over the white services section, top corners `rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px]`, elevated to `z-10`.
* **Sticky-Stacking Cards Mechanic**:
  * 3 stacked project cards inside `h-[85vh]` sticky viewport boundaries.
  * Stacking calculation:
    $$\text{topOffset} = \text{index} \times 28\text{px}$$
    $$\text{targetScale} = 1 - (\text{totalCards} - 1 - \text{index}) \times 0.03$$
  * Angular 21 implementation utilizes sticky positioning: `position: sticky; top: calc(6rem + index * 28px);` accompanied by scroll-driven scale transforms.
* **Card Anatomy**:
  * Outer: Border `2px solid #D7E2EA`, radius `rounded-[40px] sm:rounded-[50px] md:rounded-[60px]`, background `#0C0C0C`, padding `p-4 sm:p-6 md:p-8`.
  * Top Row: Massive index number (`01`, `02`, `03`), category tag (`Client` / `Personal`), project title, and `<app-live-project-button>`.
  * Bottom Row: Two-column grid with heavy corner radiuses (`rounded-[40px] sm:rounded-[50px] md:rounded-[60px]`):
    * Column 1 (40% width): 2 stacked images. Top height `clamp(130px, 16vw, 230px)`, bottom height `clamp(160px, 22vw, 340px)`.
    * Column 2 (60% width): 1 tall hero image matching combined height.

```typescript
// projects-section.component.ts
import { Component } from '@angular/core';
import { LiveProjectButtonComponent } from '../ui/live-project-button.component';
import { FadeInDirective } from '../directives/fade-in.directive';

export interface ProjectCardData {
  id: string;
  number: string;
  title: string;
  category: 'Client' | 'Personal';
  col1Image1: string;
  col1Image2: string;
  col2Image: string;
  liveUrl: string;
}

@Component({
  selector: 'app-projects-section',
  standalone: true,
  imports: [LiveProjectButtonComponent, FadeInDirective],
  template: `
    <section class="relative z-10 -mt-10 sm:-mt-12 md:-mt-14 bg-[#0C0C0C] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] px-5 sm:px-8 md:px-10 pt-20 sm:pt-24 md:pt-32 pb-32">
      <!-- Section Heading -->
      <h2
        appFadeIn
        [y]="40"
        class="hero-heading font-black uppercase text-center text-[clamp(3rem,12vw,160px)] leading-none mb-16 sm:mb-20 md:mb-28"
      >
        Project
      </h2>

      <!-- Sticky Stacking Cards Container -->
      <div class="max-w-6xl mx-auto flex flex-col gap-16 relative">
        @for (project of projects; track project.id; let i = $index) {
          <div
            class="sticky top-24 md:top-32 rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border-2 border-[#D7E2EA] bg-[#0C0C0C] p-4 sm:p-6 md:p-8 transition-transform duration-300 shadow-2xl"
            [style.top]="'calc(6rem + ' + (i * 28) + 'px)'"
          >
            <!-- Card Header -->
            <div class="flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-8 pb-4 border-b border-[#D7E2EA]/20">
              <div class="flex items-baseline gap-4 sm:gap-6">
                <span class="font-black text-3xl sm:text-5xl md:text-6xl text-[#D7E2EA]">
                  {{ project.number }}
                </span>
                <span class="text-xs sm:text-sm uppercase tracking-widest text-[#D7E2EA]/60 font-light border border-[#D7E2EA]/30 px-3 py-1 rounded-full">
                  {{ project.category }}
                </span>
                <h3 class="text-xl sm:text-2xl md:text-3xl font-medium uppercase text-white">
                  {{ project.title }}
                </h3>
              </div>
              <app-live-project-button [href]="project.liveUrl" />
            </div>

            <!-- Card Images Grid: 40% / 60% -->
            <div class="grid grid-cols-1 md:grid-cols-12 gap-4 sm:gap-6">
              <!-- Left Column: 2 Stacked Images (40% -> 5 cols) -->
              <div class="md:col-span-5 flex flex-col gap-4 sm:gap-6">
                <div class="w-full rounded-[30px] sm:rounded-[40px] md:rounded-[50px] overflow-hidden h-[clamp(130px,16vw,230px)] bg-zinc-900">
                  <img [src]="project.col1Image1" [alt]="project.title" loading="lazy" class="w-full h-full object-cover" />
                </div>
                <div class="w-full rounded-[30px] sm:rounded-[40px] md:rounded-[50px] overflow-hidden h-[clamp(160px,22vw,340px)] bg-zinc-900">
                  <img [src]="project.col1Image2" [alt]="project.title" loading="lazy" class="w-full h-full object-cover" />
                </div>
              </div>

              <!-- Right Column: 1 Tall Hero Image (60% -> 7 cols) -->
              <div class="md:col-span-7 rounded-[30px] sm:rounded-[40px] md:rounded-[50px] overflow-hidden h-full min-h-[300px] md:min-h-full bg-zinc-900">
                <img [src]="project.col2Image" [alt]="project.title" loading="lazy" class="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        }
      </div>
    </section>
  `
})
export class ProjectsSectionComponent {
  readonly projects: ProjectCardData[] = [
    {
      id: 'p1',
      number: '01',
      title: 'Nextlevel Studio',
      category: 'Client',
      col1Image1: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055344_5eff02e0-87a5-41ce-b64f-eb08da8f33db.png&w=1280&q=85',
      col1Image2: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055431_11d841fd-8b41-46a5-82e4-b04f2407a7d8.png&w=1280&q=85',
      col2Image: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055451_e317bf2d-28d4-48cc-86b0-6f72f25b6327.png&w=1280&q=85',
      liveUrl: '#'
    },
    {
      id: 'p2',
      number: '02',
      title: 'Aura Brand Identity',
      category: 'Personal',
      col1Image1: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055654_911201c5-36d9-4bc6-bac7-331adfce159f.png&w=1280&q=85',
      col1Image2: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055723_5ceda0b8-d9c2-4665-b2e3-83ba19ba76d1.png&w=1280&q=85',
      col2Image: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055753_adc5dcbd-a8e6-49c0-b43a-9b030d835cea.png&w=1280&q=85',
      liveUrl: '#'
    },
    {
      id: 'p3',
      number: '03',
      title: 'Solaris Digital',
      category: 'Client',
      col1Image1: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055759_963cfb0b-4bd1-4b0f-9d0a-09bd6cf95b2f.png&w=1280&q=85',
      col1Image2: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_060108_438f781a-9846-4dcc-89ab-c4e6cb830f5b.png&w=1280&q=85',
      col2Image: 'https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260412_055818_9d062121-ad7e-46b9-999a-1a6a692ef1ee.png&w=1280&q=85',
      liveUrl: '#'
    }
  ];
}
```

---

## 5. Main Root Shell Assembly (`AppComponent`)

In Angular 21, the entire landing page is orchestrated inside `AppComponent` utilizing standalone component imports and modern Angular control-flow deferral (`@defer`):

```typescript
// app.component.ts
import { Component } from '@angular/core';
import { HeroSectionComponent } from './components/hero-section/hero-section.component';
import { MarqueeSectionComponent } from './components/marquee-section/marquee-section.component';
import { AboutSectionComponent } from './components/about-section/about-section.component';
import { ServicesSectionComponent } from './components/services-section/services-section.component';
import { ProjectsSectionComponent } from './components/projects-section/projects-section.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeroSectionComponent,
    MarqueeSectionComponent,
    AboutSectionComponent,
    ServicesSectionComponent,
    ProjectsSectionComponent
  ],
  template: `
    <main class="w-full min-h-screen bg-[#0C0C0C] text-[#D7E2EA] font-['Kanit',sans-serif] overflow-x-clip">
      <!-- 1. Hero Section -->
      <app-hero-section id="hero" />

      <!-- 2. Marquee Section with Deferred Loading -->
      @defer (on viewport) {
        <app-marquee-section />
      } @placeholder {
        <div class="h-96 bg-[#0C0C0C]"></div>
      }

      <!-- 3. About Section -->
      @defer (on viewport) {
        <app-about-section id="about" />
      } @placeholder {
        <div class="min-h-screen bg-[#0C0C0C]"></div>
      }

      <!-- 4. Services Section -->
      @defer (on viewport) {
        <app-services-section id="price" />
      } @placeholder {
        <div class="min-h-screen bg-white"></div>
      }

      <!-- 5. Projects Section -->
      @defer (on viewport) {
        <app-projects-section id="projects" />
      } @placeholder {
        <div class="min-h-screen bg-[#0C0C0C]"></div>
      }
    </main>
  `
})
export class AppComponent {}
```

---

## 6. Recommended Angular 21 Project File Structure

```
src/
├── app/
│   ├── components/
│   │   ├── hero-section/
│   │   │   └── hero-section.component.ts
│   │   ├── marquee-section/
│   │   │   └── marquee-section.component.ts
│   │   ├── about-section/
│   │   │   └── about-section.component.ts
│   │   ├── services-section/
│   │   │   └── services-section.component.ts
│   │   ├── projects-section/
│   │   │   └── projects-section.component.ts
│   │   └── ui/
│   │       ├── contact-button.component.ts
│   │       ├── live-project-button.component.ts
│   │       └── animated-text.component.ts
│   ├── directives/
│   │   ├── fade-in.directive.ts
│   │   └── magnet.directive.ts
│   ├── models/
│   │   └── portfolio.models.ts
│   ├── app.component.ts
│   ├── app.config.ts
│   └── app.routes.ts
├── index.html
├── main.ts
└── styles.scss
```

---

## 7. Key Differences & Summary Checklist for Angular 21

1. **Signals Everywhere**: All inputs use `input()` and `computed()`, eliminating traditional lifecycle getters/setters and Zone.js change-detection overhead.
2. **Directives for DOM Physics**: Magnetic hover (`[appMagnet]`) and scroll/intersection reveal (`[appFadeIn]`) are implemented as reusable Angular Directives, keeping HTML clean.
3. **`@defer (on viewport)`**: Replaces manual React lazy loading and Framer Motion view triggers, reducing initial bundle weight and lazy-loading heavy GIF and 3D asset sections.
4. **Fluid Responsiveness**: Combines Tailwind CSS clamp utilities with Kanit Google font weights (300 to 900) across all responsive breakpoints (`sm: 640px`, `md: 768px`, `lg: 1024px`).

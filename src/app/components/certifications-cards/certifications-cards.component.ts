import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  signal
} from '@angular/core';
import { EDUCATION } from '../../data/portfolio.data';
import { ChipComponent } from '../ui/chip/chip.component';
import { MonoLabelComponent } from '../ui/mono-label/mono-label.component';

interface CourseCard {
  id: string;
  name: string;
  category: string;
  desc: string;
  accent: string;
  bg: string;
  icon: string;
  scatterRotation: number;
}

@Component({
  selector: 'app-certifications-cards',
  standalone: true,
  imports: [ChipComponent, MonoLabelComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="education" class="certifications-section relative z-[2] bg-[#FFF8F0] px-5 sm:px-8 md:px-[6%] py-24 sm:py-32 border-t border-[#E8DCCF] overflow-hidden">
      <!-- Hidden anchor tag to support #certifications links seamlessly -->
      <div id="certifications" class="absolute -top-24 left-0 pointer-events-none" aria-hidden="true"></div>

      <!-- Section Header -->
      <div class="max-w-6xl mx-auto mb-16 sm:mb-20 text-center">
        <div class="mb-5 inline-block">
          <app-mono-label [dot]="true" accentColor="#38BDF8">
            05 // EDUCATION &amp; LEARNING
          </app-mono-label>
        </div>

        <h2 class="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-[#14110F] text-ink m-0">
          Academic <span class="cabin-sketch-bold text-[#38BDF8]">Foundations</span>
        </h2>
        <p class="mt-4 text-base sm:text-lg text-[#6B6560] text-muted max-w-xl mx-auto font-normal leading-relaxed">
          Bachelor of Technology in Computer Science from LNCT Group of Colleges (82.80% aggregate) with rigorous systems coursework.
        </p>
      </div>

      <!-- Education Hero Banner -->
      <div class="max-w-6xl mx-auto mb-12">
        <div class="p-8 sm:p-10 rounded-3xl bg-white border-2 border-[#E8DCCF] shadow-[0_16px_40px_rgba(20,17,15,0.04)] flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div class="mb-3">
              <app-chip variant="pastel" color="butter" size="sm">
                <span>🎓 {{ education.period }}</span>
                <span>&bull;</span>
                <span>{{ education.location }}</span>
              </app-chip>
            </div>
            <h3 class="text-2xl sm:text-3xl font-extrabold text-[#14110F] text-ink mb-1">
              {{ education.institution }}
            </h3>
            <p class="text-base text-[#6B6560] text-muted font-normal">
              {{ education.degree }}
            </p>
          </div>

          <div class="flex items-center gap-4 bg-[#F7EFE5] px-6 py-4 rounded-2xl border border-[#E8DCCF]">
            <div class="text-right">
              <span class="text-xs font-mono uppercase tracking-wider text-[#6B6560] block font-bold">Aggregate</span>
              <span class="text-3xl font-black font-mono text-[#0A7C9C]">{{ education.aggregate }}</span>
            </div>
            <span class="text-3xl">🥇</span>
          </div>
        </div>
      </div>

      <!-- Core Coursework Cards -->
      <div class="max-w-6xl mx-auto">
        <div class="text-center mb-8">
          <span class="text-xs font-mono uppercase tracking-widest text-[#6B6560] font-bold">Verified Core Coursework</span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          @for (course of courseCards; track course.id; let idx = $index) {
            <div
              #cardWrapper
              class="course-card-wrapper h-[260px] perspective-[800px] select-none"
              [style.--scatter-rot]="course.scatterRotation + 'deg'"
              (mousemove)="onCardMouseMove($event, cardWrapper)"
              (mouseleave)="onCardMouseLeave(cardWrapper)"
              data-cursor="CORE"
            >
              <div
                class="course-card relative w-full h-full rounded-2xl p-6 border-2 flex flex-col justify-between transition-all duration-300 shadow-[0_10px_28px_rgba(20,17,15,0.04)] hover:shadow-[0_18px_36px_rgba(20,17,15,0.08)] bg-white"
                [style.border-color]="course.accent"
              >
                <div>
                  <div class="flex items-center justify-between mb-4">
                    <span class="text-2xl">{{ course.icon }}</span>
                    <span class="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" [style.background]="course.bg" [style.color]="course.accent">
                      0{{ idx + 1 }}
                    </span>
                  </div>

                  <h4 class="text-base font-extrabold text-[#14110F] text-ink leading-snug mb-2">
                    {{ course.name }}
                  </h4>
                  <p class="text-xs text-[#6B6560] text-muted leading-relaxed font-normal">
                    {{ course.desc }}
                  </p>
                </div>

                <div class="pt-3 border-t border-[#E8DCCF]/60 flex items-center justify-between text-[11px] font-mono text-[#6B6560]">
                  <span>{{ course.category }}</span>
                  <span class="text-[#0A7F3A] font-bold">&check; Verified</span>
                </div>
              </div>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styles: [`
    .course-card-wrapper {
      transform: rotate(var(--scatter-rot, 0deg));
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .course-card-wrapper:hover {
      transform: rotate(0deg) scale(1.04);
      z-index: 10;
    }
    .course-card {
      --rx: 0deg;
      --ry: 0deg;
      transform: rotateX(var(--rx)) rotateY(var(--ry));
      transition: transform 0.15s ease-out;
    }
  `]
})
export class CertificationsCardsComponent {
  readonly education = EDUCATION;

  readonly courseCards: CourseCard[] = [
    {
      id: 'dsa',
      name: 'Data Structures & Algorithms',
      category: 'Foundations',
      desc: 'Computational complexity, tree/graph traversals, dynamic programming, and space optimization.',
      accent: '#2F5BFF',
      bg: '#EBF3FF',
      icon: '🌳',
      scatterRotation: -1.5
    },
    {
      id: 'os',
      name: 'Operating Systems',
      category: 'Systems',
      desc: 'Memory management, multi-threading, concurrency locks, CPU scheduling, and kernel primitives.',
      accent: '#E5392F',
      bg: '#FFF0F0',
      icon: '⚡️',
      scatterRotation: 1.2
    },
    {
      id: 'dbms',
      name: 'DBMS & Relational Data',
      category: 'Databases',
      desc: 'Relational algebra, normalization (BCNF), transaction ACID isolation, and B-tree indexing.',
      accent: '#22C55E',
      bg: '#F0FDF4',
      icon: '🗄️',
      scatterRotation: -1.0
    },
    {
      id: 'cn',
      name: 'Computer Networks',
      category: 'Networking',
      desc: 'TCP/IP socket layer, WebSocket framing, routing protocols, DNS, and HTTP/2 stream multiplexing.',
      accent: '#8B5CF6',
      bg: '#F5F0FF',
      icon: '🌐',
      scatterRotation: 1.5
    },
    {
      id: 'cloud',
      name: 'Cloud Computing',
      category: 'Infrastructure',
      desc: 'Distributed architectures, virtualization, stateless services, and asynchronous event streams.',
      accent: '#D97706',
      bg: '#FFFDF0',
      icon: '☁️',
      scatterRotation: -0.8
    }
  ];

  onCardMouseMove(e: MouseEvent, card: HTMLDivElement): void {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotX = ((y - centerY) / centerY) * -10;
    const rotY = ((x - centerX) / centerX) * 10;

    const inner = card.querySelector('.course-card') as HTMLElement;
    if (inner) {
      inner.style.setProperty('--rx', `${rotX.toFixed(2)}deg`);
      inner.style.setProperty('--ry', `${rotY.toFixed(2)}deg`);
    }
  }

  onCardMouseLeave(card: HTMLDivElement): void {
    const inner = card.querySelector('.course-card') as HTMLElement;
    if (inner) {
      inner.style.setProperty('--rx', '0deg');
      inner.style.setProperty('--ry', '0deg');
    }
  }
}

import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  QueryList,
  ViewChildren,
  signal
} from '@angular/core';

interface CertCard {
  id: string;
  title: string;
  issuer: string;
  year: string;
  skills: string[];
  credentialId: string;
  verifyUrl: string;
  badgeEmoji: string;
  accent: string;
  scatterRotation: number;
  isFlipped: boolean;
}

@Component({
  selector: 'app-certifications-cards',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section id="certifications" class="certifications-section relative z-[2] bg-[#FFF8F0] px-5 sm:px-8 md:px-[6%] py-24 sm:py-32 border-t border-[#E8DCCF] overflow-hidden">
      <!-- Section Header -->
      <div class="max-w-6xl mx-auto mb-16 sm:mb-20 text-center">
        <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#F0F9FF] border border-[#BAE6FD] text-xs font-mono font-bold uppercase tracking-wider text-[#0A7C9C] shadow-xs mb-5">
          <span class="w-2 h-2 rounded-full bg-[#38BDF8] animate-pulse"></span>
          <span>05 // VERIFIED CREDENTIALS</span>
        </div>

        <h2 class="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-[#14110F] text-ink m-0">
          Holographic <span class="cabin-sketch-bold text-[#38BDF8]">Certifications</span>
        </h2>
        <p class="mt-4 text-base sm:text-lg text-[#6B6560] text-muted max-w-xl mx-auto font-normal leading-relaxed">
          Interactive trading cards. Hover to tilt the holographic rainbow sheen; click any card to flip and verify.
        </p>
      </div>

      <!-- Holographic Cards Loose Scatter Container -->
      <div class="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        @for (cert of certificates(); track cert.id; let idx = $index) {
          <div
            #cardWrapper
            class="cert-card-wrapper h-[440px] perspective-[1000px] cursor-pointer select-none"
            [style.--scatter-rot]="cert.scatterRotation + 'deg'"
            (mousemove)="onCardMouseMove($event, cardWrapper)"
            (mouseleave)="onCardMouseLeave(cardWrapper)"
            (click)="toggleFlip(cert.id)"
            data-cursor="FLIP"
          >
            <!-- Card Inner with 3D Flip -->
            <div
              class="cert-flipper relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d]"
              [class.is-flipped]="cert.isFlipped"
            >
              <!-- FRONT FACE (Holographic Sheen & Artwork) -->
              <div
                class="cert-front absolute inset-0 rounded-3xl p-7 border-2 border-black/15 shadow-[0_16px_40px_rgba(20,17,15,0.08)] flex flex-col justify-between overflow-hidden [backface-visibility:hidden] bg-[#FFFFFF]"
              >
                <!-- Prismatic Rainbow Hologram Layer -->
                <div class="holo-sheen absolute inset-0 pointer-events-none opacity-45 mix-blend-color-dodge transition-opacity duration-300"></div>

                <!-- Top Row -->
                <div class="relative z-10">
                  <div class="flex items-center justify-between mb-4">
                    <span class="text-xs font-mono font-bold px-2.5 py-1 rounded-full bg-white/90 border border-black/10 text-[#14110F] text-ink shadow-xs">
                      {{ cert.year }}
                    </span>
                    <span class="text-3xl filter drop-shadow-md">{{ cert.badgeEmoji }}</span>
                  </div>

                  <span class="text-[11px] font-mono uppercase tracking-widest text-[#6B6560] text-muted font-semibold block">
                    {{ cert.issuer }}
                  </span>
                  <h3 class="text-xl font-extrabold text-[#14110F] text-ink mt-2 leading-snug">
                    {{ cert.title }}
                  </h3>
                </div>

                <!-- Middle Skills Chips -->
                <div class="relative z-10 flex flex-wrap gap-1.5 my-4">
                  @for (skill of cert.skills; track skill) {
                    <span class="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white border border-black/10 text-[#14110F] text-ink">
                      {{ skill }}
                    </span>
                  }
                </div>

                <!-- Bottom Action Row -->
                <div class="relative z-10 pt-4 border-t border-black/10 flex items-center justify-between text-xs font-mono text-[#6B6560] text-muted">
                  <span class="cabin-sketch-bold text-sm text-[#14110F] text-ink">Click to flip &bull; ID</span>
                  <span class="text-base group-hover:translate-x-1 transition-transform">↺</span>
                </div>
              </div>

              <!-- BACK FACE (Verification Details & Link) -->
              <div
                class="cert-back absolute inset-0 rounded-3xl p-7 border-2 border-[#14110F] shadow-[0_16px_40px_rgba(20,17,15,0.12)] flex flex-col justify-between [backface-visibility:hidden] [transform:rotateY(180deg)] bg-[#14110F] text-white"
              >
                <div>
                  <div class="flex items-center justify-between mb-6">
                    <span class="text-xs font-mono uppercase tracking-wider text-[#FFC93C] font-bold">
                      VERIFIED CREDENTIAL
                    </span>
                    <span class="w-2.5 h-2.5 rounded-full bg-[#5CC46B] animate-pulse"></span>
                  </div>

                  <h4 class="text-lg font-bold text-white mb-2">{{ cert.title }}</h4>
                  <p class="text-xs font-mono text-white/60 mb-6">Issued by {{ cert.issuer }}</p>

                  <div class="p-4 rounded-xl bg-white/5 border border-white/10 mb-6">
                    <div class="text-[10px] font-mono text-white/40 uppercase tracking-widest">
                      Credential Serial ID
                    </div>
                    <div class="text-sm font-mono font-bold text-[#FFC93C] mt-1 select-text">
                      {{ cert.credentialId }}
                    </div>
                  </div>
                </div>

                <div>
                  <a
                    [href]="cert.verifyUrl"
                    target="_blank"
                    rel="noopener noreferrer"
                    (click)="$event.stopPropagation()"
                    class="block w-full py-3 rounded-full text-center text-xs font-mono font-bold uppercase tracking-wider bg-[#FFC93C] text-[#14110F] hover:bg-white transition-colors"
                  >
                    Verify Certificate &nearr;
                  </a>
                  <span class="block text-center text-[10px] font-mono text-white/50 mt-2">
                    Click card again to flip back
                  </span>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styles: [`
    .cert-card-wrapper {
      transform: rotate(var(--scatter-rot, 0deg));
      transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .cert-card-wrapper:hover {
      transform: rotate(0deg) scale(1.03);
      z-index: 20;
    }
    .cert-front {
      --mx: 50%;
      --my: 50%;
      --rx: 0deg;
      --ry: 0deg;
      transform: perspective(800px) rotateX(var(--rx)) rotateY(var(--ry));
      transition: transform 0.15s ease-out;
    }
    .holo-sheen {
      background:
        radial-gradient(circle at var(--mx, 50%) var(--my, 50%), rgba(255, 255, 255, 0.8), transparent 45%),
        conic-gradient(from 180deg at var(--mx, 50%) var(--my, 50%), #ff9dbb, #ffc93c, #7cf29a, #7fb2ff, #ff9dbb);
    }
    .is-flipped {
      transform: rotateY(180deg);
    }
  `]
})
export class CertificationsCardsComponent {
  readonly certificates = signal<CertCard[]>([
    {
      id: 'aws-csa',
      title: 'Solutions Architect & Cloud Dev',
      issuer: 'Amazon Web Services',
      year: '2024',
      skills: ['Serverless', 'CloudFront', 'Edge Logic', 'S3 CDN'],
      credentialId: 'AWS-SA-2024-9841',
      verifyUrl: 'https://aws.amazon.com/verification',
      badgeEmoji: '☁️',
      accent: '#FF9900',
      scatterRotation: -2.4,
      isFlipped: false
    },
    {
      id: 'gcp-arch',
      title: 'Professional Cloud Architect',
      issuer: 'Google Cloud Platform',
      year: '2023',
      skills: ['Kubernetes', 'Cloud Run', 'VPC Routing', 'BigQuery'],
      credentialId: 'GCP-PCA-871923',
      verifyUrl: 'https://cloud.google.com/certification',
      badgeEmoji: '🌐',
      accent: '#4285F4',
      scatterRotation: 1.8,
      isFlipped: false
    },
    {
      id: 'meta-fe',
      title: 'Advanced Frontend Architecture',
      issuer: 'Meta Certified',
      year: '2023',
      skills: ['Performance CWV', 'Design Systems', 'Micro-interactions'],
      credentialId: 'META-FE-99214',
      verifyUrl: 'https://coursera.org/verify',
      badgeEmoji: '⚡️',
      accent: '#0668E1',
      scatterRotation: -1.2,
      isFlipped: false
    },
    {
      id: 'd3-viz',
      title: 'D3.js Data Visualization Mastery',
      issuer: 'Observable / DataViz',
      year: '2022',
      skills: ['Kinetic Physics', 'Force Layouts', 'Hierarchical Pack'],
      credentialId: 'VIZ-D3-44102',
      verifyUrl: 'https://observablehq.com',
      badgeEmoji: '📊',
      accent: '#FF7A00',
      scatterRotation: 2.5,
      isFlipped: false
    }
  ]);

  onCardMouseMove(e: MouseEvent, cardEl: HTMLElement): void {
    const frontEl = cardEl.querySelector('.cert-front') as HTMLElement | null;
    if (!frontEl) return;

    const rect = cardEl.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const px = (x / rect.width) * 100;
    const py = (y / rect.height) * 100;

    const rx = ((y - rect.height / 2) / (rect.height / 2)) * -14;
    const ry = ((x - rect.width / 2) / (rect.width / 2)) * 14;

    frontEl.style.setProperty('--mx', `${px}%`);
    frontEl.style.setProperty('--my', `${py}%`);
    frontEl.style.setProperty('--rx', `${rx}deg`);
    frontEl.style.setProperty('--ry', `${ry}deg`);
  }

  onCardMouseLeave(cardEl: HTMLElement): void {
    const frontEl = cardEl.querySelector('.cert-front') as HTMLElement | null;
    if (!frontEl) return;

    frontEl.style.setProperty('--rx', '0deg');
    frontEl.style.setProperty('--ry', '0deg');
    frontEl.style.setProperty('--mx', '50%');
    frontEl.style.setProperty('--my', '50%');
  }

  toggleFlip(id: string): void {
    this.certificates.update((certs) =>
      certs.map((c) => (c.id === id ? { ...c, isFlipped: !c.isFlipped } : c))
    );
  }
}

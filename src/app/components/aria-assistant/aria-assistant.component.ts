import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  ViewChild,
  inject,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AvatarGazeService } from '../../services/avatar-gaze.service';
import { MASCOT_IMAGE_DATA } from '../../mascot-data';
import { SmoothScrollService } from '../../services/smooth-scroll.service';

interface ChatMessage {
  sender: 'aria' | 'user';
  text: string;
  time: string;
  link?: { label: string; target: string };
}

@Component({
  selector: 'app-aria-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Floating Mascot Robot Button (Bottom-Right) -->
    <div
      class="mascot-trigger-container fixed right-4 sm:right-6 bottom-4 sm:bottom-6 z-40 select-none"
      [class.chat-open]="isOpen()"
    >
      <!-- Playful Callout Pill -->
      @if (!isOpen() && showGreeting()) {
        <div
          class="greeting-bubble absolute bottom-full right-0 mb-3 px-3.5 py-1.5 rounded-full bg-[#14110F] text-[#FFF8F0] text-xs font-mono font-bold shadow-lg flex items-center gap-1.5 whitespace-nowrap animate-bounce cursor-pointer"
          (click)="toggleChat()"
        >
          <span>Chat with A.R.I.A</span>
          <span>🤖</span>
        </div>
      }

      <!-- Mascot Robot Trigger Button -->
      <button
        type="button"
        (click)="toggleChat()"
        class="mascot-btn relative w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-white border-2 border-[#14110F] shadow-[0_12px_32px_rgba(20,17,15,0.25)] flex items-center justify-center p-1.5 hover:scale-108 transition-all duration-300 cursor-pointer overflow-hidden group"
        data-cursor="CHAT"
        aria-label="Open A.R.I.A Portfolio Assistant"
      >
        <img
          [src]="mascotImage"
          alt="A.R.I.A AI Assistant"
          class="w-full h-full object-contain pointer-events-none group-hover:rotate-6 transition-transform"
        />
        <span class="absolute top-1 right-1 w-3 h-3 rounded-full bg-[#5CC46B] border-2 border-white animate-pulse"></span>
      </button>
    </div>

    <!-- Interactive Chat Drawer / Popover -->
    @if (isOpen()) {
      <div
        class="fixed right-4 sm:right-6 bottom-24 sm:bottom-28 z-40 w-[92vw] sm:w-[380px] max-h-[520px] bg-white rounded-3xl border-2 border-[#14110F] shadow-[0_24px_60px_rgba(20,17,15,0.2)] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-6 duration-300"
      >
        <!-- Header -->
        <div class="px-5 py-4 bg-[#14110F] text-white flex items-center justify-between">
          <div class="flex items-center gap-2.5">
            <div class="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm">
              🤖
            </div>
            <div>
              <div class="font-bold text-sm font-mono flex items-center gap-1.5">
                <span>A.R.I.A</span>
                <span class="text-[10px] px-1.5 py-0.5 rounded-full bg-[#5CC46B] text-black font-extrabold">ONLINE</span>
              </div>
              <div class="text-[11px] text-white/60 font-mono">Portfolio Assistant &bull; 60fps</div>
            </div>
          </div>

          <button
            type="button"
            (click)="toggleChat()"
            class="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-base cursor-pointer"
          >
            &times;
          </button>
        </div>

        <!-- Chat History -->
        <div #chatContainer class="flex-1 p-4 overflow-y-auto space-y-3 bg-[#FFF8F0] min-h-[240px] max-h-[320px]">
          @for (msg of messages(); track $index) {
            <div
              class="flex flex-col text-xs leading-relaxed"
              [class.items-end]="msg.sender === 'user'"
              [class.items-start]="msg.sender === 'aria'"
            >
              <div
                class="max-w-[85%] px-4 py-2.5 rounded-2xl shadow-xs font-mono"
                [class.bg-[#14110F]]="msg.sender === 'user'"
                [class.text-white]="msg.sender === 'user'"
                [class.bg-white]="msg.sender === 'aria'"
                [class.text-[#14110F]]="msg.sender === 'aria'"
                [class.border]="msg.sender === 'aria'"
                [class.border-[#E8DCCF]]="msg.sender === 'aria'"
              >
                {{ msg.text }}

                @if (msg.link) {
                  <button
                    type="button"
                    (click)="navigateTo(msg.link.target)"
                    class="block mt-2 text-[11px] text-[#2F5BFF] underline font-bold cursor-pointer"
                  >
                    {{ msg.link.label }} &rarr;
                  </button>
                }
              </div>
              <span class="text-[9px] font-mono text-[#6B6560] text-muted px-1 mt-1">{{ msg.time }}</span>
            </div>
          }

          @if (isThinking()) {
            <div class="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-white border border-[#E8DCCF] w-fit text-[#6B6560] text-muted text-xs font-mono">
              <span class="w-1.5 h-1.5 rounded-full bg-[#E5392F] animate-bounce"></span>
              <span class="w-1.5 h-1.5 rounded-full bg-[#E5392F] animate-bounce [animation-delay:0.15s]"></span>
              <span class="w-1.5 h-1.5 rounded-full bg-[#E5392F] animate-bounce [animation-delay:0.3s]"></span>
            </div>
          }
        </div>

        <!-- Suggested Quick Prompts -->
        <div class="px-3 py-2 bg-white border-t border-[#E8DCCF] flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none">
          @for (chip of quickChips; track chip.q) {
            <button
              type="button"
              (click)="askQuestion(chip.q, chip.a, chip.link)"
              class="px-2.5 py-1 rounded-full text-[11px] font-mono bg-[#F7EFE5] hover:bg-[#E8DCCF] text-[#14110F] text-ink transition-colors shrink-0 cursor-pointer"
            >
              {{ chip.q }}
            </button>
          }
        </div>

        <!-- Input Bar -->
        <form (submit)="onSendCustom($event)" class="p-3 bg-white border-t border-[#E8DCCF] flex gap-2 items-center">
          <input
            type="text"
            [(ngModel)]="userInput"
            name="userInput"
            placeholder="Ask A.R.I.A anything..."
            class="flex-1 px-3.5 py-2 rounded-xl bg-[#F7EFE5] border border-[#E8DCCF] text-xs font-mono text-[#14110F] text-ink focus:outline-none focus:border-[#E5392F]"
          />
          <button
            type="submit"
            class="px-4 py-2 rounded-xl bg-[#E5392F] text-white text-xs font-mono font-bold hover:opacity-90 cursor-pointer"
          >
            Send
          </button>
        </form>
      </div>
    }
  `
})
export class AriaAssistantComponent {
  @ViewChild('chatContainer') chatContainerRef?: ElementRef<HTMLDivElement>;

  readonly mascotImage = MASCOT_IMAGE_DATA;
  readonly isOpen = signal<boolean>(false);
  readonly isThinking = signal<boolean>(false);
  readonly showGreeting = signal<boolean>(true);

  private readonly avatarGaze = inject(AvatarGazeService);
  private readonly smoothScroll = inject(SmoothScrollService);

  userInput = '';

  readonly messages = signal<ChatMessage[]>([
    {
      sender: 'aria',
      text: 'Hey! I’m A.R.I.A, Prathak’s portfolio assistant. What would you like to explore about his engineering work or background?',
      time: 'Just now'
    }
  ]);

  readonly quickChips = [
    {
      q: 'Core Tech Stack?',
      a: 'Prathak specializes in Angular 21, TypeScript, D3.js physics simulations, Three.js/WebGL spatial graphics, and GSAP scrollytelling.',
      link: { label: 'Jump to Skills Section', target: '#skills' }
    },
    {
      q: 'Data Viz Craft?',
      a: 'With extensive D3 mastery, Prathak engineers live telemetry dashboards, rigid-body particle arenas, and animated SVG timelines running at 60fps.',
      link: { label: 'Explore D3 Playground', target: '#skills' }
    },
    {
      q: 'Selected Projects?',
      a: 'Check out his featured 3D client portals, generative spatial systems, and kinetic UI stacks.',
      link: { label: 'View Featured Works', target: '#projects' }
    },
    {
      q: 'Contact & Hire?',
      a: 'Prathak is currently open for creative dev roles & contracts. Reach him directly at prathaksoni.19@gmail.com!',
      link: { label: 'Go to Contact Section', target: '#contact' }
    }
  ];

  toggleChat(): void {
    const next = !this.isOpen();
    this.isOpen.set(next);
    this.showGreeting.set(false);

    if (next) {
      // Look toward bottom right corner where chat is open!
      this.avatarGaze.setTarget(0.85, 0.75, 'curious');
      this.avatarGaze.triggerWink();
    } else {
      this.avatarGaze.setTarget(0, 0, 'neutral');
    }
  }

  askQuestion(question: string, answer: string, link?: { label: string; target: string }): void {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.messages.update((list) => [...list, { sender: 'user', text: question, time }]);
    this.isThinking.set(true);

    // Gaze reaction
    this.avatarGaze.setTarget(0.8, 0.6, 'approving');

    setTimeout(() => {
      this.isThinking.set(false);
      this.messages.update((list) => [
        ...list,
        {
          sender: 'aria',
          text: answer,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          link
        }
      ]);
      this.scrollToBottom();
    }, 600);
  }

  onSendCustom(e: Event): void {
    e.preventDefault();
    const query = this.userInput.trim();
    if (!query) return;

    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.messages.update((list) => [...list, { sender: 'user', text: query, time }]);
    this.userInput = '';
    this.isThinking.set(true);

    this.avatarGaze.setTarget(0.7, 0.7, 'typing');

    setTimeout(() => {
      this.isThinking.set(false);
      const lower = query.toLowerCase();
      let reply = 'Prathak is a creative frontend engineer known for fluid kinematics, Angular 21, and D3 visualizations. Want to inspect his projects or send him an email?';
      let link: { label: string; target: string } | undefined = { label: 'Send an Email', target: '#contact' };

      if (lower.includes('skill') || lower.includes('stack') || lower.includes('angular') || lower.includes('react')) {
        reply = 'He works primarily with Angular 21, TypeScript, D3.js, Three.js, GSAP, and Tailwind. Check out the interactive physics playground to test each skill!';
        link = { label: 'Open Skills Playground', target: '#skills' };
      } else if (lower.includes('experience') || lower.includes('work') || lower.includes('job') || lower.includes('resume')) {
        reply = 'He has 9+ years of web experience leading frontend architecture, shipping 14+ 3D apps and enterprise data analytics tools.';
        link = { label: 'View Career Trajectory', target: '#experience' };
      } else if (lower.includes('project') || lower.includes('portfolio')) {
        reply = 'Explore his featured works below—featuring live line chart predictions, spatial UI cards, and kinetic brand identities.';
        link = { label: 'See Featured Works', target: '#projects' };
      } else if (lower.includes('contact') || lower.includes('email') || lower.includes('hire')) {
        reply = 'You can reach Prathak at prathaksoni.19@gmail.com or dispatch a message through the contact form!';
        link = { label: 'Jump to Contact Form', target: '#contact' };
      }

      this.messages.update((list) => [
        ...list,
        {
          sender: 'aria',
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          link
        }
      ]);
      this.scrollToBottom();
      this.avatarGaze.triggerWink();
    }, 700);
  }

  navigateTo(target: string): void {
    this.smoothScroll.scrollTo(target);
    this.isOpen.set(false);
  }

  private scrollToBottom(): void {
    setTimeout(() => {
      const el = this.chatContainerRef?.nativeElement;
      if (el) el.scrollTop = el.scrollHeight;
    }, 50);
  }
}

import { Component, Input, Output, EventEmitter, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import confetti from 'canvas-confetti';

export interface CertificatePopup {
  id: string;
  title: string;
  description: string;
  icon: string;
  rarity: string;
  date?: string;
}

@Component({
  selector: 'app-certificate-popup',
  standalone: true,
  imports: [CommonModule],
  template: `
        <!-- Full Screen Overlay -->
        <div class="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in"
            (click)="onClose()">

            <!-- Certificate Card - LANDSCAPE -->
            <div class="relative max-w-2xl w-full mx-4 animate-bounce-in" (click)="$event.stopPropagation()">

                <!-- Close Button -->
                <button
                    (click)="onClose()"
                    class="absolute -top-4 -right-4 z-10 w-12 h-12 bg-white rounded-full shadow-xl border-4 border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:scale-110 transition-all">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>

                <!-- Certificate Card -->
                <div class="relative bg-white rounded-[2rem] p-3 shadow-2xl border-4"
                    [ngClass]="{
                        'border-pink-300': getTheme() === 'pink',
                        'border-blue-300': getTheme() === 'blue',
                        'border-yellow-300': getTheme() === 'yellow',
                        'border-green-300': getTheme() === 'green'
                    }">

                    <!-- Inner Frame -->
                    <div class="h-full rounded-[1.5rem] border-[6px] border-double p-6 flex flex-col items-center text-center relative overflow-hidden"
                        [style.background-image]="'radial-gradient(' + getThemeColor() + ' 1px, transparent 1px)'"
                        [style.background-size]="'20px 20px'"
                        [ngClass]="{
                            'border-pink-200': getTheme() === 'pink',
                            'border-blue-200': getTheme() === 'blue',
                            'border-yellow-200': getTheme() === 'yellow',
                            'border-green-200': getTheme() === 'green'
                        }">

                        <!-- Decorative Header Arc (Original Design) -->
                        <div class="relative w-full h-16 overflow-hidden mb-4">
                            <div class="absolute -top-[100%] -left-[10%] w-[120%] h-[200%] rounded-[50%] shadow-sm flex items-end justify-center pb-2"
                                [ngClass]="{
                                    'bg-pink-500': getTheme() === 'pink',
                                    'bg-blue-500': getTheme() === 'blue',
                                    'bg-yellow-500': getTheme() === 'yellow',
                                    'bg-green-500': getTheme() === 'green'
                                }">
                                <span class="text-white font-black text-xl uppercase tracking-widest drop-shadow-md transform translate-y-[-10px]">
                                    PHIẾU BÉ NGOAN
                                </span>
                            </div>
                        </div>

                        <!-- Main Icon - Rosette -->
                        <div class="relative mb-4 group">
                            <!-- Glow Effect -->
                            <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full blur-xl opacity-40 animate-pulse"
                                [ngClass]="{
                                    'bg-pink-300': getTheme() === 'pink',
                                    'bg-blue-300': getTheme() === 'blue',
                                    'bg-yellow-300': getTheme() === 'yellow',
                                    'bg-green-300': getTheme() === 'green'
                                }">
                            </div>

                            <!-- Rosette Icon (Rotating Slowly) -->
                            <div class="relative z-10 text-8xl animate-spin-slow cursor-pointer hover:scale-110 transition-transform"
                                style="filter: drop-shadow(0 4px 12px rgba(0,0,0,0.2));"
                                (click)="triggerOneShotFirework()">
                                🏵️
                            </div>
                        </div>

                        <!-- Certificate Title -->
                        <h3 class="text-2xl md:text-3xl font-black mb-2"
                            [ngClass]="{
                                'text-pink-600': getTheme() === 'pink',
                                'text-blue-600': getTheme() === 'blue',
                                'text-yellow-600': getTheme() === 'yellow',
                                'text-green-600': getTheme() === 'green'
                            }">
                            {{ certificate.title }}
                        </h3>

                        <!-- Decorative Divider -->
                        <div class="flex items-center gap-2 mb-3 opacity-50">
                            <div class="h-[2px] w-8 rounded-full bg-current" [style.color]="getThemeHexColor()"></div>
                            <div class="text-xs">⭐</div>
                            <div class="h-[2px] w-8 rounded-full bg-current" [style.color]="getThemeHexColor()"></div>
                        </div>

                        <!-- Description -->
                        <p class="text-gray-600 font-bold mb-4 text-sm md:text-base italic">
                            "{{ certificate.description }}"
                        </p>

                        <!-- Date Stamp -->
                        @if (certificate.date) {
                            <div class="mb-2">
                                <div class="border-2 rounded-xl px-4 py-1.5 flex items-center gap-2 shadow-sm bg-white/80 backdrop-blur-sm"
                                    [ngClass]="{
                                        'border-pink-300 text-pink-600': getTheme() === 'pink',
                                        'border-blue-300 text-blue-600': getTheme() === 'blue',
                                        'border-yellow-300 text-yellow-700': getTheme() === 'yellow',
                                        'border-green-300 text-green-600': getTheme() === 'green'
                                    }">
                                    <span class="text-lg">📅</span>
                                    <span class="font-black text-sm">{{ certificate.date }}</span>
                                </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    `,
  styles: [`
        @keyframes fade-in {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-fade-in {
            animation: fade-in 0.3s ease-out forwards;
        }

        @keyframes bounce-in {
            0% { transform: scale(0.3); opacity: 0; }
            50% { transform: scale(1.05); }
            70% { transform: scale(0.9); }
            100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
            animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards;
        }

        @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
            animation: spin-slow 30s linear infinite;
        }
    `]
})
export class CertificatePopupComponent implements OnInit, OnDestroy {
  @Input({ required: true }) certificate!: CertificatePopup;
  @Output() close = new EventEmitter<void>();

  private fireworkInterval: any;

  ngOnInit() {
    this.startProfessionalFireworks();
  }

  ngOnDestroy() {
    this.stopFireworks();
  }

  onClose() {
    this.stopFireworks();
    // Fire one last burst when closing
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
      zIndex: 10000
    });
    this.close.emit();
  }

  triggerOneShotFirework() {
    // Fun interaction: Clicking the rosette triggers a burst
    confetti({
      particleCount: 30,
      spread: 360,
      startVelocity: 20,
      origin: { x: 0.5, y: 0.5 }, // Center screen is good enough for simulation
      colors: this.getParticlesColors(),
      zIndex: 10000
    });
  }

  private startProfessionalFireworks() {
    // Initial burst
    this.fireBurst(0.5, 0.5);

    // Continuous Fireworks Loop using canvas-confetti
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;

    this.fireworkInterval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      // Randomly fire from left or right
      this.fireBurst(Math.random(), Math.random() * 0.5);

    }, 800);
  }

  private fireBurst(x: number, y: number) {
    const colors = this.getParticlesColors();

    confetti({
      particleCount: 50,
      startVelocity: 30,
      spread: 360,
      origin: { x: x, y: y },
      colors: colors,
      zIndex: 10000,
      disableForReducedMotion: true
    });
  }

  private stopFireworks() {
    if (this.fireworkInterval) {
      clearInterval(this.fireworkInterval);
    }
  }

  private getParticlesColors(): string[] {
    const baseColors = ['#FFD700', '#FFFFFF'];
    const theme = this.getTheme();

    if (theme === 'pink') return [...baseColors, '#ec4899', '#f472b6'];
    if (theme === 'blue') return [...baseColors, '#3b82f6', '#60a5fa'];
    if (theme === 'yellow') return [...baseColors, '#eab308', '#facc15'];
    if (theme === 'green') return [...baseColors, '#22c55e', '#4ade80'];

    return baseColors;
  }

  getTheme(): 'pink' | 'blue' | 'yellow' | 'green' {
    const rarity = this.certificate?.rarity?.toLowerCase();
    switch (rarity) {
      case 'common': return 'pink';
      case 'rare': return 'blue';
      case 'legendary': return 'yellow';
      case 'epic': return 'green';
      default: return 'green';
    }
  }

  getThemeColor(): string {
    const theme = this.getTheme();
    switch (theme) {
      case 'pink': return '#fbcfe8';
      case 'blue': return '#bfdbfe';
      case 'yellow': return '#fef08a';
      case 'green': return '#bbf7d0';
      default: return '#bbf7d0';
    }
  }

  getThemeHexColor(): string {
    const theme = this.getTheme();
    switch (theme) {
      case 'pink': return '#db2777';
      case 'blue': return '#2563eb';
      case 'yellow': return '#ca8a04';
      case 'green': return '#16a34a';
      default: return '#16a34a';
    }
  }
}

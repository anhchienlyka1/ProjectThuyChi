import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Certificate {
    id: string;
    name: string;
    description: string;
    date?: string;
    unlocked: boolean;
    theme: 'pink' | 'blue' | 'yellow' | 'green';
}

@Component({
    selector: 'app-certificate-card',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="relative group perspective-1000">
            <div
                class="relative bg-white rounded-[2rem] p-2 shadow-xl border-4 transition-all duration-500 transform hover:-translate-y-2 hover:rotate-1"
                [class.border-gray-200]="!certificate.unlocked"
                [class.border-pink-300]="certificate.unlocked && certificate.theme === 'pink'"
                [class.border-blue-300]="certificate.unlocked && certificate.theme === 'blue'"
                [class.border-yellow-300]="certificate.unlocked && certificate.theme === 'yellow'"
                [class.border-green-300]="certificate.unlocked && certificate.theme === 'green'"
                [class.grayscale]="!certificate.unlocked">

                <!-- Inner Frame with Pattern -->
                <div
                    class="h-full rounded-[1.5rem] border-[6px] border-double p-1 flex flex-col items-center text-center relative overflow-hidden"
                    [class.bg-white]="true"
                    [style.background-image]="certificate.unlocked ? 'radial-gradient(' + (certificate.theme === 'pink' ? '#fbcfe8' : certificate.theme === 'blue' ? '#bfdbfe' : certificate.theme === 'yellow' ? '#fef08a' : '#bbf7d0') + ' 1px, transparent 1px)' : 'none'"
                    [style.background-size]="'20px 20px'"
                    [ngClass]="{
                        'border-pink-200': certificate.theme === 'pink',
                        'border-blue-200': certificate.theme === 'blue',
                        'border-yellow-200': certificate.theme === 'yellow',
                        'border-green-200': certificate.theme === 'green',
                        'border-gray-200': !certificate.unlocked
                    }">

                    <!-- Decorative Header Arc -->
                    <div class="relative w-full h-16 overflow-hidden mb-2">
                        <div
                            class="absolute -top-[100%] -left-[10%] w-[120%] h-[200%] rounded-[50%] shadow-sm flex items-end justify-center pb-2"
                            [ngClass]="{
                                'bg-pink-500': certificate.theme === 'pink',
                                'bg-blue-500': certificate.theme === 'blue',
                                'bg-yellow-500': certificate.theme === 'yellow',
                                'bg-green-500': certificate.theme === 'green',
                                'bg-gray-400': !certificate.unlocked
                            }">
                            <span class="text-white font-black text-xl uppercase tracking-widest drop-shadow-md transform translate-y-[-10px]">
                                Phiếu Bé Ngoan
                            </span>
                        </div>
                    </div>

                    <!-- Main Icon with Glow and Rotation -->
                    <div class="relative mb-2 group-hover:scale-110 transition-transform duration-500 mt-2">
                        <!-- Glow Effect behind icon -->
                        @if(certificate.unlocked) {
                            <div
                                class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full blur-xl opacity-60"
                                [ngClass]="{
                                    'bg-pink-300': certificate.theme === 'pink',
                                    'bg-blue-300': certificate.theme === 'blue',
                                    'bg-yellow-300': certificate.theme === 'yellow',
                                    'bg-green-300': certificate.theme === 'green'
                                }">
                            </div>
                        }
                        <div class="text-9xl relative z-10 drop-shadow-md" [class.animate-spin-slow]="certificate.unlocked">
                            @if (certificate.unlocked) {
                                🏵️
                            } @else {
                                🔒
                            }
                        </div>
                    </div>

                    <div class="flex-1 flex flex-col items-center justify-center w-full px-4">
                        <!-- Certificate Title -->
                        <h3 class="text-3xl font-black mb-2" [ngClass]="{
                            'text-pink-600': certificate.theme === 'pink',
                            'text-blue-600': certificate.theme === 'blue',
                            'text-yellow-600': certificate.theme === 'yellow',
                            'text-green-600': certificate.theme === 'green',
                            'text-gray-500': !certificate.unlocked
                        }">
                            {{ certificate.name }}
                        </h3>

                        <!-- Decorative Divider -->
                        <div class="flex items-center gap-2 mb-3 opacity-50">
                            <div class="h-[2px] w-8 rounded-full" [class.bg-current]="true"
                                [style.color]="certificate.theme === 'pink' ? '#db2777' : certificate.theme === 'blue' ? '#2563eb' : certificate.theme === 'yellow' ? '#ca8a04' : '#16a34a'">
                            </div>
                            <div class="text-xs">⭐</div>
                            <div class="h-[2px] w-8 rounded-full" [class.bg-current]="true"
                                [style.color]="certificate.theme === 'pink' ? '#db2777' : certificate.theme === 'blue' ? '#2563eb' : certificate.theme === 'yellow' ? '#ca8a04' : '#16a34a'">
                            </div>
                        </div>

                        <p class="text-gray-600 font-bold mb-6 text-sm md:text-base italic">
                            "{{ certificate.description }}"
                        </p>
                    </div>

                    <!-- Footer / Date Stamp -->
                    @if (certificate.date && certificate.unlocked) {
                        <div class="mb-4 relative">
                            <!-- Stamp circle -->
                            <div
                                class="border-2 rounded-xl px-5 py-1.5 flex items-center gap-2 shadow-sm bg-white/80 backdrop-blur-sm"
                                [ngClass]="{
                                    'border-pink-300 text-pink-600': certificate.theme === 'pink',
                                    'border-blue-300 text-blue-600': certificate.theme === 'blue',
                                    'border-yellow-300 text-yellow-700': certificate.theme === 'yellow',
                                    'border-green-300 text-green-600': certificate.theme === 'green'
                                }">
                                <span class="text-xl">📅</span>
                                <span class="font-black text-sm">{{ certificate.date }}</span>
                            </div>
                        </div>
                    }

                    <!-- Locked Overlay -->
                    @if (!certificate.unlocked) {
                        <div class="absolute inset-0 bg-gray-100/50 flex items-center justify-center backdrop-blur-[1px] z-20">
                            <div class="bg-white px-6 py-2 rounded-full shadow-md border border-gray-200 transform rotate-12">
                                <span class="text-gray-400 font-bold uppercase tracking-wider text-sm">Chưa đạt được</span>
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    `,
    styles: [`
        .perspective-1000 {
            perspective: 1000px;
        }

        @keyframes spin-slow {
            from {
                transform: rotate(0deg);
            }
            to {
                transform: rotate(360deg);
            }
        }

        .animate-spin-slow {
            animation: spin-slow 30s linear infinite;
        }
    `]
})
export class CertificateCardComponent {
    @Input({ required: true }) certificate!: Certificate;
}

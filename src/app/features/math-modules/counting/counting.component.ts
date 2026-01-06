import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { KidButtonComponent } from '../../../shared/ui-kit/kid-button/kid-button.component';
import { MascotService } from '../../../core/services/mascot.service';

interface NumberData {
    value: number;
    label: string;
    image: string; // Emoji đại diện
    color: string;
    items: string[]; // Icon của vật thể để đếm
}

@Component({
    selector: 'app-counting',
    standalone: true,
    imports: [CommonModule, KidButtonComponent],
    templateUrl: './counting.component.html',
    styles: [`
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-10px); }
    }
    .animate-float { animation: float 3s ease-in-out infinite; }

    @keyframes pop-in {
      0% { transform: scale(0); opacity: 0; }
      80% { transform: scale(1.1); opacity: 1; }
      100% { transform: scale(1); opacity: 1; }
    }
    .animate-pop-in { animation: pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
  `]
})
export class CountingComponent {
    private router = inject(Router);
    private mascot = inject(MascotService);

    currentNumber: number = 1;

    numberData: NumberData[] = [
        { value: 0, label: 'Số Không', image: '⭕', color: '#9CA3AF', items: [] },
        { value: 1, label: 'Số Một', image: '🍎', color: '#EF4444', items: ['🍎'] },
        { value: 2, label: 'Số Hai', image: '🦆', color: '#F59E0B', items: ['🦆', '🦆'] },
        { value: 3, label: 'Số Ba', image: '🦋', color: '#10B981', items: ['🦋', '🦋', '🦋'] },
        { value: 4, label: 'Số Bốn', image: '🍀', color: '#3B82F6', items: ['🍀', '🍀', '🍀', '🍀'] },
        { value: 5, label: 'Số Năm', image: '⭐', color: '#8B5CF6', items: ['⭐', '⭐', '⭐', '⭐', '⭐'] },
        { value: 6, label: 'Số Sáu', image: '🐌', color: '#EC4899', items: ['🐌', '🐌', '🐌', '🐌', '🐌', '🐌'] },
        { value: 7, label: 'Số Bảy', image: '🍭', color: '#F472B6', items: ['🍭', '🍭', '🍭', '🍭', '🍭', '🍭', '🍭'] },
        { value: 8, label: 'Số Tám', image: '🐙', color: '#6366F1', items: ['🐙', '🐙', '🐙', '🐙', '🐙', '🐙', '🐙', '🐙'] },
        { value: 9, label: 'Số Chín', image: '🍄', color: '#EF4444', items: ['🍄', '🍄', '🍄', '🍄', '🍄', '🍄', '🍄', '🍄', '🍄'] },
        { value: 10, label: 'Số Mười', image: '🌞', color: '#F59E0B', items: ['🌞', '🌞', '🌞', '🌞', '🌞', '🌞', '🌞', '🌞', '🌞', '🌞'] }
    ];

    get currentData(): NumberData {
        return this.numberData.find(d => d.value === this.currentNumber) || this.numberData[0];
    }

    goBack() {
        this.router.navigate(['/math']);
    }

    nextNumber() {
        if (this.currentNumber < 10) {
            this.currentNumber++;
            this.triggerMascot();
        }
    }

    prevNumber() {
        if (this.currentNumber > 0) {
            this.currentNumber--;
            this.triggerMascot();
        }
    }

    selectNumber(num: number) {
        this.currentNumber = num;
        this.triggerMascot();
    }

    triggerMascot() {
        const messages = [
            `Bé giỏi quá! Đây là số ${this.currentData.label} nè!`,
            `Số ${this.currentNumber} trông thật đáng yêu!`,
            `Con hãy đếm xem có bao nhiêu ${this.currentData.items[0] || 'hình'} nhé!`
        ];
        const randomMsg = messages[Math.floor(Math.random() * messages.length)];
        this.mascot.setEmotion('happy', randomMsg, 3000);
    }
}

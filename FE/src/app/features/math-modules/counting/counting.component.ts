import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { KidButtonComponent } from '../../../shared/ui-kit/kid-button/kid-button.component';
import { MascotService } from '../../../core/services/mascot.service';
import { AudioService } from '../../../core/services/audio.service';

import { OnInit } from '@angular/core';
import { CountingService } from '../../../core/services/counting.service';
import { NumberData } from '../../../core/models/number-data.model';


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
export class CountingComponent implements OnInit {
  private router = inject(Router);
  private mascot = inject(MascotService);
  private countingService = inject(CountingService);
  private audioService = inject(AudioService);

  currentNumber: number = 1;
  numberData: NumberData[] = [];

  ngOnInit() {
    this.countingService.getNumbers().subscribe(data => {
      this.numberData = data;

      // Speak welcome message combined with the first number to ensure smooth playback
      const welcomeText = `Chào mừng các con đến với bài học đếm số. ${this.currentData?.label || ''}`;
      this.audioService.speak(welcomeText);
    });
  }
  ngOnDestroy() {
    this.audioService.stop();
  }

  get currentData(): NumberData {
    const found = this.numberData.find(d => d.value === this.currentNumber);
    return found || this.numberData[0] || { value: 1, label: '...', image: '', color: '#000', items: [] };
  }

  goBack() {
    this.router.navigate(['/math']);
  }

  nextNumber() {
    if (this.currentNumber < 10) {
      this.currentNumber++;
      this.triggerMascot();
      this.readNumber();
    }
  }

  prevNumber() {
    if (this.currentNumber > 0) {
      this.currentNumber--;
      this.triggerMascot();
      this.readNumber();
    }
  }

  selectNumber(num: number) {
    this.currentNumber = num;
    this.triggerMascot();
    this.readNumber();
  }

  triggerMascot() {
    const messages = [
      `Bé giỏi quá! Đây là số ${this.currentData.label} nè!`,
      `Số ${this.currentNumber} trông thật đáng yêu!`,
      `Con hãy đếm xem có bao nhiêu ${this.currentData.items[0] || 'hình'} nhé!`
    ];
    const randomMsg = messages[Math.floor(Math.random() * messages.length)];
    this.mascot.setEmotion('happy', randomMsg, true, 3000);
  }

  readNumber() {
    // "Số một", "Số hai"
    const text = `${this.currentData?.label || this.currentNumber}`;
    this.audioService.speak(text);
  }
}

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { KidButtonComponent } from '../../../shared/ui-kit/kid-button/kid-button.component';
import { MascotService } from '../../../core/services/mascot.service';
import { ComparisonService } from '../../../core/services/comparison.service';
import { AudioService } from '../../../core/services/audio.service';

@Component({
  selector: 'app-comparison',
  standalone: true,
  imports: [CommonModule, KidButtonComponent],
  templateUrl: './comparison.component.html',
  styles: [`
    @keyframes pop-in {
      0% { transform: scale(0); opacity: 0; }
      80% { transform: scale(1.1); opacity: 1; }
      100% { transform: scale(1); opacity: 1; }
    }
    .animate-pop-in { animation: pop-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }

    @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
    .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }

    @keyframes bounce-in {
      0% { transform: scale(0.3); opacity: 0; }
      50% { transform: scale(1.05); }
      70% { transform: scale(0.9); }
      100% { transform: scale(1); opacity: 1; }
    }
    .animate-bounce-in { animation: bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards; }
  `]
})
export class ComparisonComponent implements OnInit {
  private router = inject(Router);
  private mascot = inject(MascotService);
  private comparisonService = inject(ComparisonService);
  private audioService = inject(AudioService);

  // Left expression
  leftNum1: number = 0;
  leftNum2: number = 0;
  leftOperator: '+' | '-' = '+';
  leftResult: number = 0;

  // Right expression
  rightNum1: number = 0;
  rightNum2: number = 0;
  rightOperator: '+' | '-' = '+';
  rightResult: number = 0;

  score: number = 0;
  config: any = {}; // Store full config

  showFeedback = false;
  isCorrect = false;

  // Game State
  totalQuestions = 10;
  currentQuestionIndex = 0;
  correctCount = 0;
  wrongCount = 0;
  isFinished = false;

  ngOnInit() {
    this.comparisonService.getConfig().subscribe(config => {
      this.config = config;
      this.totalQuestions = config.totalQuestions;
      // Trigger start message
      this.mascot.setEmotion('happy', config.mascotPrompts.start, 3000);
      this.startGame();
    });
  }

  startGame() {
    this.currentQuestionIndex = 0;
    this.correctCount = 0;
    this.wrongCount = 0;
    this.score = 0;
    this.isFinished = false;
    this.generateNewRound();
  }

  generateNewRound() {
    this.currentQuestionIndex++;

    const min = this.config.difficulty?.minNumber || 1;
    const max = this.config.difficulty?.maxNumber || 10;
    const maxResult = 30; // Maximum result allowed

    // Generate left expression with result <= 30
    do {
      this.leftNum1 = Math.floor(Math.random() * (max - min + 1)) + min;
      this.leftNum2 = Math.floor(Math.random() * (max - min + 1)) + min;
      this.leftOperator = Math.random() > 0.5 ? '+' : '-';

      // Ensure subtraction doesn't result in negative numbers
      if (this.leftOperator === '-' && this.leftNum1 < this.leftNum2) {
        [this.leftNum1, this.leftNum2] = [this.leftNum2, this.leftNum1];
      }

      this.leftResult = this.leftOperator === '+'
        ? this.leftNum1 + this.leftNum2
        : this.leftNum1 - this.leftNum2;
    } while (this.leftResult > maxResult);

    // Generate right expression with result <= 30
    do {
      this.rightNum1 = Math.floor(Math.random() * (max - min + 1)) + min;
      this.rightNum2 = Math.floor(Math.random() * (max - min + 1)) + min;
      this.rightOperator = Math.random() > 0.5 ? '+' : '-';

      // Ensure subtraction doesn't result in negative numbers
      if (this.rightOperator === '-' && this.rightNum1 < this.rightNum2) {
        [this.rightNum1, this.rightNum2] = [this.rightNum2, this.rightNum1];
      }

      this.rightResult = this.rightOperator === '+'
        ? this.rightNum1 + this.rightNum2
        : this.rightNum1 - this.rightNum2;
    } while (this.rightResult > maxResult);

    const prompt = this.config.mascotPrompts?.question.replace('{index}', this.currentQuestionIndex.toString())
      || `Câu hỏi số ${this.currentQuestionIndex}: So sánh hai phép tính!`;
    this.mascot.setEmotion('thinking', prompt, 3000);
    this.readQuestion();
  }

  readQuestion() {
    const text = `Các con hãy so sánh hai phép tính và chọn dấu thích hợp nhé!`;
    this.audioService.speak(text);
  }

  checkAnswer(operator: '>' | '<' | '=') {
    const correct = (operator === '>' && this.leftResult > this.rightResult) ||
      (operator === '<' && this.leftResult < this.rightResult) ||
      (operator === '=' && this.leftResult === this.rightResult);

    this.isCorrect = correct;
    this.showFeedback = true;

    if (correct) {
      this.score += (this.config.pointsPerQuestion || 10);
      this.correctCount++;
      this.mascot.celebrate();

      const msgs = this.config.feedback?.correct || ['Hoan hô!'];
      const msg = msgs[Math.floor(Math.random() * msgs.length)];
      this.mascot.setEmotion('happy', msg, 2000);
    } else {
      this.wrongCount++;
      const msgs = this.config.feedback?.wrong || ['Sai rồi!'];
      const msg = msgs[Math.floor(Math.random() * msgs.length)];
      this.mascot.setEmotion('sad', msg, 2000);
    }

    // Always move to next question or finish
    setTimeout(() => {
      this.showFeedback = false;
      if (this.currentQuestionIndex < this.totalQuestions) {
        this.generateNewRound();
      } else {
        this.finishGame();
      }
    }, 2000);
  }

  finishGame() {
    this.isFinished = true;
    this.mascot.setEmotion('celebrating', `Chúc mừng bé hoàn thành bài học!`, 5000);
  }

  goBack() {
    this.router.navigate(['/math']);
  }
}

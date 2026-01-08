import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { KidButtonComponent } from '../../../shared/ui-kit/kid-button/kid-button.component';
import { MascotService } from '../../../core/services/mascot.service';
import { TimeService } from '../../../core/services/time.service';
import { TimeQuestion } from '../../../core/models/time-config.model';

@Component({
  selector: 'app-time',
  standalone: true,
  imports: [CommonModule, KidButtonComponent],
  templateUrl: './time.component.html',
  styles: [`
    .clock-face {
      position: relative;
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background: white;
      border: 6px solid #FF6B9D;
      box-shadow: inset 0 0 20px rgba(0,0,0,0.05);
    }
    .clock-center {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 12px;
      height: 12px;
      background: #333;
      border-radius: 50%;
      transform: translate(-50%, -50%);
      z-index: 10;
      border: 2px solid white;
    }
    .hand {
      position: absolute;
      bottom: 50%;
      left: 50%;
      transform-origin: bottom center;
      border-radius: 4px;
      transition: transform 0.5s cubic-bezier(0.4, 2.08, 0.55, 0.44);
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    }
    .hour-hand {
      width: 6px;
      height: 45px;
      background: #333;
      z-index: 5;
    }
    .minute-hand {
      width: 4px;
      height: 70px;
      background: #FF6B9D;
      z-index: 6;
    }
    .clock-number {
      position: absolute;
      text-align: center;
      font-weight: 800;
      color: #555;
      font-size: 1.1rem;
      width: 24px;
      height: 24px;
      line-height: 24px;
      transform: translate(-50%, -50%);
    }

    /* Animations shared with other modules */
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
export class TimeComponent implements OnInit {
  private router = inject(Router);
  private mascot = inject(MascotService);
  private service = inject(TimeService);

  config: any = {};
  questions: TimeQuestion[] = [];
  currentQuestion: TimeQuestion | null = null;
  currentOptions: string[] = [];

  totalQuestions = 0;
  currentQuestionIndex = 0;
  score = 0;
  correctCount = 0;
  wrongCount = 0;

  showFeedback = false;
  isCorrect = false;
  isFinished = false;

  // Clock numbers positioning
  clockNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

  ngOnInit() {
    this.service.getConfig().subscribe(config => {
      this.config = config;
      this.questions = config.questions;
      this.totalQuestions = this.questions.length;
      this.mascot.setEmotion('happy', config.mascotPrompts.start, 3000);
      this.startGame();
    });
  }

  getNumberStyle(num: number) {
    const angle = (num * 30) * (Math.PI / 180);
    const radius = 75; // Adjusted for smaller clock (200px)
    const x = Math.sin(angle) * radius;
    const y = -Math.cos(angle) * radius;
    return {
      left: `calc(50% + ${x}px)`,
      top: `calc(50% + ${y}px)`
    };
  }

  getHourRotation(): string {
    if (!this.currentQuestion) return 'rotate(0deg)';
    const hour = this.currentQuestion.hour % 12;
    const minute = this.currentQuestion.minute;
    const deg = (hour * 30) + (minute * 0.5);
    return `rotate(${deg}deg)`;
  }

  getMinuteRotation(): string {
    if (!this.currentQuestion) return 'rotate(0deg)';
    const deg = this.currentQuestion.minute * 6;
    return `rotate(${deg}deg)`;
  }

  startGame() {
    this.currentQuestionIndex = 0;
    this.score = 0;
    this.correctCount = 0;
    this.wrongCount = 0;
    this.isFinished = false;
    this.generateNewRound();
  }

  generateNewRound() {
    this.currentQuestionIndex++;
    if (this.currentQuestionIndex > this.totalQuestions) {
      this.finishGame();
      return;
    }

    this.currentQuestion = this.questions[this.currentQuestionIndex - 1];
    this.currentOptions = [...this.currentQuestion.options].sort(() => Math.random() - 0.5);

    const prompt = this.config.mascotPrompts?.question
      .replace('{index}', this.currentQuestionIndex.toString())
      .replace('{question}', this.currentQuestion.question)
      || this.currentQuestion.question;

    this.mascot.setEmotion('thinking', prompt, 4000);
  }

  checkAnswer(selected: string) {
    if (!this.currentQuestion || this.showFeedback) return;

    this.showFeedback = true;
    this.isCorrect = selected === this.currentQuestion.correctAnswer;

    if (this.isCorrect) {
      this.correctCount++;
      this.mascot.celebrate();
      const msgs = this.config.feedback?.correct || ['Đúng rồi!'];
      this.mascot.setEmotion('happy', msgs[Math.floor(Math.random() * msgs.length)], 2000);
      this.score += 20;
    } else {
      this.wrongCount++;
      const msgs = this.config.feedback?.wrong || ['Sai rồi!'];
      this.mascot.setEmotion('sad', msgs[Math.floor(Math.random() * msgs.length)], 2000);
    }

    setTimeout(() => {
      this.showFeedback = false;
      this.generateNewRound();
    }, 2000);
  }

  finishGame() {
    this.isFinished = true;
    this.mascot.setEmotion('celebrating', 'Chúc mừng con đã hoàn thành bài học!', 5000);
  }

  goBack() {
    this.router.navigate(['/math']);
  }
}

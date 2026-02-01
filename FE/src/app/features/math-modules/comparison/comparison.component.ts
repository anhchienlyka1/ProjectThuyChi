import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { KidButtonComponent } from '../../../shared/ui-kit/kid-button/kid-button.component';
import { MascotService } from '../../../core/services/mascot.service';
import { ComparisonService } from '../../../core/services/comparison.service';
import { AudioService } from '../../../core/services/audio.service';
import { LearningService } from '../../../core/services/learning.service';
import { DailyProgressService } from '../../../core/services/daily-progress.service';
import { CertificatePopupComponent } from '../../../shared/components/certificate-popup.component';
import { LessonTimerService } from '../../../core/services/lesson-timer.service';
import { LessonTimerComponent } from '../../../shared/components/lesson-timer/lesson-timer.component';
import { LessonCompletionStatsComponent } from '../../../shared/components/lesson-completion-stats/lesson-completion-stats.component';


@Component({
  selector: 'app-comparison',
  standalone: true,
  imports: [CommonModule, KidButtonComponent, CertificatePopupComponent, LessonTimerComponent],
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

    /* Floating Elements */
    .floating-elements {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: 0;
    }

    .float-icon {
      position: absolute;
      font-size: 3rem;
      opacity: 0.2;
      animation: floatAround 20s ease-in-out infinite;
    }

    .icon-1 { top: 10%; left: 10%; animation-delay: 0s; }
    .icon-2 { top: 20%; right: 15%; animation-delay: 2s; }
    .icon-3 { bottom: 20%; left: 15%; animation-delay: 4s; }
    .icon-4 { top: 60%; right: 10%; animation-delay: 1s; }
    .icon-5 { bottom: 30%; right: 25%; animation-delay: 3s; }
    .icon-6 { top: 40%; left: 20%; animation-delay: 5s; }

    @keyframes floatAround {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      25% { transform: translate(30px, -30px) rotate(90deg); }
      50% { transform: translate(-20px, -50px) rotate(180deg); }
      75% { transform: translate(20px, -30px) rotate(270deg); }
    }

    /* Clouds */
    .clouds {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: 0;
    }

    .cloud {
      position: absolute;
      background: rgba(255, 255, 255, 0.4);
      border-radius: 100px;
      animation: cloudDrift 40s linear infinite;
    }

    .cloud::before, .cloud::after {
      content: '';
      position: absolute;
      background: rgba(255, 255, 255, 0.4);
      border-radius: 100px;
    }

    .cloud-1 {
      width: 120px; height: 50px; top: 15%; left: -120px; animation-duration: 35s;
    }
    .cloud-1::before { width: 60px; height: 60px; top: -30px; left: 15px; }
    .cloud-1::after { width: 70px; height: 45px; top: -20px; right: 15px; }

    .cloud-2 {
      width: 140px; height: 55px; top: 50%; left: -140px; animation-duration: 40s; animation-delay: 10s;
    }
    .cloud-2::before { width: 65px; height: 65px; top: -32px; left: 20px; }
    .cloud-2::after { width: 75px; height: 50px; top: -22px; right: 20px; }

    .cloud-3 {
      width: 100px; height: 45px; top: 75%; left: -100px; animation-duration: 45s; animation-delay: 20s;
    }
    .cloud-3::before { width: 50px; height: 50px; top: -25px; left: 10px; }
    .cloud-3::after { width: 60px; height: 40px; top: -15px; right: 10px; }

    @keyframes cloudDrift {
      0% { left: -150px; }
      100% { left: 110%; }
    }
  `]
})
export class ComparisonComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private mascot = inject(MascotService);
  private comparisonService = inject(ComparisonService);
  private audioService = inject(AudioService);
  private learningService = inject(LearningService);
  private dailyProgress = inject(DailyProgressService);
  private lessonTimer = inject(LessonTimerService);


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
  totalQuestions = 5;
  currentQuestionIndex = 0;
  correctCount = 0;
  wrongCount = 0;
  isFinished = false;
  startTime: number = 0;
  showCompletionStats = false;
  completionDuration = 0;

  // Achievement notification
  showAchievement = false;
  earnedAchievement: any = null;

  // Track if current question has been answered incorrectly (no score if retry)
  hasErrorInCurrentRound = false;


  ngOnInit() {
    this.comparisonService.getConfig().subscribe(config => {
      this.config = config;
      this.totalQuestions = config.totalQuestions || 5;
      // Trigger start message
      this.startGame();
    });
  }

  ngOnDestroy() {
    this.lessonTimer.stopTimer();
  }

  startGame() {
    this.currentQuestionIndex = 0;
    this.correctCount = 0;
    this.wrongCount = 0;
    this.score = 0;
    this.isFinished = false;
    this.showFeedback = false;
    this.showCompletionStats = false;
    this.startTime = Date.now();
    this.lessonTimer.startTimer('comparison');
    this.generateNewRound();
  }

  generateNewRound() {
    this.currentQuestionIndex++;
    this.hasErrorInCurrentRound = false; // Reset error flag for new question

    const min = this.config.difficulty?.minNumber || 1;
    // Upgrade difficulty: Ensure max is at least 20 even if config says 10
    const max = Math.max(this.config.difficulty?.maxNumber || 20, 20);
    const maxResult = 50; // Maximum result allowed (increased from 30)


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
      // Only count score if this is the first attempt (no errors in this round)
      if (!this.hasErrorInCurrentRound) {
        this.score += (this.config.pointsPerQuestion || 10);
      }
      this.correctCount++;

      if (this.currentQuestionIndex >= this.totalQuestions) {
        this.finishGame();
        return;
      }

      this.isCorrect = correct;
      this.showFeedback = true;

      const msgs = this.config.feedback?.correct || ['Hoan hô!'];
      const msg = msgs[Math.floor(Math.random() * msgs.length)];

      // Move to next question or finish
      setTimeout(() => {
        this.showFeedback = false;
        this.generateNewRound();
      }, 1000);
    } else {
      // Mark this question as having an error - no score will be given even if retry succeeds
      this.wrongCount++;
      this.hasErrorInCurrentRound = true;

      const msgs = this.config.feedback?.wrong || ['Sai rồi, bé thử lại nhé!'];
      const msg = msgs[Math.floor(Math.random() * msgs.length)];

      // Allow retry without moving to next question
      setTimeout(() => {
        this.showFeedback = false;
      }, 1000);
    }
  }

  finishGame() {
    // DON'T set isFinished=true immediately - wait until we show results
    const durationSeconds = this.lessonTimer.stopTimer();
    this.completionDuration = durationSeconds;

    // Increment daily completion count
    this.dailyProgress.incrementCompletion('comparison');

    this.learningService.completeSession({
      levelId: 'comparison',
      score: this.score,
      totalQuestions: this.totalQuestions,
      durationSeconds: durationSeconds
    }).subscribe({
      next: (response) => {
        const completionCount = this.dailyProgress.getTodayCompletionCount('comparison');
        const starMessage = response.starsEarned > 0
          ? `Bé đạt ${response.starsEarned} sao! Đã hoàn thành ${completionCount} lần hôm nay! 🔥`
          : `Bé hãy cố gắng hơn lần sau nhé!`;

        // Check if achievement was earned (improvementAchievement contains math lesson certificate)
        if (response.improvementAchievement) {
          // Show achievement FIRST (don't show results yet)
          this.earnedAchievement = {
            ...response.improvementAchievement,
            date: new Date().toLocaleDateString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })
          };
          setTimeout(() => {
            this.showAchievement = true;
          }, 300); // Reduced delay to 300ms for snappier feel
        } else {
          // No achievement, show results directly
          this.isFinished = true;
          setTimeout(() => {
            this.showCompletionStats = true;
          }, 2000);
        }
      },
      error: (err) => {
        console.error('Failed to save progress', err);
        const completionCount = this.dailyProgress.getTodayCompletionCount('comparison');
        // Show results even on error
        this.isFinished = true;
        setTimeout(() => {
          this.showCompletionStats = true;
        }, 2000);
      }
    });
  }

  closeAchievement() {
    this.showAchievement = false;
    // After closing achievement, show results
    this.isFinished = true;
    setTimeout(() => {
      this.showCompletionStats = true;
    }, 300);
  }

  closeCompletionStats() {
    this.showCompletionStats = false;
  }


  goBack() {
    this.router.navigate(['/math']);
  }

  formatDuration(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }
}

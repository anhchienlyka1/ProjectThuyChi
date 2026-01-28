
import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { KidButtonComponent } from '../../../shared/ui-kit/kid-button/kid-button.component';
import { MascotService } from '../../../core/services/mascot.service';
import { AudioService } from '../../../core/services/audio.service';
import { LearningService } from '../../../core/services/learning.service';
import { DailyProgressService } from '../../../core/services/daily-progress.service';
import { CertificatePopupComponent } from '../../../shared/components/certificate-popup.component';
import { LessonTimerService } from '../../../core/services/lesson-timer.service';
import { LessonTimerComponent } from '../../../shared/components/lesson-timer/lesson-timer.component';
import { LessonCompletionStatsComponent } from '../../../shared/components/lesson-completion-stats/lesson-completion-stats.component';

@Component({
  selector: 'app-mixed',
  standalone: true,
  imports: [CommonModule, KidButtonComponent, CertificatePopupComponent, LessonTimerComponent, LessonCompletionStatsComponent],
  templateUrl: './mixed.component.html',
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
export class MixedComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private mascot = inject(MascotService);
  private audioService = inject(AudioService);
  private learningService = inject(LearningService);
  private dailyProgress = inject(DailyProgressService);
  private lessonTimer = inject(LessonTimerService);


  config: any = {};

  // Operands for 3-number operations
  firstNumber: number = 0;
  secondNumber: number = 0;
  thirdNumber: number = 0;

  // Operator: '+' or '-'
  currentOperator: string = '+';

  correctAnswer: number = 0;
  userAnswer: string = '';

  items: string[] = ['🍎']; // Default
  currentItem = '🍎';

  totalQuestions = 10;
  currentQuestionIndex = 0;
  correctCount = 0;
  wrongCount = 0;
  score = 0;

  isFinished = false;
  showFeedback = false;
  isCorrect = false;
  startTime: number = 0;

  // Track if current question has been answered incorrectly (no score if retry)
  hasErrorInCurrentRound = false;

  // Achievement notification
  showAchievement = false;
  earnedAchievement: any = null;

  // Completion stats
  showCompletionStats = false;
  completionDuration = 0;
  previousFastestTime = 0; // Track previous record for comparison


  ngOnInit() {
    // Fetch previous fastest time before starting
    this.loadPreviousFastestTime();
    this.startGame();
  }

  ngOnDestroy() {
    // Stop timer when leaving component
    this.lessonTimer.stopTimer();
  }

  loadPreviousFastestTime() {
    this.learningService.getCompletionTime('mixed').subscribe({
      next: (data) => {
        if (data && data.fastestTimeSeconds > 0) {
          this.previousFastestTime = data.fastestTimeSeconds;
        }
      },
      error: (err) => {
        this.previousFastestTime = 0;
      }
    });
  }

  startGame() {
    this.currentQuestionIndex = 0;
    this.correctCount = 0;
    this.wrongCount = 0;
    this.score = 0;
    this.isFinished = false;
    this.startTime = Date.now();
    this.userAnswer = '';

    // Start lesson timer
    this.lessonTimer.startTimer('mixed');

    this.generateNewRound();
  }

  generateNewRound() {
    this.userAnswer = ''; // Clear previous answer
    this.currentQuestionIndex++;
    this.hasErrorInCurrentRound = false; // Reset error flag for new question

    // Randomly choose between addition (3 numbers) and subtraction (3 numbers)
    const isAddition = Math.random() > 0.5;
    this.currentOperator = isAddition ? '+' : '-';

    if (isAddition) {
      // Sum 3 numbers
      // Logic: Sum <= 20 or slightly higher for challenge
      const maxTotal = 20;
      const minTotal = 5;
      const total = Math.floor(Math.random() * (maxTotal - minTotal + 1)) + minTotal;

      // Split total into 3 parts
      // n1
      this.firstNumber = Math.floor(Math.random() * (total - 2)) + 1; // leave at least 1 for n2 and 1 for n3
      const remainder1 = total - this.firstNumber;

      // n2
      this.secondNumber = Math.floor(Math.random() * (remainder1 - 1)) + 1; // leave at least 1 for n3

      // n3
      this.thirdNumber = total - this.firstNumber - this.secondNumber;

      this.correctAnswer = total;

    } else {
      // Subtract 3 numbers: a - b - c = result (result >= 0)
      // Let's pick a result first, then add back
      const result = Math.floor(Math.random() * 10); // Result between 0 and 9

      // Pick c
      this.thirdNumber = Math.floor(Math.random() * 10) + 1;
      // Pick b
      this.secondNumber = Math.floor(Math.random() * 10) + 1;

      // a = result + b + c
      this.firstNumber = result + this.secondNumber + this.thirdNumber;

      this.correctAnswer = result;
    }

    this.readQuestion();
  }

  readQuestion() {
    const opText = this.currentOperator === '+' ? 'cộng' : 'trừ';
    // "A [op] B [op] C bằng bao nhiêu?"
    const text = `${this.firstNumber} ${opText} ${this.secondNumber} ${opText} ${this.thirdNumber} bằng bao nhiêu?`;
    this.audioService.speak(text);
  }

  handleKeypadInput(key: string) {
    if (this.showFeedback) return;

    if (key === 'DELETE') {
      this.userAnswer = this.userAnswer.slice(0, -1);
    } else if (key === 'SUBMIT') {
      this.checkAnswer();
    } else {
      // Limit length to 3 digits
      if (this.userAnswer.length < 3) {
        this.userAnswer += key;
      }
    }
  }


  checkAnswer() {
    if (!this.userAnswer) return;
    const selected = parseInt(this.userAnswer, 10);
    const correct = selected === this.correctAnswer;

    this.isCorrect = correct;
    this.showFeedback = true;

    if (correct) {
      // Only count score if this is the first attempt (no errors in this round)
      if (!this.hasErrorInCurrentRound) {
        this.score += 10;
        this.correctCount++;
      }

      const msgs = ['Tuyệt vời!', 'Xuất sắc!', 'Bé giỏi lắm!'];
      const msg = msgs[Math.floor(Math.random() * msgs.length)];

      setTimeout(() => {
        this.showFeedback = false;
        if (this.currentQuestionIndex < this.totalQuestions) {
          this.generateNewRound();
        } else {
          this.finishGame();
        }
      }, 2000);
    } else {
      // Mark this question as having an error
      if (!this.hasErrorInCurrentRound) {
        this.wrongCount++;
      }
      this.hasErrorInCurrentRound = true;

      const msgs = ['Sai rồi, bé thử lại nhé!', 'Cố lên nào!'];
      const msg = msgs[Math.floor(Math.random() * msgs.length)];

      // Allow retry without moving to next question
      setTimeout(() => {
        this.showFeedback = false;
        this.userAnswer = ''; // Clear answer so they can try again easily
      }, 2000);
    }
  }

  finishGame() {
    // Stop timer and get duration
    const durationSeconds = this.lessonTimer.stopTimer();
    this.completionDuration = durationSeconds;

    // Check if this is a new record
    const isNewRecord = this.previousFastestTime === 0 || durationSeconds < this.previousFastestTime;

    // Increment daily completion count
    this.dailyProgress.incrementCompletion('mixed');

    this.learningService.completeSession({
      levelId: 'mixed',
      score: this.score,
      totalQuestions: this.totalQuestions,
      durationSeconds: durationSeconds
    }).subscribe({
      next: (response) => {

        if (response.achievement) {
          this.earnedAchievement = response.achievement;
          setTimeout(() => {
            this.showAchievement = true;
          }, 300);
        } else {
          // No achievement - check if new record to show stats popup
          this.isFinished = true;
          if (isNewRecord) {
            setTimeout(() => {
              this.showCompletionStats = true;
            }, 1500);
          }
        }
      },
      error: (err) => {
        console.error('Failed to save progress', err);
        // Show results even on error - only if new record
        this.isFinished = true;
        if (isNewRecord) {
          setTimeout(() => {
            this.showCompletionStats = true;
          }, 1500);
        }
      }
    });
  }

  closeAchievement() {
    this.showAchievement = false;
    // After closing achievement, check if new record to show stats
    this.isFinished = true;

    // Check if this was a new record
    const isNewRecord = this.previousFastestTime === 0 || this.completionDuration < this.previousFastestTime;
    if (isNewRecord) {
      setTimeout(() => {
        this.showCompletionStats = true;
      }, 300);
    }
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

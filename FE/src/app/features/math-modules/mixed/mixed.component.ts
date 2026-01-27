
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
  firstNumber: number = 0;
  secondNumber: number = 0;
  resultNumber: number = 0;
  operation: string = '+';
  missingPos: number = 3; // 1 (first), 2 (second), 3 (result), 4 (operator), 5 (comparison), 6 (chain)

  // New state variables for advanced questions
  inputType: 'numeric' | 'operator' | 'comparison' = 'numeric';

  chainNumbers: number[] = [];
  chainOps: string[] = [];

  compareLeft: string = '';
  compareRight: string = '';
  compareLeftVal: number = 0;
  compareRightVal: number = 0;

  correctAnswer: number | string = 0;
  userAnswer: string = '';

  totalQuestions = 20;
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
    this.mascot.setEmotion('happy', 'Chào bé! Hôm nay chúng mình cùng ôn tập Toán nhé! 🌟', 3000);
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

    // Determine Question Type based on weights
    // 40% Basic (Missing 1, 2, 3)
    // 20% Find Operator (Missing 4)
    // 20% Comparison (Missing 5)
    // 20% Chain (Missing 6)

    const rand = Math.random();

    if (rand < 0.4) {
      // Basic Missing Number (1, 2, 3)
      this.generateBasicQuestion();
    } else if (rand < 0.6) {
      // Find Operator (4)
      this.generateFindOperatorQuestion();
    } else if (rand < 0.8) {
      // Comparison (5)
      this.generateComparisonQuestion();
    } else {
      // Chain Calculation (6)
      this.generateChainQuestion();
    }

    this.readQuestion();
  }

  generateBasicQuestion() {
    this.inputType = 'numeric';
    this.operation = Math.random() > 0.5 ? '+' : '-';

    // Sum/Sub logic
    if (this.operation === '+') {
      const targetSum = Math.floor(Math.random() * 20) + 1;
      this.firstNumber = Math.floor(Math.random() * targetSum);
      this.secondNumber = targetSum - this.firstNumber;
      this.resultNumber = targetSum;
    } else {
      this.firstNumber = Math.floor(Math.random() * 20) + 1;
      this.secondNumber = Math.floor(Math.random() * this.firstNumber);
      this.resultNumber = this.firstNumber - this.secondNumber;
    }

    // 1, 2, or 3
    this.missingPos = Math.floor(Math.random() * 3) + 1;

    if (this.missingPos === 1) this.correctAnswer = this.firstNumber;
    if (this.missingPos === 2) this.correctAnswer = this.secondNumber;
    if (this.missingPos === 3) this.correctAnswer = this.resultNumber;

    const prompt = this.missingPos === 3
      ? (this.operation === '+' ? `${this.firstNumber} cộng ${this.secondNumber} bằng bao nhiêu?` : `${this.firstNumber} trừ ${this.secondNumber} bằng bao nhiêu?`)
      : 'Số nào còn thiếu nhỉ?';

    this.mascot.setEmotion('thinking', prompt, 4000);
  }

  generateFindOperatorQuestion() {
    this.inputType = 'operator';
    this.missingPos = 4;

    // Ensure B != 0 to avoid ambiguity (+0 vs -0)
    // A ? B = C
    this.operation = Math.random() > 0.5 ? '+' : '-';

    if (this.operation === '+') {
      const targetSum = Math.floor(Math.random() * 15) + 3; // sum >= 3
      this.firstNumber = Math.floor(Math.random() * (targetSum - 1)) + 1; // 1 to sum-1
      this.secondNumber = targetSum - this.firstNumber;
      this.resultNumber = targetSum;
    } else {
      this.firstNumber = Math.floor(Math.random() * 15) + 3;
      this.secondNumber = Math.floor(Math.random() * (this.firstNumber - 1)) + 1; // ensure non-zero subtrahend
      this.resultNumber = this.firstNumber - this.secondNumber;
    }

    this.correctAnswer = this.operation;
    this.mascot.setEmotion('thinking', 'Điền dấu thích hợp vào chỗ trống nào!', 4000);
  }

  generateComparisonQuestion() {
    this.inputType = 'comparison';
    this.missingPos = 5;

    // Type: Num vs Num, or Expr vs Num
    const type = Math.random() > 0.4 ? 'expr' : 'num';

    if (type === 'num') {
      this.compareLeftVal = Math.floor(Math.random() * 50);
      this.compareRightVal = Math.floor(Math.random() * 50);
      // Avoid equality too often?
      if (Math.random() > 0.8) this.compareRightVal = this.compareLeftVal;

      this.compareLeft = this.compareLeftVal.toString();
      this.compareRight = this.compareRightVal.toString();
    } else {
      // Expr vs Num: A + B vs C
      const op = Math.random() > 0.5 ? '+' : '-';
      const n1 = Math.floor(Math.random() * 19) + 1;
      const n2 = Math.floor(Math.random() * 10) + 1;

      this.compareLeftVal = op === '+' ? n1 + n2 : (n1 >= n2 ? n1 - n2 : n1 + n2);
      // Correction if subtraction resulted in negative, force addition logic or swap
      if (op === '-' && n1 < n2) {
        this.compareLeftVal = n1 + n2;
        this.compareLeft = `${n1} + ${n2}`;
      } else {
        this.compareLeft = `${n1} ${op} ${n2}`;
      }

      // Target C close to Val
      const offset = Math.floor(Math.random() * 5) - 2; // -2 to +2
      this.compareRightVal = Math.max(0, this.compareLeftVal + offset);
      this.compareRight = this.compareRightVal.toString();
    }

    if (this.compareLeftVal > this.compareRightVal) this.correctAnswer = '>';
    else if (this.compareLeftVal < this.compareRightVal) this.correctAnswer = '<';
    else this.correctAnswer = '=';

    this.mascot.setEmotion('thinking', 'So sánh hai bên nhé!', 4000);
  }

  generateChainQuestion() {
    this.inputType = 'numeric';
    this.missingPos = 6;

    // A op1 B op2 C = ?
    // Keep intermediate steps positive and result <= 20
    let valid = false;
    let attempts = 0;

    while (!valid && attempts < 10) {
      attempts++;
      const n1 = Math.floor(Math.random() * 10) + 1;
      const n2 = Math.floor(Math.random() * 8) + 1;
      const n3 = Math.floor(Math.random() * 6) + 1;

      const op1 = Math.random() > 0.5 ? '+' : '-';
      const op2 = Math.random() > 0.5 ? '+' : '-';

      let step1 = 0;
      if (op1 === '+') step1 = n1 + n2;
      else step1 = n1 - n2;

      if (step1 < 0) continue;

      let res = 0;
      if (op2 === '+') res = step1 + n3;
      else res = step1 - n3;

      if (res >= 0 && res <= 20) {
        this.chainNumbers = [n1, n2, n3];
        this.chainOps = [op1, op2];
        this.resultNumber = res;
        this.correctAnswer = res;
        valid = true;
      }
    }

    if (!valid) {
      // Fallback to basic if bad luck
      this.generateBasicQuestion();
      return;
    }

    this.mascot.setEmotion('thinking', 'Tính toán cẩn thận nha!', 4000);
  }

  readQuestion() {
    let text = '';
    if (this.missingPos <= 3) {
      // Basic
      if (this.missingPos === 3) {
        text = this.operation === '+'
          ? `${this.firstNumber} cộng ${this.secondNumber} bằng bao nhiêu?`
          : `${this.firstNumber} trừ ${this.secondNumber} bằng bao nhiêu?`;
      } else {
        text = 'Điền số còn thiếu vào chỗ trống.';
      }
    } else if (this.missingPos === 4) {
      text = 'Điền dấu cộng hoặc trừ vào chỗ trống.';
    } else if (this.missingPos === 5) {
      text = 'So sánh hai bên nhé.';
    } else if (this.missingPos === 6) {
      text = 'Tính kết quả của phép tính dài này nhé.';
    }

    this.audioService.speak(text);
  }

  handleKeypadInput(key: string) {
    if (this.showFeedback) return;

    if (key === 'DELETE') {
      this.userAnswer = this.userAnswer.slice(0, -1);
    } else if (key === 'SUBMIT') {
      this.checkAnswer();
    } else {
      // Handle number vs symbol
      if (this.inputType === 'numeric') {
        if (this.userAnswer.length < 3) {
          this.userAnswer += key;
        }
      } else {
        // Operator or Comparison: Single char answer usually, but just set it
        this.userAnswer = key;
        // Auto submit for single-choice if desired? No, let them press submit or make it auto.
        // For buttons like > < = usually immediate feedback is nice, but consistency with Submit button is safer.
        // Let's allow change before submit.
      }
    }
  }


  checkAnswer() {
    if (!this.userAnswer) return;

    let correct = false;

    if (this.inputType === 'numeric') {
      const selected = parseInt(this.userAnswer, 10);
      correct = selected === this.correctAnswer;
    } else {
      // String comparison for operators/comparison
      correct = this.userAnswer === this.correctAnswer;
    }

    this.isCorrect = correct;
    this.showFeedback = true;

    if (correct) {
      // Only count score if this is the first attempt (no errors in this round)
      if (!this.hasErrorInCurrentRound) {
        this.score += 10;
        this.correctCount++;
      }
      this.mascot.celebrate();

      const msgs = ['Tuyệt vời!', 'Xuất sắc!', 'Bé giỏi lắm!', 'Hoan hô!'];
      const msg = msgs[Math.floor(Math.random() * msgs.length)];
      this.mascot.setEmotion('happy', msg, 2000);

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

      const msgs = ['Chưa đúng rồi', 'Thử lại nào', 'Cố lên bé ơi'];
      const msg = msgs[Math.floor(Math.random() * msgs.length)];
      this.mascot.setEmotion('sad', msg, 2000);

      // Allow retry without moving to next question
      setTimeout(() => {
        this.showFeedback = false;
        this.userAnswer = ''; // Clear answer so they can try again easily
      }, 2000);
    }
  }

  finishGame() {
    const durationSeconds = this.lessonTimer.stopTimer();
    this.completionDuration = durationSeconds;

    const isNewRecord = this.previousFastestTime === 0 || durationSeconds < this.previousFastestTime;

    this.dailyProgress.incrementCompletion('mixed');

    this.learningService.completeSession({
      levelId: 'math-5', // ID for Mixed Math
      score: this.score,
      totalQuestions: this.totalQuestions,
      durationSeconds: durationSeconds
    }).subscribe({
      next: (response) => {
        const completionCount = this.dailyProgress.getTodayCompletionCount('mixed');
        const starMessage = response.starsEarned > 0
          ? `Bé đạt ${response.starsEarned} sao! Đã hoàn thành ${completionCount} lần hôm nay! 🔥`
          : `Bé hãy cố gắng hơn lần sau nhé!`;
        this.mascot.setEmotion('celebrating', starMessage, 5000);

        if (response.achievement) {
          this.earnedAchievement = response.achievement;
          setTimeout(() => {
            this.showAchievement = true;
          }, 300);
        } else {
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
    this.isFinished = true;
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

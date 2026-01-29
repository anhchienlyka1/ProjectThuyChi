
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
export class MixedComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private mascot = inject(MascotService);
  private audioService = inject(AudioService);
  private learningService = inject(LearningService);
  private dailyProgress = inject(DailyProgressService);
  private lessonTimer = inject(LessonTimerService);


  config: any = {};

  // Question Type: '3-math' | 'fill-blank' | 'sorting' | 'find-even-odd'
  questionType: '3-math' | 'fill-blank' | 'sorting' | 'find-even-odd' = '3-math';

  // Universal operands/operators storage
  operands: number[] = [];
  operators: string[] = []; // '+', '-'

  // Legacy properties for template compatibility (mapped from operands)
  get firstNumber(): number { return this.operands[0] || 0; }
  get secondNumber(): number { return this.operands[1] || 0; }
  get thirdNumber(): number { return this.operands[2] || 0; }
  get currentOperator(): string { return this.operators[0] || '+'; }

  // Fill-in-blank specific
  missingIndex: number = -1; // -1 means result is missing (default), 0=first, 1=second..

  // Sorting specific
  sortingPool: { value: number, id: number, selected: boolean }[] = [];
  sortingSlots: (number | null)[] = [null, null, null]; // 3 slots (or 6)
  sortDirection: 'asc' | 'desc' = 'asc'; // 'asc' = bé đến lớn, 'desc' = lớn đến bé

  // Find Even/Odd specific
  evenOddTarget: 'even' | 'odd' = 'even';
  evenOddOptions: number[] = [];

  correctAnswer: number | string = 0; // Can be string for sorting "123"
  userAnswer: string = '';

  items: string[] = ['🍎']; // Default
  currentItem = '🍎';

  totalQuestions = 30;
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

    // Reset state
    this.operands = [];
    this.operators = [];
    this.missingIndex = -1; // Default: result missing
    this.sortingSlots = [null, null, null];
    this.sortingPool = [];

    // Random choice: 0='3-math', 1='fill-blank', 2='sorting', 3='find-even-odd'
    const rand = Math.random();
    if (rand < 0.3) this.questionType = '3-math';
    else if (rand < 0.6) this.questionType = 'fill-blank';
    else if (rand < 0.8) this.questionType = 'sorting';
    else this.questionType = 'find-even-odd';

    // --- CASE 1: 3-Number Math (Existing Logic) ---
    if (this.questionType === '3-math') {
      const isAddition = Math.random() > 0.5;
      // Set operators for template getters (first element used)
      this.operators = [isAddition ? '+' : '-', isAddition ? '+' : '-'];

      if (isAddition) {
        // Sum <= 10
        const maxTotal = 10;
        const minTotal = 3;
        const total = Math.floor(Math.random() * (maxTotal - minTotal + 1)) + minTotal;

        const n1 = Math.floor(Math.random() * (total - 2)) + 1;
        const n2 = Math.floor(Math.random() * (total - n1 - 1)) + 1;
        const n3 = total - n1 - n2;

        this.operands = [n1, n2, n3];
        this.correctAnswer = total;
      } else {
        // Subtraction: a - b - c = Result (Range 10)
        const maxFirst = 10;
        const n1 = Math.floor(Math.random() * (maxFirst - 2)) + 3;
        const n2 = Math.floor(Math.random() * (n1 - 2)) + 1;
        const n3 = Math.floor(Math.random() * (n1 - n2 - 1)) + 1; // Ensure result >= 0

        this.operands = [n1, n2, n3];
        this.correctAnswer = n1 - n2 - n3;
      }
      this.readQuestionAndSpeak();
    }

    // --- CASE 2: Fill in Blank (2 numbers, Range 20) ---
    else if (this.questionType === 'fill-blank') {
      const isAddition = Math.random() > 0.5;
      this.operators = [isAddition ? '+' : '-'];

      if (isAddition) {
        // a + b = c (c <= 20)
        const c = Math.floor(Math.random() * 16) + 4; // 4 to 20
        const a = Math.floor(Math.random() * (c - 1)) + 1;
        const b = c - a;
        this.operands = [a, b, c]; // Store result as 3rd operand for convenience in template
      } else {
        // a - b = c
        const a = Math.floor(Math.random() * 16) + 4; // 4 to 20
        const b = Math.floor(Math.random() * (a - 1)) + 1;
        const c = a - b;
        this.operands = [a, b, c];
      }

      // Determine missing part: 0 (first number) or 1 (second number)
      this.missingIndex = Math.random() > 0.5 ? 0 : 1;
      this.correctAnswer = this.operands[this.missingIndex];

      this.readQuestionAndSpeak();
    }

    // --- CASE 3: Sorting (6 numbers) ---
    else if (this.questionType === 'sorting') {
      // Determine direction
      this.sortDirection = Math.random() > 0.5 ? 'asc' : 'desc';

      // Generate 6 unique numbers between 0 and 50
      const nums = new Set<number>();
      while (nums.size < 6) {
        nums.add(Math.floor(Math.random() * 51));
      }

      let sorted = Array.from(nums);
      if (this.sortDirection === 'asc') {
        sorted.sort((a, b) => a - b);
      } else {
        sorted.sort((a, b) => b - a);
      }

      this.correctAnswer = sorted.join(',');

      // Initialize slots for 6 items
      this.sortingSlots = new Array(6).fill(null);

      // Create pool (shuffled)
      const poolNums = Array.from(nums).sort(() => Math.random() - 0.5);
      this.sortingPool = poolNums.map((val, idx) => ({ value: val, id: idx, selected: false }));

      this.readQuestionAndSpeak();
    }

    // --- CASE 4: Find Even/Odd Number ---
    else if (this.questionType === 'find-even-odd') {
      this.evenOddTarget = Math.random() > 0.5 ? 'even' : 'odd';

      // We will present 3 options: 1 correct, 2 incorrect
      const correctNum = this.generateNumberByParity(this.evenOddTarget);

      const wrongTarget = this.evenOddTarget === 'even' ? 'odd' : 'even';
      const wrong1 = this.generateNumberByParity(wrongTarget, [correctNum]);
      const wrong2 = this.generateNumberByParity(wrongTarget, [correctNum, wrong1]);

      this.correctAnswer = correctNum;

      // Shuffle options
      this.evenOddOptions = [correctNum, wrong1, wrong2].sort(() => Math.random() - 0.5);

      this.readQuestionAndSpeak();
    }
  }

  generateNumberByParity(type: 'even' | 'odd', exclude: number[] = []): number {
    let num = 0;
    do {
      num = Math.floor(Math.random() * 50) + 1; // 1 to 50
    } while (
      (type === 'even' ? num % 2 !== 0 : num % 2 === 0) ||
      exclude.includes(num)
    );
    return num;
  }

  readQuestionAndSpeak() {
    if (this.questionType === '3-math') {
      const opText = this.operators[0] === '+' ? 'cộng' : 'trừ';
      const text = `${this.operands[0]} ${opText} ${this.operands[1]} ${opText} ${this.operands[2]} bằng bao nhiêu?`;
      this.audioService.speak(text);
    } else if (this.questionType === 'fill-blank') {
      const opText = this.operators[0] === '+' ? 'cộng' : 'trừ';
      let text = '';
      if (this.missingIndex === 0) text = `Số mấy ${opText} ${this.operands[1]} bằng ${this.operands[2]}?`;
      else text = `${this.operands[0]} ${opText} số mấy bằng ${this.operands[2]}?`;
      this.audioService.speak(text);
    } else if (this.questionType === 'sorting') {
      if (this.sortDirection === 'asc') {
        this.audioService.speak('Bé hãy sắp xếp các số từ bé đến lớn nhé!');
      } else {
        this.audioService.speak('Bé hãy sắp xếp các số từ lớn đến bé nhé!');
      }
    } else if (this.questionType === 'find-even-odd') {
      const targetText = this.evenOddTarget === 'even' ? 'số chẵn' : 'số lẻ';
      this.audioService.speak(`Bé hãy tìm ${targetText} nhé!`);
    }
  }

  handleEvenOddSelect(value: number) {
    if (this.showFeedback) return;

    // Check answer
    if (value === this.correctAnswer) {
      this.handleCorrect();
    } else {
      this.handleWrong();
    }
  }

  readQuestion() {
    this.readQuestionAndSpeak();
  }
  // --- Interaction Logics ---

  // 1. Keypad Input (For 3-math & fill-blank)
  handleKeypadInput(key: string) {
    if (this.showFeedback || this.questionType === 'sorting') return;

    if (key === 'DELETE') {
      this.userAnswer = this.userAnswer.slice(0, -1);
    } else if (key === 'SUBMIT') {
      this.checkAnswer();
    } else {
      if (this.userAnswer.length < 3) {
        this.userAnswer += key;
      }
    }
  }

  // 2. Sorting Interaction
  onPoolNumberClick(item: any) {
    if (item.selected || this.showFeedback) return;

    // Find first empty slot
    const emptyIndex = this.sortingSlots.findIndex(s => s === null);
    if (emptyIndex !== -1) {
      this.sortingSlots[emptyIndex] = item.value;
      item.selected = true;

      // Auto-check if full
      if (this.sortingSlots.every(s => s !== null)) {
        this.checkSortingAnswer();
      }
    }
  }

  onSlotClick(index: number) {
    if (this.showFeedback || this.sortingSlots[index] === null) return;

    const val = this.sortingSlots[index];
    // Return to pool
    const poolItem = this.sortingPool.find(i => i.value === val && i.selected);
    if (poolItem) poolItem.selected = false;

    this.sortingSlots[index] = null;
  }

  checkSortingAnswer() {
    const current = this.sortingSlots.join(',');
    if (current === this.correctAnswer.toString()) {
      this.handleCorrect();
    } else {
      // Wait a moment then visual feedback
      setTimeout(() => {
        this.handleWrong();
        // Reset slots after delay so user can try again
        setTimeout(() => {
          if (!this.showFeedback) {
            this.sortingSlots = [null, null, null];
            this.sortingPool.forEach(i => i.selected = false);
          }
        }, 1000);
      }, 500);
    }
  }

  checkAnswer() {
    if (!this.userAnswer && this.questionType !== 'sorting') return;

    // For Math types
    const val = parseInt(this.userAnswer, 10);
    if (val == this.correctAnswer) {
      this.handleCorrect();
    } else {
      this.handleWrong();
    }
  }

  handleCorrect() {
    this.isCorrect = true;
    this.showFeedback = true;

    if (!this.hasErrorInCurrentRound) {
      this.score += 10;
      this.correctCount++;
    }

    setTimeout(() => {
      this.showFeedback = false;
      if (this.currentQuestionIndex < this.totalQuestions) {
        this.generateNewRound();
      } else {
        this.finishGame();
      }
    }, 2000);
  }

  handleWrong() {
    if (!this.hasErrorInCurrentRound) {
      this.wrongCount++;
    }
    this.hasErrorInCurrentRound = true;
    this.isCorrect = false;
    this.showFeedback = true;

    setTimeout(() => {
      this.showFeedback = false;
      if (this.questionType !== 'sorting') this.userAnswer = '';
    }, 2000);
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
            }, 500);
          }
        }
      },
      error: (err) => {
        console.error('Error completing session', err);
        this.isFinished = true;
      }
    });
  }

  closeAchievement() {
    this.showAchievement = false;
    this.isFinished = true;

    // Check if new record to show stats popup
    const isNewRecord = this.previousFastestTime === 0 || this.completionDuration < this.previousFastestTime;
    if (isNewRecord) {
      setTimeout(() => {
        this.showCompletionStats = true;
      }, 500);
    }
  }

  closeCompletionStats() {
    this.showCompletionStats = false;
  }

  goBack() {
    this.router.navigate(['/math']);
  }

  formatDuration(seconds: number): string {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec < 10 ? '0' : ''}${sec}`;
  }
}

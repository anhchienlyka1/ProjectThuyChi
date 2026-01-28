
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
  missingPos: number = 3; // 1-3 (basic), 4 (operator), 5 (comparison), 6 (chain), 7 (pattern), 8 (even/odd), 9 (countdown), 10 (sum3), 11 (shapes), 12 (sides), 13 (clock)

  // New state variables for advanced questions
  inputType: 'numeric' | 'operator' | 'comparison' | 'choice' = 'numeric';

  // Pattern question (missingPos = 7)
  patternNumbers: number[] = [];
  patternStep: number = 0;

  // Even/Odd question (missingPos = 8)
  evenOddOptions: number[] = [];
  evenOddType: 'even' | 'odd' = 'even';

  // Countdown question (missingPos = 9)
  countdownNumbers: number[] = [];
  countdownStep: number = 0;

  // Sum of 3 numbers (missingPos = 10)
  sum3Numbers: number[] = [];

  // Count shapes (missingPos = 11)
  shapesToCount: { type: string; count: number }[] = [];
  shapeQuestion: string = '';

  // Count sides (missingPos = 12)
  shapeForSides: string = '';
  shapeSidesCount: number = 0;

  // Clock question (missingPos = 13)
  clockHour: number = 0;
  clockOptions: number[] = [];

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

    // Equal probability for all 11 question types (~9% each)
    const rand = Math.random();

    if (rand < 0.09) {
      this.generateBasicQuestion(); // Type 1-3
    } else if (rand < 0.18) {
      this.generateFindOperatorQuestion(); // Type 4
    } else if (rand < 0.27) {
      this.generateComparisonQuestion(); // Type 5
    } else if (rand < 0.36) {
      this.generateChainQuestion(); // Type 6
    } else if (rand < 0.45) {
      this.generatePatternQuestion(); // Type 7
    } else if (rand < 0.54) {
      this.generateEvenOddQuestion(); // Type 8
    } else if (rand < 0.63) {
      this.generateCountdownQuestion(); // Type 9
    } else if (rand < 0.72) {
      this.generateSum3Question(); // Type 10
    } else if (rand < 0.81) {
      this.generateCountShapesQuestion(); // Type 11
    } else if (rand < 0.90) {
      this.generateCountSidesQuestion(); // Type 12
    } else {
      this.generateClockQuestion(); // Type 13
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

  // Type 7: Pattern Question - Quy luật số
  generatePatternQuestion() {
    this.inputType = 'numeric';
    this.missingPos = 7;

    // Generate a simple arithmetic sequence
    this.patternStep = Math.floor(Math.random() * 3) + 1; // Step: 1, 2, or 3
    const start = Math.floor(Math.random() * 10) + 1;

    this.patternNumbers = [];
    for (let i = 0; i < 4; i++) {
      this.patternNumbers.push(start + i * this.patternStep);
    }

    this.correctAnswer = start + 4 * this.patternStep;
    this.mascot.setEmotion('thinking', 'Tìm quy luật và điền số tiếp theo nhé!', 4000);
  }

  // Type 8: Even/Odd Question - Số chẵn/lẻ
  generateEvenOddQuestion() {
    this.inputType = 'choice';
    this.missingPos = 8;

    this.evenOddType = Math.random() > 0.5 ? 'even' : 'odd';

    // Generate 4 unique numbers, only one matches the criteria
    const numbers: number[] = [];
    let correctNum: number;

    if (this.evenOddType === 'even') {
      correctNum = (Math.floor(Math.random() * 10) + 1) * 2; // 2, 4, 6... 20
      numbers.push(correctNum);
      // Add 3 odd numbers
      while (numbers.length < 4) {
        const odd = Math.floor(Math.random() * 10) * 2 + 1;
        if (!numbers.includes(odd)) numbers.push(odd);
      }
    } else {
      correctNum = Math.floor(Math.random() * 10) * 2 + 1; // 1, 3, 5... 19
      numbers.push(correctNum);
      // Add 3 even numbers
      while (numbers.length < 4) {
        const even = (Math.floor(Math.random() * 10) + 1) * 2;
        if (!numbers.includes(even)) numbers.push(even);
      }
    }

    // Shuffle the options
    this.evenOddOptions = numbers.sort(() => Math.random() - 0.5);
    this.correctAnswer = correctNum;

    const typeText = this.evenOddType === 'even' ? 'chẵn' : 'lẻ';
    this.mascot.setEmotion('thinking', `Chọn số ${typeText} nhé!`, 4000);
  }

  // Type 9: Countdown Question - Đếm lùi
  generateCountdownQuestion() {
    this.inputType = 'numeric';
    this.missingPos = 9;

    this.countdownStep = Math.floor(Math.random() * 2) + 1; // Step: 1 or 2
    const start = Math.floor(Math.random() * 10) + 10; // Start from 10-19

    this.countdownNumbers = [];
    for (let i = 0; i < 4; i++) {
      this.countdownNumbers.push(start - i * this.countdownStep);
    }

    this.correctAnswer = start - 4 * this.countdownStep;
    this.mascot.setEmotion('thinking', 'Đếm lùi và điền số tiếp theo nhé!', 4000);
  }

  // Type 10: Sum of 3 numbers - Tổng 3 số
  generateSum3Question() {
    this.inputType = 'numeric';
    this.missingPos = 10;

    // Generate 3 small numbers that sum to <= 20
    const n1 = Math.floor(Math.random() * 7) + 1;
    const n2 = Math.floor(Math.random() * 6) + 1;
    const maxN3 = Math.min(6, 20 - n1 - n2);
    const n3 = Math.floor(Math.random() * maxN3) + 1;

    this.sum3Numbers = [n1, n2, n3];
    this.correctAnswer = n1 + n2 + n3;

    this.mascot.setEmotion('thinking', `Tính ${n1} cộng ${n2} cộng ${n3} bằng bao nhiêu?`, 4000);
  }

  // Type 11: Count Shapes - Đếm hình
  generateCountShapesQuestion() {
    this.inputType = 'numeric';
    this.missingPos = 11;

    const shapes = ['🔺', '🔵', '🟡', '🟢', '⭐'];
    const shapeNames = ['tam giác', 'hình tròn xanh', 'hình tròn vàng', 'hình tròn xanh lá', 'ngôi sao'];

    // Pick a random shape to count
    const targetIndex = Math.floor(Math.random() * shapes.length);
    const targetShape = shapes[targetIndex];
    const targetCount = Math.floor(Math.random() * 5) + 2; // 2-6 shapes

    this.shapesToCount = [];
    this.shapesToCount.push({ type: targetShape, count: targetCount });

    // Add some other shapes as distractors
    const otherCount = Math.floor(Math.random() * 4) + 1;
    for (let i = 0; i < otherCount; i++) {
      let otherIndex = Math.floor(Math.random() * shapes.length);
      if (otherIndex === targetIndex) otherIndex = (otherIndex + 1) % shapes.length;
      const existing = this.shapesToCount.find(s => s.type === shapes[otherIndex]);
      if (existing) {
        existing.count += Math.floor(Math.random() * 2) + 1;
      } else {
        this.shapesToCount.push({ type: shapes[otherIndex], count: Math.floor(Math.random() * 3) + 1 });
      }
    }

    this.shapeQuestion = `Đếm số ${targetShape}`;
    this.correctAnswer = targetCount;

    this.mascot.setEmotion('thinking', `Đếm xem có bao nhiêu ${shapeNames[targetIndex]} nhé!`, 4000);
  }

  // Type 12: Count Sides - Đếm cạnh
  generateCountSidesQuestion() {
    this.inputType = 'numeric';
    this.missingPos = 12;

    const shapesData = [
      { name: 'tam giác', shape: '△', sides: 3 },
      { name: 'hình vuông', shape: '□', sides: 4 },
      { name: 'hình chữ nhật', shape: '▭', sides: 4 },
      { name: 'hình ngũ giác', shape: '⬠', sides: 5 },
      { name: 'hình lục giác', shape: '⬡', sides: 6 }
    ];

    const selected = shapesData[Math.floor(Math.random() * shapesData.length)];
    this.shapeForSides = selected.shape;
    this.shapeSidesCount = selected.sides;
    this.correctAnswer = selected.sides;

    this.mascot.setEmotion('thinking', `Hình ${selected.name} có bao nhiêu cạnh?`, 4000);
  }

  // Type 13: Clock Reading - Xem đồng hồ
  generateClockQuestion() {
    this.inputType = 'choice';
    this.missingPos = 13;

    // Generate a random hour (1-12)
    this.clockHour = Math.floor(Math.random() * 12) + 1;

    // Generate 4 options including the correct one
    const options: number[] = [this.clockHour];
    while (options.length < 4) {
      const randomHour = Math.floor(Math.random() * 12) + 1;
      if (!options.includes(randomHour)) {
        options.push(randomHour);
      }
    }

    // Shuffle options
    this.clockOptions = options.sort(() => Math.random() - 0.5);
    this.correctAnswer = this.clockHour;

    this.mascot.setEmotion('thinking', 'Đồng hồ đang chỉ mấy giờ nhỉ?', 4000);
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
    } else if (this.missingPos === 7) {
      text = 'Tìm quy luật và điền số tiếp theo.';
    } else if (this.missingPos === 8) {
      const typeText = this.evenOddType === 'even' ? 'chẵn' : 'lẻ';
      text = `Chọn số ${typeText} nhé.`;
    } else if (this.missingPos === 9) {
      text = 'Đếm lùi và điền số tiếp theo.';
    } else if (this.missingPos === 10) {
      text = `Tính ${this.sum3Numbers[0]} cộng ${this.sum3Numbers[1]} cộng ${this.sum3Numbers[2]} bằng bao nhiêu?`;
    } else if (this.missingPos === 11) {
      text = 'Đếm số hình nhé.';
    } else if (this.missingPos === 12) {
      text = 'Hình này có bao nhiêu cạnh?';
    } else if (this.missingPos === 13) {
      text = 'Đồng hồ đang chỉ mấy giờ?';
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
      } else if (this.inputType === 'choice') {
        // For multiple choice, just set the answer
        this.userAnswer = key;
      } else {
        // Operator or Comparison: Single char answer
        this.userAnswer = key;
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

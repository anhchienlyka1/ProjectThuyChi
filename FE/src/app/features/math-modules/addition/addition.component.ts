import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { KidButtonComponent } from '../../../shared/ui-kit/kid-button/kid-button.component';
import { MascotService } from '../../../core/services/mascot.service';
import { AdditionService } from '../../../core/services/addition.service';
import { AudioService } from '../../../core/services/audio.service';
import { LearningService } from '../../../core/services/learning.service';
import { DailyProgressService } from '../../../core/services/daily-progress.service';


@Component({
    selector: 'app-addition',
    standalone: true,
    imports: [CommonModule, KidButtonComponent],
    templateUrl: './addition.component.html',
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
export class AdditionComponent implements OnInit {
    private router = inject(Router);
    private mascot = inject(MascotService);
    private additionService = inject(AdditionService);
    private audioService = inject(AudioService);
    private learningService = inject(LearningService);
    private dailyProgress = inject(DailyProgressService);


    config: any = {};
    firstNumber: number = 0;
    secondNumber: number = 0;
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


    ngOnInit() {
        this.additionService.getConfig().subscribe(config => {
            this.config = config;
            this.items = config.items;
            this.totalQuestions = config.totalQuestions;
            this.mascot.setEmotion('happy', config.mascotPrompts.start, 3000);
            this.startGame();
        });
    }

    startGame() {
        this.currentQuestionIndex = 0;
        this.correctCount = 0;
        this.wrongCount = 0;
        this.score = 0;
        this.score = 0;
        this.isFinished = false;
        this.startTime = Date.now();
        this.startTime = Date.now();
        this.userAnswer = '';
        this.generateNewRound();


    }

    generateNewRound() {
        this.userAnswer = ''; // Clear previous answer
        this.currentQuestionIndex++;

        // Logic: Sum >= 20 and <= 100
        const minSum = 20;
        const maxSum = 100;

        const targetSum = Math.floor(Math.random() * (maxSum - minSum + 1)) + minSum;
        this.firstNumber = Math.floor(Math.random() * (targetSum - 1)) + 1;
        this.secondNumber = targetSum - this.firstNumber;

        this.correctAnswer = this.firstNumber + this.secondNumber;

        this.currentItem = this.items[Math.floor(Math.random() * this.items.length)];


        const prompt = this.config.mascotPrompts?.question
            .replace('{index}', this.currentQuestionIndex.toString())
            .replace('{a}', this.firstNumber.toString())
            .replace('{b}', this.secondNumber.toString())
            || `${this.firstNumber} + ${this.secondNumber} = ?`;

        this.mascot.setEmotion('thinking', prompt, 4000);
        this.readQuestion(); // [NEW] Auto-read question
    }

    readQuestion() {
        // "Có [firstNumber] quả [itemName], thêm [secondNumber] quả nữa. Hỏi tất cả có bao nhiêu quả?"
        // Or simpler: "[firstNumber] cộng [secondNumber] bằng bao nhiêu?"
        const text = `${this.firstNumber} cộng ${this.secondNumber} bằng bao nhiêu?`;
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
            this.score += (this.config.pointsPerQuestion || 10);
            this.correctCount++;
            this.mascot.celebrate();

            const msgs = this.config.feedback?.correct || ['Tuyệt vời!'];
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
            this.wrongCount++;
            const msgs = this.config.feedback?.wrong || ['Sai rồi, bé thử lại nhé!'];
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
        this.isFinished = true;
        const durationSeconds = Math.round((Date.now() - this.startTime) / 1000);

        // Increment daily completion count
        this.dailyProgress.incrementCompletion('addition');

        this.learningService.completeSession({
            levelId: 'addition',
            score: this.score,
            totalQuestions: this.totalQuestions,
            durationSeconds: durationSeconds
        }).subscribe({
            next: (response) => {
                const completionCount = this.dailyProgress.getTodayCompletionCount('addition');
                const starMessage = response.starsEarned > 0
                    ? `Bé đạt ${response.starsEarned} sao! Đã hoàn thành ${completionCount} lần hôm nay! 🔥`
                    : `Bé hãy cố gắng hơn lần sau nhé!`;
                this.mascot.setEmotion('celebrating', starMessage, 5000);
            },
            error: (err) => {
                console.error('Failed to save progress', err);
                const completionCount = this.dailyProgress.getTodayCompletionCount('addition');
                this.mascot.setEmotion('celebrating', `Xuất sắc! Bé đã hoàn thành bài tập! Đã hoàn thành ${completionCount} lần hôm nay! 🔥`, 5000);
            }
        });
    }


    goBack() {
        this.router.navigate(['/math']);
    }

    getArray(n: number) {
        return Array(n).fill(0);
    }
}

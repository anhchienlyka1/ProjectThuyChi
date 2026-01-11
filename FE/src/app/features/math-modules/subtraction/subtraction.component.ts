import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { KidButtonComponent } from '../../../shared/ui-kit/kid-button/kid-button.component';
import { MascotService } from '../../../core/services/mascot.service';
import { SubtractionService } from '../../../core/services/subtraction.service';
import { AudioService } from '../../../core/services/audio.service';
import { LearningService } from '../../../core/services/learning.service';
import { DailyProgressService } from '../../../core/services/daily-progress.service';


@Component({
    selector: 'app-subtraction',
    standalone: true,
    imports: [CommonModule, KidButtonComponent],
    templateUrl: './subtraction.component.html',
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
export class SubtractionComponent implements OnInit {
    private router = inject(Router);
    private mascot = inject(MascotService);
    private subtractionService = inject(SubtractionService);
    private audioService = inject(AudioService);
    private learningService = inject(LearningService);
    private dailyProgress = inject(DailyProgressService);


    config: any = {};
    firstNumber: number = 0;
    secondNumber: number = 0;
    correctAnswer: number = 0;
    options: number[] = [];

    items: string[] = ['🍎'];
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
        this.subtractionService.getConfig().subscribe(config => {
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
        this.generateNewRound();

    }

    generateNewRound() {
        this.currentQuestionIndex++;

        // Logic: firstNumber - secondNumber = correctAnswer
        // Ensure correctAnswer is within 0-20
        const minNum = this.config.difficulty?.minNumber || 1;
        const maxNum = this.config.difficulty?.maxNumber || 20;

        // Generate correctAnswer first (0 to 20)
        this.correctAnswer = Math.floor(Math.random() * 21); // 0 to 20

        // Generate secondNumber (can be 0 to maxNum)
        const maxSecondNumber = Math.min(maxNum, maxNum - this.correctAnswer);
        this.secondNumber = Math.floor(Math.random() * (maxSecondNumber + 1));

        // Calculate firstNumber to ensure it's within range
        this.firstNumber = this.correctAnswer + this.secondNumber;

        // Ensure firstNumber doesn't exceed maxNum
        if (this.firstNumber > maxNum) {
            this.firstNumber = maxNum;
            this.correctAnswer = this.firstNumber - this.secondNumber;
        }

        this.currentItem = this.items[Math.floor(Math.random() * this.items.length)];
        this.generateOptions();

        const prompt = this.config.mascotPrompts?.question
            .replace('{index}', this.currentQuestionIndex.toString())
            .replace('{a}', this.firstNumber.toString())
            .replace('{b}', this.secondNumber.toString())
            || `${this.firstNumber} - ${this.secondNumber} = ?`;

        this.mascot.setEmotion('thinking', prompt, 4000);
        this.readQuestion();
    }

    readQuestion() {
        const text = `${this.firstNumber} trừ ${this.secondNumber} bằng bao nhiêu?`;
        this.audioService.speak(text);
    }

    generateOptions() {
        const opts = new Set<number>();
        opts.add(this.correctAnswer);

        while (opts.size < 4) {
            const offset = Math.floor(Math.random() * 9) - 4; // -4 to +4
            const val = this.correctAnswer + offset;
            if (val >= 0 && val <= 20 && val !== this.correctAnswer) {
                opts.add(val);
            }
        }
        this.options = Array.from(opts).sort(() => Math.random() - 0.5);
    }

    checkAnswer(selected: number) {
        const correct = selected === this.correctAnswer;
        this.isCorrect = correct;
        this.showFeedback = true;

        if (correct) {
            this.score += (this.config.pointsPerQuestion || 10);
            this.correctCount++;
            this.mascot.celebrate();
            const msgs = this.config.feedback?.correct || ['Tuyệt vời!'];
            this.mascot.setEmotion('happy', msgs[Math.floor(Math.random() * msgs.length)], 2000);
        } else {
            this.wrongCount++;
            const msgs = this.config.feedback?.wrong || ['Sai rồi!'];
            this.mascot.setEmotion('sad', msgs[Math.floor(Math.random() * msgs.length)], 2000);
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

    finishGame() {
        this.isFinished = true;
        const durationSeconds = Math.round((Date.now() - this.startTime) / 1000);

        // Increment daily completion count
        this.dailyProgress.incrementCompletion('subtraction');

        this.learningService.completeSession({
            levelId: 'subtraction',
            score: this.score,
            totalQuestions: this.totalQuestions,
            durationSeconds: durationSeconds
        }).subscribe({
            next: (response) => {
                const completionCount = this.dailyProgress.getTodayCompletionCount('subtraction');
                const starMessage = response.starsEarned > 0
                    ? `Bé đạt ${response.starsEarned} sao! Đã hoàn thành ${completionCount} lần hôm nay! 🔥`
                    : `Bé hãy cố gắng hơn lần sau nhé!`;
                this.mascot.setEmotion('celebrating', starMessage, 5000);
            },
            error: (err) => {
                console.error('Failed to save progress', err);
                const completionCount = this.dailyProgress.getTodayCompletionCount('subtraction');
                this.mascot.setEmotion('celebrating', `Xuất sắc! Bé đã hoàn thành bài tập! Đã hoàn thành ${completionCount} lần hôm nay! 🔥`, 5000);
            }
        });
    }


    goBack() {
        this.router.navigate(['/math']);
    }
}

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { KidButtonComponent } from '../../../shared/ui-kit/kid-button/kid-button.component';
import { MascotService } from '../../../core/services/mascot.service';
import { FillInBlankService } from '../../../core/services/fill-in-blank.service';
import { LearningService } from '../../../core/services/learning.service';
import { DailyProgressService } from '../../../core/services/daily-progress.service';


@Component({
    selector: 'app-fill-in-blank',
    standalone: true,
    imports: [CommonModule, KidButtonComponent],
    templateUrl: './fill-in-blank.component.html',
    styles: [`
    @keyframes pulse-scale {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    .animate-pulse-scale { animation: pulse-scale 2s ease-in-out infinite; }

    @keyframes bounce-in {
      0% { transform: scale(0.3); opacity: 0; }
      50% { transform: scale(1.05); }
      70% { transform: scale(0.9); }
      100% { transform: scale(1); opacity: 1; }
    }
    .animate-bounce-in { animation: bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards; }
  `]
})
export class FillInBlankComponent implements OnInit {
    private router = inject(Router);
    private mascot = inject(MascotService);
    private service = inject(FillInBlankService);
    private learningService = inject(LearningService);
    private dailyProgress = inject(DailyProgressService);


    config: any = {};

    // Game State
    displayParts: string[] = []; // e.g. ["1", "2", "?", "4"] or ["2", "+", "?", "=", "5"]
    correctAnswer: number = 0;
    options: number[] = [];

    totalQuestions = 10;
    currentQuestionIndex = 0;
    correctCount = 0;
    wrongCount = 0;
    score = 0;

    isFinished = false;
    showFeedback = false;
    isCorrect = false;
    startTime: number = 0;


    // Type of question for styling
    questionType: 'sequence' | 'equation' = 'sequence';

    ngOnInit() {
        this.service.getConfig().subscribe(config => {
            this.config = config;
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

        // Always use equation type and hide the result
        this.questionType = 'equation';
        this.generateEquation();

        this.generateOptions();

        const prompt = this.config.mascotPrompts?.question
            .replace('{index}', this.currentQuestionIndex.toString())
            || "Số nào còn thiếu nhỉ?";
        this.mascot.setEmotion('thinking', prompt, 4000);
    }

    generateSequence() {
        // Simple linear sequence: start, step
        const start = Math.floor(Math.random() * 5) + 1; // 1 to 5
        const step = Math.floor(Math.random() * 2) + 1;  // 1 or 2

        const length = 4;
        const missingIndex = Math.floor(Math.random() * length);

        this.displayParts = [];
        for (let i = 0; i < length; i++) {
            const val = start + (i * step);
            if (i === missingIndex) {
                this.displayParts.push('?');
                this.correctAnswer = val;
            } else {
                this.displayParts.push(val.toString());
            }
        }
    }

    generateEquation() {
        // num1 op1 num2 = result
        let num1, num2, result;
        let op1: string;

        // Loop to ensure we get a valid positive equation for kids
        do {
            num1 = Math.floor(Math.random() * 10) + 1;
            num2 = Math.floor(Math.random() * 10) + 1;

            op1 = Math.random() > 0.5 ? '+' : '-';

            // Calculate result
            result = (op1 === '+') ? num1 + num2 : num1 - num2;

        } while (result < 0 || result > 20 || (num1 - num2 < 0 && op1 === '-'));

        // Randomly hide one of the 3 numbers (num1, num2, or result)
        // 0: hide num1, 1: hide num2, 2: hide result
        const hidePos = Math.floor(Math.random() * 3);

        this.displayParts = [];

        // num1
        if (hidePos === 0) {
            this.displayParts.push('?');
            this.correctAnswer = num1;
        } else {
            this.displayParts.push(num1.toString());
        }

        this.displayParts.push(op1);

        // num2
        if (hidePos === 1) {
            this.displayParts.push('?');
            this.correctAnswer = num2;
        } else {
            this.displayParts.push(num2.toString());
        }

        this.displayParts.push('=');

        // result
        if (hidePos === 2) {
            this.displayParts.push('?');
            this.correctAnswer = result;
        } else {
            this.displayParts.push(result.toString());
        }
    }

    generateOptions() {
        const opts = new Set<number>();
        opts.add(this.correctAnswer);

        while (opts.size < 4) {
            const offset = Math.floor(Math.random() * 7) - 3; // -3 to +3
            const val = this.correctAnswer + offset;
            if (val >= 0 && val <= 15 && val !== this.correctAnswer) {
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
        this.dailyProgress.incrementCompletion('fill-in-blank');

        this.learningService.completeSession({
            levelId: 'fill-in-blank',
            score: this.score,
            totalQuestions: this.totalQuestions,
            durationSeconds: durationSeconds
        }).subscribe({
            next: (response) => {
                const completionCount = this.dailyProgress.getTodayCompletionCount('fill-in-blank');
                const starMessage = response.starsEarned > 0
                    ? `Bé đạt ${response.starsEarned} sao! Đã hoàn thành ${completionCount} lần hôm nay! 🔥`
                    : `Bé hãy cố gắng hơn lần sau nhé!`;
                this.mascot.setEmotion('celebrating', starMessage, 5000);
            },
            error: (err) => {
                console.error('Failed to save progress', err);
                const completionCount = this.dailyProgress.getTodayCompletionCount('fill-in-blank');
                this.mascot.setEmotion('celebrating', `Xuất sắc! Bé đã hoàn thành bài tập! Đã hoàn thành ${completionCount} lần hôm nay! 🔥`, 5000);
            }
        });
    }


    goBack() {
        this.router.navigate(['/math']);
    }
}

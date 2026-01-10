import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { KidButtonComponent } from '../../../shared/ui-kit/kid-button/kid-button.component';
import { MascotService } from '../../../core/services/mascot.service';
import { AdditionService } from '../../../core/services/addition.service';
import { AudioService } from '../../../core/services/audio.service';

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
    private audioService = inject(AudioService); // [NEW] Inject AudioService

    config: any = {}; // Full config
    // Game State
    firstNumber: number = 0;
    secondNumber: number = 0;
    correctAnswer: number = 0;
    options: number[] = [];

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
        this.isFinished = false;
        this.generateNewRound();
    }

    generateNewRound() {
        this.currentQuestionIndex++;

        // Logic: Sum >= 20 and <= 100
        const minSum = 20;
        const maxSum = 100;

        const targetSum = Math.floor(Math.random() * (maxSum - minSum + 1)) + minSum;
        this.firstNumber = Math.floor(Math.random() * (targetSum - 1)) + 1;
        this.secondNumber = targetSum - this.firstNumber;

        this.correctAnswer = this.firstNumber + this.secondNumber;

        this.currentItem = this.items[Math.floor(Math.random() * this.items.length)];
        this.generateOptions();

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

    generateOptions() {
        const opts = new Set<number>();
        opts.add(this.correctAnswer);

        while (opts.size < 4) {
            // Generate close wrong answers
            const offset = Math.floor(Math.random() * 11) - 5; // -5 to +5
            const val = this.correctAnswer + offset;
            if (val > 0 && val <= 100 && val !== this.correctAnswer) {
                opts.add(val);
            }
        }

        // Shuffle options
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
            const msg = msgs[Math.floor(Math.random() * msgs.length)];
            this.mascot.setEmotion('happy', msg, 2000);
        } else {
            this.wrongCount++;
            const msgs = this.config.feedback?.wrong || ['Sai rồi!'];
            const msg = msgs[Math.floor(Math.random() * msgs.length)];
            this.mascot.setEmotion('sad', msg, 2000);
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
        this.mascot.setEmotion('celebrating', `Xuất sắc! Bé đã hoàn thành bài tập!`, 5000);
    }

    goBack() {
        this.router.navigate(['/math']);
    }

    getArray(n: number) {
        return Array(n).fill(0);
    }
}

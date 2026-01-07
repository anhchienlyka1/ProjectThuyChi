import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { KidButtonComponent } from '../../../shared/ui-kit/kid-button/kid-button.component';
import { MascotService } from '../../../core/services/mascot.service';
import { FillInBlankService } from '../../../core/services/fill-in-blank.service';

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
        this.isFinished = false;
        this.generateNewRound();
    }

    generateNewRound() {
        this.currentQuestionIndex++;

        // Randomly choose between sequence (0) or equation (1)
        const type = Math.random() > 0.5 ? 'sequence' : 'equation';
        this.questionType = type;

        if (type === 'sequence') {
            this.generateSequence();
        } else {
            this.generateEquation();
        }

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
        // A +/- B = C
        const isAddition = Math.random() > 0.5;
        const operator = isAddition ? '+' : '-';

        let a, b, c;

        if (isAddition) { // A + B = C
            c = Math.floor(Math.random() * 9) + 2; // Sum 2 to 10
            a = Math.floor(Math.random() * (c - 1)) + 1;
            b = c - a;
        } else { // A - B = C
            a = Math.floor(Math.random() * 9) + 2; // Minuend 2 to 10
            b = Math.floor(Math.random() * (a - 1)) + 1;
            c = a - b;
        }

        // Randomly hide A, B, or C (but hiding operator is too hard/confusing for now, just hide numbers)
        // 0: Hide A, 1: Hide B, 2: Hide C
        const hidePos = Math.floor(Math.random() * 3);

        this.displayParts = [];

        // A
        this.displayParts.push(hidePos === 0 ? '?' : a.toString());
        if (hidePos === 0) this.correctAnswer = a;

        // Operator
        this.displayParts.push(operator);

        // B
        this.displayParts.push(hidePos === 1 ? '?' : b.toString());
        if (hidePos === 1) this.correctAnswer = b;

        // Equal
        this.displayParts.push('=');

        // C
        this.displayParts.push(hidePos === 2 ? '?' : c.toString());
        if (hidePos === 2) this.correctAnswer = c;
    }

    generateOptions() {
        const opts = new Set<number>();
        opts.add(this.correctAnswer);

        while (opts.size < 3) {
            const offset = Math.floor(Math.random() * 5) - 2;
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
        this.mascot.setEmotion('celebrating', `Xuất sắc! Bé đã hoàn thành bài tập!`, 5000);
    }

    goBack() {
        this.router.navigate(['/math']);
    }
}

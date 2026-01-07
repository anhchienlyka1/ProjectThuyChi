import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { KidButtonComponent } from '../../../shared/ui-kit/kid-button/kid-button.component';
import { MascotService } from '../../../core/services/mascot.service';
import { LogicService } from '../../../core/services/logic.service';
import { LogicQuestion } from '../../../core/models/logic-config.model';

@Component({
    selector: 'app-logic',
    standalone: true,
    imports: [CommonModule, KidButtonComponent],
    templateUrl: './logic.component.html',
    styles: [`
    @keyframes slide-in {
      from { transform: translateX(100px); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .animate-slide-in { animation: slide-in 0.5s ease-out forwards; }

    @keyframes bounce-in {
      0% { transform: scale(0.3); opacity: 0; }
      50% { transform: scale(1.05); }
      70% { transform: scale(0.9); }
      100% { transform: scale(1); opacity: 1; }
    }
    .animate-bounce-in { animation: bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards; }
  `]
})
export class LogicComponent implements OnInit {
    private router = inject(Router);
    private mascot = inject(MascotService);
    private service = inject(LogicService);

    config: any = {};

    questions: LogicQuestion[] = [];
    currentQuestion: LogicQuestion | null = null;
    currentOptions: string[] = [];

    totalQuestions = 5;
    currentQuestionIndex = 0;
    correctCount = 0;
    wrongCount = 0;
    score = 0;

    isFinished = false;
    showFeedback = false;
    isCorrect = false;

    ngOnInit() {
        this.service.getConfig().subscribe(config => {
            this.config = config;
            this.questions = config.questions;
            this.totalQuestions = this.questions.length;
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
        // this.questions = this.questions.sort(() => Math.random() - 0.5);
        this.generateNewRound();
    }

    generateNewRound() {
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex > this.questions.length) {
            this.finishGame();
            return;
        }

        this.currentQuestion = this.questions[this.currentQuestionIndex - 1];

        // For Odd One Out, options are the puzzle itself usually.
        // For Sequence, options are the answers.
        // The mock data structure implies 'options' are always the selectable answers.
        // But for Odd One Out, the 'options' IS the set to choose from.
        // Checking mock data:
        // Q3: "options": ["🍎", "🍌", "🍇", "🚗"], "correctAnswer": "🚗"
        // So yes, displaying options is always correct.

        this.currentOptions = [...this.currentQuestion.options];
        if (!this.currentQuestion.isOddOneOut) {
            this.currentOptions = this.currentOptions.sort(() => Math.random() - 0.5);
        } else {
            // For odd one out, also shuffle so position isn't fixed if data isn't
            this.currentOptions = this.currentOptions.sort(() => Math.random() - 0.5);
        }

        const prompt = this.config.mascotPrompts?.question
            .replace('{index}', this.currentQuestionIndex.toString())
            .replace('{question}', this.currentQuestion.question)
            || this.currentQuestion.question;

        this.mascot.setEmotion('thinking', prompt, 4000);
    }

    checkAnswer(selected: string) {
        if (!this.currentQuestion) return;

        const correct = selected === this.currentQuestion.correctAnswer;
        this.isCorrect = correct;
        this.showFeedback = true;

        if (correct) {
            this.score += (this.config.pointsPerQuestion || 20);
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

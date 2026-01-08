import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { KidButtonComponent } from '../../../shared/ui-kit/kid-button/kid-button.component';
import { MascotService } from '../../../core/services/mascot.service';
import { ShapesService } from '../../../core/services/shapes.service';
import { ShapeQuestion, ShapeOption } from '../../../core/models/shapes-config.model';

@Component({
    selector: 'app-shapes',
    standalone: true,
    imports: [CommonModule, KidButtonComponent],
    templateUrl: './shapes.component.html',
    styles: [`
    @keyframes wiggle {
      0%, 100% { transform: rotate(-3deg); }
      50% { transform: rotate(3deg); }
    }
    .animate-wiggle { animation: wiggle 2s ease-in-out infinite; }
    
    @keyframes bounce-in {
      0% { transform: scale(0.3); opacity: 0; }
      50% { transform: scale(1.05); }
      70% { transform: scale(0.9); }
      100% { transform: scale(1); opacity: 1; }
    }
    .animate-bounce-in { animation: bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards; }
  `]
})
export class ShapesComponent implements OnInit {
    private router = inject(Router);
    private mascot = inject(MascotService);
    private service = inject(ShapesService);

    config: any = {};

    // Game State
    questions: ShapeQuestion[] = [];
    currentQuestion: ShapeQuestion | null = null;
    currentOptions: ShapeOption[] = [];

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
            this.questions = config.questions; // Assign all questions
            this.totalQuestions = this.questions.length; // Override if needed
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
        // Shuffle questions if desired, or just play in order
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
        // Shuffle options for variety
        this.currentOptions = [...this.currentQuestion.options].sort(() => Math.random() - 0.5);

        const prompt = this.config.mascotPrompts?.question
            .replace('{index}', this.currentQuestionIndex.toString())
            .replace('{question}', this.currentQuestion.question)
            || this.currentQuestion.question;

        this.mascot.setEmotion('thinking', prompt, 4000);
    }

    checkAnswer(selectedOption: ShapeOption) {
        if (!this.currentQuestion) return;

        const correct = selectedOption.id === this.currentQuestion.correctAnswer;
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

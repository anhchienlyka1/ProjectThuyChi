import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { KidButtonComponent } from '../../../shared/ui-kit/kid-button/kid-button.component';
import { MascotService } from '../../../core/services/mascot.service';
import { SortingService } from '../../../core/services/sorting.service';
import { SortingQuestion } from '../../../core/models/sorting-config.model';

@Component({
    selector: 'app-sorting',
    standalone: true,
    imports: [CommonModule, KidButtonComponent],
    templateUrl: './sorting.component.html',
    styles: [`
    /* Animations shared with other modules */
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
export class SortingComponent implements OnInit {
    private router = inject(Router);
    private mascot = inject(MascotService);
    private service = inject(SortingService);

    config: any = {};
    questions: SortingQuestion[] = [];
    currentQuestion: SortingQuestion | null = null;

    // State for sorting
    availableItems: number[] = [];
    sortedItems: number[] = [];

    totalQuestions = 0;
    currentQuestionIndex = 0;
    score = 0;
    correctCount = 0;
    wrongCount = 0;

    isFinished = false;
    showFeedback = false;
    feedbackMessage = '';
    isCorrect = false;

    // To track if the current round has had any errors, to decide whether to increment correctCount for the QUESTION
    hasErrorInCurrentRound = false;

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
        this.score = 0;
        this.correctCount = 0;
        this.wrongCount = 0;
        this.isFinished = false;
        this.generateNewRound();
    }

    generateNewRound() {
        this.currentQuestionIndex++;
        if (this.currentQuestionIndex > this.totalQuestions) {
            this.finishGame();
            return;
        }

        this.currentQuestion = this.questions[this.currentQuestionIndex - 1];

        // Reset state
        this.sortedItems = [];
        this.hasErrorInCurrentRound = false;
        // Shuffle available items
        this.availableItems = [...this.currentQuestion.items].sort(() => Math.random() - 0.5);

        const prompt = this.config.mascotPrompts?.question
            .replace('{index}', this.currentQuestionIndex.toString())
            .replace('{question}', this.currentQuestion.question)
            || this.currentQuestion.question;

        this.mascot.setEmotion('thinking', prompt, 4000);
    }

    handleItemClick(item: number) {
        if (this.showFeedback || !this.currentQuestion) return;

        // Logic depends on type
        if (this.currentQuestion.type === 'find-min' || this.currentQuestion.type === 'find-max') {
            // Single choice logic
            const correct = this.currentQuestion.correctSequence.includes(item);
            if (correct) {
                if (!this.hasErrorInCurrentRound) this.correctCount++;
                this.score += 20; // Fixed score for now
                this.handleSuccess(true); // true = round finished
            } else {
                this.handleError();
            }
            return;
        }

        // Default: Sort logic - Just move to sorted, check later
        const idx = this.availableItems.indexOf(item);
        if (idx > -1) {
            this.availableItems.splice(idx, 1);
            this.sortedItems.push(item);

            // Check if done
            if (this.availableItems.length === 0) {
                this.checkResult();
            }
        }
    }

    handleSortedItemClick(item: number) {
        if (this.showFeedback || !this.currentQuestion) return;
        // Move back to available
        const idx = this.sortedItems.indexOf(item);
        if (idx > -1) {
            this.sortedItems.splice(idx, 1);
            this.availableItems.push(item);
        }
    }

    checkResult() {
        if (!this.currentQuestion) return;

        // Check if sortedItems matches correctSequence
        const isCorrect = JSON.stringify(this.sortedItems) === JSON.stringify(this.currentQuestion.correctSequence);

        if (isCorrect) {
            if (!this.hasErrorInCurrentRound) this.correctCount++;
            this.score += 30; // Bigger score for sorting whole list
            this.handleSuccess(true);
        } else {
            this.handleError();
            // Optional: Auto reset on error or let user fix it?
            // "Sắp xếp xong mới thông báo" -> usually implies we tell them result. If wrong, they should fix.
            // But if we just say "Wrong" and leave it, they need to know HOW to fix (by clicking sorted items).
            // We will resets the items to original state to simplify interaction for kids
            setTimeout(() => {
                this.resetRound();
            }, 1500);
        }
    }

    resetRound() {
        if (!this.currentQuestion) return;
        // Reset items to start state of THIS round
        this.sortedItems = [];
        this.availableItems = [...this.currentQuestion.items].sort(() => Math.random() - 0.5);
    }

    handleSuccess(roundFinished: boolean) {
        this.isCorrect = true;
        this.showFeedback = true;
        this.mascot.celebrate();
        const msgs = this.config.feedback?.correct || ['Đúng rồi!'];
        this.feedbackMessage = msgs[Math.floor(Math.random() * msgs.length)];
        this.mascot.setEmotion('happy', this.feedbackMessage, 2000);

        setTimeout(() => {
            this.showFeedback = false;
            if (roundFinished) {
                this.generateNewRound();
            }
        }, 2000);
    }

    handleError() {
        this.isCorrect = false;
        this.hasErrorInCurrentRound = true;
        this.wrongCount++;
        this.showFeedback = true;
        const msgs = this.config.feedback?.wrong || ['Chưa đúng rồi!'];
        this.feedbackMessage = msgs[Math.floor(Math.random() * msgs.length)];
        this.mascot.setEmotion('sad', this.feedbackMessage, 2000);

        setTimeout(() => {
            this.showFeedback = false;
        }, 2000);
    }

    finishGame() {
        this.isFinished = true;
        this.mascot.setEmotion('celebrating', 'Chúc mừng con đã hoàn thành bài học!', 5000);
    }

    goBack() {
        this.router.navigate(['/math']);
    }
}

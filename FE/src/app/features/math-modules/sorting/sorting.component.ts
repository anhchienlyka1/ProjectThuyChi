import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { KidButtonComponent } from '../../../shared/ui-kit/kid-button/kid-button.component';
import { MascotService } from '../../../core/services/mascot.service';
import { SortingService } from '../../../core/services/sorting.service';
import { SortingQuestion } from '../../../core/models/sorting-config.model';
import { LearningService } from '../../../core/services/learning.service';
import { DailyProgressService } from '../../../core/services/daily-progress.service';
import { LessonTimerService } from '../../../core/services/lesson-timer.service';
import { LessonTimerComponent } from '../../../shared/components/lesson-timer/lesson-timer.component';
import { LessonCompletionStatsComponent } from '../../../shared/components/lesson-completion-stats/lesson-completion-stats.component';


@Component({
    selector: 'app-sorting',
    standalone: true,
    imports: [CommonModule, KidButtonComponent, LessonTimerComponent, LessonCompletionStatsComponent],
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
export class SortingComponent implements OnInit, OnDestroy {
    private router = inject(Router);
    private mascot = inject(MascotService);
    private service = inject(SortingService);
    private learningService = inject(LearningService);
    private dailyProgress = inject(DailyProgressService);
    private lessonTimer = inject(LessonTimerService);


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
    startTime: number = 0;
    showCompletionStats = false;
    completionDuration = 0;
    previousFastestTime = 0;


    // To track if the current round has had any errors, to decide whether to increment correctCount for the QUESTION
    hasErrorInCurrentRound = false;

    ngOnInit() {
        this.loadPreviousFastestTime();

        this.service.getConfig().subscribe(config => {
            this.config = config;
            this.questions = config.questions;
            this.totalQuestions = this.questions.length;
            this.startGame();
        });
    }

    ngOnDestroy() {
        this.lessonTimer.stopTimer();
    }

    loadPreviousFastestTime() {
        this.learningService.getCompletionTime('sorting').subscribe({
            next: (data) => {
                if (data && data.fastestTimeSeconds > 0) {
                    this.previousFastestTime = data.fastestTimeSeconds;
                }
            },
            error: () => {
                this.previousFastestTime = 0;
            }
        });
    }

    startGame() {
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.correctCount = 0;
        this.wrongCount = 0;
        this.isFinished = false;
        this.showCompletionStats = false;
        this.startTime = Date.now();
        this.lessonTimer.startTimer('sorting');
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
        const msgs = this.config.feedback?.correct || ['Đúng rồi!'];
        this.feedbackMessage = msgs[Math.floor(Math.random() * msgs.length)];

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

        setTimeout(() => {
            this.showFeedback = false;
        }, 2000);
    }

    finishGame() {
        this.isFinished = true;
        const durationSeconds = this.lessonTimer.stopTimer();
        this.completionDuration = durationSeconds;

        const isNewRecord = this.previousFastestTime === 0 || durationSeconds < this.previousFastestTime;

        this.dailyProgress.incrementCompletion('sorting');

        this.learningService.completeSession({
            levelId: 'sorting',
            score: this.score,
            totalQuestions: this.totalQuestions,
            durationSeconds: durationSeconds
        }).subscribe({
            next: (response) => {
                const completionCount = this.dailyProgress.getTodayCompletionCount('sorting');
                const starMessage = response.starsEarned > 0
                    ? `Bé đạt ${response.starsEarned} sao! Đã hoàn thành ${completionCount} lần hôm nay! 🔥`
                    : `Bé hãy cố gắng hơn lần sau nhé!`;

                if (isNewRecord) {
                    setTimeout(() => {
                        this.showCompletionStats = true;
                    }, 1500);
                }
            },
            error: (err) => {
                console.error('Failed to save progress', err);
                if (isNewRecord) {
                    setTimeout(() => {
                        this.showCompletionStats = true;
                    }, 1500);
                }
            }
        });
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

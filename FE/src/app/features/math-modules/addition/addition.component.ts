import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { KidButtonComponent } from '../../../shared/ui-kit/kid-button/kid-button.component';
import { MascotService } from '../../../core/services/mascot.service';
import { AdditionService } from '../../../core/services/addition.service';
import { AudioService } from '../../../core/services/audio.service';
import { LearningService } from '../../../core/services/learning.service';
import { DailyProgressService } from '../../../core/services/daily-progress.service';
import { CertificatePopupComponent } from '../../../shared/components/certificate-popup.component';
import { LessonTimerService } from '../../../core/services/lesson-timer.service';
import { LessonTimerComponent } from '../../../shared/components/lesson-timer/lesson-timer.component';
import { LessonCompletionStatsComponent } from '../../../shared/components/lesson-completion-stats/lesson-completion-stats.component';


@Component({
    selector: 'app-addition',
    standalone: true,
    imports: [CommonModule, KidButtonComponent, CertificatePopupComponent, LessonTimerComponent, LessonCompletionStatsComponent],
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
export class AdditionComponent implements OnInit, OnDestroy {
    private router = inject(Router);
    private mascot = inject(MascotService);
    private additionService = inject(AdditionService);
    private audioService = inject(AudioService);
    private learningService = inject(LearningService);
    private dailyProgress = inject(DailyProgressService);
    private lessonTimer = inject(LessonTimerService);


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

        this.additionService.getConfig().subscribe(config => {
            this.config = config;
            this.items = config.items;
            this.totalQuestions = config.totalQuestions;
            this.startGame();
        });
    }

    ngOnDestroy() {
        // Stop timer when leaving component
        this.lessonTimer.stopTimer();
    }

    loadPreviousFastestTime() {
        this.learningService.getCompletionTime('addition').subscribe({
            next: (data) => {
                if (data && data.fastestTimeSeconds > 0) {
                    this.previousFastestTime = data.fastestTimeSeconds;
                }
            },
            error: (err) => {
                console.log('No previous record found, this might be first attempt');
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
        this.lessonTimer.startTimer('addition');

        this.generateNewRound();
    }

    generateNewRound() {
        this.userAnswer = ''; // Clear previous answer
        this.currentQuestionIndex++;
        this.hasErrorInCurrentRound = false; // Reset error flag for new question

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

        this.readQuestion(); // [NEW] Auto-read question
    }

    readQuestion() {
        // "[firstNumber] cộng [secondNumber] bằng bao nhiêu?"
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
            // Only count score if this is the first attempt (no errors in this round)
            if (!this.hasErrorInCurrentRound) {
                this.score += (this.config.pointsPerQuestion || 10);
                this.correctCount++;
            }

            const msgs = this.config.feedback?.correct || ['Tuyệt vời!'];
            const msg = msgs[Math.floor(Math.random() * msgs.length)];

            setTimeout(() => {
                this.showFeedback = false;
                if (this.currentQuestionIndex < this.totalQuestions) {
                    this.generateNewRound();
                } else {
                    this.finishGame();
                }
            }, 2000);
        } else {
            // Mark this question as having an error - no score will be given even if retry succeeds
            if (!this.hasErrorInCurrentRound) {
                this.wrongCount++;
            }
            this.hasErrorInCurrentRound = true;

            const msgs = this.config.feedback?.wrong || ['Sai rồi, bé thử lại nhé!'];
            const msg = msgs[Math.floor(Math.random() * msgs.length)];

            // Allow retry without moving to next question
            setTimeout(() => {
                this.showFeedback = false;
                this.userAnswer = ''; // Clear answer so they can try again easily
            }, 2000);
        }
    }

    finishGame() {
        // DON'T set isFinished=true immediately - wait until we show results

        // Stop timer and get duration
        const durationSeconds = this.lessonTimer.stopTimer();
        this.completionDuration = durationSeconds;

        // Check if this is a new record
        const isNewRecord = this.previousFastestTime === 0 || durationSeconds < this.previousFastestTime;

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

                // Check if math lesson achievement was earned (improvementAchievement)
                if (response.improvementAchievement) {
                    // Show achievement FIRST
                    this.earnedAchievement = {
                        ...response.improvementAchievement,
                        date: new Date().toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        })
                    };
                    setTimeout(() => {
                        this.showAchievement = true;
                    }, 300); // Reduced delay to 300ms
                } else if (response.achievement) {
                    // Fallback to old achievement if exists
                    this.earnedAchievement = {
                        ...response.achievement,
                        date: new Date().toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                        })
                    };
                    setTimeout(() => {
                        this.showAchievement = true;
                    }, 300);
                } else {
                    // No achievement - check if new record to show stats popup
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
                const completionCount = this.dailyProgress.getTodayCompletionCount('addition');
                // Show results even on error - only if new record
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
        // After closing achievement, check if new record to show stats
        this.isFinished = true;

        // Check if this was a new record
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

    getArray(n: number) {
        return Array(n).fill(0);
    }

    formatDuration(seconds: number): string {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

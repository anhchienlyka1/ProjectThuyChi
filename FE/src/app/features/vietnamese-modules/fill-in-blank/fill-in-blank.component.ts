import { Component, OnInit, inject } from '@angular/core';
import { MOCK_VIETNAMESE_EXERCISES } from '../../../core/initial-data/vietnamese-exercises.mock';
import { CommonModule, Location } from '@angular/common';
import { KidButtonComponent } from '../../../shared/ui-kit/kid-button/kid-button.component';
import { DailyProgressService } from '../../../core/services/daily-progress.service';
import { ExerciseService } from '../../../core/services/exercise.service';
import { FillInBlankQuestion } from '../../../core/models/exercise.model';
import { LessonTimerComponent } from '../../../shared/components/lesson-timer/lesson-timer.component';
import { LessonTimerService } from '../../../core/services/lesson-timer.service';
import { LearningService } from '../../../core/services/learning.service';

interface LevelData {
    phrase: string;
    correctAnswer: string;
    options: string[];
    fullText: string;
    imageUrl?: string;
}

@Component({
    selector: 'app-vietnamese-fill-in-blank',
    standalone: true,
    imports: [CommonModule, KidButtonComponent, LessonTimerComponent],
    templateUrl: './fill-in-blank.component.html',
    styleUrls: ['./fill-in-blank.component.css']
})
export class VietnameseFillInBlankComponent implements OnInit {
    private exerciseService = inject(ExerciseService);
    private location = inject(Location);
    private dailyProgress = inject(DailyProgressService);
    private lessonTimer = inject(LessonTimerService);
    private learningService = inject(LearningService);

    levels: LevelData[] = [];
    currentLevelIndex = 0;
    currentLevel!: LevelData;

    isCorrect: boolean = false;
    isWrong: boolean = false;
    showFeedback: boolean = false;
    isFinished: boolean = false;
    isLoading: boolean = true;
    score: number = 0;
    startTime: number = 0;
    previousFastestTime: number = 0;
    completionDuration: number = 0;

    shuffledOptions: string[] = [];
    selectedOption: string | null = null;

    questionParts: string[] = [];

    ngOnInit(): void {
        this.loadPreviousFastestTime();
        this.loadExerciseData();
    }

    ngOnDestroy() {
        this.lessonTimer.stopTimer();
    }

    loadPreviousFastestTime() {
        this.learningService.getCompletionTime('fill-in-blank').subscribe({
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

    loadExerciseData() {
        this.isLoading = true;
        this.exerciseService.getExercises({ type: 'fill-in-blank', status: 'published' }).subscribe({
            next: (exercises) => {
                let targetExercise = exercises[0];

                // FALLBACK
                if (!targetExercise) {
                    console.warn('Using fallback mock data for Fill In Blank');
                    const mock = MOCK_VIETNAMESE_EXERCISES.find((e: any) => e.type === 'fill-in-blank');
                    if (mock) targetExercise = mock as any;
                }

                if (targetExercise && targetExercise.questions && targetExercise.questions.length > 0) {
                    const questionsToUse = targetExercise.questions.slice(0, 5);
                    this.levels = questionsToUse
                        .filter((q: any) => q.type === 'fill-in-blank')
                        .map((q: any) => {
                            const data = q.data as FillInBlankQuestion;
                            return {
                                phrase: data.phrase,
                                correctAnswer: data.correctAnswer,
                                options: data.options || [],
                                fullText: data.fullText,
                                imageUrl: data.imageUrl
                            };
                        });

                    if (this.levels.length > 0) {
                        this.loadLevel();
                    } else {
                        console.warn('No valid fill-in-blank questions found.');
                    }
                } else {
                    console.warn('No published fill-in-blank exercises found (even in mock).');
                }
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Failed to load exercises, using fallback:', err);
                const mock = MOCK_VIETNAMESE_EXERCISES.find((e: any) => e.type === 'fill-in-blank');
                if (mock && mock.questions) {
                    const questionsToUse = mock.questions.slice(0, 5);
                    this.levels = questionsToUse.map((q: any) => {
                        const data = q.data as FillInBlankQuestion;
                        return {
                            phrase: data.phrase,
                            correctAnswer: data.correctAnswer,
                            options: data.options || [],
                            fullText: data.fullText,
                            imageUrl: data.imageUrl
                        };
                    });
                    if (this.levels.length > 0) this.loadLevel();
                }
                this.isLoading = false;
            }
        });
    }

    loadLevel() {
        this.currentLevel = this.levels[this.currentLevelIndex];
        this.isCorrect = false;
        this.isWrong = false;
        this.selectedOption = null;
        this.questionParts = this.currentLevel.phrase.split('_');

        // Shuffle options
        this.shuffledOptions = [...this.currentLevel.options].sort(() => Math.random() - 0.5);

        if (this.currentLevelIndex === 0) {
            this.startTime = Date.now();
            this.lessonTimer.startTimer('fill-in-blank');
        }
    }

    selectOption(option: string) {
        if (this.isCorrect) return;

        this.selectedOption = option;
        this.checkAnswer(option);
    }

    checkAnswer(answer: string) {
        if (answer === this.currentLevel.correctAnswer) {
            this.isCorrect = true;
            this.playSound('success');
            this.showFeedback = true;

            setTimeout(() => {
                this.showFeedback = false;
                this.score += 10;
                this.nextLevel();
            }, 2000);
        } else {
            this.isWrong = true;
            this.playSound('wrong');
            this.showFeedback = true;

            setTimeout(() => {
                this.isWrong = false;
                this.showFeedback = false;
                this.selectedOption = null;
            }, 1500);
        }
    }

    nextLevel() {
        if (this.currentLevelIndex < this.levels.length - 1) {
            this.currentLevelIndex++;
            this.loadLevel();
        } else {
            this.isFinished = true;
            this.dailyProgress.incrementCompletion('fill-in-blank');

            // Stop timer and save session
            const durationSeconds = this.lessonTimer.stopTimer();
            this.completionDuration = durationSeconds;

            // Save to backend
            this.learningService.completeSession({
                levelId: 'fill-in-blank',
                score: this.score,
                totalQuestions: this.levels.length,
                durationSeconds: durationSeconds
            }).subscribe();
        }
    }

    restartGame() {
        this.currentLevelIndex = 0;
        this.isFinished = false;
        this.score = 0;
        this.loadLevel();
        this.startTime = Date.now();
        this.lessonTimer.startTimer('fill-in-blank');
    }

    readQuestion() {
        if (this.currentLevel) {
            window.speechSynthesis.cancel();
            // Read "Điền từ vào chỗ trống, [phrase]"
            // Or just read the phrase
            const text = `Điền từ còn thiếu. ${this.currentLevel.phrase.replace('_', ' ')}`;
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'vi-VN';
            utterance.rate = 0.9;
            window.speechSynthesis.speak(utterance);
        }
    }

    goBack() {
        this.location.back();
    }

    playSound(type: 'pop' | 'click' | 'success' | 'wrong') {
        // Placeholder
    }
}

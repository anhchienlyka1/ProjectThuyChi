import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { KidButtonComponent } from '../../../shared/ui-kit/kid-button/kid-button.component';
import { DailyProgressService } from '../../../core/services/daily-progress.service';
import { LessonTimerService } from '../../../core/services/lesson-timer.service';
import { LessonTimerComponent } from '../../../shared/components/lesson-timer/lesson-timer.component';
import { LearningService } from '../../../core/services/learning.service';

interface SentenceLevel {
    id: number;
    sentence: string;
    words: string[]; // Correct order
    shuffledWords: string[]; // For display
    image: string;
    hint: string;
}

@Component({
    selector: 'app-sentence-builder',
    standalone: true,
    imports: [CommonModule, KidButtonComponent, LessonTimerComponent],
    templateUrl: './sentence-builder.component.html',
    styleUrl: './sentence-builder.component.css'
})
export class SentenceBuilderComponent implements OnInit, OnDestroy {
    private location = inject(Location);
    private router = inject(Router);
    private dailyProgress = inject(DailyProgressService);
    private lessonTimer = inject(LessonTimerService);
    private learningService = inject(LearningService);

    levels: SentenceLevel[] = [
        {
            id: 1,
            sentence: 'Con mèo đang ngủ',
            words: ['Con', 'mèo', 'đang', 'ngủ'],
            shuffledWords: [],
            image: '🐱',
            hint: 'Con gì kêu meo meo?'
        },
        {
            id: 2,
            sentence: 'Bé đi học vui quá',
            words: ['Bé', 'đi', 'học', 'vui', 'quá'],
            shuffledWords: [],
            image: '🏫',
            hint: 'Mỗi ngày đến trường là một ngày vui'
        },
        {
            id: 3,
            sentence: 'Mặt trời mọc đằng đông',
            words: ['Mặt', 'trời', 'mọc', 'đằng', 'đông'],
            shuffledWords: [],
            image: '☀️',
            hint: 'Buổi sáng thức dậy thấy ông gì?'
        },
        {
            id: 4,
            sentence: 'Hôm nay trời thật đẹp',
            words: ['Hôm', 'nay', 'trời', 'thật', 'đẹp'],
            shuffledWords: [],
            image: '🌈',
            hint: 'Khen thời tiết hôm nay'
        },
        {
            id: 5,
            sentence: 'Cây xanh cho bóng mát',
            words: ['Cây', 'xanh', 'cho', 'bóng', 'mát'],
            shuffledWords: [],
            image: '🌳',
            hint: 'Tại sao nên trồng nhiều cây?'
        }
    ];

    currentLevelIndex = 0;
    currentLevel!: SentenceLevel;

    // Game State
    availableWords: { id: number, text: string, selected: boolean }[] = [];
    selectedWords: { id: number, text: string, originalIndex: number }[] = [];

    isCorrect: boolean = false;
    isWrong: boolean = false;
    showFeedback: boolean = false;
    isFinished: boolean = false;
    isLoading: boolean = true;
    score: number = 0;

    // Timer and stats
    showCompletionStats = false;
    completionDuration = 0;
    startTime = 0;
    previousFastestTime = 0;

    ngOnInit(): void {
        this.loadPreviousFastestTime();
        this.initGame();
    }

    ngOnDestroy() {
        this.lessonTimer.stopTimer();
    }

    loadPreviousFastestTime() {
        this.learningService.getCompletionTime('sentence-builder').subscribe({
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

    initGame() {
        this.isLoading = false;
        this.currentLevelIndex = 0;
        this.score = 0;
        this.isFinished = false;
        this.startTime = Date.now();
        this.lessonTimer.startTimer('sentence-builder');
        this.loadLevel();
    }

    loadLevel() {
        this.currentLevel = this.levels[this.currentLevelIndex];
        this.selectedWords = [];
        this.isCorrect = false;
        this.isWrong = false;
        this.showFeedback = false;

        // Prepare valid shuffled words
        // We map them to objects with IDs to handle duplicate words correctly if any
        const wordsWithIds = this.currentLevel.words.map((word, index) => ({
            id: index,
            text: word,
            selected: false
        }));

        // Shuffle
        this.availableWords = [...wordsWithIds].sort(() => Math.random() - 0.5);
    }

    selectWord(wordItem: { id: number, text: string, selected: boolean }, index: number) {
        if (wordItem.selected || this.isCorrect) return;

        this.playSound('pop');

        // Mark as selected in available
        // We update the specific item in the array to keep track
        const availableIndex = this.availableWords.findIndex(w => w.id === wordItem.id);
        if (availableIndex !== -1) {
            this.availableWords[availableIndex].selected = true;
            this.selectedWords.push({
                id: wordItem.id,
                text: wordItem.text,
                originalIndex: availableIndex
            });
        }

        this.checkAutoSubmit();
    }

    deselectWord(selectedItemIndex: number) {
        if (this.isCorrect) return;

        this.playSound('click');

        const item = this.selectedWords[selectedItemIndex];

        // Find back in available and unselect
        const availableIndex = this.availableWords.findIndex(w => w.id === item.id);
        if (availableIndex !== -1) {
            this.availableWords[availableIndex].selected = false;
        }

        // Remove from selected
        this.selectedWords.splice(selectedItemIndex, 1);
    }

    checkAutoSubmit() {
        // If all words selected, check answer
        if (this.selectedWords.length === this.currentLevel.words.length) {
            this.checkAnswer();
        }
    }

    checkAnswer() {
        const builtSentence = this.selectedWords.map(w => w.text).join(' ');

        if (builtSentence === this.currentLevel.sentence) {
            this.handleSuccess();
        } else {
            this.handleWrong();
        }
    }

    handleSuccess() {
        this.isCorrect = true;
        this.playSound('success');
        this.score += 10;
        this.showFeedback = true;

        setTimeout(() => {
            this.showFeedback = false;
            if (this.currentLevelIndex < this.levels.length - 1) {
                this.currentLevelIndex++;
                this.loadLevel();
            } else {
                this.finishGame();
            }
        }, 2000);
    }

    handleWrong() {
        this.isWrong = true;
        this.playSound('wrong');
        this.showFeedback = true;

        // Reset selection after delay or let user correct manually? 
        // Let's reset recently added or just show error and let user fix.
        // Usually tailored for kids, maybe reset all to make it clear it was wrong.
        setTimeout(() => {
            this.isWrong = false;
            this.showFeedback = false;

            // Optional: Reset all to try again
            this.selectedWords.forEach(item => {
                const avIndex = this.availableWords.findIndex(w => w.id === item.id);
                if (avIndex !== -1) this.availableWords[avIndex].selected = false;
            });
            this.selectedWords = [];
        }, 1500);
    }

    finishGame() {
        this.isFinished = true;
        const durationSeconds = this.lessonTimer.stopTimer();
        this.completionDuration = durationSeconds;

        const isNewRecord = this.previousFastestTime === 0 || durationSeconds < this.previousFastestTime;

        this.dailyProgress.incrementCompletion('sentence-builder');

        this.learningService.completeSession({
            levelId: 'sentence-builder',
            score: this.score,
            totalQuestions: this.levels.length,
            durationSeconds: durationSeconds
        }).subscribe({
            next: () => {
                if (isNewRecord) {
                    setTimeout(() => this.showCompletionStats = true, 1500);
                }
            },
            error: (err) => {
                console.error('Failed to save', err);
                if (isNewRecord) setTimeout(() => this.showCompletionStats = true, 1500);
            }
        });
    }

    restartGame() {
        this.initGame();
        this.showCompletionStats = false;
    }

    goBack() {
        this.location.back();
    }

    playSound(type: 'pop' | 'click' | 'success' | 'wrong') {
        // Placeholder - would integrate actual audio service
    }

    readSentence() {
        window.speechSynthesis.cancel();
        const text = this.currentLevel.sentence; // Or hint? Maybe just read the hint or existing words?
        // Since it's a puzzle, maybe reading the answer is cheating.
        // Let's read the hint or some encouragement.
        const utter = new SpeechSynthesisUtterance(this.currentLevel.hint || "Bé hãy xếp các từ thành câu đúng nhé");
        utter.lang = 'vi-VN';
        window.speechSynthesis.speak(utter);
    }
}

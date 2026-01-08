import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { KidButtonComponent } from '../../../shared/ui-kit/kid-button/kid-button.component';

interface Question {
    text: string;
    answer: number;
    options: number[];
}

interface PlayerState {
    currentQuestionIndex: number;
    score: number; // Not strictly used for Tug of War position, but good for stats
    isLocked: boolean; // If answered wrong, maybe lock for a second?
}

@Component({
    selector: 'app-tug-of-war',
    standalone: true,
    imports: [CommonModule, RouterModule, KidButtonComponent],
    templateUrl: './tug-of-war.component.html',
    styleUrls: ['./tug-of-war.component.css']
})
export class TugOfWarComponent implements OnInit, OnDestroy {
    // Game Configuration
    readonly GAME_DURATION_SEC = 300; // 5 minutes max
    readonly WIN_SCORE = 50; // Points needed to reach finish line

    // Game State
    timeLeft = this.GAME_DURATION_SEC;
    timerInterval: any;

    // Player Progress (0 to WIN_SCORE)
    progressLeft = 0; // Tortoise
    progressRight = 0; // Hare

    gameStatus: 'unitialized' | 'playing' | 'finished' = 'unitialized';
    winner: 'left' | 'right' | 'draw' | null = null;

    // Questions Management
    // Instead of pre-generating fixed array, we generate on fly or maintain buffer
    currentQuestionLeft: Question | null = null;
    currentQuestionRight: Question | null = null;

    constructor(private router: Router, private cdr: ChangeDetectorRef) { }

    ngOnInit() {
        this.startGame();
    }

    ngOnDestroy() {
        this.stopTimer();
    }

    startGame() {
        this.gameStatus = 'playing';
        this.timeLeft = this.GAME_DURATION_SEC;
        this.progressLeft = 0;
        this.progressRight = 0;
        this.winner = null;

        // Initial Questions
        this.currentQuestionLeft = this.generateSingleQuestion();
        this.currentQuestionRight = this.generateSingleQuestion(); // Independent questions? Or Same? User said race. Usually independent is better for pure speed race so one doesn't block other. Let's do INDEPENDENT questions.

        this.startTimer();
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.timeLeft--;
            if (this.timeLeft <= 0) {
                this.endGame();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }

    generateSingleQuestion(): Question {
        // Simple Math Generator
        const isAddition = Math.random() > 0.5;
        const a = Math.floor(Math.random() * 10) + 1;
        const b = Math.floor(Math.random() * 10) + 1;
        let answer = 0;
        let text = '';

        if (isAddition) {
            answer = a + b;
            text = `${a} + ${b} = ?`;
        } else {
            const max = Math.max(a, b);
            const min = Math.min(a, b);
            answer = max - min;
            text = `${max} - ${min} = ?`;
        }

        const options = new Set<number>();
        options.add(answer);
        while (options.size < 4) {
            const wrong = Math.floor(Math.random() * 20);
            if (wrong !== answer) options.add(wrong);
        }

        return {
            text,
            answer,
            options: Array.from(options).sort(() => Math.random() - 0.5)
        };
    }

    handleAnswer(side: 'left' | 'right', selectedOption: number) {
        if (this.gameStatus !== 'playing') return;

        const currentQ = side === 'left' ? this.currentQuestionLeft : this.currentQuestionRight;
        if (!currentQ) return;

        if (selectedOption === currentQ.answer) {
            // Correct - Advance
            if (side === 'left') this.progressLeft++;
            else this.progressRight++;

            // Check Win immediate
            if (this.checkWinCondition()) return;

            // Next Question for this user
            if (side === 'left') this.currentQuestionLeft = this.generateSingleQuestion();
            else this.currentQuestionRight = this.generateSingleQuestion();

        } else {
            // Wrong - Penalty (Freeze or just no move? "unlimited questions" implies speed run. Maybe slight pause or just no points. Let's do nothing but shake or require correct answer? No, usually shuffle question to prevent guessing spam.)
            // Let's shuffle question
            if (side === 'left') this.currentQuestionLeft = this.generateSingleQuestion();
            else this.currentQuestionRight = this.generateSingleQuestion();
        }
    }

    checkWinCondition(): boolean {
        if (this.progressLeft >= this.WIN_SCORE) {
            this.winner = 'left';
            this.endGame();
            return true;
        }
        if (this.progressRight >= this.WIN_SCORE) {
            this.winner = 'right';
            this.endGame();
            return true;
        }
        return false;
    }

    endGame() {
        this.stopTimer();
        this.gameStatus = 'finished';
        if (!this.winner) {
            // Time out - who is furthest?
            if (this.progressLeft > this.progressRight) this.winner = 'left';
            else if (this.progressRight > this.progressLeft) this.winner = 'right';
            else this.winner = 'draw';
        }
    }

    get formattedTime(): string {
        const m = Math.floor(this.timeLeft / 60);
        const s = this.timeLeft % 60;
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    }
}

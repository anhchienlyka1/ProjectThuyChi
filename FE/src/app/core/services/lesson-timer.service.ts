import { Injectable, signal } from '@angular/core';

export interface LessonTimer {
    levelId: string;
    startTime: number;
    elapsedSeconds: number;
    isRunning: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class LessonTimerService {
    // Current active timer
    private currentTimer = signal<LessonTimer | null>(null);
    private intervalId: any = null;

    // Public signals
    readonly elapsedSeconds = signal<number>(0);
    readonly isRunning = signal<boolean>(false);
    readonly formattedTime = signal<string>('00:00');

    /**
     * Start timer for a lesson
     */
    startTimer(levelId: string): void {
        this.stopTimer(); // Stop any existing timer

        const timer: LessonTimer = {
            levelId,
            startTime: Date.now(),
            elapsedSeconds: 0,
            isRunning: true
        };

        this.currentTimer.set(timer);
        this.isRunning.set(true);
        this.elapsedSeconds.set(0);
        this.formattedTime.set('00:00');

        // Update every second
        this.intervalId = setInterval(() => {
            const current = this.currentTimer();
            if (current && current.isRunning) {
                const elapsed = Math.floor((Date.now() - current.startTime) / 1000);
                current.elapsedSeconds = elapsed;
                this.elapsedSeconds.set(elapsed);
                this.formattedTime.set(this.formatTime(elapsed));
                this.currentTimer.set({ ...current });
            }
        }, 1000);
    }

    /**
     * Pause the current timer
     */
    pauseTimer(): void {
        const current = this.currentTimer();
        if (current) {
            current.isRunning = false;
            this.currentTimer.set({ ...current });
            this.isRunning.set(false);
        }
    }

    /**
     * Resume the paused timer
     */
    resumeTimer(): void {
        const current = this.currentTimer();
        if (current) {
            // Adjust start time to account for elapsed time
            current.startTime = Date.now() - (current.elapsedSeconds * 1000);
            current.isRunning = true;
            this.currentTimer.set({ ...current });
            this.isRunning.set(true);
        }
    }

    /**
     * Stop and clear the timer
     */
    /**
     * Stop and clear the timer
     */
    stopTimer(): number {
        let elapsed = this.elapsedSeconds();
        const current = this.currentTimer();

        // Calculate exact final time if running
        if (current && current.isRunning) {
            elapsed = Math.floor((Date.now() - current.startTime) / 1000);
        }

        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
        }

        this.currentTimer.set(null);
        this.isRunning.set(false);
        this.elapsedSeconds.set(0);
        this.formattedTime.set('00:00');

        return elapsed;
    }

    /**
     * Get current elapsed time in seconds
     */
    getElapsedSeconds(): number {
        return this.elapsedSeconds();
    }

    /**
     * Get current timer info
     */
    getCurrentTimer(): LessonTimer | null {
        return this.currentTimer();
    }

    /**
     * Format seconds to MM:SS or HH:MM:SS
     */
    private formatTime(seconds: number): string {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        if (hours > 0) {
            return `${this.pad(hours)}:${this.pad(minutes)}:${this.pad(secs)}`;
        }
        return `${this.pad(minutes)}:${this.pad(secs)}`;
    }

    private pad(num: number): string {
        return num.toString().padStart(2, '0');
    }

    /**
     * Format seconds to human readable string
     */
    formatTimeHuman(seconds: number): string {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        const parts: string[] = [];
        if (hours > 0) parts.push(`${hours} giờ`);
        if (minutes > 0) parts.push(`${minutes} phút`);
        if (secs > 0 || parts.length === 0) parts.push(`${secs} giây`);

        return parts.join(' ');
    }
}

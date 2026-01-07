import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class SessionTimerService {
    private platformId = inject(PLATFORM_ID);

    // Config (Could come from Parent Settings Store)
    readonly maxDurationMinutes = 15;

    // State
    readonly remainingSeconds = signal<number>(15 * 60);
    readonly isSessionActive = signal<boolean>(true);

    private intervalId: any;

    constructor() {
        if (isPlatformBrowser(this.platformId)) {
            this.startSession();
        }

        // Auto-stop effect
        effect(() => {
            if (this.remainingSeconds() <= 0) {
                this.isSessionActive.set(false);
                this.stopTimer();
                if (isPlatformBrowser(this.platformId)) {
                    // In real app, emit event or show modal. Avoid alert() in SSR.
                    console.log('Session ended');
                    // alert('Đã hết giờ học rồi! Bé nghỉ ngơi nhé!');
                }
            }
        });
    }

    startSession() {
        if (!isPlatformBrowser(this.platformId)) return;
        this.stopTimer();
        this.isSessionActive.set(true);
        this.intervalId = setInterval(() => {
            this.remainingSeconds.update(v => v - 1);
        }, 1000);
    }

    stopTimer() {
        if (this.intervalId) clearInterval(this.intervalId);
    }

    addTime(minutes: number) {
        this.remainingSeconds.update(v => v + (minutes * 60));
        this.isSessionActive.set(true);
        if (!this.intervalId) this.startSession();
    }

    resetDaily() {
        this.remainingSeconds.set(this.maxDurationMinutes * 60);
        this.startSession();
    }
}

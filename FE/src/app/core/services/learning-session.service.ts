import { Injectable, signal } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { AuthService } from './auth.service';

export interface LearningSessionData {
    levelId: string;
    subject: 'math' | 'vietnamese' | 'english';
    moduleType: string;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    duration: number; // seconds
}

export interface LearningSession extends LearningSessionData {
    id?: string;
    userId: string;
    xpEarned: number;
    starsEarned: number;
    date: string;
    completedAt: string;
    createdAt?: string;
    updatedAt?: string;
}

@Injectable({
    providedIn: 'root'
})
export class LearningSessionService {
    // Signal để track session hiện tại
    currentSession = signal<LearningSession | null>(null);
    isSessionActive = signal<boolean>(false);

    constructor(
        private db: FirestoreService,
        private auth: AuthService
    ) { }

    /**
     * Bắt đầu một session học mới
     */
    startSession(levelId: string, subject: 'math' | 'vietnamese' | 'english', moduleType: string): void {
        const userId = this.auth.getUserId();
        if (!userId) {
            console.error('No user logged in');
            return;
        }

        const session: LearningSession = {
            userId,
            levelId,
            subject,
            moduleType,
            score: 0,
            totalQuestions: 0,
            correctAnswers: 0,
            duration: 0,
            xpEarned: 0,
            starsEarned: 0,
            date: new Date().toISOString().split('T')[0],
            completedAt: new Date().toISOString()
        };

        this.currentSession.set(session);
        this.isSessionActive.set(true);
    }

    /**
     * Hoàn thành và lưu session
     */
    async completeSession(sessionData: LearningSessionData): Promise<void> {
        const userId = this.auth.getUserId();
        if (!userId) {
            console.error('No user logged in');
            return;
        }

        try {
            const today = new Date().toISOString().split('T')[0];

            // Calculate rewards
            const xpEarned = sessionData.correctAnswers * 10;
            const starsEarned = Math.floor(sessionData.score / 20);

            const session: LearningSession = {
                ...sessionData,
                userId,
                xpEarned,
                starsEarned,
                date: today,
                completedAt: new Date().toISOString()
            };

            // Save session to Firestore
            const sessionId = await this.db.addDocument('learning_sessions', session);
            console.log('Session saved with ID:', sessionId);

            // Update user stats (XP, stars, level)
            await this.updateUserStats(userId, xpEarned, starsEarned);

            // Update daily progress
            await this.updateDailyProgress(userId, today, sessionData, xpEarned, starsEarned);

            // Reset current session
            this.currentSession.set(null);
            this.isSessionActive.set(false);

            return;
        } catch (error) {
            console.error('Error completing session:', error);
            throw error;
        }
    }

    /**
     * Update user XP, stars, and level
     */
    private async updateUserStats(userId: string, xpEarned: number, starsEarned: number): Promise<void> {
        try {
            // Note: Temporarily using localStorage since we haven't migrated auth yet
            // This will be replaced when we migrate auth.service to use Firestore
            const currentUser = this.auth.currentUser();
            if (!currentUser) return;

            // Cast to any because the base User interface doesn't have these properties yet
            const userAny = currentUser as any;
            const currentXp = userAny.xp || 0;
            const currentStars = userAny.totalStars || 0;

            const newXp = currentXp + xpEarned;
            const newTotalStars = currentStars + starsEarned;
            const newLevel = Math.floor(newXp / 500) + 1;

            // Update in Firestore if user document exists
            const userDoc = await this.db.getDocument('users', userId);
            if (userDoc) {
                await this.db.updateDocument('users', userId, {
                    xp: newXp,
                    totalStars: newTotalStars,
                    level: newLevel
                });
            }

            // Also update localStorage for now
            const updatedUser = {
                ...userAny,
                xp: newXp,
                totalStars: newTotalStars,
                level: newLevel
            };

            if (typeof localStorage !== 'undefined') {
                localStorage.setItem('thuyChi_user', JSON.stringify(updatedUser));
            }

            console.log(`User stats updated: +${xpEarned} XP, +${starsEarned} stars, Level ${newLevel}`);
        } catch (error) {
            console.error('Error updating user stats:', error);
        }
    }

    /**
     * Update daily progress
     */
    private async updateDailyProgress(
        userId: string,
        today: string,
        sessionData: LearningSessionData,
        xpEarned: number,
        starsEarned: number
    ): Promise<void> {
        try {
            const docId = `${userId}_${today}`;
            const progressDoc = await this.db.getDocument('daily_progress', docId);

            if (progressDoc) {
                // Update existing progress
                const completions = progressDoc['completions'] || {};
                completions[sessionData.levelId] = (completions[sessionData.levelId] || 0) + 1;

                await this.db.updateDocument('daily_progress', docId, {
                    lessonsCompleted: (progressDoc['lessonsCompleted'] || 0) + 1,
                    correctAnswers: (progressDoc['correctAnswers'] || 0) + sessionData.correctAnswers,
                    totalQuestions: (progressDoc['totalQuestions'] || 0) + sessionData.totalQuestions,
                    minutesLearned: (progressDoc['minutesLearned'] || 0) + Math.floor(sessionData.duration / 60),
                    xpEarned: (progressDoc['xpEarned'] || 0) + xpEarned,
                    starsEarned: (progressDoc['starsEarned'] || 0) + starsEarned,
                    completions
                });
            } else {
                // Create new progress document
                await this.db.setDocument('daily_progress', docId, {
                    userId,
                    date: today,
                    lessonsCompleted: 1,
                    correctAnswers: sessionData.correctAnswers,
                    totalQuestions: sessionData.totalQuestions,
                    minutesLearned: Math.floor(sessionData.duration / 60),
                    xpEarned,
                    starsEarned,
                    completions: { [sessionData.levelId]: 1 }
                });
            }

            console.log('Daily progress updated');
        } catch (error) {
            console.error('Error updating daily progress:', error);
        }
    }

    /**
     * Get learning history for a user
     */
    async getLearningHistory(userId: string, limit: number = 10): Promise<LearningSession[]> {
        try {
            const documents = await this.db.queryDocuments(
                'learning_sessions',
                // @ts-ignore - where is imported from firebase/firestore
                where('userId', '==', userId)
            );

            // Sort by completedAt descending
            return documents
                .sort((a, b) => {
                    const timeA = new Date(a['completedAt']).getTime();
                    const timeB = new Date(b['completedAt']).getTime();
                    return timeB - timeA;
                })
                .slice(0, limit) as unknown as LearningSession[];
        } catch (error) {
            console.error('Error getting learning history:', error);
            return [];
        }
    }

    /**
     * Get today's sessions count
     */
    async getTodaySessionsCount(userId: string): Promise<number> {
        try {
            const today = new Date().toISOString().split('T')[0];
            const sessions = await this.db.queryDocuments(
                'learning_sessions',
                // @ts-ignore
                where('userId', '==', userId),
                // @ts-ignore  
                where('date', '==', today)
            );
            return sessions.length;
        } catch (error) {
            console.error('Error getting today sessions count:', error);
            return 0;
        }
    }
}

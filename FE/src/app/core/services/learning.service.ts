import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { saveLearningSession, getCompletionTimeStats } from '../mock-data/learning-sessions.mock';

export interface LearningSessionResult {
  userId?: string;  // Optional - will be auto-filled from AuthService
  levelId: string;
  score: number;
  totalQuestions: number;
  durationSeconds: number;
  answers?: any[];
}

export interface LearningResponse {
  success: boolean;
  starsEarned: number;
  newHighScore: boolean;
  accuracy: number;
  sessionId: number;
  completed: boolean;
  achievement?: {
    id: string;
    title: string;
    description: string;
    icon: string;
    rarity: string;
    points: number;
  };
  improvementAchievement?: {
    id: string;
    title: string;
    description: string;
    icon: string;
    rarity: string;
    points: number;
  };
}

export interface CompletionTimeSession {
  sessionId: number;
  levelId: string;
  levelName: string;
  durationSeconds: number;
  score: number;
  totalQuestions: number;
  accuracyPercentage: number;
  stars: number;
  completedAt: Date;
}

export interface CompletionTimeResponse {
  userId: string;
  levelId: string;
  totalSessions: number;
  averageTimeSeconds: number;
  fastestTimeSeconds: number;
  slowestTimeSeconds: number;
  totalTimeSeconds: number;
  recentSessions: CompletionTimeSession[];
}

@Injectable({
  providedIn: 'root'
})
export class LearningService {
  private authService = inject(AuthService);

  completeSession(result: LearningSessionResult): Observable<LearningResponse> {
    console.log('result', result);
    const userId = result.userId || this.authService.getUserId();

    if (!userId) {
      console.error('[LearningService] No user ID available');
      throw new Error('User not logged in');
    }

    // Use mock data service to save session
    const response = saveLearningSession(
      userId,
      result.levelId,
      result.score,
      result.totalQuestions,
      result.durationSeconds
    );

    // Return observable with simulated delay
    return of(response).pipe(delay(500));
  }

  getCompletionTime(levelId?: string): Observable<CompletionTimeResponse> {
    const userId = this.authService.getUserId();

    if (!userId) {
      console.error('[LearningService] No user ID available');
      throw new Error('User not logged in');
    }

    // Get completion time stats from mock data
    const stats = getCompletionTimeStats(userId, levelId);

    if (!stats) {
      // Return empty stats if no sessions found
      const emptyStats: CompletionTimeResponse = {
        userId,
        levelId: levelId || 'all',
        totalSessions: 0,
        averageTimeSeconds: 0,
        fastestTimeSeconds: 0,
        slowestTimeSeconds: 0,
        totalTimeSeconds: 0,
        recentSessions: []
      };
      return of(emptyStats).pipe(delay(300));
    }

    // Return observable with simulated delay
    return of(stats).pipe(delay(300));
  }
}

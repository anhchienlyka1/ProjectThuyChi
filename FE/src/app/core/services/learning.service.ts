import { Injectable, inject } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { LearningSessionService } from './learning-session.service';
import { DailyProgressService } from './daily-progress.service';
import { saveLearningSession, getCompletionTimeStats } from '../mock-data/learning-sessions.mock';

export interface LearningSessionResult {
  userId?: string;  // Optional - will be auto-filled from AuthService
  levelId: string;
  score: number;
  totalQuestions: number;
  durationSeconds: number;
  answers?: any[];
  subject?: 'math' | 'vietnamese' | 'english'; // Add subject field
  moduleType?: string; // Add module type (e.g., 'addition', 'spelling')
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
  private sessionService = inject(LearningSessionService);
  private dailyProgressService = inject(DailyProgressService);

  completeSession(result: LearningSessionResult): Observable<LearningResponse> {
    console.log('[LearningService] Completing session:', result);
    const userId = result.userId || this.authService.getUserId();

    if (!userId) {
      console.error('[LearningService] No user ID available');
      throw new Error('User not logged in');
    }

    // Calculate accuracy and stars
    const accuracy = Math.round((result.score / result.totalQuestions) * 100);
    const correctAnswers = Math.round((accuracy / 100) * result.totalQuestions);
    const starsEarned = Math.floor(accuracy / 20); // 0-5 stars based on accuracy

    // Determine subject and module type from levelId
    let subject: 'math' | 'vietnamese' | 'english' = 'math';
    let moduleType = 'mixed';

    if (result.levelId.includes('vietnamese') || result.levelId.includes('spelling')) {
      subject = 'vietnamese';
      moduleType = result.moduleType || 'spelling';
    } else if (result.levelId.includes('addition')) {
      moduleType = 'addition';
    } else if (result.levelId.includes('subtraction')) {
      moduleType = 'subtraction';
    } else if (result.levelId.includes('geometry')) {
      moduleType = 'geometry';
    } else if (result.levelId.includes('comparison')) {
      moduleType = 'comparison';
    } else if (result.levelId.includes('sorting')) {
      moduleType = 'sorting';
    } else if (result.levelId.includes('fill')) {
      moduleType = 'fill-in-blank';
    }

    // Override if provided in result
    if (result.subject) subject = result.subject;
    if (result.moduleType) moduleType = result.moduleType;

    // Save to Firestore via LearningSessionService
    const savePromise = this.sessionService.completeSession({
      levelId: result.levelId,
      subject,
      moduleType,
      score: accuracy,
      totalQuestions: result.totalQuestions,
      correctAnswers,
      duration: result.durationSeconds
    });

    // Also save to mock data for backward compatibility
    const mockResponse = saveLearningSession(
      userId,
      result.levelId,
      result.score,
      result.totalQuestions,
      result.durationSeconds
    );

    // Convert Promise to Observable and add delay
    return from(savePromise).pipe(
      map(() => {
        console.log('[LearningService] Session saved to Firestore successfully');

        // Refresh daily progress cache
        this.dailyProgressService.refreshCompletions();

        // Return response with calculated values
        return {
          ...mockResponse,
          starsEarned,
          accuracy,
          success: true
        };
      }),
      catchError(error => {
        console.error('[LearningService] Error saving to Firestore:', error);
        // Fallback to mock response if Firestore fails
        return of({
          ...mockResponse,
          starsEarned,
          accuracy,
          success: true
        });
      }),
      delay(500)
    );
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

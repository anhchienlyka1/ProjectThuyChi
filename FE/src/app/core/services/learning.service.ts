import { Injectable, inject } from '@angular/core';
import { Observable, of, from } from 'rxjs';
import { delay, map, catchError } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { LearningSessionService } from './learning-session.service';
import { DailyProgressService } from './daily-progress.service';
import { FirebaseService } from './firebase.service';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';

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
  // improvementAchievement removed as it was mock-specific for now
  improvementAchievement?: any;
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
  private firebaseService = inject(FirebaseService);

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

    // Determine subject and module type from levelId if not provided
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

    // Convert Promise to Observable and add delay
    return from(savePromise).pipe(
      map(() => {
        console.log('[LearningService] Session saved to Firestore successfully');

        // Refresh daily progress cache
        this.dailyProgressService.refreshCompletions();

        // Return response with calculated values
        return {
          success: true,
          starsEarned,
          newHighScore: false, // Logic for high score could be checked here by querying Firestore, skipping for now
          accuracy,
          sessionId: Date.now(), // Mock ID for frontend
          completed: true,
          // Achievements would be populated here if we implemented achievement awarding logic
        } as LearningResponse;
      }),
      catchError(error => {
        console.error('[LearningService] Error saving to Firestore:', error);
        // Return a success response even if save fails to not block the UI, but log error
        return of({
          success: true,
          starsEarned,
          newHighScore: false,
          accuracy,
          sessionId: Date.now(),
          completed: true
        });
      }),
      delay(500)
    );
  }

  getCompletionTime(levelId?: string): Observable<CompletionTimeResponse> {
    const userId = this.authService.getUserId();

    if (!userId) {
      console.error('[LearningService] No user ID available');
      return of(this.getEmptyStats('unknown', levelId));
    }

    const sessionsRef = collection(this.firebaseService.firestore, 'learning_sessions');
    let q = query(
      sessionsRef,
      where('userId', '==', userId),
      orderBy('completedAt', 'desc'),
      limit(50) // Fetch last 50 sessions for stats calculation
    );

    if (levelId && levelId !== 'all') {
      q = query(
        sessionsRef,
        where('userId', '==', userId),
        where('levelId', '==', levelId),
        orderBy('completedAt', 'desc'),
        limit(50)
      );
    }

    return from(getDocs(q)).pipe(
      map(snapshot => {
        if (snapshot.empty) {
          return this.getEmptyStats(userId, levelId);
        }

        const sessions = snapshot.docs.map(doc => doc.data());
        let totalTime = 0;
        let fastestTime = Infinity;
        let slowestTime = 0;

        // Map to CompletionTimeSession format
        const recentSessions: CompletionTimeSession[] = sessions.map(data => {
          const time = data['duration'] || 0;
          totalTime += time;
          if (time < fastestTime) fastestTime = time;
          if (time > slowestTime) slowestTime = time;

          return {
            sessionId: 0, // ID not critical for stats view
            levelId: data['levelId'],
            levelName: data['levelId'], // Could resolve name if levels cached
            durationSeconds: time,
            score: data['score'] || 0,
            totalQuestions: data['totalQuestions'] || 0,
            accuracyPercentage: data['score'] || 0, // Score is usually accuracy in this app (0-100)
            stars: data['starsEarned'] || 0,
            completedAt: data['completedAt'] ? new Date(data['completedAt']) : new Date()
          };
        });

        if (fastestTime === Infinity) fastestTime = 0;

        return {
          userId,
          levelId: levelId || 'all',
          totalSessions: sessions.length,
          averageTimeSeconds: sessions.length > 0 ? Math.round(totalTime / sessions.length) : 0,
          fastestTimeSeconds: fastestTime,
          slowestTimeSeconds: slowestTime,
          totalTimeSeconds: totalTime,
          recentSessions
        };
      }),
      catchError(error => {
        console.warn('[LearningService] Error fetching stats (index likely missing for complex query):', error);
        return of(this.getEmptyStats(userId, levelId));
      })
    );
  }

  private getEmptyStats(userId: string, levelId?: string): CompletionTimeResponse {
    return {
      userId,
      levelId: levelId || 'all',
      totalSessions: 0,
      averageTimeSeconds: 0,
      fastestTimeSeconds: 0,
      slowestTimeSeconds: 0,
      totalTimeSeconds: 0,
      recentSessions: []
    };
  }
}

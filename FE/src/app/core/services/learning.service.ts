import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

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
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${environment.apiUrl}/learning/complete`;

  completeSession(result: LearningSessionResult): Observable<LearningResponse> {
    console.log('result', result);
    const userId = result.userId || this.authService.getUserId();

    if (!userId) {
      console.error('[LearningService] No user ID available');
      return throwError(() => new Error('User not logged in'));
    }

    const payload = {
      ...result,
      userId
    };

    return this.http.post<LearningResponse>(this.apiUrl, payload).pipe(
      catchError(error => {
        console.error('Error saving learning session:', error);
        throw error;
      })
    );
  }

  getCompletionTime(levelId?: string): Observable<CompletionTimeResponse> {
    const userId = this.authService.getUserId();

    if (!userId) {
      console.error('[LearningService] No user ID available');
      return throwError(() => new Error('User not logged in'));
    }

    const url = `${environment.apiUrl}/learning/completion-time`;
    const params: any = { userId };

    if (levelId) {
      params.levelId = levelId;
    }

    return this.http.get<CompletionTimeResponse>(url, { params }).pipe(
      catchError(error => {
        console.error('Error fetching completion time:', error);
        throw error;
      })
    );
  }
}

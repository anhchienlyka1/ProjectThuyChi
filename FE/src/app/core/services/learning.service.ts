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
}

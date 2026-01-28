import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { FirestoreService } from './firestore.service';
import { AuthService } from './auth.service';

interface DailyCompletionsResponse {
  date: string; // YYYY-MM-DD format
  completions: { [levelId: string]: number }; // levelId -> count
}

@Injectable({
  providedIn: 'root'
})
export class DailyProgressService {
  // Cache for today's completions to avoid excessive Firestore calls
  private completionsCache$ = new BehaviorSubject<DailyCompletionsResponse | null>(null);
  private lastFetchDate: string | null = null;

  constructor(
    private db: FirestoreService,
    private authService: AuthService
  ) {
    // Load initial data
    this.loadTodayCompletions();
  }

  /**
   * Get today's date in YYYY-MM-DD format
   */
  private getTodayString(): string {
    const now = new Date();
    return now.toISOString().split('T')[0];
  }

  /**
   * Load today's completions from Firestore
   */
  private async loadTodayCompletions(): Promise<DailyCompletionsResponse> {
    const today = this.getTodayString();

    // Check if we need to refresh (new day or no cache)
    if (this.lastFetchDate !== today || !this.completionsCache$.value) {
      console.log('[DailyProgress] Loading completions from Firestore...');

      // Get current user ID from AuthService
      const userId = this.authService.getUserId();
      if (!userId) {
        console.warn('[DailyProgress] No user logged in, returning empty completions');
        const emptyData: DailyCompletionsResponse = {
          date: today,
          completions: {}
        };
        this.completionsCache$.next(emptyData);
        return emptyData;
      }

      try {
        const docId = `${userId}_${today}`;
        const progressDoc = await this.db.getDocument('daily_progress', docId);

        const data: DailyCompletionsResponse = {
          date: today,
          completions: (progressDoc && progressDoc['completions']) || {}
        };

        console.log('[DailyProgress] Loaded completions:', data);
        this.completionsCache$.next(data);
        this.lastFetchDate = today;

        return data;
      } catch (error) {
        console.error('[DailyProgress] Failed to load daily completions:', error);
        // Return empty data on error
        const emptyData: DailyCompletionsResponse = {
          date: today,
          completions: {}
        };
        this.completionsCache$.next(emptyData);
        return emptyData;
      }
    }

    console.log('[DailyProgress] Using cached completions:', this.completionsCache$.value);
    return this.completionsCache$.value!;
  }

  /**
   * Refresh completions from Firestore
   */
  async refreshCompletions(): Promise<DailyCompletionsResponse> {
    console.log('[DailyProgress] Forcing refresh...');
    this.lastFetchDate = null; // Force refresh
    return await this.loadTodayCompletions();
  }

  /**
   * Get completion count for a specific level today
   */
  getTodayCompletionCount(levelId: string): number {
    const cache = this.completionsCache$.value;
    if (!cache || cache.date !== this.getTodayString()) {
      return 0;
    }
    return cache.completions[levelId] || 0;
  }

  /**
   * Check if a level has been completed today
   */
  isCompletedToday(levelId: string): boolean {
    return this.getTodayCompletionCount(levelId) > 0;
  }

  /**
   * Increment completion count for a level
   * Note: This is called after completeSession, so we just refresh the cache
   */
  async incrementCompletion(levelId: string): Promise<void> {
    // The LearningSessionService already updated the daily_progress document
    // We just need to refresh our cache to get the updated count
    await this.refreshCompletions();
  }

  /**
   * Get all today's completions as Observable (for reactive updates)
   */
  getTodayCompletionsObservable(): Observable<{ [levelId: string]: number }> {
    // Trigger load if not loaded yet
    this.loadTodayCompletions();

    return new Observable(observer => {
      const subscription = this.completionsCache$.subscribe(data => {
        if (data) {
          observer.next(data.completions);
        }
      });

      return () => subscription.unsubscribe();
    });
  }

  /**
   * Get completions cache as Observable for reactive updates
   */
  getCompletionsObservable(): Observable<DailyCompletionsResponse | null> {
    return this.completionsCache$.asObservable();
  }

  /**
   * Get today's progress summary
   */
  async getTodayProgress(): Promise<{
    lessonsCompleted: number;
    correctAnswers: number;
    totalQuestions: number;
    minutesLearned: number;
    xpEarned: number;
    starsEarned: number;
  }> {
    const userId = this.authService.getUserId();
    if (!userId) {
      return {
        lessonsCompleted: 0,
        correctAnswers: 0,
        totalQuestions: 0,
        minutesLearned: 0,
        xpEarned: 0,
        starsEarned: 0
      };
    }

    try {
      const today = this.getTodayString();
      const docId = `${userId}_${today}`;
      const progressDoc = await this.db.getDocument('daily_progress', docId);

      return {
        lessonsCompleted: (progressDoc && progressDoc['lessonsCompleted']) || 0,
        correctAnswers: (progressDoc && progressDoc['correctAnswers']) || 0,
        totalQuestions: (progressDoc && progressDoc['totalQuestions']) || 0,
        minutesLearned: (progressDoc && progressDoc['minutesLearned']) || 0,
        xpEarned: (progressDoc && progressDoc['xpEarned']) || 0,
        starsEarned: (progressDoc && progressDoc['starsEarned']) || 0
      };
    } catch (error) {
      console.error('Error getting today progress:', error);
      return {
        lessonsCompleted: 0,
        correctAnswers: 0,
        totalQuestions: 0,
        minutesLearned: 0,
        xpEarned: 0,
        starsEarned: 0
      };
    }
  }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, of, map } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

interface DailyCompletionsResponse {
  date: string; // YYYY-MM-DD format
  completions: { [levelId: string]: number }; // levelId -> count
}

@Injectable({
  providedIn: 'root'
})
export class DailyProgressService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${environment.apiUrl}/learning`;

  // Cache for today's completions to avoid excessive API calls
  private completionsCache$ = new BehaviorSubject<DailyCompletionsResponse | null>(null);
  private lastFetchDate: string | null = null;

  constructor() {
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
   * Load today's completions from API
   */
  private loadTodayCompletions(): Observable<DailyCompletionsResponse> {
    const today = this.getTodayString();

    // Check if we need to refresh (new day or no cache)
    if (this.lastFetchDate !== today || !this.completionsCache$.value) {
      console.log('[DailyProgress] Loading completions from API...');

      // Get current user ID from AuthService
      const userId = this.authService.getUserId();
      if (!userId) {
        console.warn('[DailyProgress] No user logged in, returning empty completions');
        const emptyData: DailyCompletionsResponse = {
          date: today,
          completions: {}
        };
        this.completionsCache$.next(emptyData);
        return of(emptyData);
      }

      return this.http.get<DailyCompletionsResponse>(
        `${this.apiUrl}/daily-completions`,
        { params: { userId } }
      ).pipe(
        tap(data => {
          console.log('[DailyProgress] Loaded completions:', data);
          this.completionsCache$.next(data);
          this.lastFetchDate = today;
        }),
        catchError(error => {
          console.error('[DailyProgress] Failed to load daily completions:', error);
          // Return empty data on error
          const emptyData: DailyCompletionsResponse = {
            date: today,
            completions: {}
          };
          this.completionsCache$.next(emptyData);
          return of(emptyData);
        })
      );
    }

    console.log('[DailyProgress] Using cached completions:', this.completionsCache$.value);
    return of(this.completionsCache$.value!);
  }

  /**
   * Refresh completions from server
   */
  refreshCompletions(): Observable<DailyCompletionsResponse> {
    console.log('[DailyProgress] Forcing refresh...');
    this.lastFetchDate = null; // Force refresh
    return this.loadTodayCompletions();
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
   * Note: This is called after completeSession API, so we just refresh the cache
   */
  incrementCompletion(levelId: string): void {
    // The backend already saved the session via completeSession API
    // We just need to refresh our cache to get the updated count
    this.refreshCompletions().subscribe();
  }

  /**
   * Get all today's completions as Observable
   */
  getTodayCompletions(): Observable<{ [levelId: string]: number }> {
    return this.loadTodayCompletions().pipe(
      map(data => data.completions)
    );
  }

  /**
   * Get completions cache as Observable for reactive updates
   */
  getCompletionsObservable(): Observable<DailyCompletionsResponse | null> {
    return this.completionsCache$.asObservable();
  }
}

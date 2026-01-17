import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, map } from 'rxjs';
import { MathLevel } from '../models/math-level.model';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MathLevelService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = `${environment.apiUrl}/levels`;

  getLevels(subjectId: string = 'math'): Observable<MathLevel[]> {
    const userId = this.authService.getUserId();
    if (!userId) {
      console.warn('[MathLevelService] No user logged in');
      return of([]);
    }

    return this.http.get<MathLevel[]>(`${this.apiUrl}?subjectId=${subjectId}&userId=${userId}`).pipe(
      map(levels => levels.map(level => ({
        ...level,
        colorRgb: this.hexToRgb(level.color)
      }))),
      catchError(error => {
        console.error('Error loading math levels:', error);
        throw error;
      })
    );
  }

  private hexToRgb(hex: string): string {
    // Remove # if present
    hex = hex.replace('#', '');

    // Parse hex values
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    return `${r}, ${g}, ${b}`;
  }
}

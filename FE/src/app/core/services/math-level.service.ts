import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { MathLevel } from '../models/math-level.model';
import { AuthService } from './auth.service';
import { getLevelsBySubject } from '../mock-data/levels.mock';

@Injectable({
  providedIn: 'root'
})
export class MathLevelService {
  private authService = inject(AuthService);

  getLevels(subjectId: string = 'math'): Observable<MathLevel[]> {
    const userId = this.authService.getUserId();
    if (!userId) {
      console.warn('[MathLevelService] No user logged in');
      return of([]);
    }

    // Get mock levels
    const mockLevels = getLevelsBySubject(subjectId, userId);

    // Map to MathLevel format
    const levels: MathLevel[] = mockLevels.map(level => ({
      ...level,
      colorRgb: this.hexToRgb(level.color)
    }));

    // Return observable with simulated delay
    return of(levels).pipe(delay(300));
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

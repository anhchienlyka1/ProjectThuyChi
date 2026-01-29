import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MathLevel } from '../models/math-level.model';
import { AuthService } from './auth.service';
import { MOCK_MATH_LEVELS } from '../initial-data/levels.mock';

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

    // Filter mocks if needed (though structurally straightforward here)
    // The current mock has 'math-' ids but doesn't explicitly have subjectId property in type?
    // Let's assume we return all MOCK_MATH_LEVELS as they are specific to this service.

    return of(MOCK_MATH_LEVELS).pipe(
      map(levels => levels.map(level => {
        return {
          ...level,
          colorRgb: this.hexToRgb(level.color)
        };
      }))
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

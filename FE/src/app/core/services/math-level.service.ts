import { Injectable, inject } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { MathLevel } from '../models/math-level.model';
import { AuthService } from './auth.service';
import { FirebaseService } from './firebase.service';
import { collection, query, where, getDocs } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class MathLevelService {
  private authService = inject(AuthService);
  private firebaseService = inject(FirebaseService);

  getLevels(subjectId: string = 'math'): Observable<MathLevel[]> {
    const userId = this.authService.getUserId();
    if (!userId) {
      console.warn('[MathLevelService] No user logged in');
      return of([]);
    }

    const levelsRef = collection(this.firebaseService.firestore, 'levels');
    const q = query(levelsRef, where('subjectId', '==', subjectId));

    return from(getDocs(q)).pipe(
      map(snapshot => snapshot.docs.map(doc => {
        const data = doc.data() as MathLevel;
        return {
          ...data,
          colorRgb: this.hexToRgb(data.color)
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

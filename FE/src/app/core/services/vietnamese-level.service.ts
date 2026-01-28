import { Injectable, inject } from '@angular/core';
import { Observable, from, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { VietnameseLevel } from '../models/vietnamese-level.model';
import { AuthService } from './auth.service';
import { FirebaseService } from './firebase.service';
import { collection, query, where, getDocs } from 'firebase/firestore';

@Injectable({
    providedIn: 'root'
})
export class VietnameseLevelService {
    private authService = inject(AuthService);
    private firebaseService = inject(FirebaseService);

    getLevels(): Observable<VietnameseLevel[]> {
        const userId = this.authService.getUserId();
        if (!userId) {
            console.warn('[VietnameseLevelService] No user logged in');
            return of([]);
        }

        const levelsRef = collection(this.firebaseService.firestore, 'levels');
        const q = query(levelsRef, where('subjectId', '==', 'vietnamese'));

        return from(getDocs(q)).pipe(
            map(snapshot => snapshot.docs.map(doc => doc.data() as VietnameseLevel))
        );
    }
}

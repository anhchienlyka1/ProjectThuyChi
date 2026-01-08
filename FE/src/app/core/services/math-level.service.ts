import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { MathLevel } from '../models/math-level.model';

@Injectable({
    providedIn: 'root'
})
export class MathLevelService {
    private http = inject(HttpClient);
    private dataUrl = 'assets/mock-data/math-levels.json';

    getLevels(): Observable<MathLevel[]> {
        return this.http.get<MathLevel[]>(this.dataUrl).pipe(
            catchError(error => {
                console.error('Error loading math levels:', error);
                throw error;
            })
        );
    }
}

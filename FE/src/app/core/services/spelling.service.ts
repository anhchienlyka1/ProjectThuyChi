import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SpellingLevel {
    id?: number;
    word: string;
    image: string;
    parts: { text: string; missing: boolean }[];
    options: string[];
    hint: string;
}

@Injectable({
    providedIn: 'root'
})
export class SpellingService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/questions`;

    getLevels(): Observable<SpellingLevel[]> {
        return this.http.get<SpellingLevel[]>(`${this.apiUrl}?levelId=spelling`).pipe(
            catchError(error => {
                console.error('Error loading spelling levels:', error);
                throw error;
            })
        );
    }

    createLevel(level: SpellingLevel): Observable<any> {
        return this.http.post(this.apiUrl, {
            levelId: 'spelling',
            content: level,
            type: 'spelling'
        });
    }

    updateLevel(id: number, level: SpellingLevel): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, {
            content: level
        });
    }

    deleteLevel(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}

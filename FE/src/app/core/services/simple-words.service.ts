import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface WordLevel {
    id?: number;
    word: string;
    image: string;
    hint: string;
}

@Injectable({
    providedIn: 'root'
})
export class SimpleWordsService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/questions`;

    getLevels(): Observable<WordLevel[]> {
        return this.http.get<WordLevel[]>(`${this.apiUrl}?levelId=simple-words`).pipe(
            catchError(error => {
                console.error('Error loading simple words levels:', error);
                throw error;
            })
        );
    }

    createLevel(level: WordLevel): Observable<any> {
        return this.http.post(this.apiUrl, {
            levelId: 'simple-words',
            content: level,
            type: 'simple-words'
        });
    }

    updateLevel(id: number, level: WordLevel): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, {
            content: level
        });
    }

    deleteLevel(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`);
    }
}

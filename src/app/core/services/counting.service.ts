import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { NumberData } from '../models/number-data.model';

@Injectable({
    providedIn: 'root'
})
export class CountingService {
    private http = inject(HttpClient);
    private dataUrl = 'assets/mock-data/counting-numbers.json';

    getNumbers(): Observable<NumberData[]> {
        return this.http.get<NumberData[]>(this.dataUrl).pipe(
            catchError(error => {
                console.error('Error loading counting numbers:', error);
                throw error;
            })
        );
    }
}

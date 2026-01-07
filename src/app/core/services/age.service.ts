import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

import { AgeOption } from '../models/age.model';

@Injectable({
    providedIn: 'root'
})
export class AgeService {
    private http = inject(HttpClient);
    private dataUrl = 'assets/mock-data/ages.json';

    getAges(): Observable<AgeOption[]> {
        return this.http.get<AgeOption[]>(this.dataUrl).pipe(
            catchError(error => {
                console.error('Error loading ages:', error);
                throw error;
            })
        );
    }
}

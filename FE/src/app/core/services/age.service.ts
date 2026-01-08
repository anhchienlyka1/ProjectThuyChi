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

    // Store the selected age. Default can be null or a safe default.
    private _selectedAge = 3; // Defaulting to 3 for safety, or we can use 0/null to indicate no selection

    get selectedAge(): number {
        return this._selectedAge;
    }

    set selectedAge(age: number) {
        this._selectedAge = age;
    }

    getAges(): Observable<AgeOption[]> {
        return this.http.get<AgeOption[]>(this.dataUrl).pipe(
            catchError(error => {
                console.error('Error loading ages:', error);
                throw error;
            })
        );
    }
}

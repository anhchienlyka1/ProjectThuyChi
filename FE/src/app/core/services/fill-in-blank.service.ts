import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { FillInBlankConfig } from '../models/fill-in-blank-config.model';

@Injectable({
    providedIn: 'root'
})
export class FillInBlankService {
    private http = inject(HttpClient);
    private dataUrl = 'assets/mock-data/fill-in-blank-config.json';

    getConfig(): Observable<FillInBlankConfig> {
        return this.http.get<FillInBlankConfig>(this.dataUrl).pipe(
            catchError(error => {
                console.error('Error loading fill-in-blank config:', error);
                throw error;
            })
        );
    }
}

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { FillInBlankConfig } from '../models/fill-in-blank-config.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class FillInBlankService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/questions`;

    getConfig(): Observable<FillInBlankConfig> {
        return this.http.get<FillInBlankConfig>(`${this.apiUrl}?levelId=fill-in-blank`).pipe(
            catchError(error => {
                console.error('Error loading fill-in-blank config:', error);
                throw error;
            })
        );
    }
}

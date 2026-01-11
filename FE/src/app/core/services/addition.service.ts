import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { AdditionConfig } from '../models/addition-config.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class AdditionService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/questions`;

    getConfig(): Observable<AdditionConfig> {
        return this.http.get<AdditionConfig>(`${this.apiUrl}?levelId=addition`).pipe(
            catchError(error => {
                console.error('Error loading addition config:', error);
                throw error;
            })
        );
    }
}

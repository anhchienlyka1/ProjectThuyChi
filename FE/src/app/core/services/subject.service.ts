import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { SubjectCard } from '../models/subject.model';

@Injectable({
    providedIn: 'root'
})
export class SubjectService {
    private http = inject(HttpClient);
    private dataUrl = 'assets/mock-data/subjects.json';

    getSubjects(): Observable<SubjectCard[]> {
        return this.http.get<SubjectCard[]>(this.dataUrl).pipe(
            catchError(error => {
                console.error('Error loading subjects:', error);
                throw error;
            })
        );
    }
}

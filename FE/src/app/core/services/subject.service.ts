import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map } from 'rxjs';
import { SubjectCard } from '../models/subject.model';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class SubjectService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/subjects`;

    getSubjects(): Observable<SubjectCard[]> {
        return this.http.get<any[]>(this.apiUrl).pipe(
            map((subjects: any[]) => subjects.map((s: any) => ({
                id: s.id,
                title: s.title,
                icon: s.icon,
                color: s.themeConfig?.color,
                gradient: s.themeConfig?.gradient,
                route: '/' + s.id
            }))),
            catchError(error => {
                console.error('Error loading subjects:', error);
                throw error;
            })
        );
    }
}

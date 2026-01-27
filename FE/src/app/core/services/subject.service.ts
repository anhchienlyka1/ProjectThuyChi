import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { SubjectCard } from '../models/subject.model';
import { getMockSubjects } from '../mock-data/subjects.mock';

@Injectable({
    providedIn: 'root'
})
export class SubjectService {

    getSubjects(): Observable<SubjectCard[]> {
        // Simulate network delay
        return of(getMockSubjects()).pipe(delay(300));
    }
}

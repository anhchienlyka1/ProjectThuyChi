import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { SubjectCard } from '../models/subject.model';
import { FirebaseService } from './firebase.service';
import { collection, getDocs } from 'firebase/firestore';

@Injectable({
    providedIn: 'root'
})
export class SubjectService {
    private firebaseService = inject(FirebaseService);

    getSubjects(): Observable<SubjectCard[]> {
        const subjectsRef = collection(this.firebaseService.firestore, 'subjects');
        return from(getDocs(subjectsRef)).pipe(
            map(snapshot => snapshot.docs.map(doc => doc.data() as SubjectCard))
        );
    }
}

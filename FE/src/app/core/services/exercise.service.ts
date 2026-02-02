import { Injectable, inject } from '@angular/core';
import {
    collection,
    doc,
    addDoc,
    updateDoc,
    deleteDoc,
    getDocs,
    getDoc,
    query,
    where,
    orderBy,
    Timestamp,
    QueryConstraint
} from 'firebase/firestore';
import { Observable, from, map } from 'rxjs';
import { FirebaseService } from './firebase.service';
import { Exercise, ExerciseFilters, ExerciseStats, ExerciseType } from '../models/exercise.model';

import { MOCK_VIETNAMESE_EXERCISES } from '../initial-data/vietnamese-exercises.mock';

@Injectable({
    providedIn: 'root'
})
export class ExerciseService {
    // ...

    /**
     * Seed Vietnamese Data
     */
    async seedVietnameseExercises(): Promise<void> {
        console.log('Seeding Vietnamese exercises...');
        const promises = MOCK_VIETNAMESE_EXERCISES.map(exercise => {
            // Check if similar exercise exists (optional, simply add new ones for now)
            return this.createExercise(exercise).toPromise();
        });

        try {
            await Promise.all(promises);
            console.log('Seeding complete!');
        } catch (error) {
            console.error('Seeding failed:', error);
            throw error;
        }
    }
    private readonly COLLECTION_NAME = 'exercises';
    private firebaseService = inject(FirebaseService);

    constructor() { }

    /**
     * Tạo bài tập mới
     */
    createExercise(exercise: Omit<Exercise, 'id' | 'createdAt' | 'updatedAt'>): Observable<string> {
        const exerciseData = {
            ...exercise,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
        };

        return from(
            addDoc(
                collection(this.firebaseService.firestore, this.COLLECTION_NAME),
                exerciseData
            )
        ).pipe(
            map(docRef => docRef.id)
        );
    }

    /**
     * Cập nhật bài tập
     */
    updateExercise(id: string, exercise: Partial<Exercise>): Observable<void> {
        const exerciseData = {
            ...exercise,
            updatedAt: Timestamp.now()
        };

        const docRef = doc(this.firebaseService.firestore, this.COLLECTION_NAME, id);
        return from(updateDoc(docRef, exerciseData));
    }

    /**
     * Xóa bài tập
     */
    deleteExercise(id: string): Observable<void> {
        const docRef = doc(this.firebaseService.firestore, this.COLLECTION_NAME, id);
        return from(deleteDoc(docRef));
    }

    /**
     * Lấy một bài tập theo ID
     */
    getExerciseById(id: string): Observable<Exercise | null> {
        const docRef = doc(this.firebaseService.firestore, this.COLLECTION_NAME, id);
        return from(getDoc(docRef)).pipe(
            map(docSnap => {
                if (docSnap.exists()) {
                    return {
                        id: docSnap.id,
                        ...docSnap.data(),
                        createdAt: docSnap.data()['createdAt']?.toDate(),
                        updatedAt: docSnap.data()['updatedAt']?.toDate()
                    } as Exercise;
                }
                return null;
            })
        );
    }

    /**
     * Lấy danh sách bài tập với filters
     */
    getExercises(filters?: ExerciseFilters): Observable<Exercise[]> {
        const constraints: QueryConstraint[] = [];

        if (filters) {
            if (filters.type) {
                constraints.push(where('type', '==', filters.type));
            }
            if (filters.category) {
                constraints.push(where('category', '==', filters.category));
            }
            if (filters.difficulty) {
                constraints.push(where('difficulty', '==', filters.difficulty));
            }
            if (filters.status) {
                constraints.push(where('status', '==', filters.status));
            }
            if (filters.level) {
                constraints.push(where('level', '==', filters.level));
            }
            if (filters.tags && filters.tags.length > 0) {
                constraints.push(where('tags', 'array-contains-any', filters.tags));
            }
        }

        const q = query(
            collection(this.firebaseService.firestore, this.COLLECTION_NAME),
            ...constraints
        );

        return from(getDocs(q)).pipe(
            map(snapshot => {
                let exercises = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    createdAt: doc.data()['createdAt']?.toDate(),
                    updatedAt: doc.data()['updatedAt']?.toDate()
                } as Exercise));

                // Client-side sorting (Newest first) to avoid Firestore Index requirement
                exercises.sort((a, b) => {
                    const timeA = a.createdAt ? a.createdAt.getTime() : 0;
                    const timeB = b.createdAt ? b.createdAt.getTime() : 0;
                    return timeB - timeA;
                });

                // Client-side search nếu có searchQuery
                if (filters?.searchQuery) {
                    const query = filters.searchQuery.toLowerCase();
                    exercises = exercises.filter(ex =>
                        ex.title.toLowerCase().includes(query) ||
                        ex.description?.toLowerCase().includes(query) ||
                        ex.tags.some(tag => tag.toLowerCase().includes(query))
                    );
                }

                return exercises;
            })
        );
    }

    /**
     * Lấy thống kê bài tập
     */
    getExerciseStats(): Observable<ExerciseStats> {
        return this.getExercises().pipe(
            map(exercises => {
                const stats: ExerciseStats = {
                    totalExercises: exercises.length,
                    publishedExercises: exercises.filter(e => e.status === 'published').length,
                    draftExercises: exercises.filter(e => e.status === 'draft').length,
                    exercisesByType: {
                        '3-math': 0,
                        'fill-blank': 0,
                        'sorting': 0,
                        'find-even-odd': 0,
                        'comparison': 0,
                        'simple-words': 0,
                        'spelling': 0,
                        'fill-in-blank': 0,
                        'alphabet': 0,
                        'sentence-builder': 0
                    },
                    exercisesByDifficulty: {
                        'easy': 0,
                        'medium': 0,
                        'hard': 0
                    }
                };

                exercises.forEach(exercise => {
                    stats.exercisesByType[exercise.type]++;
                    stats.exercisesByDifficulty[exercise.difficulty]++;
                });

                return stats;
            })
        );
    }

    /**
     * Duplicate một bài tập
     */
    duplicateExercise(id: string): Observable<string> {
        return this.getExerciseById(id).pipe(
            map(exercise => {
                if (!exercise) {
                    throw new Error('Exercise not found');
                }

                const { id: _, createdAt, updatedAt, ...exerciseData } = exercise;
                return {
                    ...exerciseData,
                    title: `${exerciseData.title} (Copy)`,
                    status: 'draft' as const
                };
            }),
            map(exerciseData => this.createExercise(exerciseData)),
            map(obs => {
                let resultId = '';
                obs.subscribe(id => resultId = id);
                return resultId;
            })
        );
    }
    /**
     * Archive (unpublish) old exercises of a specific type
     * Used when publishing a new exercise to ensure only one is active
     */
    async archiveOldPublishedExercises(type: ExerciseType, excludeId?: string): Promise<void> {
        // Use direct query to avoid 'orderBy' from getExercises which requires composite index
        const q = query(
            collection(this.firebaseService.firestore, this.COLLECTION_NAME),
            where('type', '==', type),
            where('status', '==', 'published')
        );

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
            const batchPromises = snapshot.docs
                .filter(docSnap => docSnap.id !== excludeId)
                .map(docSnap => {
                    return this.updateExercise(docSnap.id, { status: 'draft' }).toPromise();
                });

            await Promise.all(batchPromises);
        }
    }
}

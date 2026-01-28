import { Injectable, inject } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { writeBatch, doc } from 'firebase/firestore';
import { MOCK_SUBJECTS } from '../initial-data/subjects.mock';
import { MOCK_MATH_LEVELS, MOCK_VIETNAMESE_LEVELS } from '../initial-data/levels.mock';
import { MOCK_ACHIEVEMENTS, MOCK_WEEKLY_ACHIEVEMENTS } from '../initial-data/achievements.mock';
import { MOCK_LEARNING_SESSIONS } from '../initial-data/learning-sessions.mock';

// Define MOCK_USERS locally since the file is missing/removed
const MOCK_USERS = [
    {
        id: '1',
        username: 'beminh',
        fullName: 'Bé Minh',
        email: 'beminh@example.com',
        role: 'student',
        avatarUrl: 'assets/avatars/boy-1.png',
        pinCode: '1234',
        gender: 'male',
        level: 4, // 1500 XP approx level 4
        xp: 1500,
        totalStars: 45
    },
    {
        id: '2',
        username: 'methuychi',
        fullName: 'Mẹ Thùy Chi',
        email: 'me@example.com',
        role: 'parent',
        avatarUrl: 'assets/avatars/mom.png',
        pinCode: '5678',
        gender: 'female'
    }
];

@Injectable({
    providedIn: 'root'
})
export class DataSeedingService {
    private firebaseService = inject(FirebaseService);

    async seedAllData() {
        console.log('Starting data seeding...');
        const batch = writeBatch(this.firebaseService.firestore);
        let opCount = 0;

        // 1. Subjects
        for (const subject of MOCK_SUBJECTS) {
            const ref = doc(this.firebaseService.firestore, 'subjects', subject.id);
            batch.set(ref, subject);
            opCount++;
        }

        // 2. Levels
        // Math
        for (const level of MOCK_MATH_LEVELS) {
            const levelData = { ...level, subjectId: 'math' };
            const ref = doc(this.firebaseService.firestore, 'levels', level.id);
            batch.set(ref, levelData);
            opCount++;
        }
        // Vietnamese
        for (const level of MOCK_VIETNAMESE_LEVELS) {
            const levelData = { ...level, subjectId: 'vietnamese' };
            const ref = doc(this.firebaseService.firestore, 'levels', level.id);
            batch.set(ref, levelData);
            opCount++;
        }

        // 3. Users
        for (const user of MOCK_USERS) {
            // @ts-ignore
            const ref = doc(this.firebaseService.firestore, 'users', user.id);
            batch.set(ref, user);
            opCount++;

            if (user.id === '1') {
                for (const ach of MOCK_ACHIEVEMENTS) {
                    // Keep Date -> Timestamp for Achievements as per Service expectation
                    const achRef = doc(this.firebaseService.firestore, 'users', user.id, 'achievements', ach.achievementId + '-' + ach.id);
                    batch.set(achRef, ach);
                    opCount++;
                }
                for (const weekly of MOCK_WEEKLY_ACHIEVEMENTS) {
                    const wRef = doc(this.firebaseService.firestore, 'users', user.id, 'weekly_achievements', weekly.id.toString());
                    batch.set(wRef, weekly);
                    opCount++;
                }
            }
        }

        // 4. Learning Sessions - MAP to Firestore Schema
        for (const session of MOCK_LEARNING_SESSIONS) {
            let subject = 'math';
            if (session.levelId.includes('vietnamese')) subject = 'vietnamese';

            // Map to Firestore schema (convert Dates to Strings/ISO as per LearningSessionService pattern)
            const firestoreSession = {
                userId: session.userId,
                levelId: session.levelId,
                subject,
                moduleType: 'mixed',
                score: session.accuracyPercentage, // Firestore score is Accuracy
                totalQuestions: session.totalQuestions,
                correctAnswers: session.score, // Mock score is correct answers
                duration: session.durationSeconds,
                xpEarned: session.score * 10,
                starsEarned: session.stars,
                date: session.completedAt instanceof Date ? session.completedAt.toISOString().split('T')[0] : '2026-01-01',
                completedAt: session.completedAt instanceof Date ? session.completedAt.toISOString() : new Date().toISOString()
            };

            const ref = doc(this.firebaseService.firestore, 'learning_sessions', session.sessionId.toString());
            batch.set(ref, firestoreSession);
            opCount++;
        }

        // Commit
        try {
            await batch.commit();
            console.log('Seeding completed successfully!');
            alert('Data migration to Firebase successful! You can now verify the data in Firestore.');
        } catch (error) {
            console.error('Seeding failed:', error);
            alert('Seeding failed. Check console.');
        }
    }
}

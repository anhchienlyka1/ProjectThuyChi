import { Injectable, inject } from '@angular/core';
import { FirebaseService } from './firebase.service';
import { doc, getDoc, collection, query, where, getDocs, Timestamp, orderBy, limit as firestoreLimit } from 'firebase/firestore';

export interface StudentProfileResponse {
    student: {
        id: string;
        name: string;
        avatar: string;
        level: number;
        totalStars: number;
        xp: {
            current: number;
            currentLevelProgress: number;
            xpNeededForNextLevel: number;
            percentage: number;
        };
    };
    todayStats: {
        lessonsCompleted: number;
        correctAnswers: number;
        minutesLearned: number;
    };
}

export interface Achievement {
    id: number;
    achievementId: string;
    title: string;
    description: string;
    icon: string;
    rarity: string;
    earnedAt: Date;
    earnedContext?: any;
    points?: number;
}

export interface WeeklyAchievement {
    id: number;
    title: string;
    description: string;
    icon: string;
    earnedAt: Date;
    weekNumber: number;
}

@Injectable({
    providedIn: 'root'
})
export class StudentProfileService {
    private firebaseService = inject(FirebaseService);

    /**
     * Get student profile overview - Using Firebase Firestore
     */
    async getStudentProfile(userId: string): Promise<StudentProfileResponse> {
        try {
            // 1. Get User Data from 'users' collection
            const userDocRef = doc(this.firebaseService.firestore, 'users', userId);
            const userSnapshot = await getDoc(userDocRef);

            if (!userSnapshot.exists()) {
                throw new Error('User not found in Firebase');
            }

            const userData = userSnapshot.data() as any;

            // Calculate XP progression
            const xp = userData.xp || 0;
            const xpPerLevel = 500;
            const currentLevelProgress = xp % xpPerLevel;
            const xpNeededForNextLevel = xpPerLevel;
            const percentage = Math.round((currentLevelProgress / xpNeededForNextLevel) * 100);

            // 2. Get Today's Stats from 'learning_sessions' collection
            const todayStats = await this.getTodayStatsFromFirebase(userId);

            return {
                student: {
                    id: userId,
                    name: userData.fullName || userData.username || 'Bé Yêu',
                    avatar: userData.avatarUrl || 'assets/avatars/default.png',
                    level: userData.level || 1,
                    totalStars: userData.totalStars || 0,
                    xp: {
                        current: xp,
                        currentLevelProgress,
                        xpNeededForNextLevel,
                        percentage
                    }
                },
                todayStats
            };
        } catch (error) {
            console.error('Error fetching student profile from Firebase:', error);
            throw error;
        }
    }

    private async getTodayStatsFromFirebase(userId: string) {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const todayTimestamp = Timestamp.fromDate(today);

            const sessionsRef = collection(this.firebaseService.firestore, 'learning_sessions');
            const q = query(
                sessionsRef,
                where('userId', '==', userId),
                where('completedAt', '>=', todayTimestamp)
            );

            const querySnapshot = await getDocs(q);
            let lessonsCompleted = 0;
            let correctAnswers = 0;
            let totalDurationSeconds = 0;

            querySnapshot.forEach((doc) => {
                const session = doc.data();
                lessonsCompleted++;
                correctAnswers += (session['score'] || 0);
                totalDurationSeconds += (session['durationSeconds'] || 0);
            });

            return {
                lessonsCompleted,
                correctAnswers,
                minutesLearned: Math.round(totalDurationSeconds / 60)
            };
        } catch (error) {
            console.warn('Error fetching today stats (might need index):', error);
            // Fallback object if query fails (e.g., missing index)
            return {
                lessonsCompleted: 0,
                correctAnswers: 0,
                minutesLearned: 0
            };
        }
    }

    /**
     * Get student's achievements (Phiếu Bé Ngoan) - Using Firestore
     */
    async getStudentAchievements(userId: string, page: number = 1, limitCount: number = 10): Promise<{ data: Achievement[], meta: any }> {
        try {
            const achievementsRef = collection(this.firebaseService.firestore, 'users', userId, 'achievements');
            const q = query(
                achievementsRef,
                orderBy('earnedAt', 'desc'),
                firestoreLimit(limitCount * page)
            );

            const querySnapshot = await getDocs(q);
            const allDocs = querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: data['id'] || 0,
                    achievementId: doc.id,
                    title: data['title'] || '',
                    description: data['description'] || '',
                    icon: data['icon'] || '🏆',
                    rarity: data['rarity'] || 'common',
                    earnedAt: data['earnedAt'] ? (data['earnedAt'] as Timestamp).toDate() : new Date(),
                    earnedContext: data['earnedContext'],
                    points: data['points'] || 0
                } as Achievement;
            });

            // Client-side pagination slice
            const start = (page - 1) * limitCount;
            const end = start + limitCount;
            const pagedDocs = allDocs.slice(start, end);

            return {
                data: pagedDocs,
                meta: {
                    page,
                    limit: limitCount,
                    total: allDocs.length,
                    totalPages: Math.ceil(allDocs.length / limitCount)
                }
            };
        } catch (error) {
            console.error('Error fetching achievements:', error);
            return { data: [], meta: { page, limit: limitCount, total: 0, totalPages: 0 } };
        }
    }

    /**
     * Get weekly achievements - Using Firestore
     */
    async getWeeklyAchievements(userId: string): Promise<WeeklyAchievement[]> {
        try {
            const weeklyRef = collection(this.firebaseService.firestore, 'users', userId, 'weekly_achievements');
            const q = query(weeklyRef, orderBy('earnedAt', 'desc'), firestoreLimit(5));

            const querySnapshot = await getDocs(q);
            return querySnapshot.docs.map(doc => {
                const data = doc.data();
                return {
                    id: data['id'] || 0,
                    title: data['title'] || '',
                    description: data['description'] || '',
                    icon: data['icon'] || '📅',
                    earnedAt: data['earnedAt'] ? (data['earnedAt'] as Timestamp).toDate() : new Date(),
                    weekNumber: data['weekNumber'] || 0
                } as WeeklyAchievement;
            });
        } catch (error) {
            console.warn('Error fetching weekly achievements:', error);
            return [];
        }
    }
}

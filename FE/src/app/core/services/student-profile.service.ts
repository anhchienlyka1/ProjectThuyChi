import { Injectable, inject } from '@angular/core';
import { getUserById } from '../mock-data/users.mock';
import { getAchievementsByUserId, getWeeklyAchievementsByUserId } from '../mock-data/achievements.mock';
import { getTodayStats } from '../mock-data/learning-sessions.mock';

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
    /**
     * Get student profile overview - Using Mock Data
     */
    async getStudentProfile(userId: string): Promise<StudentProfileResponse> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));

        const user = getUserById(userId);
        if (!user) {
            throw new Error('User not found');
        }

        // Calculate XP progression
        const xpPerLevel = 500;
        const currentLevelProgress = user.xp % xpPerLevel;
        const xpNeededForNextLevel = xpPerLevel;
        const percentage = Math.round((currentLevelProgress / xpNeededForNextLevel) * 100);

        // Get today's stats
        const todayStats = getTodayStats(userId);

        return {
            student: {
                id: user.id,
                name: user.fullName,
                avatar: user.avatarUrl || 'assets/avatars/default.png',
                level: user.level,
                totalStars: user.totalStars,
                xp: {
                    current: user.xp,
                    currentLevelProgress,
                    xpNeededForNextLevel,
                    percentage
                }
            },
            todayStats
        };
    }

    /**
   * Get student's achievements (Phiếu Bé Ngoan) - Using Mock Data
   */
    async getStudentAchievements(userId: string, page: number = 1, limit: number = 10): Promise<{ data: Achievement[], meta: any }> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));

        return getAchievementsByUserId(userId, page, limit);
    }

    /**
     * Get weekly achievements - Using Mock Data
     */
    async getWeeklyAchievements(userId: string): Promise<WeeklyAchievement[]> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 300));

        return getWeeklyAchievementsByUserId(userId);
    }
}

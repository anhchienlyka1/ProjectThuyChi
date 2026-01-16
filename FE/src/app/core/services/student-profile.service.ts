import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

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
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/student-profile`;

    /**
     * Get student profile overview
     */
    async getStudentProfile(userId: string): Promise<StudentProfileResponse> {
        return firstValueFrom(
            this.http.get<StudentProfileResponse>(`${this.apiUrl}/${userId}`)
        );
    }

    /**
   * Get student's achievements (Phiếu Bé Ngoan)
   */
    async getStudentAchievements(userId: string, limit?: number): Promise<Achievement[]> {
        let url = `${this.apiUrl}/${userId}/achievements`;
        if (limit) {
            url += `?limit=${limit}`;
        }
        return firstValueFrom(
            this.http.get<Achievement[]>(url)
        );
    }

    /**
     * Get weekly achievements
     */
    async getWeeklyAchievements(userId: string): Promise<WeeklyAchievement[]> {
        return firstValueFrom(
            this.http.get<WeeklyAchievement[]>(`${this.apiUrl}/${userId}/weekly-achievements`)
        );
    }
}

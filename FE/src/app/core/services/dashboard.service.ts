import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private http = inject(HttpClient);
    private API_URL = environment.apiUrl;

    async getRecentHistory(childId: string): Promise<any[]> {
        return firstValueFrom(
            this.http.get<any[]>(`${this.API_URL}/dashboard/history?userId=${childId}`)
        );
    }

    async getCertificates(userId: string, options?: { limit?: number; offset?: number }): Promise<CertificatesResponse> {
        const params = new URLSearchParams({ userId });

        if (options?.limit) {
            params.append('limit', options.limit.toString());
        }

        if (options?.offset) {
            params.append('offset', options.offset.toString());
        }

        return firstValueFrom(
            this.http.get<CertificatesResponse>(`${this.API_URL}/dashboard/certificates?${params}`)
        );
    }

    async getSubjectAchievements(childId: string): Promise<SubjectAchievementsResponse> {
        return firstValueFrom(
            this.http.get<SubjectAchievementsResponse>(`${this.API_URL}/dashboard/subject-achievements?childId=${childId}`)
        );
    }

    async getDailyActivities(childId: string, timeRange: 'week' | 'month' | 'year' = 'week'): Promise<DailyActivitiesResponse> {
        return firstValueFrom(
            this.http.get<DailyActivitiesResponse>(`${this.API_URL}/dashboard/daily-activities?childId=${childId}&timeRange=${timeRange}`)
        );
    }
}


export interface Certificate {
    id: number;
    achievementId: string;
    title: string;
    description: string;
    icon: string;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
    earnedAt: Date;
    weekNumber: number;
    isUnlocked: boolean;
    earnedContext?: any;
}

export interface CertificatesResponse {
    certificates: Certificate[];
    total: number;
    hasMore: boolean;
}

export interface SubjectAchievement {
    subjectId: string;
    subjectName: string;
    icon: string;
    completedLessons: number;
    totalLevels: number;
    totalTimeMinutes: number;
    avgScore: number;
    strengths: string[];
    needsImprovement: string[];
    colors: {
        bgGradient: string;
        headerGradient: string;
        textColor: string;
    };
}

export interface SubjectAchievementsResponse {
    subjectAchievements: SubjectAchievement[];
}

export interface DailyActivity {
    date: string;
    totalMinutes: number;
    lessonsCompleted: number;
    averageScore: number;
}

export interface DailyActivitiesResponse {
    activities: DailyActivity[];
    summary: {
        totalMinutes: number;
        totalLessons: number;
        averageScore: number;
        streak: number;
        improvement: number;
    };
    timeRange: 'week' | 'month' | 'year';
    groupBy: 'day' | 'week' | 'month';
}


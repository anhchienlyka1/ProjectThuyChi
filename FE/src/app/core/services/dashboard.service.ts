import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

export interface ParentOverviewResponse {
    dailySummary: {
        minutesLearned: number;
        lessonsCompleted: number;
        avgScore: number;
    };
    weeklyStats: {
        totalTime: { value: string; trend: string };
        lessonsCompleted: { value: number; trend: string };
        avgScore: { value: string; trend: string };
        badges: { value: number; newThisWeek: number };
    };
    subjectProgress: Array<{
        subjectId: string;
        subjectName: string;
        totalLevels: number;
        completedLevels: number;
        percentage: number;
        color: string;
    }>;
}

@Injectable({
    providedIn: 'root'
})
export class DashboardService {
    private http = inject(HttpClient);
    private API_URL = environment.apiUrl;

    async getParentOverview(childId: string): Promise<ParentOverviewResponse> {
        return firstValueFrom(
            this.http.get<ParentOverviewResponse>(`${this.API_URL}/dashboard/parent-overview?childId=${childId}`)
        );
    }

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

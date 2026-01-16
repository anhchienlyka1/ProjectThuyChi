import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from '../../application/services/dashboard.service';

@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    @Get('overview')
    async getOverview(@Query('userId') userId: string) {
        // TODO: Get userId from JWT token in future. For now, accept query param or default to demo user.
        if (!userId) {
            // Fallback to fetch first user or error
            // For development convenience, we might want to allow passing nothing and use a default demo user ID logic if possible,
            // but it's cleaner to require it from client for now.
            // Or we can find the user by email 'demo@thuychi.com' here if not provided?
            // Let's implement a simple fallback logic in Service or just throw error.
            // User should provide userId.
        }
        return this.dashboardService.getOverview(userId);
    }

    @Get('parent-overview')
    async getParentOverview(@Query('childId') childId: string) {
        if (!childId) {
            throw new Error('childId is required');
        }
        return this.dashboardService.getParentOverview(childId);
    }

    @Get('history')
    async getHistory(@Query('userId') userId: string) {
        return this.dashboardService.getRecentHistory(userId);
    }

    @Get('progress')
    async getProgress(@Query('userId') userId: string) {
        return this.dashboardService.getProgress(userId);
    }

    @Get('achievements')
    async getAchievements(@Query('userId') userId: string) {
        return this.dashboardService.getAchievements(userId);
    }

    /**
     * GET /dashboard/certificates
     * Get certificates (Phiếu Bé Ngoan) for a student
     * Query params:
     * - userId: string (required)
     * - limit: number (optional) - number of certificates to return
     * - offset: number (optional) - pagination offset
     */
    @Get('certificates')
    async getCertificates(
        @Query('userId') userId: string,
        @Query('limit') limit?: number,
        @Query('offset') offset?: number
    ) {
        if (!userId) {
            throw new Error('userId is required');
        }
        return this.dashboardService.getCertificates(userId, {
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined
        });
    }
}

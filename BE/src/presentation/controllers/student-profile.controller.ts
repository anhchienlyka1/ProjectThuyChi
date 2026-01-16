import { Controller, Get, Param, Query } from '@nestjs/common';
import { StudentProfileService } from '../../application/services/student-profile.service';

@Controller('student-profile')
export class StudentProfileController {
    constructor(
        private readonly studentProfileService: StudentProfileService
    ) { }

    /**
     * GET /student-profile/:userId
     * Get student profile overview (for parent dashboard "Hồ Sơ Của Bé" section)
     * 
     * Response:
     * {
     *   student: {
     *     id: string,
     *     name: string,
     *     avatar: string,
     *     level: number,
     *     totalStars: number,
     *     xp: {
     *       current: number,
     *       currentLevelProgress: number,
     *       xpNeededForNextLevel: number,
     *       percentage: number
     *     }
     *   },
     *   todayStats: {
     *     lessonsCompleted: number,
     *     correctAnswers: number,
     *     minutesLearned: number
     *   }
     * }
     */
    @Get(':userId')
    async getStudentProfile(@Param('userId') userId: string) {
        return this.studentProfileService.getStudentProfile(userId);
    }

    /**
     * GET /student-profile/:userId/achievements
     * Get student's achievements (Phiếu Bé Ngoan)
     * 
     * Query params:
     * - limit: number (optional) - limit number of achievements returned
     * 
     * Response:
     * [
     *   {
     *     id: number,
     *     achievementId: string,
     *     title: string,
     *     description: string,
     *     icon: string,
     *     rarity: string,
     *     earnedAt: Date,
     *     earnedContext: any
     *   }
     * ]
     */
    @Get(':userId/achievements')
    async getStudentAchievements(
        @Param('userId') userId: string,
        @Query('limit') limit?: number
    ) {
        return this.studentProfileService.getStudentAchievements(userId, limit);
    }

    /**
     * GET /student-profile/:userId/weekly-achievements
     * Get weekly achievements (Phiếu Bé Ngoan Tuần)
     * 
     * Response:
     * [
     *   {
     *     id: number,
     *     title: string,
     *     description: string,
     *     icon: string,
     *     earnedAt: Date,
     *     weekNumber: number
     *   }
     * ]
     */
    @Get(':userId/weekly-achievements')
    async getWeeklyAchievements(@Param('userId') userId: string) {
        return this.studentProfileService.getWeeklyAchievements(userId);
    }
}

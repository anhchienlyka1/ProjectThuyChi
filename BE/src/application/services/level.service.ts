import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LevelSchema } from '../../infrastructure/database/schemas/level.schema';
import { UserProgressSchema } from '../../infrastructure/database/schemas/user-progress.schema';
import { UserSchema } from '../../infrastructure/database/schemas/user.schema';

@Injectable()
export class LevelService {
    constructor(
        @InjectRepository(LevelSchema)
        private levelRepo: Repository<LevelSchema>,
        @InjectRepository(UserProgressSchema)
        private progressRepo: Repository<UserProgressSchema>,
        @InjectRepository(UserSchema)
        private userRepo: Repository<UserSchema>,
    ) { }

    async findBySubject(subjectId: string, userIdInput?: string) {
        const userId = userIdInput;

        const levels = await this.levelRepo.find({
            where: { subjectId, isDeleted: false },

            order: { levelNumber: 'ASC' }
        });

        let progress: any[] = [];
        if (userId) {
            progress = await this.progressRepo.find({ where: { userId, isDeleted: false } });
        }


        // Logic tính toán trạng thái Locked/Unlocked
        return levels.map((level, index) => {
            const userLevelProgress = progress.find(p => p.levelId === level.id);

            // Logic Unlock:
            // 1. Level đầu tiên luôn mở
            // 2. Level này là Free (isFree = true)
            // 3. Level này đã có progress (đã từng chơi)
            // 4. Level trước đó đã hoàn thành (status = COMPLETED)

            let isLocked = true;
            if (index === 0) isLocked = false;
            else if (level.isFree) isLocked = false;
            else if (userLevelProgress) isLocked = false;
            else {
                // Check level trước
                const prevLevel = levels[index - 1];
                const prevProgress = progress.find(p => p.levelId === prevLevel.id);
                if (prevProgress && prevProgress.status === 'COMPLETED') {
                    isLocked = false;
                }
            }

            // Nếu không có userId (không tìm thấy demo user), lock tất cả trừ level 1
            if (!userId && index > 0) isLocked = true;

            return {
                id: level.id,
                levelNumber: level.levelNumber,
                title: level.title,
                subtitle: level.subtitle,
                icon: level.icon,
                color: level.uiConfig?.color,
                gradient: level.uiConfig?.gradient,
                route: level.route,
                isLocked: isLocked,
                stars: userLevelProgress ? userLevelProgress.stars : 0
            };
        });
    }
}

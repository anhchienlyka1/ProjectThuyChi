import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubjectController } from '../presentation/controllers/subject.controller';
import { SubjectService } from '../application/services/subject.service';
import { SubjectSchema } from '../infrastructure/database/schemas/subject.schema';

@Module({
    imports: [TypeOrmModule.forFeature([SubjectSchema])],
    controllers: [SubjectController],
    providers: [SubjectService],
})
export class SubjectModule { }

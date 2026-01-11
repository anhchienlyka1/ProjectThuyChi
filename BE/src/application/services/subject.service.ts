import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubjectSchema } from '../../infrastructure/database/schemas/subject.schema';

@Injectable()
export class SubjectService {
    constructor(
        @InjectRepository(SubjectSchema)
        private subjectRepo: Repository<SubjectSchema>,
    ) { }

    async findAll() {
        return this.subjectRepo.find({
            where: { active: true, isDeleted: false },

            order: { sortOrder: 'ASC' }
        });
    }
}

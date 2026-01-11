import { Controller, Get } from '@nestjs/common';
import { SubjectService } from '../../application/services/subject.service';

@Controller('subjects')
export class SubjectController {
    constructor(private readonly subjectService: SubjectService) { }

    @Get()
    async getSubjects() {
        return this.subjectService.findAll();
    }
}

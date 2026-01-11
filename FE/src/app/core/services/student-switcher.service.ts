import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, firstValueFrom } from 'rxjs';

export interface Student {
    id: string;
    name: string;
    email: string;
    gender?: string;
    avatarUrl?: string;
}

@Injectable({
    providedIn: 'root'
})
export class StudentSwitcherService {
    private readonly API_URL = 'http://localhost:3000/users';

    // Signal để lưu danh sách học sinh
    private studentsSignal = signal<Student[]>([]);

    // Signal để lưu học sinh hiện tại được chọn
    private selectedStudentSignal = signal<Student | null>(null);

    // Computed signals để expose ra ngoài
    students = computed(() => this.studentsSignal());
    selectedStudent = computed(() => this.selectedStudentSignal());

    constructor(private http: HttpClient) {
        // Load selected student from localStorage if exists
        const savedStudentId = localStorage.getItem('selectedStudentId');
        if (savedStudentId) {
            // Will be set after loading students
        }
    }

    /**
     * Load danh sách học sinh của phụ huynh
     */
    async loadStudents(parentId: string): Promise<void> {
        try {
            const students = await firstValueFrom(
                this.http.get<Student[]>(`${this.API_URL}/${parentId}/children`)
            );

            this.studentsSignal.set(students);

            // Nếu chưa có student nào được chọn, chọn student đầu tiên
            if (!this.selectedStudentSignal() && students.length > 0) {
                const savedStudentId = localStorage.getItem('selectedStudentId');
                const savedStudent = students.find(s => s.id === savedStudentId);
                this.selectStudent(savedStudent || students[0]);
            }
        } catch (error) {
            console.error('Error loading students:', error);
            this.studentsSignal.set([]);
        }
    }

    /**
     * Chọn một học sinh
     */
    selectStudent(student: Student): void {
        this.selectedStudentSignal.set(student);
        localStorage.setItem('selectedStudentId', student.id);

        // Emit event để các components khác biết student đã thay đổi
        window.dispatchEvent(new CustomEvent('studentChanged', { detail: student }));
    }

    /**
     * Get selected student ID
     */
    getSelectedStudentId(): string | null {
        return this.selectedStudentSignal()?.id || null;
    }

    /**
     * Clear selection
     */
    clearSelection(): void {
        this.selectedStudentSignal.set(null);
        localStorage.removeItem('selectedStudentId');
    }
}

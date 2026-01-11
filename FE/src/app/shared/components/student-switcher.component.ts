import { Component, computed, inject, HostListener, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentSwitcherService, Student } from '../../core/services/student-switcher.service';

@Component({
  selector: 'app-student-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="student-switcher-compact">
      @if (students().length > 1) {
        <div class="switcher-relative">
          <button
            class="switcher-trigger"
            (click)="toggleDropdown()"
            [class.active]="isDropdownOpen">
            <div class="trigger-content">
              <div class="mini-avatar-wrapper">
                <div class="mini-avatar">
                  @if (selectedStudent()?.avatarUrl) {
                    <img [src]="selectedStudent()!.avatarUrl" [alt]="selectedStudent()!.name">
                  } @else {
                    <div class="mini-avatar-placeholder">
                      {{ getInitials(selectedStudent()?.name || '') }}
                    </div>
                  }
                </div>
              </div>
              <div class="trigger-text">
                <span class="label">Tiến độ của:</span>
                <span class="name">{{ selectedStudent()?.name }}</span>
              </div>
              <svg class="chevron" width="14" height="14" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
          </button>

          @if (isDropdownOpen) {
            <div class="switcher-dropdown">
              <div class="dropdown-header">Chọn con của bạn</div>
              @for (student of students(); track student.id) {
                <button
                  class="dropdown-item"
                  [class.selected]="student.id === selectedStudent()?.id"
                  (click)="selectStudent(student)">
                  <div class="item-avatar-wrapper">
                    <div class="item-avatar">
                      @if (student.avatarUrl) {
                        <img [src]="student.avatarUrl" [alt]="student.name">
                      } @else {
                        <div class="item-avatar-placeholder">
                          {{ getInitials(student.name) }}
                        </div>
                      }
                    </div>
                  </div>
                  <span class="item-name">{{ student.name }}</span>
                  @if (student.id === selectedStudent()?.id) {
                    <div class="check-badge">
                      <svg width="12" height="12" viewBox="0 0 20 20" fill="currentColor">
                        <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                      </svg>
                    </div>
                  }
                </button>
              }
            </div>
          }
        </div>
      } @else if (selectedStudent()) {
        <div class="single-student-fixed">
          <div class="mini-avatar-wrapper">
            <div class="mini-avatar">
              @if (selectedStudent()?.avatarUrl) {
                <img [src]="selectedStudent()!.avatarUrl" [alt]="selectedStudent()!.name">
              } @else {
                <div class="mini-avatar-placeholder">
                  {{ getInitials(selectedStudent()?.name || '') }}
                </div>
              }
            </div>
          </div>
          <div class="trigger-text">
            <span class="label">Tiến độ của:</span>
            <span class="name">{{ selectedStudent()?.name }}</span>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    .student-switcher-compact {
      display: inline-block;
      font-family: 'Nunito', sans-serif;
    }

    .switcher-relative {
      position: relative;
    }

    .switcher-trigger {
      background: white;
      border: 1.5px solid #E9D5FF;
      padding: 6px 14px 6px 6px;
      border-radius: 99px;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 2px 10px rgba(168, 85, 247, 0.05);
      display: flex;
      align-items: center;
    }

    .switcher-trigger:hover {
      border-color: #A855F7;
      transform: translateY(-1px);
      box-shadow: 0 10px 20px -5px rgba(168, 85, 247, 0.15);
      background: #FAF5FF;
    }

    .switcher-trigger.active {
      border-color: #A855F7;
      background: white;
      box-shadow: 0 0 0 3px rgba(168, 85, 247, 0.1);
    }

    .trigger-content {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .mini-avatar-wrapper {
      position: relative;
      padding: 2px;
      background: linear-gradient(135deg, #A855F7, #EC4899);
      border-radius: 50%;
      flex-shrink: 0;
    }

    .mini-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      overflow: hidden;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid white;
    }

    .mini-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .mini-avatar-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 800;
      color: #7E22CE;
      background: #F3E8FF;
    }

    .trigger-text {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      line-height: 1.2;
    }

    .trigger-text .label {
      font-size: 8px;
      font-weight: 700;
      color: #A1A1AA;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .trigger-text .name {
      font-size: 14px;
      font-weight: 700;
      color: #374151;
      max-width: 120px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .chevron {
      color: #A855F7;
      transition: transform 0.3s ease;
      margin-left: 4px;
    }

    .active .chevron {
      transform: rotate(180deg);
    }

    .switcher-dropdown {
      position: absolute;
      top: calc(100% + 12px);
      left: 0;
      width: 260px;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(20px);
      border-radius: 20px;
      box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05);
      border: 1px solid white;
      padding: 12px;
      z-index: 100;
      transform-origin: top left;
      animation: dropdownShow 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards;
    }

    @keyframes dropdownShow {
      from { opacity: 0; transform: scale(0.9) translateY(-10px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }

    .dropdown-header {
      padding: 0 12px 10px 12px;
      font-size: 10px;
      font-weight: 800;
      color: #94A3B8;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      border-bottom: 1px solid #F1F5F9;
      margin-bottom: 8px;
    }

    .dropdown-item {
      width: 100%;
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px;
      border-radius: 14px;
      border: 1.5px solid transparent;
      background: transparent;
      cursor: pointer;
      transition: all 0.2s ease;
      text-align: left;
      margin-bottom: 4px;
    }

    .dropdown-item:last-child {
      margin-bottom: 0;
    }

    .dropdown-item:hover {
      background: white;
      border-color: #F1F5F9;
      transform: translateX(4px);
      box-shadow: 0 4px 12px rgba(0,0,0,0.03);
    }

    .dropdown-item.selected {
      background: linear-gradient(to right, #FAF5FF, white);
      border-color: #E9D5FF;
    }

    .item-avatar-wrapper {
      padding: 2px;
      background: #F1F5F9;
      border-radius: 50%;
      flex-shrink: 0;
      transition: background 0.2s;
    }

    .dropdown-item.selected .item-avatar-wrapper {
      background: linear-gradient(135deg, #A855F7, #EC4899);
    }

    .item-avatar {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      overflow: hidden;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1.5px solid white;
    }

    .item-name {
      flex: 1;
      font-size: 15px;
      font-weight: 700;
      color: #475569;
      transition: color 0.2s;
    }

    .dropdown-item.selected .item-name {
      color: #7E22CE;
    }

    .check-badge {
      width: 22px;
      height: 22px;
      background: #A855F7;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 4px 10px rgba(168, 85, 247, 0.3);
    }

    .single-student-fixed {
      display: flex;
      align-items: center;
      gap: 12px;
      background: white;
      padding: 6px 16px 6px 6px;
      border-radius: 99px;
      border: 1.5px solid #E9D5FF;
      box-shadow: 0 2px 10px rgba(168, 85, 247, 0.05);
    }
  `]
})
export class StudentSwitcherComponent {
  private studentSwitcherService = inject(StudentSwitcherService);
  private elementRef = inject(ElementRef);

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.isDropdownOpen = false;
    }
  }

  students = this.studentSwitcherService.students;
  selectedStudent = this.studentSwitcherService.selectedStudent;
  isDropdownOpen = false;

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  selectStudent(student: Student) {
    this.studentSwitcherService.selectStudent(student);
    this.isDropdownOpen = false;
  }

  getInitials(name: string): string {
    if (!name) return '?';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}

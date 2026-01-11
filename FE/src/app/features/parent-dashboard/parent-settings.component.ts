import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface SettingOption {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'toggle' | 'select' | 'time' | 'navigation';
  value?: boolean | string;
  options?: string[];
}

interface SettingSection {
  title: string;
  icon: string;
  color: string;
  settings: SettingOption[];
}

@Component({
  selector: 'app-parent-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="parent-settings">
      <!-- Header -->
      <div class="settings-header">
        <button class="back-button" (click)="goBack()">
          <span class="back-icon">←</span>
          <span>Quay lại</span>
        </button>
        <h1 class="settings-title">
          <span class="title-icon">⚙️</span>
          Cài Đặt
        </h1>
        <p class="settings-subtitle">Quản lý tài khoản và tùy chọn học tập</p>
      </div>

      <!-- Settings Sections - 2 sections per row -->
      <div class="settings-container">
        @for (section of settingSections(); track section.title) {
          <div class="settings-section" [style.--section-color]="section.color">
            <div class="section-header">
              <span class="section-icon">{{ section.icon }}</span>
              <h2 class="section-title">{{ section.title }}</h2>
            </div>

            <div class="settings-list">
              @for (setting of section.settings; track setting.id) {
                <div class="setting-item" [class.clickable]="setting.type === 'navigation'">
                  <div class="setting-info">
                    <div class="setting-icon">{{ setting.icon }}</div>
                    <div class="setting-text">
                      <h3 class="setting-title">{{ setting.title }}</h3>
                      <p class="setting-description">{{ setting.description }}</p>
                    </div>
                  </div>

                  <div class="setting-control">
                    @if (setting.type === 'toggle') {
                      <label class="toggle-switch">
                        <input
                          type="checkbox"
                          [checked]="setting.value"
                          (change)="toggleSetting(setting.id)"
                        >
                        <span class="toggle-slider"></span>
                      </label>
                    }
                    @if (setting.type === 'select') {
                      <select
                        class="setting-select"
                        [value]="setting.value"
                        (change)="updateSetting(setting.id, $event)"
                      >
                        @for (option of setting.options; track option) {
                          <option [value]="option">{{ option }}</option>
                        }
                      </select>
                    }
                    @if (setting.type === 'time') {
                      <input
                        type="time"
                        class="setting-time"
                        [value]="setting.value"
                        (change)="updateSetting(setting.id, $event)"
                      >
                    }
                    @if (setting.type === 'navigation') {
                      <button class="nav-button" (click)="navigateTo(setting.id)">
                        <span>→</span>
                      </button>
                    }
                  </div>
                </div>
              }
            </div>
          </div>
        }
      </div>

      <!-- Save Button -->
      <div class="save-section">
        <button class="save-button" (click)="saveSettings()">
          <span class="save-icon">💾</span>
          <span>Lưu Thay Đổi</span>
        </button>
      </div>

      <!-- Floating Decorations -->
      <div class="floating-decoration gear-1">⚙️</div>
      <div class="floating-decoration gear-2">🔧</div>
      <div class="floating-decoration star-1">⭐</div>
      <div class="floating-decoration star-2">✨</div>
    </div>
  `,
  styles: [`
    .parent-settings {
      min-height: 100vh;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 2rem;
      position: relative;
      overflow: hidden;
    }

    /* Floating Decorations */
    .floating-decoration {
      position: fixed;
      font-size: 3rem;
      opacity: 0.15;
      pointer-events: none;
      z-index: 0;
    }

    .gear-1 {
      top: 10%;
      left: 5%;
      animation: rotate-slow 20s linear infinite;
    }

    .gear-2 {
      bottom: 15%;
      right: 8%;
      animation: rotate-slow 15s linear infinite reverse;
    }

    .star-1 {
      top: 20%;
      right: 10%;
      animation: twinkle 3s ease-in-out infinite;
    }

    .star-2 {
      bottom: 25%;
      left: 15%;
      animation: twinkle 4s ease-in-out infinite 1s;
    }

    @keyframes rotate-slow {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }

    @keyframes twinkle {
      0%, 100% { opacity: 0.1; transform: scale(1); }
      50% { opacity: 0.3; transform: scale(1.2); }
    }

    /* Header */
    .settings-header {
      text-align: center;
      margin-bottom: 3rem;
      position: relative;
      z-index: 1;
    }

    .back-button {
      position: absolute;
      left: 0;
      top: 0;
      background: rgba(255, 255, 255, 0.2);
      backdrop-filter: blur(10px);
      border: 2px solid rgba(255, 255, 255, 0.3);
      color: white;
      padding: 0.75rem 1.5rem;
      border-radius: 50px;
      font-size: 1rem;
      font-weight: 600;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: all 0.3s ease;
    }

    .back-button:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateX(-5px);
    }

    .back-icon {
      font-size: 1.5rem;
      transition: transform 0.3s ease;
    }

    .back-button:hover .back-icon {
      transform: translateX(-3px);
    }

    .settings-title {
      color: white;
      font-size: 3rem;
      font-weight: 800;
      margin: 0 0 0.5rem 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
    }

    .title-icon {
      font-size: 3.5rem;
      animation: rotate-slow 10s linear infinite;
    }

    .settings-subtitle {
      color: rgba(255, 255, 255, 0.9);
      font-size: 1.2rem;
      margin: 0;
    }

    /* Settings Container - 2 sections per row */
    .settings-container {
      max-width: 1400px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 2rem;
      position: relative;
      z-index: 1;
    }

    /* Settings Section */
    .settings-section {
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-radius: 24px;
      padding: 2rem;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
      border: 3px solid rgba(255, 255, 255, 0.5);
      transition: all 0.3s ease;
    }

    .settings-section:hover {
      transform: translateY(-5px);
      box-shadow: 0 12px 48px rgba(0, 0, 0, 0.15);
    }

    .section-header {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 3px solid var(--section-color, #667eea);
    }

    .section-icon {
      font-size: 2.5rem;
      filter: drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.1));
    }

    .section-title {
      font-size: 1.8rem;
      font-weight: 700;
      color: #2d3748;
      margin: 0;
    }

    /* Settings List - vertical list of items */
    .settings-list {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .setting-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      background: linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%);
      border-radius: 16px;
      border: 2px solid #e9ecef;
      transition: all 0.3s ease;
    }

    .setting-item:hover {
      border-color: var(--section-color, #667eea);
      box-shadow: 0 4px 16px rgba(102, 126, 234, 0.1);
      transform: translateX(5px);
    }

    .setting-item.clickable {
      cursor: pointer;
    }

    .setting-info {
      display: flex;
      align-items: center;
      gap: 1rem;
      flex: 1;
    }

    .setting-icon {
      font-size: 2rem;
      width: 60px;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, var(--section-color, #667eea) 0%, var(--section-color, #764ba2) 100%);
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    .setting-text {
      flex: 1;
    }

    .setting-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: #2d3748;
      margin: 0 0 0.25rem 0;
    }

    .setting-description {
      font-size: 0.9rem;
      color: #718096;
      margin: 0;
    }

    /* Toggle Switch */
    .toggle-switch {
      position: relative;
      display: inline-block;
      width: 60px;
      height: 34px;
    }

    .toggle-switch input {
      opacity: 0;
      width: 0;
      height: 0;
    }

    .toggle-slider {
      position: absolute;
      cursor: pointer;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: #cbd5e0;
      border-radius: 34px;
      transition: all 0.3s ease;
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .toggle-slider:before {
      position: absolute;
      content: "";
      height: 26px;
      width: 26px;
      left: 4px;
      bottom: 4px;
      background: white;
      border-radius: 50%;
      transition: all 0.3s ease;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }

    input:checked + .toggle-slider {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    input:checked + .toggle-slider:before {
      transform: translateX(26px);
    }

    /* Select & Time Input */
    .setting-select,
    .setting-time {
      padding: 0.75rem 1rem;
      border: 2px solid #e9ecef;
      border-radius: 12px;
      font-size: 1rem;
      font-weight: 600;
      color: #2d3748;
      background: white;
      cursor: pointer;
      transition: all 0.3s ease;
      min-width: 150px;
    }

    .setting-select:hover,
    .setting-time:hover {
      border-color: var(--section-color, #667eea);
    }

    .setting-select:focus,
    .setting-time:focus {
      outline: none;
      border-color: var(--section-color, #667eea);
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }

    /* Navigation Button */
    .nav-button {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--section-color, #667eea) 0%, var(--section-color, #764ba2) 100%);
      border: none;
      color: white;
      font-size: 1.5rem;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }

    .nav-button:hover {
      transform: scale(1.1) rotate(90deg);
      box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
    }

    /* Save Section */
    .save-section {
      max-width: 900px;
      margin: 2rem auto 0;
      text-align: center;
      position: relative;
      z-index: 1;
    }

    .save-button {
      background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
      color: white;
      border: none;
      padding: 1.25rem 3rem;
      border-radius: 50px;
      font-size: 1.3rem;
      font-weight: 700;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 1rem;
      box-shadow: 0 8px 24px rgba(72, 187, 120, 0.3);
      transition: all 0.3s ease;
    }

    .save-button:hover {
      transform: translateY(-3px) scale(1.05);
      box-shadow: 0 12px 32px rgba(72, 187, 120, 0.4);
    }

    .save-button:active {
      transform: translateY(-1px) scale(1.02);
    }

    .save-icon {
      font-size: 1.8rem;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .parent-settings {
        padding: 1rem;
      }

      .settings-title {
        font-size: 2rem;
      }

      .title-icon {
        font-size: 2.5rem;
      }

      .back-button {
        position: static;
        margin-bottom: 1rem;
      }

      /* Single column on mobile */
      .settings-container {
        grid-template-columns: 1fr;
      }

      .setting-item {
        flex-direction: column;
        align-items: flex-start;
        gap: 1rem;
      }

      .setting-control {
        width: 100%;
        display: flex;
        justify-content: flex-end;
      }
    }
  `]
})
export class ParentSettingsComponent {
  settingSections = signal<SettingSection[]>([
    {
      title: 'Thông Tin Tài Khoản',
      icon: '👤',
      color: '#667eea',
      settings: [
        {
          id: 'child-name',
          title: 'Tên Bé',
          description: 'Thay đổi tên hiển thị của bé',
          icon: '👶',
          type: 'navigation'
        },
        {
          id: 'child-age',
          title: 'Độ Tuổi',
          description: 'Cập nhật độ tuổi để điều chỉnh nội dung phù hợp',
          icon: '🎂',
          type: 'select',
          value: '5 tuổi',
          options: ['4 tuổi', '5 tuổi', '6 tuổi', '7 tuổi']
        },
        {
          id: 'avatar',
          title: 'Ảnh Đại Diện',
          description: 'Chọn avatar yêu thích cho bé',
          icon: '🖼️',
          type: 'navigation'
        }
      ]
    },
    {
      title: 'Cài Đặt Học Tập',
      icon: '📚',
      color: '#f093fb',
      settings: [
        {
          id: 'daily-goal',
          title: 'Mục Tiêu Hàng Ngày',
          description: 'Số bài học bé cần hoàn thành mỗi ngày',
          icon: '🎯',
          type: 'select',
          value: '3 bài',
          options: ['1 bài', '2 bài', '3 bài', '4 bài', '5 bài']
        },
        {
          id: 'study-time',
          title: 'Thời Gian Học',
          description: 'Thời gian học tập mỗi ngày (phút)',
          icon: '⏰',
          type: 'select',
          value: '30 phút',
          options: ['15 phút', '30 phút', '45 phút', '60 phút']
        },
        {
          id: 'difficulty',
          title: 'Độ Khó',
          description: 'Điều chỉnh mức độ khó của bài học',
          icon: '📊',
          type: 'select',
          value: 'Trung bình',
          options: ['Dễ', 'Trung bình', 'Khó']
        },
        {
          id: 'auto-advance',
          title: 'Tự Động Chuyển Bài',
          description: 'Tự động chuyển sang bài tiếp theo khi hoàn thành',
          icon: '⏭️',
          type: 'toggle',
          value: true
        }
      ]
    },
    {
      title: 'Thông Báo & Nhắc Nhở',
      icon: '🔔',
      color: '#4facfe',
      settings: [
        {
          id: 'daily-reminder',
          title: 'Nhắc Nhở Hàng Ngày',
          description: 'Nhận thông báo nhắc bé học mỗi ngày',
          icon: '⏰',
          type: 'toggle',
          value: true
        },
        {
          id: 'reminder-time',
          title: 'Giờ Nhắc Nhở',
          description: 'Chọn giờ nhận thông báo nhắc nhở',
          icon: '🕐',
          type: 'time',
          value: '19:00'
        },
        {
          id: 'achievement-notify',
          title: 'Thông Báo Phiếu Bé Ngoan',
          description: 'Nhận thông báo khi bé nhận được phiếu bé ngoan mới',
          icon: '🏆',
          type: 'toggle',
          value: true
        },
        {
          id: 'weekly-report',
          title: 'Báo Cáo Tuần',
          description: 'Nhận báo cáo tiến độ học tập hàng tuần',
          icon: '📊',
          type: 'toggle',
          value: true
        }
      ]
    },
    {
      title: 'Kiểm Soát Phụ Huynh',
      icon: '🔒',
      color: '#fa709a',
      settings: [
        {
          id: 'parent-gate',
          title: 'Khóa Phụ Huynh',
          description: 'Yêu cầu xác thực để truy cập phần phụ huynh',
          icon: '🔐',
          type: 'toggle',
          value: true
        },
        {
          id: 'change-password',
          title: 'Đổi Mật Khẩu',
          description: 'Thay đổi mật khẩu bảo vệ',
          icon: '🔑',
          type: 'navigation'
        },
        {
          id: 'screen-time',
          title: 'Giới Hạn Thời Gian',
          description: 'Giới hạn thời gian sử dụng ứng dụng mỗi ngày',
          icon: '⏱️',
          type: 'select',
          value: 'Không giới hạn',
          options: ['15 phút', '30 phút', '1 giờ', '2 giờ', 'Không giới hạn']
        }
      ]
    },
    {
      title: 'Âm Thanh & Hiệu Ứng',
      icon: '🎵',
      color: '#43e97b',
      settings: [
        {
          id: 'sound-effects',
          title: 'Hiệu Ứng Âm Thanh',
          description: 'Bật/tắt âm thanh hiệu ứng trong game',
          icon: '🔊',
          type: 'toggle',
          value: true
        },
        {
          id: 'background-music',
          title: 'Nhạc Nền',
          description: 'Bật/tắt nhạc nền khi học',
          icon: '🎶',
          type: 'toggle',
          value: true
        },
        {
          id: 'voice-guide',
          title: 'Hướng Dẫn Giọng Nói',
          description: 'Sử dụng giọng nói hướng dẫn cho bé',
          icon: '🗣️',
          type: 'toggle',
          value: true
        },
        {
          id: 'volume',
          title: 'Âm Lượng',
          description: 'Điều chỉnh mức âm lượng',
          icon: '🔉',
          type: 'select',
          value: 'Trung bình',
          options: ['Thấp', 'Trung bình', 'Cao']
        }
      ]
    },
    {
      title: 'Giao Diện & Ngôn Ngữ',
      icon: '🎨',
      color: '#f093fb',
      settings: [
        {
          id: 'theme',
          title: 'Chủ Đề',
          description: 'Chọn giao diện sáng hoặc tối',
          icon: '🌈',
          type: 'select',
          value: 'Sáng',
          options: ['Sáng', 'Tối', 'Tự động']
        },
        {
          id: 'language',
          title: 'Ngôn Ngữ',
          description: 'Chọn ngôn ngữ hiển thị',
          icon: '🌍',
          type: 'select',
          value: 'Tiếng Việt',
          options: ['Tiếng Việt', 'English']
        },
        {
          id: 'font-size',
          title: 'Cỡ Chữ',
          description: 'Điều chỉnh kích thước chữ',
          icon: '📝',
          type: 'select',
          value: 'Trung bình',
          options: ['Nhỏ', 'Trung bình', 'Lớn']
        },
        {
          id: 'animations',
          title: 'Hiệu Ứng Chuyển Động',
          description: 'Bật/tắt hiệu ứng animation',
          icon: '✨',
          type: 'toggle',
          value: true
        }
      ]
    }
  ]);

  constructor(private router: Router) { }

  goBack(): void {
    this.router.navigate(['/parents']);
  }

  toggleSetting(settingId: string): void {
    const sections = this.settingSections();
    for (const section of sections) {
      const setting = section.settings.find(s => s.id === settingId);
      if (setting && setting.type === 'toggle') {
        setting.value = !setting.value;
        console.log(`${setting.title}: ${setting.value}`);
        break;
      }
    }
  }

  updateSetting(settingId: string, event: Event): void {
    const target = event.target as HTMLSelectElement | HTMLInputElement;
    const sections = this.settingSections();
    for (const section of sections) {
      const setting = section.settings.find(s => s.id === settingId);
      if (setting) {
        setting.value = target.value;
        console.log(`${setting.title}: ${setting.value}`);
        break;
      }
    }
  }

  navigateTo(settingId: string): void {
    console.log(`Navigate to: ${settingId}`);
    // Implement navigation logic here
  }

  saveSettings(): void {
    console.log('Saving settings...', this.settingSections());
    // Show success message
    alert('✅ Đã lưu cài đặt thành công!');
  }
}

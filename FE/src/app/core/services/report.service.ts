import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface LearningSession {
  id: string;
  timestamp: string;
  durationSeconds: number;
  subject: 'math' | 'vietnamese' | 'english' | 'mixed';
  lessonsAttempted: number;
  correctAnswers: number;
  wrongAnswers: number;
}

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private platformId = inject(PLATFORM_ID);

  // In a real app, this would be backed by an API or IndexedDB
  readonly sessions = signal<LearningSession[]>([]);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem('learning_reports');
      if (saved) {
        try { this.sessions.set(JSON.parse(saved)); } catch (e) { }
      }
    }
  }

  logSession(session: Omit<LearningSession, 'id' | 'timestamp'>) {
    const newSession: LearningSession = {
      ...session,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString()
    };

    this.sessions.update(s => [newSession, ...s]);
    this.syncToStorage();
  }

  getWeeklyReport() {
    // Mock calculation
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return this.sessions().filter(s => new Date(s.timestamp) > oneWeekAgo);
  }

  private syncToStorage() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('learning_reports', JSON.stringify(this.sessions()));
    }
  }
}

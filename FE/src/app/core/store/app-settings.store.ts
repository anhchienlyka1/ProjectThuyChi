import { Injectable, signal, effect, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export interface AppSettings {
    dailyLimitMinutes: number;
    bgMusicEnabled: boolean;
    sfxEnabled: boolean;
    voiceEnabled: boolean;
    language: 'vi' | 'en'; // Default VI
}

const DEFAULT_SETTINGS: AppSettings = {
    dailyLimitMinutes: 20,
    bgMusicEnabled: true,
    sfxEnabled: true,
    voiceEnabled: true,
    language: 'vi'
};

@Injectable({
    providedIn: 'root'
})
export class AppSettingsStore {
    private platformId = inject(PLATFORM_ID);

    settings = signal<AppSettings>(DEFAULT_SETTINGS);

    constructor() {
        if (isPlatformBrowser(this.platformId)) {
            this.loadSettings();
        }

        // Auto-save effect
        effect(() => {
            if (isPlatformBrowser(this.platformId)) {
                localStorage.setItem('app_settings', JSON.stringify(this.settings()));
            }
        });
    }

    updateSettings(partial: Partial<AppSettings>) {
        this.settings.update(s => ({ ...s, ...partial }));
    }

    loadSettings() {
        if (!isPlatformBrowser(this.platformId)) return;
        const saved = localStorage.getItem('app_settings');
        if (saved) {
            try {
                this.settings.set({ ...DEFAULT_SETTINGS, ...JSON.parse(saved) });
            } catch (e) {
                console.error('Failed to parse settings', e);
            }
        }
    }
}

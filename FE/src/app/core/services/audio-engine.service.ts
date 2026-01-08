import { Injectable, inject, effect, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ParentSettingsStore } from '../store/parent-settings.store';

@Injectable({
    providedIn: 'root'
})
export class AudioEngineService {
    private settingsStore = inject(ParentSettingsStore);
    private platformId = inject(PLATFORM_ID);

    private bgAudio: HTMLAudioElement | undefined;
    private sfxAudio: HTMLAudioElement | undefined;
    private voiceAudio: HTMLAudioElement | undefined;

    constructor() {
        if (isPlatformBrowser(this.platformId)) {
            this.bgAudio = new Audio();
            this.sfxAudio = new Audio(); // We usually clone for SFX, but keep property for structure
            this.voiceAudio = new Audio();

            this.bgAudio.loop = true;
            this.bgAudio.volume = 0.3;

            // Ducking logic
            this.voiceAudio.addEventListener('play', () => this.fadeBgVolume(0.1));
            this.voiceAudio.addEventListener('ended', () => this.fadeBgVolume(0.3));
            this.voiceAudio.addEventListener('pause', () => this.fadeBgVolume(0.3));
        }

        // Effect must run in injection context, which matches constructor
        effect(() => {
            if (!isPlatformBrowser(this.platformId) || !this.bgAudio) return;

            const s = this.settingsStore.settings();
            if (!s.bgMusicEnabled) {
                this.bgAudio.pause();
            } else if (this.bgAudio.src && this.bgAudio.paused) {
                this.bgAudio.play().catch(e => console.warn('Autoplay prevented', e));
            }
        });
    }

    playBgMusic(url: string) {
        if (!isPlatformBrowser(this.platformId) || !this.bgAudio) return;
        if (!this.settingsStore.settings().bgMusicEnabled) return;

        if (this.bgAudio.src !== url) {
            this.bgAudio.src = url;
            this.bgAudio.load();
        }
        this.bgAudio.play().catch(e => console.warn('BG Play error', e));
    }

    playSFX(url: string) {
        if (!isPlatformBrowser(this.platformId)) return;
        if (!this.settingsStore.settings().sfxEnabled) return;

        const audio = new Audio(url);
        audio.play().catch(e => console.warn('SFX Play error', e));
    }

    speak(url: string) {
        if (!isPlatformBrowser(this.platformId) || !this.voiceAudio) return;
        if (!this.settingsStore.settings().voiceEnabled) return;

        this.voiceAudio.src = url;
        this.voiceAudio.play().catch(e => console.warn('Voice Play error', e));
    }

    private fadeBgVolume(target: number) {
        if (this.bgAudio) this.bgAudio.volume = target;
    }
}

import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AudioEngineService } from './audio-engine.service';

export type MascotEmotion = 'idle' | 'happy' | 'sad' | 'surprised' | 'thinking' | 'celebrating';

@Injectable({
  providedIn: 'root'
})
export class MascotService {
  private audio = inject(AudioEngineService);
  private platformId = inject(PLATFORM_ID);

  readonly emotion = signal<MascotEmotion>('idle');
  readonly message = signal<string>(''); // Bubble text

  // Helper to revert to idle automatically
  private idleTimeout: any;

  setEmotion(emotion: MascotEmotion, text?: string, duration = 3000) {
    if (!isPlatformBrowser(this.platformId)) return;

    this.emotion.set(emotion);
    if (text) this.message.set(text);

    // Play sound based on emotion
    if (emotion === 'happy') this.audio.playSFX('assets/sounds/mascot-giggle.mp3');
    if (emotion === 'sad') this.audio.playSFX('assets/sounds/mascot-sad.mp3');
    if (emotion === 'celebrating') this.audio.playSFX('assets/sounds/party-horn.mp3');

    if (this.idleTimeout) clearTimeout(this.idleTimeout);

    if (emotion !== 'idle') {
      this.idleTimeout = setTimeout(() => {
        this.emotion.set('idle');
        this.message.set('');
      }, duration);
    }
  }

  celebrate() {
    this.setEmotion('celebrating', 'Hoan hô! Bé giỏi quá!', 5000);
  }

  encourage() {
    this.setEmotion('sad', 'Không sao đâu, thử lại nhé!', 3000);
  }

  greet() {
    if (!isPlatformBrowser(this.platformId)) return;

    const hour = new Date().getHours();
    let msg = 'Chào bé yêu!';
    if (hour < 12) msg = 'Chào buổi sáng!';
    else if (hour > 18) msg = 'Chúc bé buổi tối vui vẻ!';

    this.setEmotion('happy', msg, 4000);
  }
}

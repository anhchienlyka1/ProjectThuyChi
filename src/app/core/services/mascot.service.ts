import { Injectable, signal, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { AudioEngineService } from './audio-engine.service';
import { AudioService } from './audio.service';

export type MascotEmotion = 'idle' | 'happy' | 'sad' | 'surprised' | 'thinking' | 'celebrating';

@Injectable({
  providedIn: 'root'
})
export class MascotService {
  private audioEngine = inject(AudioEngineService);
  private ttsService = inject(AudioService); // For TTS
  private platformId = inject(PLATFORM_ID);

  readonly emotion = signal<MascotEmotion>('idle');
  readonly message = signal<string>(''); // Bubble text

  private idleTimeout: any;

  /**
   * Triggers a specific emotion and optional message + speech
   * @param emotion The visual state of the mascot
   * @param text The text to display in the bubble
   * @param speak Whether to use TTS to read the text (default: true)
   * @param duration How long before staying idle (ms)
   */
  setEmotion(emotion: MascotEmotion, text?: string, speakOrDuration?: boolean | number, durationArg?: number) {
    if (!isPlatformBrowser(this.platformId)) return;

    let speak = true; // Changed default to true - speak by default
    let duration = 4000;

    // Handle overload: if 3rd arg is number, it's duration, and speak defaults to true
    if (typeof speakOrDuration === 'number') {
      duration = speakOrDuration;
      speak = true; // Changed: speak by default even when duration is provided
    } else if (typeof speakOrDuration === 'boolean') {
      speak = speakOrDuration;
      if (durationArg !== undefined) duration = durationArg;
    }

    this.emotion.set(emotion);
    if (text) {
      this.message.set(text);
      if (speak) {
        this.ttsService.speak(text);
      }
    }

    // Play SFX based on emotion (Generic sounds from assets if available)
    // Note: User can add these files to assets/sounds/ later
    if (emotion === 'celebrating') this.audioEngine.playSFX('assets/sounds/success.mp3');
    if (emotion === 'sad') this.audioEngine.playSFX('assets/sounds/error.mp3');

    // Clear previous timeout
    if (this.idleTimeout) clearTimeout(this.idleTimeout);

    // Auto-revert to idle unless it's a persistent state
    if (emotion !== 'idle') {
      this.idleTimeout = setTimeout(() => {
        this.emotion.set('idle');
        this.message.set('');
      }, duration);
    }
  }

  /**
   * Helper for correct answer/positive reinforcement
   */
  celebrate(msg: string = 'Hoan hô! Bé giỏi quá!') {
    this.setEmotion('celebrating', msg, true, 5000);
  }

  /**
   * Helper for incorrect answer/encouragement
   */
  encourage(msg: string = 'Không sao đâu, bé thử lại nhé!') {
    this.setEmotion('sad', msg, true, 4000);
  }

  /**
   * Helper for thinking/processing state
   */
  think(msg: string = 'Hmm... Để tớ xem nào...') {
    this.setEmotion('thinking', msg, false, 3000);
  }

  /**
   * Idle greeting
   */
  greet() {
    if (!isPlatformBrowser(this.platformId)) return;
    const hour = new Date().getHours();
    let msg = 'Chào bé yêu!';
    if (hour < 12) msg = 'Chào buổi sáng!';
    else if (hour > 18) msg = 'Chúc bé buổi tối vui vẻ!';
    this.setEmotion('happy', msg, true, 4000);
  }
}

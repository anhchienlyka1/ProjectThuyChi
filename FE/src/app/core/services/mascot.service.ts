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
    // Logic removed
  }

  /**
   * Helper for correct answer/positive reinforcement
   */
  celebrate(msg: string = 'Hoan hô! Bé giỏi quá!') {
    // Logic removed
  }

  /**
   * Helper for incorrect answer/encouragement
   */
  encourage(msg: string = 'Không sao đâu, bé thử lại nhé!') {
    // Logic removed
  }

  /**
   * Helper for thinking/processing state
   */
  think(msg: string = 'Hmm... Để tớ xem nào...') {
    // Logic removed
  }

  /**
   * Idle greeting
   */
  greet() {
    // Logic removed
  }
}

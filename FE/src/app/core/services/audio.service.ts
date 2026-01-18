import { Injectable, signal, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AudioService {
  private http = inject(HttpClient);
  private apiKey = 'k0ZwlmmrVirZfn6nRxx6ouyl9oxRpEcI'; // API Key provided by user
  private apiUrl = '/fpt-api/hmi/tts/v5';

  // Track if audio is currently playing
  isPlaying = signal<boolean>(false);
  private currentAudio: HTMLAudioElement | null = null;
  private currentSubscription: Subscription | null = null;

  /**
   * Reads the provided text using FPT AI Text-to-Speech
   * @param text The text to read
   * @param voice Voice ID (default: 'banmai' - Female Northern)
   * Options: 'banmai', 'leminh', 'myan', 'thuphuong', 'ngocminh', ...
   */
  speak(text: string, voice: string = 'banmai'): void {
    if (!text) return;

    // Cancel any ongoing speech
    this.stop();

    const headers = new HttpHeaders({
      'api-key': this.apiKey,
      'voice': voice,
      'speed': '0', // -3 to 3 (0 is normal)
      'format': 'mp3'
    });

    this.isPlaying.set(true);

    console.log('FPT TTS Request:', { url: this.apiUrl, text, headers: headers.keys() });

    // FPT AI expects the text in the body
    this.currentSubscription = this.http.post<any>(this.apiUrl, text, { headers }).subscribe({
      next: (response) => {
        console.log('FPT TTS Response:', response);
        if (response && response.async) {
          this.playUrl(response.async);
        } else {
          console.error('FPT AI TTS Error: Invalid response format', response);
          this.isPlaying.set(false);
        }
      },
      error: (err) => {
        console.error('FPT AI TTS Request Failed:', err);
        this.isPlaying.set(false);
      }
    });
  }

  private playUrl(url: string) {
    // Rewrite URL to use proxy
    // Original: https://file01.fpt.ai/text2speech-v5/...
    // Proxy: /text2speech-v5/...
    const proxyUrl = url.replace('https://file01.fpt.ai', '');

    console.log('Attempting to download and play audio from (Proxy):', proxyUrl);

    // Download the audio file as a Blob first to ensure it exists and is valid
    this.http.get(proxyUrl, { responseType: 'blob' }).pipe(
      retry({ count: 2, delay: 500 }) // Retry up to 2 times with a 500ms delay
    ).subscribe({
      next: (blob: Blob) => {
        console.log('Audio blob downloaded successfully, size:', blob.size);
        const audioUrl = URL.createObjectURL(blob);
        this.currentAudio = new Audio(audioUrl);

        this.currentAudio.onended = () => {
          this.isPlaying.set(false);
          URL.revokeObjectURL(audioUrl); // Clean up
          this.currentAudio = null;
        };

        this.currentAudio.onerror = (e) => {
          console.error('Audio playback error (Blob):', e);
          this.isPlaying.set(false);
          URL.revokeObjectURL(audioUrl);
        };

        this.currentAudio.play().catch(err => {
          console.warn('Playback interrupted or blocked:', err);
          this.isPlaying.set(false);
        });
      },
      error: (err) => {
        console.error('Failed to download audio file:', err.status, err.statusText);
        console.error('URL was:', proxyUrl);
        this.isPlaying.set(false);
      }
    });
  }

  /**
   * Stops any current speech
   */
  stop(): void {
    if (this.currentSubscription) {
      this.currentSubscription.unsubscribe();
      this.currentSubscription = null;
    }
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio = null;
    }
    this.isPlaying.set(false);
  }

  /**
   * Plays a sound effect from a URL
   * @param path Path to the audio file
   */
  playSound(path: string): void {
    const audio = new Audio(path);
    audio.play().catch(err => console.error('Error playing sound:', err));
  }

  playCorrectSound(): void {
    this.playSound('/assets/sounds/correct.mp3');
  }

  playWrongSound(): void {
    this.playSound('/assets/sounds/wrong.mp3');
  }
}

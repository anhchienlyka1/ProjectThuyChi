import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class AudioService {
    private synth = window.speechSynthesis;
    // Track if audio is currently playing
    isPlaying = signal<boolean>(false);

    voices: SpeechSynthesisVoice[] = [];

    constructor() {
        if (this.synth) {
            // Chrome loads voices asynchronously
            if (this.synth.onvoiceschanged !== undefined) {
                this.synth.onvoiceschanged = () => this.loadVoices();
            }
            this.loadVoices();
        }
    }

    private loadVoices() {
        if (!this.synth) return;
        this.voices = this.synth.getVoices();
        console.log('Voices loaded:', this.voices.length);
    }

    /**
     * Reads the provided text using Text-to-Speech
     * @param text The text to read
     * @param lang Language code (default: 'vi-VN')
     */
    speak(text: string, lang: string = 'vi-VN'): void {
        if (!this.synth) {
            console.warn('Web Speech API not supported in this browser.');
            return;
        }

        // Cancel any ongoing speech
        this.stop();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;

        // Try to find a specific high-quality voice
        // Prioritize "Google" voices as they are usually neural/higher quality online
        if (this.voices.length === 0) this.loadVoices();

        const vnVoice = this.voices.find(v => v.lang === lang && v.name.includes('Google'))
            || this.voices.find(v => v.lang === lang);

        if (vnVoice) {
            utterance.voice = vnVoice;
            console.log('Using voice:', vnVoice.name);
        }

        utterance.rate = 0.8; // Slower for better clarity
        utterance.pitch = 1.0; // Natural pitch (high pitch might distort tones)

        utterance.onstart = () => this.isPlaying.set(true);
        utterance.onend = () => this.isPlaying.set(false);
        utterance.onerror = () => this.isPlaying.set(false);

        this.synth.speak(utterance);
    }

    /**
     * Stops any current speech
     */
    stop(): void {
        if (this.synth) {
            this.synth.cancel();
            this.isPlaying.set(false);
        }
    }

    /**
     * Plays a sound effect from a URL
     * @param path Path to the audio file
     */
    playSound(path: string): void {
        const audio = new Audio(path);
        audio.play().catch(err => console.error('Error playing sound:', err));
    }
}

import {Component, EventEmitter, Input, Output} from '@angular/core';
import {TTSService} from "../../../../services/tts.service";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-audio-track',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './audio-track.component.html',
  styleUrl: './audio-track.component.css'
})
export class AudioTrackComponent {
  @Input() text: string = '';
  @Input() gender: 'male' | 'female' = 'female';
  @Input() fileName: string = '';
  @Output() closed = new EventEmitter<void>();

  progress: number = 0;
  protected totalDuration: number = 0;
  private startTime: number = 0;
  isMinimized: boolean = false;

  constructor() {
    setTimeout(() => this.start(), 0);
  }

  toggleMinimize(): void {
    this.isMinimized = !this.isMinimized;
  }

  start(): void {
    TTSService.speak(this.text, this.gender);
    this.calculateDuration();
    this.updateProgress();
  }

  togglePlayPause(): void {
    if (TTSService.isPaused()) {
      TTSService.resume();
    } else {
      TTSService.pause();
    }
  }

  stop(): void {
    TTSService.stop();
    this.progress = 0;
  }

  close(): void {
    this.stop();
    this.closed.emit();
  }

  private calculateDuration(): void {
    // Примерная скорость речи: 70 слов минут
    const words = this.text.split(/\s+/).length;
    const wordsPerMinute = 70;
    this.totalDuration = (words / wordsPerMinute) * 60;
  }

  private updateProgress(): void {
    const utterance = (TTSService as any).currentUtterance as SpeechSynthesisUtterance | null;
    if (!utterance) return;

    // Инициализируем время начала
    this.startTime = Date.now();

    // Используем onboundary для отслеживания прогресса по символам
    utterance.onboundary = (event) => {
      const charIndex = event.charIndex;
      const totalLength = this.text.length;
      this.progress = Math.min((charIndex / totalLength) * 100, 100);
    };

    // Дополнительно обновляем прогресс по времени
    const interval = setInterval(() => {
      if (TTSService.isSpeaking() && !TTSService.isPaused()) {
        const elapsedTime = (Date.now() - this.startTime) / 1000; // Время в секундах
        this.progress = Math.min((elapsedTime / this.totalDuration) * 100, 100);
      } else if (!TTSService.isSpeaking()) {
        this.progress = TTSService.isPaused() ? this.progress : 0; // Сохраняем прогресс при паузе
        clearInterval(interval);
      }
    }, 100);

    utterance.onend = () => {
      this.progress = 100;
      setTimeout(() => {
        if (!TTSService.isSpeaking()) this.progress = 0; // Сбрасываем после небольшой задержки
      }, 500);
    };
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  }

  TTSService = TTSService;
}

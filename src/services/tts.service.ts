import {Gender} from "../shared/enums/gender.enum";

export class TTSService {
    private static _currentUtterance: SpeechSynthesisUtterance | null = null;

    public static get currentUtterance(): SpeechSynthesisUtterance | null {
        return this.currentUtterance;
    }

    /**
     * Озвучивает текст с выбором голоса.
     * @param text Текст для озвучки
     * @param gender Пол голоса ('male' или 'female')
     */
    public static speak(text: string, gender: Gender): void {
        this.stop();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ru-RU';

        const voices = window.speechSynthesis.getVoices();
        utterance.voice = voices.find(v =>
            v.lang === 'ru-RU' &&
            (gender === Gender.MALE ? v.name.toLowerCase().includes(Gender.MALE) : v.name.toLowerCase().includes(Gender.FEMALE))
        ) || voices.find(v => v.lang === 'ru-RU') || voices[0];

        this._currentUtterance = utterance;

        window.speechSynthesis.speak(utterance);

        utterance.onend = () => {
            this._currentUtterance = null;
        };
    }

    /**
     * Останавливает текущую озвучку.
     */
    public static stop(): void {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            this._currentUtterance = null;
        }
    }

    /**
     * Ставит озвучку на паузу.
     */
    public static pause(): void {
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
            window.speechSynthesis.pause();
        }
    }

    /**
     * Возобновляет озвучку после паузы.
     */
    public static resume(): void {
        if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
        }
    }

    /**
     * Проверяет, идёт ли сейчас озвучка.
     */
    public static isSpeaking(): boolean {
        return window.speechSynthesis.speaking || window.speechSynthesis.pending;
    }

    /**
     * Проверяет, на паузе ли озвучка.
     */
    public static isPaused(): boolean {
        return window.speechSynthesis.paused;
    }
}
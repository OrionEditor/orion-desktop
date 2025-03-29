export class TTSService {
    private static currentUtterance: SpeechSynthesisUtterance | null = null;

    /**
     * Озвучивает текст с выбором голоса.
     * @param text Текст для озвучки
     * @param gender Пол голоса ('male' или 'female')
     */
    public static speak(text: string, gender: 'male' | 'female'): void {
        this.stop();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ru-RU';

        const voices = window.speechSynthesis.getVoices();
        utterance.voice = voices.find(v =>
            v.lang === 'ru-RU' &&
            (gender === 'male' ? v.name.toLowerCase().includes('male') : v.name.toLowerCase().includes('female'))
        ) || voices.find(v => v.lang === 'ru-RU') || voices[0];

        this.currentUtterance = utterance;

        window.speechSynthesis.speak(utterance);

        utterance.onend = () => {
            this.currentUtterance = null;
        };
    }

    /**
     * Останавливает текущую озвучку.
     */
    public static stop(): void {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.cancel();
            this.currentUtterance = null;
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
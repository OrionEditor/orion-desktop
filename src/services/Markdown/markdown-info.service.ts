import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class MarkdownInfoService {
    getCharacterCount(content: string): number {
        return content.length;
    }

    getWordCount(content: string): number {
        const words = content.trim().split(/\s+/).filter(word => word.length > 0);
        return words.length;
    }

    getLineCount(content: string): number {
        return content.split('\n').length;
    }

    getReadingTime(content: string): string {
        const wordsPerMinute = 130;
        const wordCount = this.getWordCount(content);
        const minutes = Math.ceil(wordCount / wordsPerMinute);
        return minutes === 1 ? `${minutes} минута` : `${minutes} минут`;
    }

    getHeadingCount(content: string): number {
        const headingRegex = /^(#{1,6})\s+.*/gm;
        const matches = content.match(headingRegex);
        return matches ? matches.length : 0; // Количество заголовков
    }
}
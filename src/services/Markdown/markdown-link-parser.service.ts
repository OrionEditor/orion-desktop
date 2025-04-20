// // src/app/services/markdown/markdown-link-parser.service.ts
// import { Injectable } from '@angular/core';
// import {LinkType} from "../../shared/enums/link-type.enum";
//
// @Injectable({
//     providedIn: 'root'
// })
// export class MarkdownLinkParserService {
//     private imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.svg'];
//     private videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.mkv'];
//     private audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac'];
//
//     getLinkType(url: string): LinkType {
//         const lowerUrl = url.toLowerCase();
//
//         const isLocal = !lowerUrl.startsWith('http://') && !lowerUrl.startsWith('https://');
//
//         // Извлекаем расширение файла из URL
//         const extensionMatch = lowerUrl.match(/\.[a-z0-9]+$/i);
//         const extension = extensionMatch ? extensionMatch[0] : '';
//
//         if (this.imageExtensions.includes(extension)) {
//             return LinkType.IMAGE;
//         } else if (this.videoExtensions.includes(extension)) {
//             return LinkType.VIDEO;
//         } else if (this.audioExtensions.includes(extension)) {
//             return LinkType.AUDIO;
//         } else {
//             return LinkType.WEB;
//         }
//     }
//
//     // Метод для извлечения всех ссылок из Markdown
//     extractLinks(markdown: string): { text: string; url: string; type: LinkType }[] {
//         const linkRegex = /\[([^\]]*)\]\(([^)]+)\)/g;
//         const links: { text: string; url: string; type: LinkType }[] = [];
//         let match;
//
//         while ((match = linkRegex.exec(markdown)) !== null) {
//             const text = match[1];
//             const url = match[2];
//             const type = this.getLinkType(url);
//             links.push({ text, url, type });
//         }
//
//         return links;
//     }
// }

// src/app/services/markdown/markdown-link-parser.service.ts
import { Injectable } from '@angular/core';

export enum LinkType {
    WEB = 'web',
    IMAGE = 'image',
    VIDEO = 'video',
    AUDIO = 'audio'
}

export interface MarkdownLink {
    text: string;
    url: string;
    type: LinkType;
    isImage: boolean; // Флаг для отличия изображений от ссылок
}

@Injectable({
    providedIn: 'root'
})
export class MarkdownLinkParserService {
    private imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp', '.svg'];
    private videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.mkv'];
    private audioExtensions = ['.mp3', '.wav', '.ogg', '.m4a', '.aac'];

    getLinkType(url: string): LinkType {
        const lowerUrl = url.toLowerCase();
        const extensionMatch = lowerUrl.match(/\.[a-z0-9]+$/i);
        const extension = extensionMatch ? extensionMatch[0] : '';

        if (this.imageExtensions.includes(extension)) {
            return LinkType.IMAGE;
        } else if (this.videoExtensions.includes(extension)) {
            return LinkType.VIDEO;
        } else if (this.audioExtensions.includes(extension)) {
            return LinkType.AUDIO;
        }
        return LinkType.WEB;
    }

    extractLinksAndImages(markdown: string): MarkdownLink[] {
        const linkRegex = /\[([^\]]*)\]\(([^)]+)\)/g; // Ссылки [text](url)
        const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g; // Изображения ![alt](url)
        const links: MarkdownLink[] = [];

        let match;
        // Парсим ссылки
        while ((match = linkRegex.exec(markdown)) !== null) {
            const text = match[1];
            const url = match[2];
            const type = this.getLinkType(url);
            links.push({ text, url, type, isImage: false });
        }

        // Парсим изображения
        while ((match = imageRegex.exec(markdown)) !== null) {
            const text = match[1];
            const url = match[2];
            const type = this.getLinkType(url);
            links.push({ text, url, type, isImage: true });
        }

        return links;
    }
}
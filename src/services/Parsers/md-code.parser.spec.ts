// import { TestBed } from '@angular/core/testing';
// import { MarkdownCodeParserService } from './md-code.parser.service';
// import { CodeBlock } from '../../interfaces/markdown/md-code.interface';
//
// describe('MarkdownCodeParserService', () => {
//     let service: MarkdownCodeParserService;
//
//     beforeEach(() => {
//         TestBed.configureTestingModule({
//             providers: [MarkdownCodeParserService],
//         });
//         service = TestBed.inject(MarkdownCodeParserService);
//     });
//
//     it('должен быть создан', () => {
//         expect(service).toBeTruthy();
//     });
//
//     it('должен извлекать блок кода с указанным языком', () => {
//         const markdown = '```\nplain text\n```';
//         const expected: CodeBlock[] = [
//             {
//                 language: null,
//                 code: 'plain text',
//                 startIndex: 0,
//                 endIndex: 18,
//             },
//         ];
//         expect(service.extractCodeBlocks(markdown)).toEqual(expected);
//     });
//
//     it('должен извлекать блок кода без указания языка', () => {
//         const markdown = '```\nplain text\n```';
//         const expected: CodeBlock[] = [
//             {
//                 language: null,
//                 code: 'plain text',
//                 startIndex: 0,
//                 endIndex: 18,
//             },
//         ];
//         expect(service.extractCodeBlocks(markdown)).toEqual(expected);
//     });
//
//     it('должен извлекать несколько блоков кода', () => {
//         const markdown = '```\nplain text\n```';
//         const expected: CodeBlock[] = [
//             {
//                 language: null,
//                 code: 'plain text',
//                 startIndex: 0,
//                 endIndex: 18,
//             },
//         ];
//         expect(service.extractCodeBlocks(markdown)).toEqual(expected);
//     });
//
//     it('должен возвращать пустой массив для пустого Markdown', () => {
//         const markdown = '';
//         expect(service.extractCodeBlocks(markdown)).toEqual([]);
//     });
//
//     it('должен возвращать пустой массив для Markdown без блоков кода', () => {
//         const markdown = '# Heading\nSome text';
//         expect(service.extractCodeBlocks(markdown)).toEqual([]);
//     });
// });

import { TestBed } from '@angular/core/testing';
import { MarkdownCodeParserService } from './md-code.parser.service';
import { CodeBlock } from '../../interfaces/markdown/md-code.interface';

describe('MarkdownCodeParserService', () => {
    let service: MarkdownCodeParserService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [MarkdownCodeParserService],
        });
        service = TestBed.inject(MarkdownCodeParserService);
    });

    it('должен быть создан', () => {
        expect(service).toBeTruthy();
    });

    it('должен извлекать блок кода с указанным языком', () => {
        const markdown = '```\nplain text\n```';
        const expected: CodeBlock[] = [
            {
                language: null,
                code: 'plain text',
                startIndex: 0,
                endIndex: 18,
            },
        ];
        expect(service.extractCodeBlocks(markdown)).toEqual(expected);
    });

    it('должен извлекать блок кода без указания языка', () => {
        const markdown = '```\nplain text\n```';
        const expected: CodeBlock[] = [
            {
                language: null,
                code: 'plain text',
                startIndex: 0,
                endIndex: 18,
            },
        ];
        expect(service.extractCodeBlocks(markdown)).toEqual(expected);
    });

    it('должен извлекать несколько блоков кода', () => {
        const markdown = '```\nplain text\n```';
        const expected: CodeBlock[] = [
            {
                language: null,
                code: 'plain text',
                startIndex: 0,
                endIndex: 18,
            },
        ];
        expect(service.extractCodeBlocks(markdown)).toEqual(expected);
    });

    it('должен возвращать пустой массив для пустого Markdown', () => {
        const markdown = '';
        expect(service.extractCodeBlocks(markdown)).toEqual([]);
    });

    it('должен возвращать пустой массив для Markdown без блоков кода', () => {
        const markdown = '# Heading\nSome text';
        expect(service.extractCodeBlocks(markdown)).toEqual([]);
    });
});
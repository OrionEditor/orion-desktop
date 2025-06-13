import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";
import {MarkdownStatistics} from "../../../../interfaces/markdown/markdown-statisctics.interface";
import {MarkdownInfoService} from "../../../../services/Markdown/markdown-info.service";
import * as Diff from 'diff';
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-version-diff-modal',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './version-diff-modal.component.html',
  styleUrl: './version-diff-modal.component.css'
})
export class VersionDiffModalComponent {
  // @Input() prevVersionContent: string = '';
  // @Input() currentVersionContent: string = '';
  // @Input() prevVersionNumber: number = 0;
  // @Input() currentVersionNumber: number = 0;
  // @Input() prevFileSize: number = 0;
  // @Input() currentFileSize: number = 0;
  //
  // prevDiffContent: SafeHtml | string = '';
  // currentDiffContent: SafeHtml | string = '';
  // prevStats: MarkdownStatistics | null = null;
  // currentStats: MarkdownStatistics | null = null;
  //
  // constructor(
  //     private markdownInfoService: MarkdownInfoService,
  //     private sanitizer: DomSanitizer
  // ) {}
  //
  // ngOnInit() {
  //   this.prevStats = {
  //     characterCount: this.markdownInfoService.getCharacterCount(this.prevVersionContent),
  //     wordCount: this.markdownInfoService.getWordCount(this.prevVersionContent),
  //     lineCount: this.markdownInfoService.getLineCount(this.prevVersionContent),
  //     readingTime: this.markdownInfoService.getReadingTime(this.prevVersionContent),
  //     headingCount: this.markdownInfoService.getHeadingCount(this.prevVersionContent)
  //   };
  //
  //   this.currentStats = {
  //     characterCount: this.markdownInfoService.getCharacterCount(this.currentVersionContent),
  //     wordCount: this.markdownInfoService.getWordCount(this.currentVersionContent),
  //     lineCount: this.markdownInfoService.getLineCount(this.currentVersionContent),
  //     readingTime: this.markdownInfoService.getReadingTime(this.currentVersionContent),
  //     headingCount: this.markdownInfoService.getHeadingCount(this.currentVersionContent)
  //   };
  //
  //   this.computeDiff();
  // }
  //
  // private computeDiff() {
  //   const diff = Diff.diffLines(this.prevVersionContent, this.currentVersionContent);
  //   let prevHtml = '';
  //   let currentHtml = '';
  //
  //   diff.forEach(part => {
  //     const escapedValue = part.value.replace(/[&<>"']/g, match => ({
  //       '&': '&',
  //       '<': '<',
  //       '>': '>',
  //     }[match]!));
  //
  //     if (part.added) {
  //       currentHtml += `<div class="diff-block diff-added">${escapedValue}</div>`;
  //       prevHtml += `<div class="diff-block diff-placeholder"></div>`;
  //     } else if (part.removed) {
  //       prevHtml += `<div class="diff-block diff-removed">${escapedValue}</div>`;
  //       currentHtml += `<div class="diff-block diff-placeholder"></div>`;
  //     } else {
  //       prevHtml += `<div class="diff-block">${escapedValue}</div>`;
  //       currentHtml += `<div class="diff-block">${escapedValue}</div>`;
  //     }
  //   });
  //
  //   this.prevDiffContent = this.sanitizer.bypassSecurityTrustHtml(prevHtml.replace(/\n/g, '<br>'));
  //   this.currentDiffContent = this.sanitizer.bypassSecurityTrustHtml(currentHtml.replace(/\n/g, '<br>'));
  // }
  //
  // close(){
  //
  // }

  @Input() prevVersionContent: string = '';
  @Input() currentVersionContent: string = '';
  @Input() prevVersionNumber: number = 0;
  @Input() currentVersionNumber: number = 0;
  @Input() prevFileSize: number = 0;
  @Input() currentFileSize: number = 0;

  @Output() close = new EventEmitter<void>(); // Событие для закрытия

  @ViewChild('arrowsSvg', { static: false }) arrowsSvg!: ElementRef<SVGSVGElement>;

  prevDiffContent: SafeHtml | string = '';
  currentDiffContent: SafeHtml | string = '';
  prevStats: MarkdownStatistics | null = null;
  currentStats: MarkdownStatistics | null = null;

  prevLineNumbers: number[] = [];
  currentLineNumbers: number[] = [];

  prevLineChanges: ('added' | 'removed' | null)[] = [];
  currentLineChanges: ('added' | 'removed' | null)[] = [];

  constructor(
      private markdownInfoService: MarkdownInfoService,
      private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.prevStats = {
      characterCount: this.markdownInfoService.getCharacterCount(this.prevVersionContent),
      wordCount: this.markdownInfoService.getWordCount(this.prevVersionContent),
      lineCount: this.markdownInfoService.getLineCount(this.prevVersionContent),
      readingTime: this.markdownInfoService.getReadingTime(this.prevVersionContent),
      headingCount: this.markdownInfoService.getHeadingCount(this.prevVersionContent)
    };

    this.currentStats = {
      characterCount: this.markdownInfoService.getCharacterCount(this.currentVersionContent),
      wordCount: this.markdownInfoService.getWordCount(this.currentVersionContent),
      lineCount: this.markdownInfoService.getLineCount(this.currentVersionContent),
      readingTime: this.markdownInfoService.getReadingTime(this.currentVersionContent),
      headingCount: this.markdownInfoService.getHeadingCount(this.currentVersionContent)
    };

    // Генерируем номера строк
    this.prevLineNumbers = Array.from(
        { length: this.prevVersionContent.split('\n').length },
        (_, i) => i + 1
    );
    this.currentLineNumbers = Array.from(
        { length: this.currentVersionContent.split('\n').length },
        (_, i) => i + 1
    );

    this.computeDiff();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.drawArrows();
    }, 200)
  }

  ngAfterViewChecked() {
    this.drawArrows();
  }

  // private computeDiff() {
  //   const diff = Diff.diffLines(this.prevVersionContent, this.currentVersionContent);
  //   let prevHtml = '';
  //   let currentHtml = '';
  //
  //   diff.forEach(part => {
  //     const escapedValue = part.value.replace(/[&<>"']/g, match => ({
  //       '&': '&',
  //       '<': '<',
  //       '>': '>',
  //       '"': '"'
  //     }[match]!));
  //
  //     if (part.added) {
  //       currentHtml += `<div class="diff-block diff-added">${escapedValue}</div>`;
  //       prevHtml += `<div class="diff-block diff-placeholder"></div>`;
  //     } else if (part.removed) {
  //       prevHtml += `<div class="diff-block diff-removed">${escapedValue}</div>`;
  //       currentHtml += `<div class="diff-block diff-placeholder"></div>`;
  //     } else {
  //       prevHtml += `<div class="diff-block">${escapedValue}</div>`;
  //       currentHtml += `<div class="diff-block">${escapedValue}</div>`;
  //     }
  //   });
  //
  //   this.prevDiffContent = this.sanitizer.bypassSecurityTrustHtml(prevHtml.replace(/\n/g, '<br>'));
  //   this.currentDiffContent = this.sanitizer.bypassSecurityTrustHtml(currentHtml.replace(/\n/g, '<br>'));
  // }

  // private computeDiff() {
  //   console.log('Computing diff between:', {
  //     prev: this.prevVersionContent,
  //     current: this.currentVersionContent
  //   });
  //   const diff = Diff.diffWords(this.prevVersionContent, this.currentVersionContent);
  //   console.log('Diff result:', diff);
  //
  //   let prevHtml = '';
  //   let currentHtml = '';
  //
  //   diff.forEach(part => {
  //     const escapedValue = part.value.replace(/[&<>"']/g, match => ({
  //       '&': '&amp;',
  //       '<': '&lt;',
  //       '>': '&gt;',
  //       '"': '&quot;',
  //       "'": '&#39;'
  //     }[match]!));
  //
  //     if (part.added) {
  //       currentHtml += `<span class="diff-added">${escapedValue}</span>`;
  //       prevHtml += `<span class="diff-placeholder"></span>`;
  //     } else if (part.removed) {
  //       prevHtml += `<span class="diff-removed">${escapedValue}</span>`;
  //       currentHtml += `<span class="diff-placeholder"></span>`;
  //     } else {
  //       prevHtml += `<span>${escapedValue}</span>`;
  //       currentHtml += `<span>${escapedValue}</span>`;
  //     }
  //   });
  //
  //   // Разбиваем на строки для нумерации
  //   const prevLines = prevHtml.split('\n').map(line => `<div class="diff-line">${line}</div>`).join('');
  //   const currentLines = currentHtml.split('\n').map(line => `<div class="diff-line">${line}</div>`).join('');
  //
  //   this.prevDiffContent = this.sanitizer.bypassSecurityTrustHtml(prevLines);
  //   this.currentDiffContent = this.sanitizer.bypassSecurityTrustHtml(currentLines);
  // }

  // private drawArrows() {
  //   if (!this.arrowsSvg) return;
  //
  //   const svg = this.arrowsSvg.nativeElement;
  //   const prevBlocks = document.querySelectorAll('.version-column:first-child .diff-block');
  //   const currentBlocks = document.querySelectorAll('.version-column:last-child .diff-block');
  //
  //   prevBlocks.forEach((prevBlock, index) => {
  //     const currentBlock = currentBlocks[index];
  //     if (
  //         (prevBlock.classList.contains('diff-removed') && currentBlock.classList.contains('diff-added')) ||
  //         (prevBlock.classList.contains('diff-added') && currentBlock.classList.contains('diff-removed'))
  //     ) {
  //       const prevRect = prevBlock.getBoundingClientRect();
  //       const currentRect = currentBlock.getBoundingClientRect();
  //       const svgRect = svg.getBoundingClientRect();
  //
  //       const x1 = 0;
  //       const x2 = svgRect.width;
  //       const y1 = prevRect.top + prevRect.height / 2 - svgRect.top;
  //       const y2 = currentRect.top + currentRect.height / 2 - svgRect.top;
  //
  //       const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  //       path.setAttribute('d', `M${x1},${y1} C${x1 + 20},${y1} ${x2 - 20},${y2} ${x2},${y2}`);
  //       path.setAttribute('stroke', '#888');
  //       path.setAttribute('stroke-width', '2');
  //       path.setAttribute('fill', 'none');
  //       path.setAttribute('marker-end', 'url(#arrowhead)');
  //
  //       svg.appendChild(path);
  //     }
  //   });
  //
  //   const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
  //   marker.setAttribute('id', 'arrowhead');
  //   marker.setAttribute('markerWidth', '10');
  //   marker.setAttribute('markerHeight', '7');
  //   marker.setAttribute('refX', '9');
  //   marker.setAttribute('refY', '3.5');
  //   marker.setAttribute('orient', 'auto');
  //   const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  //   polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
  //   polygon.setAttribute('fill', '#888');
  //   marker.appendChild(polygon);
  //   svg.appendChild(marker);
  // }

  // private computeDiff() {
  //   console.log('Computing diff between:', {
  //     prev: this.prevVersionContent,
  //     current: this.currentVersionContent
  //   });
  //   const diff = Diff.diffChars(this.prevVersionContent, this.currentVersionContent);
  //   console.log('Diff result:', diff);
  //
  //   let prevHtml = '';
  //   let currentHtml = '';
  //   let prevLineChanges: ('added' | 'removed' | null)[] = [];
  //   let currentLineChanges: ('added' | 'removed' | null)[] = [];
  //
  //   let prevLine = '';
  //   let currentLine = '';
  //   let lineIndex = 0;
  //
  //   diff.forEach(part => {
  //     const escapedValue = part.value.replace(/[&<>"']/g, match => ({
  //       '&': '&amp;',
  //       '<': '&lt;',
  //       '>': '&gt;',
  //       '"': '&quot;',
  //       "'": '&#39;'
  //     }[match]!));
  //
  //     const lines = escapedValue.split('\n');
  //     lines.forEach((line, idx) => {
  //       if (idx > 0) {
  //         // Завершаем предыдущую строку
  //         prevHtml += `<div class="diff-line">${prevLine}</div>`;
  //         currentHtml += `<div class="diff-line">${currentLine}</div>`;
  //         prevLineChanges[lineIndex] = part.removed ? 'removed' : part.added ? null : prevLineChanges[lineIndex] || null;
  //         currentLineChanges[lineIndex] = part.added ? 'added' : part.removed ? null : currentLineChanges[lineIndex] || null;
  //         lineIndex++;
  //         prevLine = '';
  //         currentLine = '';
  //       }
  //
  //       if (part.added) {
  //         currentLine += `<span class="diff-added">${line}</span>`;
  //         prevLine += `<span class="diff-placeholder">${line.replace(/./g, ' ')}</span>`;
  //       } else if (part.removed) {
  //         prevLine += `<span class="diff-removed">${line}</span>`;
  //         currentLine += `<span class="diff-placeholder">${line.replace(/./g, ' ')}</span>`;
  //       } else {
  //         prevLine += `<span>${line}</span>`;
  //         currentLine += `<span>${line}</span>`;
  //       }
  //     });
  //   });
  //
  //   // Добавляем последнюю строку, если она не пустая
  //   if (prevLine || currentLine) {
  //     prevHtml += `<div class="diff-line">${prevLine}</div>`;
  //     currentHtml += `<div class="diff-line">${currentLine}</div>`;
  //     prevLineChanges[lineIndex] = diff[diff.length - 1]?.removed ? 'removed' : null;
  //     currentLineChanges[lineIndex] = diff[diff.length - 1]?.added ? 'added' : null;
  //   }
  //
  //   this.prevDiffContent = this.sanitizer.bypassSecurityTrustHtml(prevHtml);
  //   this.currentDiffContent = this.sanitizer.bypassSecurityTrustHtml(currentHtml);
  //   this.prevLineChanges = prevLineChanges;
  //   this.currentLineChanges = currentLineChanges;
  //
  //   console.log('Generated HTML:', { prevHtml, currentHtml });
  // }

  private computeDiff() {
    console.log('Computing diff between:', {
      current: this.currentVersionContent,
      prev: this.prevVersionContent
    });
    const diff = Diff.diffChars(this.currentVersionContent, this.prevVersionContent);
    console.log('Diff result:', diff);

    let currentHtml = '';
    let prevHtml = '';
    let currentLineChanges: ('removed' | 'added' | null)[] = [];
    let prevLineChanges: ('removed' | 'added' | null)[] = [];

    let currentLine = '';
    let prevLine = '';
    let lineIndex = 0;

    diff.forEach(part => {
      const escapedValue = part.value.replace(/[&<>"']/g, match => ({
        '&': '&',
        '<': '<',
        '>': '>',
        '"': '"'
      }[match]!));

      const lines = escapedValue.split('\n');
      lines.forEach((line, idx) => {
        if (idx > 0) {
          currentHtml += `<div class="diff-line">${currentLine}</div>`;
          prevHtml += `<div class="diff-line">${prevLine}</div>`;
          currentLineChanges[lineIndex] = part.added ? 'removed' : part.removed ? 'added' : currentLineChanges[lineIndex] || null;
          prevLineChanges[lineIndex] = part.added ? 'added' : part.removed ? 'removed' : prevLineChanges[lineIndex] || null;
          lineIndex++;
          currentLine = '';
          prevLine = '';
        }

        if (part.added) {
          prevLine += `<span class="diff-added">${line}</span>`;
          currentLine += `<span class="diff-placeholder">${line.replace(/./g, ' ')}</span>`;
        } else if (part.removed) {
          currentLine += `<span class="diff-removed">${line}</span>`;
          prevLine += `<span class="diff-placeholder">${line.replace(/./g, ' ')}</span>`;
        } else {
          currentLine += `<span>${line}</span>`;
          prevLine += `<span>${line}</span>`;
        }
      });
    });

    if (currentLine || prevLine) {
      currentHtml += `<div class="diff-line">${currentLine}</div>`;
      prevHtml += `<div class="diff-line">${prevLine}</div>`;
      currentLineChanges[lineIndex] = diff[diff.length - 1]?.removed ? 'removed' : diff[diff.length - 1]?.added ? 'added' : null;
      prevLineChanges[lineIndex] = diff[diff.length - 1]?.added ? 'removed' : diff[diff.length - 1]?.removed ? 'added' : null;
    }

    this.currentDiffContent = this.sanitizer.bypassSecurityTrustHtml(currentHtml);
    this.prevDiffContent = this.sanitizer.bypassSecurityTrustHtml(prevHtml);
    this.currentLineChanges = currentLineChanges;
    this.prevLineChanges = prevLineChanges;

    console.log('Generated HTML:', { currentHtml, prevHtml });
  }


  // private drawArrows() {
  //   if (!this.arrowsSvg) return;
  //
  //   const svg = this.arrowsSvg.nativeElement;
  //   // Очищаем SVG перед перерисовкой
  //   while (svg.firstChild) {
  //     svg.removeChild(svg.firstChild);
  //   }
  //
  //   const prevBlocks = document.querySelectorAll('.version-column:first-child .diff-added, .version-column:first-child .diff-removed');
  //   const currentBlocks = document.querySelectorAll('.version-column:last-child .diff-added, .version-column:last-child .diff-removed');
  //
  //   prevBlocks.forEach((prevBlock, index) => {
  //     const currentBlock = currentBlocks[index];
  //     if (!currentBlock) return;
  //
  //     const prevRect = prevBlock.getBoundingClientRect();
  //     const currentRect = currentBlock.getBoundingClientRect();
  //     const svgRect = svg.getBoundingClientRect();
  //
  //     const x1 = 0;
  //     const x2 = svgRect.width;
  //     const y1 = prevRect.top + prevRect.height / 2 - svgRect.top;
  //     const y2 = currentRect.top + currentRect.height / 2 - svgRect.top;
  //
  //     const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  //     path.setAttribute('d', `M${x1},${y1} C${x1 + 20},${y1} ${x2 - 20},${y2} ${x2},${y2}`);
  //     path.setAttribute('stroke', '#888');
  //     path.setAttribute('stroke-width', '2');
  //     path.setAttribute('fill', 'none');
  //     path.setAttribute('marker-end', 'url(#arrowhead)');
  //
  //     svg.appendChild(path);
  //   });
  //
  //   const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
  //   marker.setAttribute('id', 'arrowhead');
  //   marker.setAttribute('markerWidth', '10');
  //   marker.setAttribute('markerHeight', '7');
  //   marker.setAttribute('refX', '9');
  //   marker.setAttribute('refY', '3.5');
  //   marker.setAttribute('orient', 'auto');
  //   const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  //   polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
  //   polygon.setAttribute('fill', '#888');
  //   marker.appendChild(polygon);
  //   svg.appendChild(marker);
  // }

  // private drawArrows() {
  //   if (!this.arrowsSvg) return;
  //
  //   const svg = this.arrowsSvg.nativeElement;
  //   while (svg.firstChild) {
  //     svg.removeChild(svg.firstChild);
  //   }
  //
  //   const prevBlocks = document.querySelectorAll('.version-column:first-child .diff-line .diff-removed, .version-column:first-child .diff-line .diff-added');
  //   const currentBlocks = document.querySelectorAll('.version-column:last-child .diff-line .diff-added, .version-column:last-child .diff-line .diff-removed');
  //
  //   prevBlocks.forEach((prevBlock, index) => {
  //     const currentBlock = currentBlocks[index];
  //     if (!currentBlock) return;
  //
  //     const prevRect = prevBlock.getBoundingClientRect();
  //     const currentRect = currentBlock.getBoundingClientRect();
  //     const svgRect = svg.getBoundingClientRect();
  //
  //     const x1 = 0;
  //     const x2 = svgRect.width;
  //     const y1 = prevRect.top + prevRect.height / 2 - svgRect.top;
  //     const y2 = currentRect.top + currentRect.height / 2 - svgRect.top;
  //
  //     const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  //     path.setAttribute('d', `M${x1},${y1} C${x1 + 20},${y1} ${x2 - 20},${y2} ${x2},${y2}`);
  //     path.setAttribute('stroke', '#888');
  //     path.setAttribute('stroke-width', '2');
  //     path.setAttribute('fill', 'none');
  //     path.setAttribute('marker-end', 'url(#arrowhead)');
  //
  //     svg.appendChild(path);
  //   });
  //
  //   const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
  //   marker.setAttribute('id', 'arrowhead');
  //   marker.setAttribute('markerWidth', '10');
  //   marker.setAttribute('markerHeight', '7');
  //   marker.setAttribute('refX', '9');
  //   marker.setAttribute('refY', '3.5');
  //   marker.setAttribute('orient', 'auto');
  //   const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
  //   polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
  //   polygon.setAttribute('fill', '#888');
  //   marker.appendChild(polygon);
  //   svg.appendChild(marker);
  //
  //   console.log('Arrows drawn:', prevBlocks.length);
  // }

  private drawArrows() {
    if (!this.arrowsSvg) return;

    const svg = this.arrowsSvg.nativeElement;
    while (svg.firstChild) {
      svg.removeChild(svg.firstChild);
    }

    const currentBlocks = document.querySelectorAll('.version-column:first-child .diff-line .diff-removed, .version-column:first-child .diff-line .diff-added');
    const prevBlocks = document.querySelectorAll('.version-column:last-child .diff-line .diff-added, .version-column:last-child .diff-line .diff-removed');

    currentBlocks.forEach((currentBlock, index) => {
      const prevBlock = prevBlocks[index];
      if (!prevBlock) return;

      const currentRect = currentBlock.getBoundingClientRect();
      const prevRect = prevBlock.getBoundingClientRect();
      const svgRect = svg.getBoundingClientRect();

      const x1 = 0;
      const x2 = svgRect.width;
      const y1 = currentRect.top + currentRect.height / 2 - svgRect.top;
      const y2 = prevRect.top + prevRect.height / 2 - svgRect.top;

      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', `M${x1},${y1} C${x1 + 20},${y1} ${x2 - 20},${y2} ${x2},${y2}`);
      path.setAttribute('stroke', '#888');
      path.setAttribute('stroke-width', '2');
      path.setAttribute('fill', 'none');
      path.setAttribute('marker-end', 'url(#arrowhead)');

      svg.appendChild(path);
    });

    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', 'arrowhead');
    marker.setAttribute('markerWidth', '10');
    marker.setAttribute('markerHeight', '7');
    marker.setAttribute('refX', '9');
    marker.setAttribute('refY', '3.5');
    marker.setAttribute('orient', 'auto');
    const polygon = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
    polygon.setAttribute('points', '0 0, 10 3.5, 0 7');
    polygon.setAttribute('fill', '#888');
    marker.appendChild(polygon);
    svg.appendChild(marker);

    console.log('Arrows drawn:', currentBlocks.length);
  }

  onClose() {
    this.close.emit(); // Вызываем событие закрытия
  }
}

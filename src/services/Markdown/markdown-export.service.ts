// markdown-export.service.ts
import { Injectable } from '@angular/core';
import { writeTextFile } from '@tauri-apps/plugin-fs';
import { marked } from 'marked';
import { jsPDF } from 'jspdf';
import html2canvas from "html2canvas";

@Injectable({
    providedIn: 'root'
})
export class MarkdownExportService {
    static async exportToHtml(content: string, filePath: string, fileName: string): Promise<void> {
        const htmlContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${fileName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          pre { background: #f4f4f4; padding: 10px; border-radius: 5px; }
        </style>
      </head>
      <body>
        ${marked(content)}
      </body>
      </html>
    `;
        try {
            await writeTextFile(filePath, htmlContent);
        } catch (error) {
            throw error;
        }
    }

    // static async exportToPdf(content: string, filePath: string): Promise<void> {
    //     const doc = new jsPDF();
    //     const markdownHtml = marked(content); // Преобразуем Markdown в HTML
    //     const tempDiv = document.createElement('div');
    //     tempDiv.innerHTML = markdownHtml.toString();
    //
    //     // Извлекаем текст из HTML для простоты (без сложного форматирования)
    //     const textContent = tempDiv.textContent || '';
    //     const lines = doc.splitTextToSize(textContent, 180); // Разбиваем текст на строки шириной 180
    //
    //     doc.setFontSize(12);
    //     doc.text(lines, 10, 10); // Добавляем текст в PDF
    //
    //     try {
    //         const pdfOutput = doc.output('arraybuffer');
    //         await writeTextFile(filePath, new TextDecoder().decode(pdfOutput)); // Сохраняем как бинарный файл
    //         console.log(`PDF экспортирован в: ${filePath}`);
    //     } catch (error) {
    //         console.error('Ошибка экспорта в PDF:', error);
    //         throw error;
    //     }
    // }

    static async exportToPdf(content: string, filePath: string): Promise<void> {
        const doc = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });

        const tempDiv = document.createElement('div');
        tempDiv.style.position = 'absolute';
        tempDiv.style.left = '-9999px';
        tempDiv.style.width = '190mm';
        tempDiv.style.padding = '10mm';
        tempDiv.style.fontFamily = 'Times New Roman';
        tempDiv.innerHTML = marked(content).toString();
        document.body.appendChild(tempDiv);

        try {
            // Преобразуем HTML в canvas
            const canvas = await html2canvas(tempDiv, {
                useCORS: true
            });

            const imgData = canvas.toDataURL('image/png');
            const imgWidth = 190;
            const pageHeight = 277;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 10;

            doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft > 0) {
                doc.addPage();
                position = heightLeft - imgHeight + 10;
                doc.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            const pdfOutput = doc.output('arraybuffer');
            await writeTextFile(filePath, new TextDecoder().decode(pdfOutput));
        } catch (error) {
            throw error;
        } finally {
            document.body.removeChild(tempDiv);
        }
    }
}
/**
 * Извлекает расширение файла из имени и возвращает его в нижнем регистре.
 * @param fileName Имя файла
 * @returns Расширение файла в нижнем регистре
 */
export function getFileExtension(fileName: string): string {
    if (!fileName) {
        return '';
    }

    const lastDotIndex = fileName.lastIndexOf('.');
    if (lastDotIndex === -1 || lastDotIndex === fileName.length - 1) {
        return '';
    }

    return fileName.substring(lastDotIndex + 1).toLowerCase();
}
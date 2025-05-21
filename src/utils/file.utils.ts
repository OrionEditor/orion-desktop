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

/**
 * Извлекает имя файла (включая расширение) из пути.
 * @param filePath Путь к файлу
 * @returns Имя файла с расширением или пустая строка, если путь некорректен
 */
export function getFileNameFromPath(filePath: string): string {
    if (!filePath) {
        return '';
    }

    // Находим последний разделитель пути (\ или /)
    const lastSlashIndex = Math.max(filePath.lastIndexOf('/'), filePath.lastIndexOf('\\'));
    if (lastSlashIndex === -1) {
        // Если разделителей нет, возвращаем весь путь как имя файла
        return filePath;
    }

    // Возвращаем часть строки после последнего разделителя
    return filePath.substring(lastSlashIndex + 1);
}
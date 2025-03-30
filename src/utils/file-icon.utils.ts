import {DEFAULT_FOLDER_ICON} from "../shared/constants/FileSystem/folder";
import {DEFAULT_FILE_ICON, FILE_ICONS} from "../shared/constants/FileSystem/fileIcons";
import {FILE_TYPES} from "../shared/constants/FileSystem/files.types";

export function getFileIcon(fileName: string, isDir: boolean = false): string {
    if (isDir) {
        return DEFAULT_FOLDER_ICON;
    }

    const extension = fileName.split('.').pop()?.toLowerCase();
    if (!extension) {
        return DEFAULT_FILE_ICON;
    }

    const fullExtension = `.${extension}`;

    if (Object.values(FILE_TYPES.IMAGE).includes(extension)) {
        const fileIcon = FILE_ICONS.find(icon => icon.type === fullExtension);
        return fileIcon ? fileIcon.icon : 'image-icon.png';
    }

    if (Object.values(FILE_TYPES.VIDEO).includes(extension)) {
        const fileIcon = FILE_ICONS.find(icon => icon.type === fullExtension);
        return fileIcon ? fileIcon.icon : 'video-icon.png';
    }

    const fileIcon = FILE_ICONS.find(icon => icon.type === fullExtension);
    return fileIcon ? fileIcon.icon : DEFAULT_FILE_ICON;
}
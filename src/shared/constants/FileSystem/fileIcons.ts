import {FILE_TYPES, getExtensionWithDot} from "./files.types";

export const FILE_ICONS = [
    { type: getExtensionWithDot(FILE_TYPES.MD), icon: "assets/icons/svg/filesystem/filetypes/md.svg" },
    { type: getExtensionWithDot(FILE_TYPES.TXT), icon: "assets/icons/svg/filesystem/filetypes/txt.svg" },
    { type: getExtensionWithDot(FILE_TYPES.IMAGE.JPEG), icon: "assets/icons/svg/filesystem/filetypes/image.svg" },
    { type: getExtensionWithDot(FILE_TYPES.IMAGE.JPG), icon: "assets/icons/svg/filesystem/filetypes/image.svg" },
    { type: getExtensionWithDot(FILE_TYPES.IMAGE.SVG), icon: "assets/icons/svg/filesystem/filetypes/image.svg" },
    { type: getExtensionWithDot(FILE_TYPES.IMAGE.PNG), icon: "assets/icons/svg/filesystem/filetypes/image.svg" },
    { type: getExtensionWithDot(FILE_TYPES.IMAGE.WEBP), icon: "assets/icons/svg/filesystem/filetypes/image.svg" },
    { type: getExtensionWithDot(FILE_TYPES.VIDEO.MP4), icon: "assets/icons/svg/filesystem/filetypes/video.svg" },
    { type: getExtensionWithDot(FILE_TYPES.HTML), icon: "assets/icons/svg/filesystem/filetypes/html.svg" },
    { type: getExtensionWithDot(FILE_TYPES.PDF), icon: "assets/icons/svg/filesystem/filetypes/pdf.svg" },
    { type: getExtensionWithDot(FILE_TYPES.AUDIO.MP3), icon: "assets/icons/svg/filesystem/filetypes/audio.svg" },
    { type: getExtensionWithDot(FILE_TYPES.AUDIO.OGG), icon: "assets/icons/svg/filesystem/filetypes/audio.svg" },

];

export const DEFAULT_FILE_ICON = "assets/icons/svg/filesystem/file.svg";

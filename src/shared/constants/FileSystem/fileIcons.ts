import {FILE_TYPES} from "./files.types";

export const FILE_ICONS = [
    { type: FILE_TYPES.MD, icon: "assets/icons/svg/filesystem/filetypes/md.svg" },
    { type: FILE_TYPES.TXT, icon: "assets/icons/svg/filesystem/filetypes/txt.svg" },
    // { type: ".pptx", icon: "assets/icons/svg/filesystem/powerpoint.svg" },
    // { type: ".json", icon: "assets/icons/svg/filesystem/json.svg" },
    // { type: ".png", icon: "assets/icons/svg/filesystem/image.svg" },
    // { type: ".jpg", icon: "assets/icons/svg/filesystem/image.svg" },
    // { type: ".js", icon: "assets/icons/svg/filesystem/javascript.svg" },
    // Добавьте другие расширения по необходимости
];

// Значение по умолчанию для неизвестных типов
export const DEFAULT_FILE_ICON = "assets/icons/svg/filesystem/file.svg";

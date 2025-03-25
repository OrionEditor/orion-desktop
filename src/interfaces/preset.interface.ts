export interface Preset {
    id: number;
    name: string;
    structure: FolderStructure;
}

export interface FolderStructure {
    folders: string[];
    files: string[];
    subfolders: { [folderName: string]: FolderStructure };
}
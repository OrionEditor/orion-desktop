import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { listen } from '@tauri-apps/api/event';
import {invoke} from "@tauri-apps/api/core";
import {FileSystemNode} from "../../interfaces/filesystem/filesystem-node.interface";
import {TauriCommands} from "../../shared/constants/app/tauri/command/command";

@Injectable({
    providedIn: 'root',
})
export class FileSystemService {
    private fileStructureSubject = new BehaviorSubject<FileSystemNode[]>([]);
    fileStructure$ = this.fileStructureSubject.asObservable();

    constructor() {}

    async loadFileStructure(projectPath: string) {
        const structure = await invoke<FileSystemNode[]>(TauriCommands.GET_FILE_STRUCTURE, {
            path: projectPath,
        });
        this.fileStructureSubject.next(structure);
    }

    async watchFileChanges(projectPath: string) {
        await listen(TauriCommands.FILE_CHANGED, (event: any) => {
            if (event.payload.path.startsWith(projectPath)) {
                this.loadFileStructure(projectPath);
            }
        });
    }

    toggleFileSystem() {
        this.fileStructureSubject.next([]);
    }

    async createDirectory(path: string, name: string) {
        await invoke(TauriCommands.CREATE_DIRECTORY, { path, name });
    }

    async createFile(path: string, name: string) {
        await invoke(TauriCommands.CREATE_FILE, { path, name });
    }

    static async deleteFile(filePath: string) {
        await invoke(TauriCommands.DELETE_FILE, {filePath});
    }


    /**
     * Moves a folder from one path to another.
     * @param sourcePath Path of the folder to move.
     * @param destinationPath Path to move the folder to.
     */
    async moveFolder(sourcePath: string, destinationPath: string) {
        try {
            await invoke('move_folder', { source: sourcePath, destination: destinationPath });
            console.log(`Folder moved from ${sourcePath} to ${destinationPath}`);
        } catch (error) {
            console.error('Error moving folder:', error);
        }
    }
}

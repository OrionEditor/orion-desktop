import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { listen } from '@tauri-apps/api/event';
import {invoke} from "@tauri-apps/api/core";
import {FileSystemNode} from "../../interfaces/filesystem/filesystem-node.interface";

@Injectable({
    providedIn: 'root',
})
export class FileSystemService {
    private fileStructureSubject = new BehaviorSubject<FileSystemNode[]>([]);
    fileStructure$ = this.fileStructureSubject.asObservable();

    constructor() {}

    async loadFileStructure(projectPath: string) {
        const structure = await invoke<FileSystemNode[]>('get_file_structure', {
            path: projectPath,
        });
        this.fileStructureSubject.next(structure);
    }

    async watchFileChanges(projectPath: string) {
        await listen('file-changed', (event: any) => {
            if (event.payload.path.startsWith(projectPath)) {
                this.loadFileStructure(projectPath);
            }
        });
    }

    toggleFileSystem() {
        this.fileStructureSubject.next([]);
    }

    async createDirectory(path: string, name: string) {
        await invoke('create_directory', { path, name });
    }

    async createFile(path: string, name: string) {
        await invoke('create_file', { path, name });
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

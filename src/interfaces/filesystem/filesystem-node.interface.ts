export interface FileSystemNode {
    expanded: boolean;
    type_id: string,
    name: string;
    path: string;
    isDirectory: boolean;
    children?: FileSystemNode[];
    created: number;
    last_modified: number;
}
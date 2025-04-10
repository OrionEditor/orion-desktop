import {ContextMenuItem} from "../../../interfaces/context-menu-item.interface";
import {FileSystemService} from "../../../services/FileSystem/fileSystem.service";
import {FileSystemNode} from "../../../interfaces/filesystem/filesystem-node.interface";
export const FileNodeContextmenu = (node: FileSystemNode, deleteFile: () => void): ContextMenuItem[] => [
    {
        id: 'create',
        text: 'Создать',
        isSubmenu: true,
        icon: 'assets/icons/svg/contextMenu/file-node/create.svg',
        submenuItems: [
            {
                id: 'create-node',
                text: 'Создать заметку',
                icon: 'assets/icons/svg/filesystem/filetypes/md.svg',
            },
            {
                id: 'create-folder',
                text: 'Создать папку',
                icon: 'assets/icons/svg/filesystem/folder.svg',
            },
        ],
    },
    {
        id: 'rename',
        text: 'Переименовать',
        icon: 'assets/icons/svg/contextMenu/rename.svg',
    },
    {
        id: 'delete',
        text: 'Удалить',
        icon: 'assets/icons/svg/contextMenu/delete.svg',
        action: () => deleteFile()
    },
]
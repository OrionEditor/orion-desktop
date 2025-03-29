import {ContextMenuItem} from "../../../interfaces/context-menu-item.interface";

export const MdSettingsContextMenu: ContextMenuItem[] = [
    {
        id: 'view-code',
        text: 'Просмотр исходного кода',
        action: () => console.log('Просмотр исходного кода'),
        icon: 'assets/icons/svg/contextMenu/code.svg',
        select: false,
        possibleSelect: true
    },
    {
        id: 'edit',
        text: 'Редактировать',
        isSubmenu: true,
        icon: 'assets/icons/svg/contextMenu/edit.svg',
        submenuItems: [
            {
                id: 'rename',
                text: 'Переименовать',
                action: () => console.log('Переименовать'),
                icon: 'assets/icons/svg/contextMenu/rename.svg',
            },
            {
                id: 'delete',
                text: 'Удалить',
                icon: 'assets/icons/svg/contextMenu/delete.svg',
                action: () => console.log('Удалить нажато'),
            },
        ],
    },
    {
        id: 'export',
        text: 'Экспортировать',
        isSubmenu: true,
        icon: 'assets/icons/svg/contextMenu/export.svg',
        submenuItems: [
            {
                id: 'export-html',
                text: 'Экспортировать в HTML',
                action: () => console.log('Экспортировать в HTML'),
                icon: 'assets/icons/svg/contextMenu/export-html.svg',
            },
            {
                id: 'export-pdf',
                text: 'Экспортировать в PDF',
                action: () => console.log('Экспортировать в PDF'),
                icon: 'assets/icons/svg/contextMenu/export-pdf.svg',
            },
        ],
    },
    {
        id: 'ai-functions',
        text: 'ИИ преобразования',
        isSubmenu: true,
        icon: 'assets/icons/svg/contextMenu/ai.svg',
        submenuItems: [
            {
                id: 'ai-translate',
                text: 'Перевести текст',
                action: () => console.log('Перевести текст'),
                icon: 'assets/icons/svg/contextMenu/translate.svg',
            },
            {
                id: 'ai-voice',
                text: 'Озвучить текст',
                isSubmenu: true,
                icon: 'assets/icons/svg/contextMenu/voice.svg',
                submenuItems: [
                    {
                        id: 'ai-voice-male',
                        text: 'Мужской голос',
                        action: () => console.log('Переименовать'),
                        icon: 'assets/icons/svg/contextMenu/male.svg',
                    },
                    {
                        id: 'ai-voice-female',
                        text: 'Женский голос',
                        icon: 'assets/icons/svg/contextMenu/female.svg',
                        action: () => console.log('Удалить нажато'),
                    },
                ],
            },
        ],
    },
    {
        id: 'open-explorer',
        text: 'Открыть в проводнике',
        action: () => console.log('Открыть в проводнике'),
        icon: 'assets/icons/svg/contextMenu/explorer.svg',
    },
];
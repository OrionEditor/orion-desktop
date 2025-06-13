import {ContextMenuItem} from "../../../interfaces/context-menu-item.interface";
import {MarkdownSettingsContextMenuService} from "../../../services/Markdown/markdown-settings-context-menu.service";

export const MdSettingsContextMenu = (filePath: string = '', content: string = '', fileName: string = '', showAudioTrack: { value: boolean } = { value: false }): ContextMenuItem[] => [
    {
        id: 'view-code',
        text: 'Просмотр исходного кода',
        action: () => MarkdownSettingsContextMenuService.viewCode,
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
                action:MarkdownSettingsContextMenuService.rename,
                icon: 'assets/icons/svg/contextMenu/rename.svg',
            },
            {
                id: 'delete',
                text: 'Удалить',
                icon: 'assets/icons/svg/contextMenu/delete.svg',
                action: () => MarkdownSettingsContextMenuService.delete,
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
                action: () => MarkdownSettingsContextMenuService.exportToHtml(content, fileName),
                icon: 'assets/icons/svg/contextMenu/export-html.svg',
            },
            {
                id: 'export-pdf',
                text: 'Экспортировать в PDF',
                action: () => MarkdownSettingsContextMenuService.exportToPdf(content, fileName),
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
                action: () => MarkdownSettingsContextMenuService.translateText(content, fileName),
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
                        action: () => MarkdownSettingsContextMenuService.voiceMale,
                        icon: 'assets/icons/svg/contextMenu/male.svg',
                        unavailable: true
                    },
                    {
                        id: 'ai-voice-female',
                        text: 'Женский голос',
                        icon: 'assets/icons/svg/contextMenu/female.svg',
                        action: () => MarkdownSettingsContextMenuService.voiceFemale(showAudioTrack),
                        select: false
                    },
                ],
            },
        ],
    },
    {
        id: 'open-explorer',
        text: 'Открыть в проводнике',
        action: () => MarkdownSettingsContextMenuService.openExplorer(filePath),
        icon: 'assets/icons/svg/contextMenu/explorer.svg',
    },
    {
        id: 'show_diff',
        text: 'Показать изменения',
        // action: () => MarkdownSettingsContextMenuService.showDiff(showDiffModal),
        select: false,
        icon: 'assets/icons/svg/contextMenu/diff.svg',
        isShow: false
    }
];
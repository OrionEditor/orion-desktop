import {MarkdownFilesType} from "../../../interfaces/markdown/markdownFiles.interface";
import {Language} from "../../../assets/localization/languages";

export const AppConstConfig = {
    APP_NAME: 'OrionEditor',
    APP_VERSION: '1.0.0',
    UI: {
        WINDOW_TITLE: 'OrionEditor - Текстовый markdown редактор',
        EXPORT_SUCCESS_MESSAGE: 'Файл успешно сохранён по пути:',
    },
    MARKDOWN: {
        [MarkdownFilesType.HELP]: {
            [Language.RU]: { name: 'help_ru.md' },
            [Language.EN]: { name: 'help_en.md' }
        },
        [MarkdownFilesType.SYNTAX]: {
            [Language.RU]: { name: 'syntax_ru.md' },
            [Language.EN]: { name: 'syntax_en.md' }
        }
    }
};
import { Injectable } from '@angular/core';
import {MdSettingsContextMenu} from "../../shared/constants/contextMenu/mdSettings.contextmenu";
import {DialogService} from "../dialog.service";
import {MarkdownExportService} from "./markdown-export.service";
import {OpenInExplorer} from "../../utils/open-explorer.utils";
import {FILE_TYPES} from "../../shared/constants/FileSystem/files.types";
import {NetworkService} from "../network.service";
import {LanguageTranslateService} from "../translate.service";

@Injectable({
    providedIn: 'root'
})
export class MarkdownSettingsContextMenuService {
    private static dialogService: DialogService;
    private static languageTranslateService: LanguageTranslateService;
    public static viewCode() {
        // @ts-ignore
        MdSettingsContextMenu[0].select = !MdSettingsContextMenu[0].select;
    }

    public static rename() {
    }

    public static delete() {
    }

    public static async exportToHtml(content: string, fileName:string) {
        const selectedPath = await DialogService.StaticSelectPath(true);
        if (selectedPath) {
            const exportPath = `${selectedPath}/${fileName}.${FILE_TYPES.HTML}`;
            try {
                await MarkdownExportService.exportToHtml(content, exportPath, fileName);
            } catch {}
        }
    }

    public static async exportToPdf(content: string, fileName:string) {
        const selectedPath = await DialogService.StaticSelectPath(true);
        if (selectedPath) {
            const exportPath = `${selectedPath}/${fileName}.${FILE_TYPES.PDF}`;
            await MarkdownExportService.exportToPdf(content, exportPath);
        }
    }

    public static async translateText(content: string, fileName:string) {
        // if (!NetworkService.getConnectionStatus()) {
        //     return;
        // }
        const selectedPath = await DialogService.StaticSelectPath(true);
        if(!selectedPath){return;}
        const filePath = `${selectedPath}\\${fileName}.${FILE_TYPES.MD}`
        await this.languageTranslateService.translateAndSave(content, filePath);
    }

    public static voiceMale() {
    }

    public static voiceFemale(showAudioTrack: { value: boolean }) {
        showAudioTrack.value = true;
    }

    public static async openExplorer(filePath: string): Promise<void> {
        await OpenInExplorer(filePath);
    }

    public static showDiff(){

    }
}
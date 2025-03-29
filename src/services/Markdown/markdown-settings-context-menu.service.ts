import { Injectable } from '@angular/core';
import {MdSettingsContextMenu} from "../../shared/constants/contextMenu/mdSettings.contextmenu";
import {DialogService} from "../dialog.service";
import {MarkdownExportService} from "./markdown-export.service";
import {OpenInExplorer} from "../../utils/open-explorer.utils";

@Injectable({
    providedIn: 'root'
})
export class MarkdownSettingsContextMenuService {
    public static viewCode() {
        // @ts-ignore
        MdSettingsContextMenu[0].select = !MdSettingsContextMenu[0].select;
    }

    public static rename() {
    }

    public static delete() {
    }

    public static async exportToHtml() {
    }

    public static exportToPdf() {
    }

    public static translateText() {
    }

    public static voiceMale() {
    }

    public static voiceFemale() {
    }

    public static async openExplorer(filePath: string): Promise<void> {
        await OpenInExplorer(filePath);
    }
}
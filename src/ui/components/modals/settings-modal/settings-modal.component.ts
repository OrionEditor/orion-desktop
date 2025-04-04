import { Component } from '@angular/core';
import {FillButtonComponent} from "../../buttons/fill-button/fill-button.component";
import {TabService} from "../../../../services/tab.service";
import {AppConstConfig} from "../../../../shared/constants/app/app.const";
import {MarkdownFilesService} from "../../../../services/Markdown/markdown-files.service";
import {MarkdownFiles, MarkdownFilesType} from "../../../../interfaces/markdown/markdownFiles.interface";
import {Language} from "../../../../assets/localization/languages";
import {ConfigService} from "../../../../services/configService";
import {LanguageService} from "../../../../services/language.service";

@Component({
  selector: 'app-settings-modal',
  standalone: true,
  imports: [
    FillButtonComponent
  ],
  templateUrl: './settings-modal.component.html',
  styleUrl: './settings-modal.component.css'
})
export class SettingsModalComponent {
  currentLang: string = 'ru';

  async ngOnInit(){
    if (!this.configService.getConfig()) {
      await this.configService.loadConfig();
    }
    this.currentLang = this.configService.getLanguage().toString().toLowerCase();

    this.languageService.setDefaultLang(this.currentLang);
    this.languageService.useLang(this.currentLang);
  }

  constructor(private tabService: TabService, private configService: ConfigService, private languageService: LanguageService) {
    MarkdownFilesService.initialize().then(() => this.loadInitialFiles());
  }

  async openTab(type: MarkdownFilesType): Promise<void> {
    const path = await MarkdownFilesService.getFilePath(type, this.currentLang);
    const name = AppConstConfig.MARKDOWN[type][this.currentLang as Language].name;
    this.tabService.createTab(path, name);
  }

  private async loadInitialFiles(): Promise<void> {
  }

  protected readonly MarkdownFilesType = MarkdownFilesType;
}

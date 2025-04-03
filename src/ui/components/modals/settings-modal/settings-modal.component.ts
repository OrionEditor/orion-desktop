import { Component } from '@angular/core';
import {FillButtonComponent} from "../../buttons/fill-button/fill-button.component";
import {TabService} from "../../../../services/tab.service";
import {AppConstConfig} from "../../../../shared/constants/app/app.const";

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

  markdown = {
    help: {
      path: AppConstConfig.MARKDOWN.HELP.ru.path,
      name: AppConstConfig.MARKDOWN.HELP.ru.name
    },
    syntax: {
      path: AppConstConfig.MARKDOWN.SYNTAX.ru.path,
      name: AppConstConfig.MARKDOWN.SYNTAX.ru.name
    }
  }

  constructor(private tabService: TabService) {}
  openTab(fileInfo: {path: string, name: string}): void {
    this.tabService.createTab(fileInfo.path, fileInfo.name);
  }

  protected readonly AppConstConfig = AppConstConfig;
}

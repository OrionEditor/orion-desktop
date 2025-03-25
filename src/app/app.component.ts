import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {StartPageComponent} from "../ui/pages/start-page/start-page.component";
import {ConfigService} from "../services/configService";
import {HttpClient} from "@angular/common/http";
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {WindowService} from "../services/window.service";
import {CreateProjectPageComponent} from "../ui/pages/create-project-page/create-project-page.component";
import {ProjectPageComponent} from "../ui/pages/project-page/project-page.component";
import {LoginPageComponent} from "../ui/pages/login-page/login-page.component";
import {UploadModalComponent} from "../ui/components/modals/upload-modal/upload-modal.component";
import {UploadService} from "../services/upload.service";
import {ApiEndpointsService} from "../api/api.service";
import {ToastComponent} from "../ui/components/toasts/toast/toast.component";
import {WINDOWS_LABELS} from "../shared/enums/windows-labels.enum";
import {ProfilePageComponent} from "../ui/pages/profile-page/profile-page.component";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/localization/i18n/', '.json');
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, StartPageComponent, CreateProjectPageComponent, ProjectPageComponent, LoginPageComponent, UploadModalComponent, ToastComponent, ProfilePageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  windowLabel: string = '';

  constructor(private configService: ConfigService, private windowService: WindowService, protected uploadService: UploadService, private apiEndpointsService: ApiEndpointsService) {}

  async ngOnInit(): Promise<void> {
    await this.configService.loadConfig();
    this.windowLabel = await this.windowService.getWindowLabel();
  }

    protected readonly WINDOWS_LABELS = WINDOWS_LABELS;
}



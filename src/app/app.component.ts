import {ApplicationRef, Component, EnvironmentInjector} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {StartPageComponent} from "../ui/pages/start-page/start-page.component";
import {ConfigService} from "../services/configService";
import {HttpClient, HttpClientModule} from "@angular/common/http";
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
import {MarkdownFiles} from "../interfaces/markdown/markdownFiles.interface";
import {invoke} from "@tauri-apps/api/core";
import {MarkdownFilesService} from "../services/Markdown/markdown-files.service";
import {cleanupLinkHandler, initializeLinkHandler} from "../utils/markown/link/link.utils";
import {StoreService} from "../services/Store/store.service";
import {StoreKeys} from "../shared/constants/vault/store.keys";
import {TokenService} from "../services/Token/token.service";
import {ProfileService} from "../services/Routes/profile/profile.service";
import {NetworkService} from "../services/Network/network.service";
import {listen} from "@tauri-apps/api/event";
import {ToastService} from "../services/Notifications/toast.service";

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '../assets/localization/i18n/', '.json');
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, StartPageComponent, CreateProjectPageComponent, ProjectPageComponent, LoginPageComponent, UploadModalComponent, ToastComponent, HttpClientModule, ProfilePageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  windowLabel: string = '';

  constructor(appRef: ApplicationRef, injector: EnvironmentInjector, private configService: ConfigService, private windowService: WindowService, protected uploadService: UploadService, private apiEndpointsService: ApiEndpointsService, private http: HttpClient) {
    this.initializeMarkdownFiles();
    ToastService.initialize(appRef, injector);
  }

  private profileService = new ProfileService(this.http);

  async initializeMarkdownFiles(): Promise<void> {
    await MarkdownFilesService.initialize();
  }

  async ngOnInit(): Promise<void> {
    initializeLinkHandler(document.body);
    await this.configService.loadConfig();
    this.windowLabel = await this.windowService.getWindowLabel();

    const token = await TokenService.getAuthToken();
    await StoreService.save(StoreKeys.ACCESS_TOKEN, token ? token : '');

    await this.profileService.getProfile();

    NetworkService.initialize();

    listen('reload-windows', () => {
      console.log('Получено событие перезагрузки, перезагружаем окно');
      window.location.reload();
    }).catch((err) => {
      console.error('Ошибка при установке слушателя события:', err);
    });

  }

  async ngOnChanges(){
    await this.profileService.getProfile();
  }

  ngOnDestroy() {
    cleanupLinkHandler(document.body);
  }

    protected readonly WINDOWS_LABELS = WINDOWS_LABELS;
}



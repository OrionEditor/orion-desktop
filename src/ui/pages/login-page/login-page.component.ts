import {Component} from '@angular/core';
import {LogoContainerComponent} from "../../components/logo-container/logo-container.component";
import {InputTextFieldComponent} from "../../components/inputs/input-text-field/input-text-field.component";
import {TranslatePipe} from "@ngx-translate/core";
import {ConfigService} from "../../../services/configService";
import {LanguageService} from "../../../services/language.service";
import {deleteOverflowWindow} from "../../../utils/overflow.utils";
import {applyTheme, observeThemeChanges, setDarkTheme} from "../../../utils/theme.utils";
import {FillButtonComponent} from "../../components/buttons/fill-button/fill-button.component";
import {NgClass, NgForOf, NgIf} from "@angular/common";
import {ValidationService} from "../../../services/validation.service";
import {AuthService} from "../../../services/Routes/auth.service";
import {RegisterPageComponent} from "../register-page/register-page.component";
import {CodeconfirmPageComponent} from "../codeconfirm-page/codeconfirm-page.component";
import {AuthModes} from "../../../shared/enums/auth-modes.enum";
import {themes} from "../../../shared/enums/theme.enum";
import {TokenService} from "../../../services/Token/token.service";
import {AUTH_SUCCESS} from "../../../shared/constants/messages/success/auth.success";
import {TOASTS_TYPES} from "../../../shared/constants/toasts/toasts.types";
import {TranslateService} from "@ngx-translate/core";
import {ToastService} from "../../../services/Toasts/toast.service";
import {WINDOWS_LABELS} from "../../../shared/enums/windows-labels.enum";
import {WindowService} from "../../../services/window.service";
import {listen} from "@tauri-apps/api/event";
import {StoreService} from "../../../services/Store/store.service";
import {StoreKeys} from "../../../shared/constants/vault/store.keys";

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [LogoContainerComponent, InputTextFieldComponent, TranslatePipe, FillButtonComponent, NgIf, NgForOf, NgClass, RegisterPageComponent, CodeconfirmPageComponent],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  username: string = ''
  password: string = ''
  email: string = ''
  currentTheme: string = ''
  currentLang: string = ''
  mode: string = AuthModes.LOGIN
  UUID: string = ''
  constructor(private configService: ConfigService, private languageService: LanguageService, private validationService: ValidationService, private authService: AuthService, private tokenService: TokenService, private translateService: TranslateService, private toastService: ToastService, private windowService: WindowService) {
  }

  async ngOnInit(){

    if (!this.configService.getConfig()) {
      await this.configService.loadConfig();
    }

    this.currentTheme = this.configService.getTheme();
    this.currentLang = this.configService.getLanguage();

    this.languageService.setDefaultLang(this.currentLang);
    this.languageService.useLang(this.currentLang);

    deleteOverflowWindow();

    // Применяем тему при загрузке
    document.body.classList.toggle('dark', this.currentTheme === 'dark');
    applyTheme(this.currentTheme === 'dark');
    observeThemeChanges();

    // Слушаем события изменения темы
    await listen('theme-changed', (event) => {
      const newTheme = event.payload as string;
      this.currentTheme = newTheme;
      document.body.classList.toggle('dark', newTheme === 'dark');
      applyTheme(newTheme === 'dark');
    });
  }

  login(event: { username: string; password: string }){
    if(!this.formValid()){
      return;
    }

    const loginData = { username: event.username, password: event.password };

    this.authService.login(loginData).subscribe({
      next: async (response) => {
        if(response.token){
          await StoreService.save(StoreKeys.ACCESS_TOKEN, response.token);
          await this.saveToken(response.token);

          await this.reloadStartPage();

          await WindowService.reloadAllWindows();

          const translatedSuccess = await this.translateService.get(AUTH_SUCCESS.SUCCESS_LOGIN.message).toPromise();
          this.toastService.showToast(translatedSuccess, TOASTS_TYPES.SUCCESS);

          await this.closeLoginWindow();
        }
      },
      error: (error) => {
      }
    });

  }

  async closeLoginWindow(){
    await this.windowService.closeWindowByLabel(WINDOWS_LABELS.LOGIN);
  }
  // Сохранение токена
  async saveToken(token: string) {
    await TokenService.saveAuthToken(token);
  }

  toggleMode() {
    this.mode = this.mode === AuthModes.LOGIN ? AuthModes.REGISTER : AuthModes.LOGIN;
  }

  confirmCode(){
    this.mode = AuthModes.CONFIRMCODE;
  }

  setEmail(email: string){
    this.email = email;
  }

  setUUID(UUID: string){
    this.UUID = UUID;
  }

  setUsername(username: string){
    this.username = username;
  }

  setPassword(password: string){
    this.password = password;
  }

  formValid(): boolean {
    return this.validationService.validateUsername(this.username) && this.validationService.validatePassword(this.password) && this.mode === AuthModes.LOGIN ? true : this.validationService.validateEmail(this.email);
  }

  async reloadStartPage(){
    await this.windowService.reloadWindowByLabel(WINDOWS_LABELS.LOGIN);
  }

  protected readonly AuthModes = AuthModes;
}

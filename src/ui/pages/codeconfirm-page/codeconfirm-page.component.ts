import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {NgClass, NgForOf} from "@angular/common";
import {FillButtonComponent} from "../../components/buttons/fill-button/fill-button.component";
import {TranslatePipe, TranslateService} from "@ngx-translate/core";
import {deleteOverflowWindow} from "../../../utils/overflow.utils";
import {observeThemeChanges, setDarkTheme} from "../../../utils/theme.utils";
import {ConfigService} from "../../../services/configService";
import {LanguageService} from "../../../services/language.service";
import {AuthService} from "../../../services/Routes/auth.service";
import {ToastService} from "../../../services/Toasts/toast.service";
import {TOASTS_TYPES} from "../../../shared/constants/toasts/toasts.types";
import {AUTH_SUCCESS} from "../../../shared/constants/messages/success/auth.success";
import {AUTH_ERRORS} from "../../../shared/constants/messages/errors/auth.errors";

@Component({
  selector: 'app-codeconfirm-page',
  standalone: true,
  imports: [
    NgClass,
    NgForOf,
    FillButtonComponent,
    TranslatePipe
  ],
  templateUrl: './codeconfirm-page.component.html',
  styleUrl: '../login-page/login-page.component.css',
})
export class CodeconfirmPageComponent {
  @Input() email: string = '';
  @Input() UUID: string = '';
  @Input() username: string = '';
  @Input() password: string = '';
  @Output() login = new EventEmitter<{ username: string; password: string }>();
  code: string = ''
  codeInputs: string[] = ['', '', '', '', ''];
  currentIndex: number = -1

  isCodeValid: boolean = false;  // Флаг для проверки правильности кода
  isCodeEntered: boolean = false; // флаг для отслеживания, был ли введен код

  currentTheme: string = ''
  currentLang: string = ''
  CODE_LENGTH: number = 5;

  constructor(private configService: ConfigService, private languageService: LanguageService, private authService: AuthService, private toastService: ToastService, private translateService : TranslateService) {
  }

  @ViewChild('codeInput') firstInput: ElementRef | undefined;
  @ViewChild('codeInputsEl') codeInputsEl: ElementRef | undefined;

  async ngOnInit(){

    // Загружаем конфигурацию при старте приложения, если она еще не загружена
    if (!this.configService.getConfig()) {
      await this.configService.loadConfig();
    }

    this.currentTheme = this.configService.getTheme();
    this.currentLang = this.configService.getLanguage();

    this.languageService.setDefaultLang(this.currentLang);
    this.languageService.useLang(this.currentLang);

    deleteOverflowWindow();

    if(this.currentTheme === 'dark'){
      setDarkTheme();
    }
    observeThemeChanges()

  }

  ngAfterViewInit(): void {
    if(!this.firstInput){
      return;
    }
    this.firstInput.nativeElement.focus();  // Устанавливаем фокус на первый элемент
  }

  onCodeInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Проверка на повторный ввод в тот же элемент
    if (this.currentIndex === index) {
      return;
    }

    this.currentIndex = index; // Устанавливаем текущий индекс

    if (!/^\d$/.test(value)) {
      input.value = ''; // Только цифры
      return;
    }

    // Обновляем массив значений
    this.codeInputs[index] = value;
    this.code+=value

    // Переход к следующему полю
    if (index < this.codeInputs.length - 1) {
      const nextInput = document.getElementById(`codeInput${index + 1}`) as HTMLInputElement;
      if (nextInput && this.codeInputs[index] !== '') {
        nextInput.focus(); // Фокусируемся на следующем элементе
        nextInput.value = ''; // Очищаем значение следующего поля
        this.codeInputs[index]='';
      }
    }

    // Проверка, если код введен полностью (и ни одно поле не пустое)
    if (this.code.length === this.CODE_LENGTH) {
      this.isCodeEntered = true; // Код введен
      this.isCodeValid = this.validateCode(this.code);
      this.handleCodeValidation();
    }
  }

  async handleCodeValidation() {
    // Получаем все элементы с классом .code-input
    const inputs = document.querySelectorAll('.code-input') as NodeListOf<HTMLInputElement>;

    // Если код неверный, очищаем поля через 1 секунду
    if (!this.isCodeValid) {
      setTimeout(() => {
        inputs.forEach(input => {
          input.value = '';
          input.style.borderColor = ''; // Сбросить стиль
        });
        this.codeInputs.fill(''); // Очистить массив

        if(!this.codeInputsEl){
          return;
        }
        this.codeInputsEl.nativeElement.classList.remove('valid', 'invalid');
        this.firstInput?.nativeElement.focus();
        this.code = '';
      }, 1000);
      return;
    }

    await this.submitRegister(this.code,this.UUID);
  }

  async submitRegister(code: string, UUID: string) {
    const requestData = { code, UUID };

    this.authService.registerUser(requestData).subscribe({
      next: async (response) => {
        const translatedSuccess = await this.translateService.get(AUTH_SUCCESS.SUCCESS_REGISTER.message).toPromise();
        this.toastService.showToast(translatedSuccess, TOASTS_TYPES.SUCCESS);

        this.login.emit({username: this.username, password: this.password});
      },
      error: async (error) => {
        const translatedError = await this.translateService.get(AUTH_ERRORS.ERROR_REGISTER.message).toPromise();
        this.toastService.showToast(translatedError, TOASTS_TYPES.DANGER);
      },
    });
  }

  validateCode(code: string): boolean {
    // Фиктивная проверка кода
    //TODO: Маршрутик для проверки кода
    return code === '12345';
  }
}

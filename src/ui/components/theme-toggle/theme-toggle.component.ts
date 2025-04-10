import {Component, Input} from '@angular/core';
import {NgIf} from "@angular/common";
import {ConfigService} from "../../../services/configService";
import {applyTheme} from "../../../utils/theme.utils";
import {emit, listen} from "@tauri-apps/api/event";

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
    imports: [
        NgIf
    ],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.css'
})
export class ThemeToggleComponent {
  // @Input() currentTheme: string = '';
  //
  // constructor(private configService: ConfigService) {}
  //
  // async ngOnInit() {
  //   // Получаем текущую тему при инициализации компонента
  //   this.currentTheme = this.configService.getTheme();
  // }
  //
  // async toggleTheme() {
  //   await this.configService.toggleTheme();
  //   this.currentTheme = this.configService.getTheme();
  //   document.body.classList.toggle('dark', this.currentTheme === 'dark');
  // }
  @Input() currentTheme: string = '';

  constructor(private configService: ConfigService) {}

  async ngOnInit() {
    // Получаем текущую тему при инициализации
    this.currentTheme = this.configService.getTheme();
    document.body.classList.toggle('dark', this.currentTheme === 'dark');
    applyTheme(this.currentTheme === 'dark');

    // Слушаем события изменения темы от других окон
    await listen('theme-changed', (event) => {
      const newTheme = event.payload as string;
      this.currentTheme = newTheme;
      document.body.classList.toggle('dark', newTheme === 'dark');
      applyTheme(newTheme === 'dark');
    });
  }

  async toggleTheme() {
    // Переключаем тему в конфигурации
    await this.configService.toggleTheme();
    this.currentTheme = this.configService.getTheme();

    // Применяем тему локально
    document.body.classList.toggle('dark', this.currentTheme === 'dark');
    applyTheme(this.currentTheme === 'dark');

    // Отправляем событие всем окнам
    await emit('theme-changed', this.currentTheme);
  }
}
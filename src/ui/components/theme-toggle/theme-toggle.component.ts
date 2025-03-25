import {Component, Input} from '@angular/core';
import {NgIf} from "@angular/common";
import {ConfigService} from "../../../services/configService";

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
  @Input() currentTheme: string = '';

  constructor(private configService: ConfigService) {}

  async ngOnInit() {
    // Получаем текущую тему при инициализации компонента
    this.currentTheme = this.configService.getTheme();
  }

  async toggleTheme() {
    await this.configService.toggleTheme();
    this.currentTheme = this.configService.getTheme();
    document.body.classList.toggle('dark', this.currentTheme === 'dark');
  }
}
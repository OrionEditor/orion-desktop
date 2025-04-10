import { Component } from '@angular/core';
import {Select} from "../../../interfaces/select.interface";
import {SelectComponent} from "../../components/select/select.component";
import {FormsModule} from "@angular/forms";
import {DialogService} from "../../../services/dialog.service";
import {FillButtonComponent} from "../../components/buttons/fill-button/fill-button.component";
import {InputTextFieldComponent} from "../../components/inputs/input-text-field/input-text-field.component";
import {CheckboxComponent} from "../../components/inputs/checkbox/checkbox.component";
import {observeThemeChanges, setDarkTheme} from "../../../utils/theme.utils";
import {ConfigService} from "../../../services/configService";
import {LanguageService} from "../../../services/language.service";
import {deleteMarginWindow, deleteOverflowWindow} from "../../../utils/overflow.utils";
import {ValidateService} from "../../../services/validate.service";
import {presets} from "../../../services/presets";
import {exists, writeTextFile, create, mkdir} from "@tauri-apps/plugin-fs";
import {TranslatePipe} from "@ngx-translate/core";
import {TranslateService} from "@ngx-translate/core";
import {invoke} from "@tauri-apps/api/core";
import { presets as rawPresets } from "../../../services/presets";
import {WindowService} from "../../../services/window.service";
import {UploadService} from "../../../services/upload.service";
import {listen} from "@tauri-apps/api/event";
import {SelectionCardsComponent} from "../../components/selection/selection-cards/selection-cards.component";
import {PROJECT_TYPES} from "../../../shared/constants/cards/project-types.cards";
import {FolderStructure} from "../../../interfaces/preset.interface";

@Component({
  selector: 'app-create-project-page',
  standalone: true,
  imports: [SelectComponent, FormsModule, FillButtonComponent, InputTextFieldComponent, CheckboxComponent, TranslatePipe, SelectionCardsComponent],
  templateUrl: './create-project-page.component.html',
  styleUrl: './create-project-page.component.css'
})
export class CreateProjectPageComponent {
  currentTheme: string = "";
  currentLang: string = "";
  projectName: string = '';
  projectId: string | null = '';
  projectPath: string = '';
  selectedPresetId: number = 0;
  createReadme: boolean = false;

  presets: Select[] = presets.map(preset => ({ id: preset.id, name: preset.name }));

  constructor(private dialogService: DialogService, private configService: ConfigService, private languageService: LanguageService, private validateService: ValidateService, private translateService: TranslateService, private windowService: WindowService, private uploadService: UploadService) {
  }

  async ngOnInit() {

    // Загружаем конфигурацию при старте приложения, если она еще не загружена
    if (!this.configService.getConfig()) {
      await this.configService.loadConfig();
    }

    // Получаем значение темы
    this.currentTheme = this.configService.getTheme();
    this.currentLang = this.configService.getLanguage();

    this.languageService.setDefaultLang(this.currentLang);
    this.languageService.useLang(this.currentLang);

    deleteOverflowWindow();

    if(this.currentTheme === 'dark'){
      setDarkTheme();
    }
    observeThemeChanges()

    // Загрузка переводов и формирование локализованных пресетов
    await this.loadPresets(); // Загружаем переводы для пресетов

  }

  onProjectTypeSelection(selectedId: string | null): void {
    this.projectId = selectedId;
  }

  async loadPresets() {
    const promises = rawPresets.map(async preset => {
      const translatedName = await this.translateService.get(`createPage.presets.preset${preset.id}`).toPromise();
      return { id: preset.id, name: translatedName };
    });

    this.presets = await Promise.all(promises);
  }

  onPresetSelect(id: number) {
    this.selectedPresetId = id;
  }

  async selectProjectPath() {
    const selectedPath = await this.dialogService.selectPath();
    if (selectedPath) {
      this.projectPath = selectedPath as string;
    }
  }
  async createOrionFolder() {
    const orionPath = `${this.projectPath}/.orion`;

    // Проверка существования папки .mnote
    const orionExists = await exists(orionPath);
    if (!orionExists) {
      await mkdir(orionPath);
    }
  }
  // async onSubmit() {
  //   // Валидация данных перед созданием проекта
  //   const isProjectNameValid = this.validateService.validateProjectName(this.projectName);
  //   const isProjectPathValid = await this.validateService.validateProjectPath(this.projectPath);
  //
  //   if (!isProjectNameValid) {
  //     this.translateService.get('createPage.alerts.nameProject').subscribe((message: string) => {
  //       alert(message);
  //     });
  //     return;
  //   }
  //
  //   if (!isProjectPathValid) {
  //     this.translateService.get('createPage.alerts.pathProject').subscribe((message: string) => {
  //       alert(message);
  //     });
  //     return;
  //   }
  //
  //   if (this.createReadme) {
  //     await this.createReadmeFile();
  //   }
  //
  //   await this.createMNoteFolder();
  //
  //   const selectedPreset = presets.find(preset => preset.id === this.selectedPresetId);
  //   if (selectedPreset && selectedPreset.id != 0) {
  //     await this.createPresetStructure(selectedPreset.structure, this.projectPath);
  //   }
  //
  //     await invoke('create_workspace', { workspacePath: this.projectPath + "\\.mnote" })
  //         .then(() => console.log('Workspace created successfully'))
  //         .catch((error) => error);
  //
  //   this.setLastOpenedProject(this.projectPath);
  //
  //   this.projectPath = "";
  //   this.projectName = "";
  //
  //   await this.windowService.openProjectWindow();
  //
  //   await this.windowService.closeAllWindowsExProject();
  // }

  async onSubmit() {
    this.uploadService.startUpload();

    try {
      await this.uploadService.executeWithProgress(
          [
            // Этап 1: Проверка имени проекта
            async () => {
              const isProjectNameValid = this.validateService.validateProjectName(this.projectName);
              if (!isProjectNameValid) {
                const message = await this.translateService.get('createPage.alerts.nameProject').toPromise();
                throw new Error(message);
              }
            },
            // Этап 2: Проверка пути проекта
            async () => {
              const isProjectPathValid = await this.validateService.validateProjectPath(this.projectPath);
              if (!isProjectPathValid) {
                const message = await this.translateService.get('createPage.alerts.pathProject').toPromise();
                throw new Error(message);
              }
            },
            // Этап 3: Создание README
            async () => {
              if (this.createReadme) {
                await this.createReadmeFile();
              }
            },
            // Этап 4: Создание папки
            async () => {
              await this.createOrionFolder();
            },
            // Этап 5: Создание структуры пресета
            async () => {
              const selectedPreset = presets.find(preset => preset.id === this.selectedPresetId);
              if (selectedPreset && selectedPreset.id != 0) {
                await this.createPresetStructure(selectedPreset.structure, this.projectPath);
              }
            },
            // Этап 6: Создание рабочего пространства
            async () => {
              await invoke('create_workspace', { workspacePath: this.projectPath + "\\.orion" });
            },
            // Этап 7: Открытие нового окна
            async () => {
              this.setLastOpenedProject(this.projectPath);
              this.projectPath = "";
              this.projectName = "";
              await this.windowService.openProjectWindow();
              await this.windowService.closeAllWindowsExProject();
            },
          ]
      );
    } catch (error) {
      console.error("Error during submission:", error);
      alert(error); // Отображение сообщения об ошибке
    } finally {
      this.uploadService.finishUpload();
    }
  }

  async openProjectWindow() {
    try {
      await invoke('create_fullscreen_project_window');
    } catch (error) {
      console.error("Ошибка при создании окна:", error);
    }
  }

  setLastOpenedProject(projectPath: string) {
    invoke('set_last_opened', { projectPath })
        .then(() => {
        })
        .catch((error) => {
        });
  }

  async createReadmeFile() {
    const readmePath = `${this.projectPath}/README.md`;
    const readmeExists = await exists(readmePath);

    if (!readmeExists) {
      await writeTextFile(readmePath, `# ${this.projectName}`);
    }
  }

  // async createPresetStructure(structure: any, currentPath: string) {
  //   if(structure.folders.length <= 0){
  //     return;
  //   }
  //   // Создание всех папок параллельно и ожидание их завершения
  //   await Promise.all(structure.folders.map(async (folder: string) => {
  //     const folderPath = `${currentPath}/${folder}`;
  //     const folderExists = await exists(folderPath);
  //     if (!folderExists) {
  //       await mkdir(folderPath);
  //     }
  //   }));
  //
  //   // Создание всех файлов параллельно и ожидание их завершения
  //   await Promise.all(structure.files.map(async (file: string) => {
  //     const filePath = `${currentPath}/${file}`;
  //     const fileExists = await exists(filePath);
  //     if (!fileExists) {
  //       await writeTextFile(filePath, `# ${file}`);
  //     }
  //   }));
  //
  //   // Рекурсивное создание подкаталогов и их содержимого
  //   for (const folderName of Object.keys(structure.subfolders)) {
  //     const subfolderStructure = structure.subfolders[folderName];
  //     const subfolderPath = `${currentPath}/${folderName}`;
  //
  //     const subfolderExists = await exists(subfolderPath);
  //     if (!subfolderExists) {
  //       await mkdir(subfolderPath);
  //     }
  //
  //     // Дождаться завершения рекурсивного вызова для подпапки
  //     await this.createPresetStructure(subfolderStructure, subfolderPath);
  //   }
  // }

  async createPresetStructure(structure: FolderStructure, currentPath: string) {
    // Создание всех папок параллельно
    await Promise.all(structure.folders.map(async (folder: string) => {
      const folderPath = `${currentPath}/${folder}`;
      const folderExists = await exists(folderPath);
      if (!folderExists) {
        await mkdir(folderPath);
      }
    }));

    // Создание всех файлов параллельно
    await Promise.all(structure.files.map(async (file: string) => {
      const filePath = `${currentPath}/${file}`;
      const fileExists = await exists(filePath);
      if (!fileExists) {
        await writeTextFile(filePath, `# ${file}`);
      }
    }));

    // Рекурсивное создание подкаталогов и их содержимого
    for (const folderName of Object.keys(structure.subfolders)) {
      const subfolderStructure = structure.subfolders[folderName];
      const subfolderPath = `${currentPath}/${folderName}`;

      const subfolderExists = await exists(subfolderPath);
      if (!subfolderExists) {
        await mkdir(subfolderPath);
      }

      // Рекурсивно обрабатываем вложенную структуру
      await this.createPresetStructure(subfolderStructure, subfolderPath);
    }
  }

  protected readonly PROJECT_TYPES = PROJECT_TYPES;
}

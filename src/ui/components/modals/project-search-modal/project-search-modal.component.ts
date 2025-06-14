import {Component, EventEmitter, Output} from '@angular/core';
import {ToastService} from "../../../../services/Notifications/toast.service";
import {WindowService} from "../../../../services/window.service";
import {DialogService} from "../../../../services/dialog.service";
import {invoke} from "@tauri-apps/api/core";
import {NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-project-search-modal',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './project-search-modal.component.html',
  styleUrl: './project-search-modal.component.css'
})
export class ProjectSearchModalComponent {
  @Output() close = new EventEmitter<void>();

  foundProjects: { name: string; path: string }[] = [];
  searchPhase: 'fast' | 'deep' | 'idle' = 'idle';
  elapsedTime: number = 0;
  timerInterval: any;
  showDeepSearchPrompt: boolean = false;
  isSearching: boolean = false;

  constructor(
      private windowService: WindowService,
      private dialogService: DialogService
  ) {}

  async ngOnInit() {
    await this.startSearch();
  }

  ngOnDestroy() {
    this.stopTimer();
  }

  async startSearch() {
    this.searchPhase = 'fast';
    this.isSearching = true;
    this.foundProjects = [];
    this.elapsedTime = 0;
    this.startTimer();

    try {
      const projects = await invoke<{ name: string; path: string }[]>('search_orion_projects', { deep: false });
      this.foundProjects = projects;
      this.isSearching = false;
      this.stopTimer();
      this.showDeepSearchPrompt = true;
    } catch (error) {
      console.error('Ошибка при поиске проектов:', error);
      ToastService.danger('Ошибка при поиске проектов');
      this.isSearching = false;
      this.stopTimer();
    }
  }

  async startDeepSearch() {
    this.searchPhase = 'deep';
    this.isSearching = true;
    this.showDeepSearchPrompt = false;
    this.elapsedTime = 0;
    this.startTimer();

    try {
      const projects = await invoke<{ name: string; path: string }[]>('search_orion_projects', { deep: true });
      this.foundProjects = [...this.foundProjects, ...projects];
      this.isSearching = false;
      this.stopTimer();
    } catch (error) {
      console.error('Ошибка при глубоком поиске:', error);
      ToastService.danger('Ошибка при глубоком поиске');
      this.isSearching = false;
      this.stopTimer();
    }
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      this.elapsedTime += 1;
    }, 1000);
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  async openProject(project: { name: string; path: string }) {
    try {
      const hasOrion = await this.dialogService.hasOrionFolder(project.path);
      if (!hasOrion) {
        ToastService.warning('Папка .orion не найдена в выбранном проекте');
        return;
      }

      await invoke('set_last_opened', { projectPath: project.path });
      await this.windowService.openProjectWindow();
      await this.windowService.closeAllWindowsExProject();
      this.close.emit();
    } catch (error) {
      console.error('Ошибка при открытии проекта:', error);
      ToastService.danger('Ошибка при открытии проекта');
    }
  }

  closeModal() {
    this.stopTimer();
    this.close.emit();
  }
}

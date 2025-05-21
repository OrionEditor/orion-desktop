import {Component, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {Tab} from "../../../../interfaces/components/tab.interface";
import {TabContextMenuComponent} from "../../contextMenus/tab-context-menu/tab-context-menu.component";
import {NgIf} from "@angular/common";
import {getFileIcon} from "../../../../utils/file-icon.utils";
import {WorkspaceService} from "../../../../services/Workspace/workspace.service";
import {ConfigService} from "../../../../services/configService";

@Component({
  selector: 'app-file-tab',
  standalone: true,
  imports: [
    TabContextMenuComponent,
    NgIf
  ],
  templateUrl: './file-tab.component.html',
  styleUrl: './file-tab.component.css'
})
export class FileTabComponent {
  @Input() tab!: Tab;
  @Output() close = new EventEmitter<string>();
  @Output() select = new EventEmitter<string>();
  @Output() pinTabEvent = new EventEmitter<string>();
  @Output() unpinTabEvent = new EventEmitter<string>();
  @Output() closeOthersEvent = new EventEmitter<string>();
  @Output() closeAllEvent = new EventEmitter<void>();
  @Output() dragStart = new EventEmitter<string>();
  @Output() dragEnd = new EventEmitter<void>();
  @Output() dropTab = new EventEmitter<{ draggedId: string; targetId: string }>();
  projectPath: string | null = '';

  showContextMenu = false;
  contextMenuPosition = { x: 0, y: 0 };

  constructor(private configService: ConfigService) {
  }

  async ngOnInit(){
    this.projectPath = this.configService.getLastOpened();
  }

  async onClose(event: Event) {
    event.stopPropagation();
    this.close.emit(this.tab.id);
    await WorkspaceService.removeActiveTab(this.projectPath ? this.projectPath + '\\.orion' : '', this.tab.filePath);
  }

  onTabClick(): void {
    this.select.emit(this.tab.id);
  }

  onRightClick(event: MouseEvent): void {
    event.preventDefault();
    this.contextMenuPosition = { x: event.clientX, y: event.clientY };
    this.showContextMenu = true;
  }

  @HostListener('document:click')
  hideContextMenu(): void {
    this.showContextMenu = false;
  }

  pinTab(): void {
    this.pinTabEvent.emit(this.tab.id);
    this.showContextMenu = false;
  }

  unpinTab(): void {
    this.unpinTabEvent.emit(this.tab.id);
    this.showContextMenu = false;
  }

  closeTab(): void {
    this.close.emit(this.tab.id);
    this.showContextMenu = false;
  }

  closeOtherTabs(): void {
    this.closeOthersEvent.emit(this.tab.id);
    this.showContextMenu = false;
  }

  closeAllTabs(): void {
    this.closeAllEvent.emit();
    this.showContextMenu = false;
  }

  // Обработка начала перетаскивания
  onDragStart(event: DragEvent): void {
    event.dataTransfer?.setData('text/plain', this.tab.id);
    this.dragStart.emit(this.tab.id);
  }

  // Разрешаем сброс на вкладку
  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  // Обработка сброса вкладки
  onDrop(event: DragEvent): void {
    event.preventDefault();
    const draggedId = event.dataTransfer?.getData('text/plain');
    if (draggedId && draggedId !== this.tab.id) {
      this.dropTab.emit({ draggedId, targetId: this.tab.id });
    }
    this.dragEnd.emit();
  }

    protected readonly getFileIcon = getFileIcon;
}

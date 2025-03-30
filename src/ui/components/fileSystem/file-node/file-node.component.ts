import {Component, ElementRef, EventEmitter, Input, Output, Renderer2, ViewChild} from '@angular/core';
import {FileSystemNode} from "../../../../services/FileSystem/fileSystem.service";
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {ContextMenuNodeComponent} from "../../contextMenus/context-menu-node/context-menu-node.component";
import {DEFAULT_FILE_ICON, FILE_ICONS} from "../../../../shared/constants/FileSystem/fileIcons";
import {DEFAULT_FOLDER_ICON} from "../../../../shared/constants/FileSystem/folder";
import {TranslatePipe} from "@ngx-translate/core";
import { ChangeDetectorRef } from '@angular/core';
import {TabService} from "../../../../services/tab.service";
import {FILE_TYPES} from "../../../../shared/constants/FileSystem/files.types";
import {getFileIcon} from "../../../../utils/file-icon.utils";


@Component({
  selector: 'app-file-node',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    ContextMenuNodeComponent,
    NgStyle,
    TranslatePipe
  ],
  templateUrl: './file-node.component.html',
  styleUrl: './file-node.component.css'
})
export class FileNodeComponent {
  @Input() node!: FileSystemNode;
  @Output() dragstart = new EventEmitter<void>();
  @Output() dragover = new EventEmitter<DragEvent>();
  @Output() drop = new EventEmitter<FileSystemNode>();
  @Output() fileSelected = new EventEmitter<{path: string, name: string}>();

  isExpanded = false;
  isDir: boolean = false;
  contextMenuVisible = false;
  contextMenuPosition = { x: 0, y: 0 };

  constructor(private cdRef: ChangeDetectorRef, private tabService: TabService) { }

    onDragStart(event: DragEvent, node: FileSystemNode) {
    event.stopPropagation(); // Предотвращаем всплытие события
    this.dragstart.emit(); // Передаем узел в событие
  }

  onDragOver(event: DragEvent) {
    event.preventDefault(); // Разрешаем сброс
    event.stopPropagation(); // Предотвращаем всплытие события
    this.dragover.emit(event); // Передаем событие
  }

  onDrop(event: DragEvent, node: FileSystemNode) {
    event.stopPropagation(); // Предотвращаем всплытие события
    this.drop.emit(node); // Передаем узел в событие
  }


  ngOnInit() {
    this.isDir = this.isDirectory();

    // Слушаем клик на документе
    document.addEventListener('click', this.onDocumentClick.bind(this));
  }

  ngOnDestroy() {
    // Удаляем слушатель при уничтожении компонента
    document.removeEventListener('click', this.onDocumentClick.bind(this));
  }

  onDocumentClick(event: MouseEvent) {
    const targetElement = event.target as HTMLElement;

    // Если кликнули не по контекстному меню и не по узлу, закрываем меню
    if (
        this.contextMenuVisible &&
        !targetElement.closest('.file-node') && // Убедиться, что клик не внутри узла
        !targetElement.closest('app-context-menu') // Убедиться, что клик не внутри меню
    ) {
      this.closeContextMenu();
    }
  }

  toggleExpand() {
    if (this.isDirectory()) {
      this.isExpanded = !this.isExpanded;
      this.node.expanded = !this.node.expanded; // Переключение состояния узла
    }
  }


    isHiddenDirectory(): boolean {
    return this.node.name.startsWith('.');
  }

  isDirectory(): boolean {
    return this.node.type_id === "Directory";
  }

  // Метод для открытия файла
  openFile() {
    if (!this.isDir) {
      this.fileSelected.emit({
        path: this.node.path,
        name: this.node.name
      });
      console.log('Файл открыт:', this.node.name);
    }  }

  onRightClick(event: MouseEvent) {
    event.preventDefault(); // Останавливаем стандартное контекстное меню
    this.contextMenuPosition = { x: event.clientX, y: event.clientY };
    this.contextMenuVisible = true;
  }

  // Закрыть контекстное меню при клике вне
  closeContextMenu() {
    this.contextMenuVisible = false;
  }

  countContents(node: FileSystemNode): { files: number; folders: number } {
    if (!node.children || node.children.length === 0) {
      return { files: node.type_id === "File" ? 1 : 0, folders: node.type_id === "Directory" ? 1 : 0 };
    }

    return node.children.reduce(
        (acc, child) => {
          const childCount = this.countContents(child);
          return {
            files: acc.files + childCount.files,
            folders: acc.folders + childCount.folders,
          };
        },
        { files: 0, folders: node.type_id === "Directory" ? 1 : 0 } // Текущий узел считается как папка
    );
  }

  getNodeName(): string {
    if (this.isDir) {
      return this.node.name; // Если это директория, возвращаем имя без изменений
    }

    // Если это файл, убираем расширение
    const dotIndex = this.node.name.lastIndexOf('.');
    if (dotIndex !== -1) {
      return this.node.name.substring(0, dotIndex);
    }

    return this.node.name; // Если у файла нет расширения, возвращаем имя как есть
  }

  getExpandedChildrenCount(node: FileSystemNode): number {
    if (!node.children || !node.expanded) {
      return 0;
    }

    let count = 0;

    for (const child of node.children) {
      count++; // сам дочерний элемент
      count += this.getExpandedChildrenCount(child); // рекурсивно считаем его детей, если он раскрыт
    }

    return count;
  }

  getIndentLineHeight(): string {
    const count = this.getExpandedChildrenCount(this.node);
    return `${(count + 1) * 24}px`; // 24px — это приблизительная высота одного элемента
  }

  protected readonly DEFAULT_FOLDER_ICON = DEFAULT_FOLDER_ICON;
  protected readonly getFileIcon = getFileIcon;
}

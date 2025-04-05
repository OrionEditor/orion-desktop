import {Component, EventEmitter, Output} from '@angular/core';
import {ConfigService} from "../../../../../services/configService";
import {FileSystemNode, FileSystemService} from "../../../../../services/FileSystem/fileSystem.service";
import {NgForOf, NgIf} from "@angular/common";
import {FileNodeComponent} from "../../../fileSystem/file-node/file-node.component";
import {SidebarFilesystemSearchComponent} from "./sidebar-filesystem-search/sidebar-filesystem-search.component";
import {SidebarFilesystemControlsComponent} from "./sidebar-filesystem-controls/sidebar-filesystem-controls.component";
import {TranslatePipe} from "@ngx-translate/core";
import {TabService} from "../../../../../services/tab.service";

@Component({
  selector: 'app-sidebar-filesystem',
  standalone: true,
  imports: [
    NgForOf,
    FileNodeComponent,
    SidebarFilesystemSearchComponent,
    SidebarFilesystemControlsComponent,
    NgIf,
    TranslatePipe
  ],
  templateUrl: './sidebar-filesystem.component.html',
  styleUrl: './sidebar-filesystem.component.css'
})
export class SidebarFilesystemComponent {
  projectPath: string | null = '';
  fileStructure: FileSystemNode[] = [];
  filteredFileStructure: FileSystemNode[] = [];
  searchQuery: string = '';
  draggedNode: FileSystemNode | null = null;
  @Output() fileSelected = new EventEmitter<{path: string, name: string}>();

  onFileSelected(fileInfo: {path: string, name: string}){
    this.fileSelected.emit(fileInfo);
  }

  // onDragStart(node: FileSystemNode) {
  //   this.draggedNode = node;
  // }
  //
  // onDragOver(event: DragEvent) {
  //   event.preventDefault(); // Разрешаем сброс (drop)
  // }
  //
  // async onDrop(targetNode: FileSystemNode) {
  //   if (this.draggedNode && this.draggedNode.path !== targetNode.path) {
  //     const sourcePath = this.draggedNode.path;
  //     const destinationPath = `${targetNode.path}/${this.draggedNode.name}`;
  //
  //     try {
  //       await this.fileSystemService.moveFolder(sourcePath, destinationPath);
  //       this.draggedNode = null;
  //       // Перезагружаем структуру файлов
  //       await this.fileSystemService.loadFileStructure(this.projectPath!);
  //     } catch (error) {
  //       console.error('Error while moving folder:', error);
  //     }
  //   }
  // }

  onDragStart(event: DragEvent, node: FileSystemNode) {
    this.draggedNode = node;
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  async onDrop(event: DragEvent, targetNode: FileSystemNode) {
    if (this.draggedNode && this.draggedNode.path !== targetNode.path) {
      const sourcePath = this.draggedNode.path;
      const destinationPath = `${targetNode.path}/${this.draggedNode.name}`;
      try {
        await this.fileSystemService.moveFolder(sourcePath, destinationPath);
        this.draggedNode = null;
        await this.fileSystemService.loadFileStructure(this.projectPath!);
      } catch (error) {
        console.error('Error while moving folder:', error);
      }
    }
  }


  setDraggedNode(node: FileSystemNode){
    this.draggedNode = node;
  }

  getDraggedNode() : FileSystemNode{
    return <FileSystemNode>this.draggedNode;
  }

  constructor(private configService: ConfigService, private fileSystemService: FileSystemService) {
  }

  private initializeExpandedState(nodes: FileSystemNode[]): FileSystemNode[] {
    return nodes.map((node) => ({
      ...node,
      expanded: false, // Все узлы изначально свернуты
      children: node.children ? this.initializeExpandedState(node.children) : [],
    }));
  }

  async ngOnInit(){
    // this.projectPath = this.configService.getLastOpened();
    //
    // this.fileSystemService.fileStructure$.subscribe((structure) => {
    //   this.fileStructure = structure;
    //   this.applyFilter();
    // });
    //
    // this.fileSystemService.fileStructure$.subscribe((structure) => {
    //   this.fileStructure = this.initializeExpandedState(structure);
    //   this.fileStructure = structure;
    //   this.applyFilter();
    // });
    //
    // // Загрузка структуры
    // if (this.projectPath) {
    //   await this.fileSystemService.loadFileStructure(this.projectPath);
    //   await this.fileSystemService.watchFileChanges(this.projectPath);
    // }

    this.projectPath = this.configService.getLastOpened();

    // Единая подписка на fileStructure$
    this.fileSystemService.fileStructure$.subscribe((structure) => {
      this.fileStructure = this.deepCopy(structure); // Глубокая копия для реактивности
      this.applyFilter();
    });

    // Загрузка структуры
    if (this.projectPath) {
      await this.fileSystemService.loadFileStructure(this.projectPath);
      await this.fileSystemService.watchFileChanges(this.projectPath);
    }
  }

  // Глубокая копия структуры для сохранения изменений
  private deepCopy(nodes: FileSystemNode[]): FileSystemNode[] {
    return nodes.map(node => ({
      ...node,
      expanded: node.expanded ?? false, // Сохраняем или устанавливаем false
      children: node.children ? this.deepCopy(node.children) : []
    }));
  }

  expandAllNodes() {
    console.log('expand');
    this.traverseNodes(this.fileStructure, true);
    this.fileStructure = this.deepCopy(this.fileStructure); // Обновляем ссылку
    this.applyFilter();
  }

  collapseAllNodes() {
    console.log('collapse');
    this.traverseNodes(this.fileStructure, false);
    this.fileStructure = this.deepCopy(this.fileStructure); // Обновляем ссылку
    this.applyFilter();
  }

  private traverseNodes(nodes: FileSystemNode[], expanded: boolean) {
    nodes.forEach((node) => {
      node.expanded = expanded;
      if (node.children && node.children.length > 0) {
        this.traverseNodes(node.children, expanded);
      }
    });
  }

  // expandAllNodes() {
  //   console.log("expand");
  //   this.traverseNodes(this.fileStructure, true);
  //   this.applyFilter(); // Обновляем отфильтрованную структуру
  // }
  //
  // collapseAllNodes() {
  //   console.log("collapse");
  //   this.traverseNodes(this.fileStructure, false);
  //   this.applyFilter(); // Обновляем отфильтрованную структуру
  // }
  //
  // private traverseNodes(nodes: FileSystemNode[], expanded: boolean) {
  //   nodes.forEach((node) => {
  //     node.expanded = expanded;
  //     if (node.children && node.children.length > 0) {
  //       this.traverseNodes(node.children, expanded);
  //     }
  //   });
  // }

  onSearch(query: string) {
    this.searchQuery = query;
    this.applyFilter();
  }

  applyFilter() {
    if (this.searchQuery === '') {
      this.filteredFileStructure = this.deepCopy(this.fileStructure); // Глубокая копия
    } else {
      this.filteredFileStructure = this.filterNodes(this.fileStructure, this.searchQuery.toLowerCase());
    }
    console.log('Filtered structure:', this.filteredFileStructure);
  }

  filterNodes(nodes: FileSystemNode[], query: string): FileSystemNode[] {
    return nodes
        .map(node => {
          const children = node.children ? this.filterNodes(node.children, query) : [];
          const matches = node.name.toLowerCase().includes(query);
          if (matches || children.length > 0) {
            return { ...node, children };
          }
          return null;
        })
        .filter(node => node !== null) as FileSystemNode[];
  }

  // applyFilter() {
  //   if (this.searchQuery === '') {
  //     this.filteredFileStructure = [...this.fileStructure]; // Копируем структуру
  //   } else {
  //     this.filteredFileStructure = this.filterNodes(this.fileStructure, this.searchQuery.toLowerCase());
  //   }
  // }
  //
  // filterNodes(nodes: FileSystemNode[], query: string): FileSystemNode[] {
  //   return nodes
  //       .map(node => {
  //         const children = node.children ? this.filterNodes(node.children, query) : [];
  //         const matches = node.name.toLowerCase().includes(query);
  //         if (matches || children.length > 0) {
  //           return { ...node, children }; // Сохраняем состояние expanded
  //         }
  //         return null;
  //       })
  //       .filter(node => node !== null) as FileSystemNode[];
  // }
}

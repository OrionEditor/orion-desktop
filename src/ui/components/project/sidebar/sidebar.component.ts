import {Component, EventEmitter, Input, Output} from '@angular/core';
import {invoke} from "@tauri-apps/api/core";
import {SidebarToolbarComponent} from "./sidebar-toolbar/sidebar-toolbar.component";
import {SidebarActionsComponent} from "./sidebar-actions/sidebar-actions.component";
import {SidebarFilesystemComponent} from "./sidebar-filesystem/sidebar-filesystem.component";
import {TabService} from "../../../../services/tab.service";
import {WorkspaceService} from "../../../../services/Workspace/workspace.service";
import {getWorkspacePath} from "../../../../shared/constants/workspace/workspace-path.const";
import {getFileNameFromPath} from "../../../../utils/file.utils";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    SidebarToolbarComponent,
    SidebarActionsComponent,
    SidebarFilesystemComponent
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent {
  @Input() tabService!: TabService;
  @Input() sidebarWidth: string = "20vw";
  @Input() isSidebarHidden: boolean = false;
  @Input() projectPath: string | null = "";
  @Output() sidebarWidthChange = new EventEmitter<string>();
  @Output() isSidebarHiddenChange = new EventEmitter<boolean>();
  @Output() fileSelected = new EventEmitter<{path: string, name: string}>();

  constructor() {}

  async ngOnInit(){
    const activeTabs = await WorkspaceService.getActiveTabs(getWorkspacePath(this.projectPath ? this.projectPath : ''));

    activeTabs.map((tab) => {
      this.fileSelected.emit({path: tab, name: getFileNameFromPath(tab)});
    } )
  }

  onFileSelected(fileInfo: {path: string, name: string}) {
    this.fileSelected.emit(fileInfo);
  }

  startResizing(event: MouseEvent) {
    event.preventDefault();

    const startX = event.clientX;
    const startWidth = parseFloat(this.sidebarWidth);

    const onMouseMove = (e: MouseEvent) => {
      const deltaX = e.clientX - startX;
      const newWidth = startWidth + (deltaX / window.innerWidth) * 100;
      const clampedWidth = `${Math.max(4, Math.min(newWidth, 70))}vw`;
      this.sidebarWidth = clampedWidth;
      this.sidebarWidthChange.emit(clampedWidth);
    };

    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }

  toggleSidebar() {
    this.isSidebarHidden = !this.isSidebarHidden;
    this.sidebarWidth = this.isSidebarHidden ? "4vw" : "20vw";
    this.sidebarWidthChange.emit(this.sidebarWidth);
    this.isSidebarHiddenChange.emit(this.isSidebarHidden);
  }
}

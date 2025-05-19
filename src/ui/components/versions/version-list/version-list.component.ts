import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Version} from "../../../../interfaces/version.interface";
import {NgForOf, NgIf} from "@angular/common";
import {getFileIcon} from "../../../../utils/file-icon.utils";
import {FormsModule} from "@angular/forms";
import {StoreService} from "../../../../services/Store/store.service";
import {StoreKeys} from "../../../../shared/constants/vault/store.keys";
import {NetworkService} from "../../../../services/Network/network.service";
import {FillButtonComponent} from "../../buttons/fill-button/fill-button.component";
import {success} from "../../../../styles/var/globalColors";
import {WindowService} from "../../../../services/window.service";

@Component({
  selector: 'app-version-list',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    FormsModule,
    FillButtonComponent
  ],
  templateUrl: './version-list.component.html',
  styleUrl: './version-list.component.css'
})
export class VersionListComponent {
  @Input() filePath: string = '';
  @Input() fileName: string = '';
  @Input() versions: Version[] = [];
  @Input() isCollapsed: boolean = false;
  @Output() versionSelected = new EventEmitter<string>();
  @Output() collapseToggled = new EventEmitter<boolean>();

  searchQuery: string = '';
  filteredVersions: Version[] = [];

  hasAuth: string | null = '';

  constructor(private windowService: WindowService) {
  }

  async ngOnInit(){
    this.hasAuth = await StoreService.get(StoreKeys.ACCESS_TOKEN);
  }

  async ngOnChanges() {
    this.hasAuth = await StoreService.get(StoreKeys.ACCESS_TOKEN);
    this.filterVersions();
  }

  async openLoginPage(){
    await this.windowService.openLoginWindow();
  }

  selectVersion(versionId: string): void {
    this.versionSelected.emit(versionId);
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
    this.collapseToggled.emit(this.isCollapsed);
  }

  createNewVersion(): void {
    // this.newVersion.emit();
  }

  deleteVersion(): void {
    // const activeVersion = this.versions.find(v => v.isActive);
    // if (activeVersion) {
    //   this.deleteVersionEvent.emit(activeVersion.id);
    // }
  }

  restoreVersion(): void {
    // const activeVersion = this.versions.find(v => v.isActive);
    // if (activeVersion) {
    //   this.restoreVersionEvent.emit(activeVersion.id);
    // }
  }

  exportVersion(): void {
    // const activeVersion = this.versions.find(v => v.isActive);
    // if (activeVersion) {
    //   this.exportVersionEvent.emit(activeVersion.id);
    // }
  }

  hasActiveVersion(): boolean {
    return this.versions.some(v => v.isActive);
  }

  filterVersions(): void {
    if (!this.searchQuery) {
      this.filteredVersions = [...this.versions];
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredVersions = this.versions.filter(version =>
          version.fileName.toLowerCase().includes(query) ||
          version.versionNumber.toLowerCase().includes(query) ||
          version.createdAt.toLowerCase().includes(query)
      );
    }
  }

  protected readonly getFileIcon = getFileIcon;
  protected readonly NetworkService = NetworkService;
  protected readonly success = success;
}

import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DatePipe, NgForOf, NgIf} from "@angular/common";
import {getFileIcon} from "../../../../utils/file-icon.utils";
import {FormsModule} from "@angular/forms";
import {StoreService} from "../../../../services/Store/store.service";
import {StoreKeys} from "../../../../shared/constants/vault/store.keys";
import {NetworkService} from "../../../../services/Network/network.service";
import {FillButtonComponent} from "../../buttons/fill-button/fill-button.component";
import {success} from "../../../../styles/var/globalColors";
import {WindowService} from "../../../../services/window.service";
import {GetDocumentResponse} from "../../../../interfaces/routes/document.interface";
import {Version} from "../../../../interfaces/routes/document.interface";

@Component({
  selector: 'app-version-list',
  standalone: true,
  imports: [
    NgForOf,
    NgIf,
    FormsModule,
    FillButtonComponent,
    DatePipe
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
  @Output() newVersion = new EventEmitter<void>();
  @Output() delVersion = new EventEmitter<void>();
  @Input() currentDocument: GetDocumentResponse | null = null;

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
    this.newVersion.emit();
  }

  deleteVersion(): void {
    this.delVersion.emit();
  }

  hasActiveVersion(): boolean {
    return this.versions.some(v => v.is_active);
  }

  filterVersions(): void {
    if (!this.searchQuery) {
      this.filteredVersions = [...this.versions];
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredVersions = this.versions.filter(version =>
          // version.fileName.toLowerCase().includes(query) ||
          version.version_number.toString().toLowerCase().includes(query) ||
          version.created_at.toLowerCase().includes(query)
      );
    }
  }

  protected readonly getFileIcon = getFileIcon;
  protected readonly NetworkService = NetworkService;
  protected readonly success = success;
}

import {Component, EventEmitter, Output} from '@angular/core';
import {InputTextFieldComponent} from "../../../../inputs/input-text-field/input-text-field.component";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-sidebar-filesystem-search',
  standalone: true,
    imports: [
        InputTextFieldComponent,
        TranslatePipe
    ],
  templateUrl: './sidebar-filesystem-search.component.html',
  styleUrl: './sidebar-filesystem-search.component.css'
})
export class SidebarFilesystemSearchComponent {
  @Output() searchQuery = new EventEmitter<string>();

  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.emit(input.value.trim());
  }
}

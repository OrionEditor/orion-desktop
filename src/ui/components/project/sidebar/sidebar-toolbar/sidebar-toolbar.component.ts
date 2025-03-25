import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
  selector: 'app-sidebar-toolbar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar-toolbar.component.html',
  styleUrl: './sidebar-toolbar.component.css'
})
export class SidebarToolbarComponent {
  @Output() toggleSidebar = new EventEmitter<void>();

  onToggleSidebar(){
    this.toggleSidebar.emit();
  }
}

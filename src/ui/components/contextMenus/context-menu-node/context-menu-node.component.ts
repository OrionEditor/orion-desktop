import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FileSystemNode} from "../../../../interfaces/filesystem/filesystem-node.interface";
import {NgIf} from "@angular/common";
import {TranslatePipe} from "@ngx-translate/core";

@Component({
  selector: 'app-context-menu-node',
  standalone: true,
  imports: [
    NgIf,
    TranslatePipe
  ],
  templateUrl: './context-menu-node.component.html',
  styleUrl: './context-menu-node.component.css'
})
export class ContextMenuNodeComponent {
  @Input() node!: FileSystemNode;

  isDirectory(): boolean {
    return this.node.children !== undefined && this.node.children.length > 0;
  }

  onRename() {

  }

  onDelete() {

  }

  onCreate() {

  }
}

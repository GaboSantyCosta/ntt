import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [],
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.css'
})
export class ContextMenuComponent {
  @Input() x: number = 0;
  @Input() y: number = 0;
  @Output() edited = new EventEmitter<void>();
  @Output() deleted = new EventEmitter<void>();

  constructor() { }

  edit(): void {
    this.edited.emit();
  }

  delete(): void {
    this.deleted.emit();
  }
}

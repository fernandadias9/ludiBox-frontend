import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button-secondary',
  templateUrl: './button-secondary.component.html',
  styleUrl: './button-secondary.component.scss'
})
export class ButtonSecondaryComponent {
  @Input() title: string = '';
  @Input() disabled = false
  @Input() type = "button"

  @Output() click: EventEmitter<void> = new EventEmitter<void>()

  onClick() {
    if (!this.disabled) {
      this.click.emit()
    }
  }
}

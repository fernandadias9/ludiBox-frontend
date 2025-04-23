import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-button-primary',
  templateUrl: './button-primary.component.html',
  styleUrl: './button-primary.component.scss'
})
export class ButtonPrimaryComponent {
  @Input() title: string = '';
  @Input() disabled = false
  @Input() type = "submit"

  @Output() click: EventEmitter<void> = new EventEmitter<void>()

  onClick() {
    if (!this.disabled) {
      this.click.emit()
    }
  }
}

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-input',
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss'
})
export class InputComponent {
  @Input() label: string = '';
  @Input() for: string = '';
  @Input() id: string = '';
  @Input() type: string = 'text';
  @Input() value: any;
  @Input() disabled: boolean = false;
  @Input() placeholder: string = '';
  @Input() showLabel: boolean = false;
  @Input() name: string = '';
}

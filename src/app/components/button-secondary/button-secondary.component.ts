import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button-secondary',
  templateUrl: './button-secondary.component.html',
  styleUrl: './button-secondary.component.scss'
})
export class ButtonSecondaryComponent {
  @Input() title: string = '';
}

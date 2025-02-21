import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-template-telas-iniciais',
  templateUrl: './template-telas-iniciais.component.html',
  styleUrl: './template-telas-iniciais.component.scss'
})
export class TemplateTelasIniciaisComponent {
  @Input() withOverflow: boolean = false;
}

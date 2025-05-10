import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-header-telas-perfil-com-add',
  templateUrl: './header-telas-perfil-com-add.component.html',
  styleUrl: './header-telas-perfil-com-add.component.scss'
})
export class HeaderTelasPerfilComAddComponent {
  @Input() titulo!: string;
  @Input() botaoTitulo!: string;
  @Output() botaoClicado = new EventEmitter<void>();

  onClick() {
    this.botaoClicado.emit();
  }
}

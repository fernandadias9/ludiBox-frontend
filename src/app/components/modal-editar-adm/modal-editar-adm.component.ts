import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Pessoa } from '../../shared/model/entity/pessoa';

@Component({
  selector: 'app-modal-editar-adm',
  templateUrl: './modal-editar-adm.component.html',
  styleUrl: './modal-editar-adm.component.scss'
})
export class ModalEditarAdmComponent {
  @Input() adm!: Pessoa;
  @Output() onClose = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<Pessoa>();

  isModalSenhaOpen = false;

  onCancelar(): void {
    this.onClose.emit();
  }

  onSalvar(): void {
    this.salvar.emit(this.adm);
  }

  abrirModal(): void {
    this.isModalSenhaOpen = true;
  }

  fecharModalSenha(): void {
    this.isModalSenhaOpen = false;
  }
}

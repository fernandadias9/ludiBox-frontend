import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal-confirmacao',
  templateUrl: './modal-confirmacao.component.html',
  styleUrls: ['./modal-confirmacao.component.scss']
})
export class ModalConfirmacaoComponent {
  @Input() titulo: string = 'Confirmação';
  @Input() mensagem: string = 'Você tem certeza?';
  @Output() onConfirmar = new EventEmitter<void>();
  @Output() onCancelar = new EventEmitter<void>();

  confirmar() {
    this.onConfirmar.emit();
  }

  cancelar() {
    this.onCancelar.emit();
  }
}

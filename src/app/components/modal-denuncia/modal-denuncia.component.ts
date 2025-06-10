import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-modal-denuncia',
  templateUrl: './modal-denuncia.component.html'
})
export class ModalDenunciaComponent {
  @Output() fechar = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<string>();

  motivoSelecionado: string = '';
  outroMotivo: string = '';

  opcoes = [
    'Conteúdo indevido.',
    'Preços abusivos.',
    'Publicação falsa.'
  ];

  onSalvar() {
    const motivo = this.motivoSelecionado === 'outro' ? this.outroMotivo : this.motivoSelecionado;
    this.salvar.emit(motivo);
  }

  fechaModal() {
    this.fechar.emit();
  }
}

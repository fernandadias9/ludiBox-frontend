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
    let motivoFinal = this.motivoSelecionado;

    if (this.outroMotivo && this.outroMotivo.trim() !== '') {
      motivoFinal += ' - ' + this.outroMotivo.trim();
    }

    this.salvar.emit(motivoFinal);
  }

  fechaModal() {
    this.fechar.emit();
  }
}

import { Component, EventEmitter, Output } from '@angular/core';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-denuncia',
  templateUrl: './modal-denuncia.component.html',
  styleUrls: ['./modal-denuncia.component.scss']
})
export class ModalDenunciaComponent {
  @Output() fechar = new EventEmitter<void>();
  @Output() salvar = new EventEmitter<{
    motivo: 'CONTEUDO_INDEVIDO' | 'PRECO_ABUSIVO' | 'PUBLICACAO_FALSA' | 'OUTRO',
    descricao: string
  }>();

  motivoSelecionado: 'CONTEUDO_INDEVIDO' | 'PRECO_ABUSIVO' | 'PUBLICACAO_FALSA' | 'OUTRO' | '' = '';
  outroMotivo: string = '';

  opcoes = [
    { label: 'Conteúdo indevido.', value: 'CONTEUDO_INDEVIDO' },
    { label: 'Preços abusivos.', value: 'PRECO_ABUSIVO' },
    { label: 'Publicação falsa.', value: 'PUBLICACAO_FALSA' },
    { label: 'Outro', value: 'OUTRO' }
  ];

  async onSalvar() {
    if (!this.motivoSelecionado) {
      await Swal.fire({
        icon: 'warning',
        title: 'Atenção',
        text: 'Por favor, selecione um motivo.'
      });
      return;
    }

    let descricaoFinal = '';

    if (this.motivoSelecionado === 'OUTRO') {
      if (!this.outroMotivo.trim()) {
        await Swal.fire({
          icon: 'warning',
          title: 'Atenção',
          text: 'Por favor, descreva o motivo da denúncia.'
        });
        return;
      }
      descricaoFinal = this.outroMotivo.trim();
    }

    this.salvar.emit({
      motivo: this.motivoSelecionado,
      descricao: descricaoFinal
    });
  }

  fechaModal() {
    this.fechar.emit();
  }
}

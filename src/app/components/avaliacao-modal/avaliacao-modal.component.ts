import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AvaliacaoService } from '../../shared/service/avaliacao.service';
import { AvaliacaoRequestDTO } from '../../shared/model/dto/avaliacaoRequestDTO';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-avaliacao-modal',
  templateUrl: './avaliacao-modal.component.html',
  styleUrl: './avaliacao-modal.component.scss'
})
export class AvaliacaoModalComponent {
  @Input() produtoLocacaoId!: number;
  @Output() closed = new EventEmitter<void>();
  @Output() saved = new EventEmitter<void>();

  estrelas = 0;
  comentario = '';

  constructor(private avaliacaoService: AvaliacaoService) {}

  setRating(n: number) {
    this.estrelas = n;
  }

  onCancel() {
    this.estrelas = 0;
    this.comentario = '';
    this.closed.emit();
  }

  onConfirm() {
    const payload: AvaliacaoRequestDTO = {
      produtoLocacaoId: this.produtoLocacaoId,
      estrelas: this.estrelas,
      comentario: this.comentario || undefined
    };
    this.avaliacaoService.salvarAvaliacao(payload).subscribe({
      next: () => {
        this.saved.emit();
        Swal.fire('Obrigado!', 'Sua avaliação foi enviada.', 'success');
      },
      error: () => {
        Swal.fire('Ops...', 'Não foi possível enviar sua avaliação.', 'error');
      }
    });
  }
}

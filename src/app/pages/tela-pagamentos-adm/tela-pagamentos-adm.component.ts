import { Component, OnInit } from '@angular/core';
import { PagamentoAnuncianteService } from '../../shared/service/pagamento-anunciante.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tela-pagamentos-adm',
  templateUrl: './tela-pagamentos-adm.component.html',
  styleUrls: ['./tela-pagamentos-adm.component.scss']
})
export class TelaPagamentosAdmComponent implements OnInit {
  pagamentos: any[] = [];

  filtro = {
    pago: null
  };

  status = [
    { value: 'true', label: 'Pago' },
    { value: 'false', label: 'Para pagar' }
  ];

  constructor(private pagamentoService: PagamentoAnuncianteService) { }

  ngOnInit(): void {
    this.buscarPagamentos();
  }

  buscarPagamentos(): void {
    this.pagamentoService.listarComFiltro(this.filtro).subscribe({
      next: (res) => {
        console.log('Pagamentos recebidos:', res);
        this.pagamentos = res;
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Não foi possível carregar os pagamentos.',
          confirmButtonText: 'Ok'
        });
      }
    });
  }

  pagar(id: number): void {
    Swal.fire({
      title: 'Confirmar pagamento?',
      text: 'Deseja marcar este pagamento como pago?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, pagar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.pagamentoService.pagar(id).subscribe(() => {
          Swal.fire('Sucesso!', 'Pagamento marcado como pago.', 'success');
          this.buscarPagamentos();
        });
      }
    });
  }

  limparFiltros(): void {
    this.filtro.pago = null;
    this.buscarPagamentos();
  }
}

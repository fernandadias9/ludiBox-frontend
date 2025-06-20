import { Component, OnInit } from '@angular/core';
import { DenunciaService } from '../../shared/service/denunciaService';
import { Denuncia } from '../../shared/model/entity/denuncia';
import Swal from 'sweetalert2';
import { EnumStatusProdutoDenunciado } from '../../shared/model/enum/EnumStatusProdutoDenunciado';

@Component({
  selector: 'app-tela-de-denuncias',
  templateUrl: './tela-de-denuncias.component.html',
  styleUrls: ['./tela-de-denuncias.component.scss']
})
export class TelaDeDenunciasComponent implements OnInit {
  denuncias: Denuncia[] = [];
  EnumStatusProdutoDenunciado = EnumStatusProdutoDenunciado;

  filtro = {
    dataInicio: '',
    dataFim: '',
    motivo: '',
    status: ''
  };

  status = [
    { value: 'NOVO', label: 'Novo' },
    { value: 'ANALISADO', label: 'Analisado' }
  ];

  motivos = [
    { value: 'CONTEUDO_INDEVIDO', label: 'Conteúdo indevido' },
    { value: 'PRECO_ABUSIVO', label: 'Preços abusivos' },
    { value: 'PUBLICACAO_FALSA', label: 'Publicação falsa' },
    { value: 'OUTRO', label: 'Outro' }
  ];

  constructor(private denunciaService: DenunciaService) { }

  ngOnInit(): void {
    this.buscarDenuncias();
  }

  buscarDenuncias(): void {
    this.denunciaService.listarComFiltro(this.filtro).subscribe({
      next: (res) => {
        console.log('Denúncias recebidas:', res);
        this.denuncias = res;
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Não foi possível carregar as denúncias. Tente novamente mais tarde.',
          confirmButtonText: 'Ok'
        });
      }
    });
  }

  permitir(id: number): void {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Deseja permitir essa publicação?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sim, permitir',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.denunciaService.permitir(id).subscribe(() => {
          Swal.fire('Permitido!', 'A publicação foi liberada.', 'success');
          this.buscarDenuncias();
        });
      }
    });
  }

  bloquear(id: number): void {
    Swal.fire({
      title: 'Tem certeza?',
      text: 'Deseja bloquear essa publicação?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sim, bloquear',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.denunciaService.bloquear(id).subscribe(() => {
          Swal.fire('Bloqueado!', 'A publicação foi bloqueada.', 'success');
          this.buscarDenuncias();
        });
      }
    });
  }

  verPublicacao(produtoId: number): void {
    window.open(`/produto/${produtoId}`, '_blank');
  }

  getMotivoLabel(motivo: string): string {
    const motivoMap: Record<string, string> = {
      'CONTEUDO_INDEVIDO': 'Conteúdo Indevido',
      'PRECO_ABUSIVO': 'Preço Abusivo',
      'PUBLICACAO_FALSA': 'Publicação Falsa',
      'OUTRO': 'Outro'
    };
    return motivoMap[motivo] || motivo;
  }

  limparFiltros(): void {
    this.filtro = {
      dataInicio: '',
      dataFim: '',
      motivo: '',
      status: ''
    };
    this.buscarDenuncias();
  }
}

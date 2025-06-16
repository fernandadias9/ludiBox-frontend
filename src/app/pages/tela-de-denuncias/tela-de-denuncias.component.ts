import { Component, OnInit } from '@angular/core';
import { Denuncia, DenunciaService } from '../../shared/service/denunciaService';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tela-de-denuncias',
  templateUrl: './tela-de-denuncias.component.html',
  styleUrls: ['./tela-de-denuncias.component.scss']
})
export class TelaDeDenunciasComponent implements OnInit {

  denuncias: Denuncia[] = [];

  filtro = {
    dataInicio: '',
    dataFim: '',
    motivo: '',
    status: ''
  };

  status = [
    { value: 'NOVO', label: 'Novo' },
    { value: 'ANALISADO', label: 'Analisado' },
  ];

  motivos = [
    { value: 'Conteúdo indevido.', label: 'Conteúdo indevido' },
    { value: 'Preços abusivos.', label: 'Preços abusivos' },
    { value: 'Publicação falsa.', label: 'Publicação falsa' },
    { value: 'Outro', label: 'Outro' },
  ];

  constructor(
    private denunciaService: DenunciaService
  ) {}

  ngOnInit(): void {
    this.buscarDenuncias();
  }

  buscarDenuncias(): void {
    this.denunciaService.listarComFiltro(this.filtro).subscribe({
      next: (res) => {
        this.denuncias = res;
      },
      error: (err) => {
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
    this.denunciaService.permitir(id).subscribe(() => this.buscarDenuncias());
  }

  bloquear(id: number): void {
    this.denunciaService.bloquear(id).subscribe(() => this.buscarDenuncias());
  }
}

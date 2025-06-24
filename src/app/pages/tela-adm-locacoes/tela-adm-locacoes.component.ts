import { Component, OnInit } from '@angular/core';
import { LocacaoService } from '../../shared/service/locacao.service';
import { Locacao } from '../../shared/model/entity/locacao';

@Component({
  selector: 'app-tela-adm-locacoes',
  templateUrl: './tela-adm-locacoes.component.html',
  styleUrls: ['./tela-adm-locacoes.component.scss']
})
export class TelaAdmLocacoesComponent implements OnInit {
  locacoes: Locacao[] = [];
  totalPeriodo: number = 0;

  filtro = {
    dataInicio: '',
    dataFim: '',
    valorMin: null as number | null,
    valorMax: null as number | null
  };

  constructor(private locacaoService: LocacaoService) {}

  ngOnInit(): void {
    this.buscarTodas();
  }

  buscarTodas() {
    this.locacaoService.listarTodas().subscribe({
      next: (dados) => {
        this.locacoes = dados;
        this.calcularTotal();
      }
    });
  }

  aplicarFiltro() {
    const params: any = {};

    if (this.filtro.dataInicio) params.dataInicio = this.filtro.dataInicio;
    if (this.filtro.dataFim) params.dataFim = this.filtro.dataFim;
    if (this.filtro.valorMin !== null) params.valorMin = this.filtro.valorMin;
    if (this.filtro.valorMax !== null) params.valorMax = this.filtro.valorMax;

    this.locacaoService.filtrarTodasLocacoes(params).subscribe({
      next: (dados) => {
        this.locacoes = dados;
        this.calcularTotal();
      }
    });
  }

  calcularTotal() {
    this.totalPeriodo = this.locacoes.reduce((total, loc) => total + (loc.valorTotal ?? 0), 0);
  }

  limparFiltros() {
    this.filtro = {
      dataInicio: '',
      dataFim: '',
      valorMin: null,
      valorMax: null
    };
    this.buscarTodas();
  }
}

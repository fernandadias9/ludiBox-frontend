import { Component, OnInit } from '@angular/core';
import { LocacaoService } from '../../shared/service/locacao.service';
import Swal from 'sweetalert2';
import { ValorBrutoMesDTO } from '../../shared/model/dto/ValorBrutoMesDTO';

@Component({
  selector: 'app-tela-adm-valor-bruto',
  templateUrl: './tela-adm-valor-bruto.component.html',
  styleUrl: './tela-adm-valor-bruto.component.scss'
})

export class TelaAdmValorBrutoComponent implements OnInit {
  valorBrutoMes: ValorBrutoMesDTO[] = [];
  filtro = {
    dataInicio: '',
    dataFim: '',
    valorMax: '',
    valorMin: ''
  };

  constructor(private locacaoService: LocacaoService) { }

  ngOnInit() {
    this.buscarComFiltroMensal();
  }

  buscarComFiltroMensal() {
  if (!this.filtro.dataInicio || !this.filtro.dataFim) {
    this.locacaoService.listarValorBrutoMensal('', '')
      .subscribe({
        next: (dados) => {
          this.valorBrutoMes = dados;
        },
        error: (err) => {
          console.error('Erro ao buscar valores brutos', err);
        }
      });
    return;
  }

  const [inicioAno, inicioMes] = this.filtro.dataInicio.split('-').map(Number);
  const [fimAno, fimMes] = this.filtro.dataFim.split('-').map(Number);

  const dataInicio = `${inicioAno}-${String(inicioMes).padStart(2, '0')}-01`;
  const ultimoDia = new Date(fimAno, fimMes, 0).getDate();
  const dataFim = `${fimAno}-${String(fimMes).padStart(2, '0')}-${ultimoDia}`;

  this.locacaoService.listarValorBrutoMensal(dataInicio, dataFim)
    .subscribe({
      next: (dados) => {
        this.valorBrutoMes = dados;
        console.log('Dados carregados:', dados);
      },
      error: (err) => {
        console.error('Erro ao buscar valores brutos', err);
        Swal.fire({
          icon: 'error',
          title: 'Erro ao carregar dados',
          text: 'Tente novamente mais tarde.',
          confirmButtonText: 'Ok',
        });
      }
    });
}

  limparFiltros() {
    this.filtro = {
      dataInicio: '',
      dataFim: '',
      valorMin: null,
      valorMax: null
    };
    this.buscarComFiltroMensal();
  }
}

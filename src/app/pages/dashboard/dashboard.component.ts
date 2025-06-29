import { Component, OnInit } from '@angular/core';
import { PessoaService } from '../../shared/service/PessoaService';
import { LocacaoService } from '../../shared/service/locacao.service';
import { DenunciaService } from '../../shared/service/denunciaService';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  numeroDeUsuariosAtivos: number = 0;
  quantidadeLocacoes = 0;
  quantidadeDenuncias = 0;
  valorBruto = 0;

  constructor(
    private locacaoService: LocacaoService,
    private pessoaService: PessoaService,
    private denunciaService: DenunciaService
  ) { }

  ngOnInit(): void {
    this.carregarUsuariosAtivos();
    this.buscarQuantidadeLocacoes();
    this.buscarQuantidadeDenuncias();
    this.buscarValorBruto();
  }

  carregarUsuariosAtivos(): void {
    this.pessoaService.buscarUsuariosAtivos().subscribe(
      dados => this.numeroDeUsuariosAtivos = dados.length,
      erro => console.error('Erro ao buscar usuários ativos:', erro)
    );
  }

  private buscarQuantidadeLocacoes() {
    this.locacaoService.quantidadeNoMesAtual()
      .subscribe(valor => this.quantidadeLocacoes = valor);
  }

  private buscarQuantidadeDenuncias() {
    this.denunciaService.quantidadeNoMesAtual()
      .subscribe(valor => this.quantidadeDenuncias = valor);
  }

  private buscarValorBruto() {
    this.locacaoService.valorBrutoNoMesAtual()
      .subscribe(valor => this.valorBruto = valor);
  }
}

import { Component, OnInit } from '@angular/core';
import { Locacao } from '../../shared/model/entity/locacao';
import { LocacaoService } from '../../shared/service/locacao.service';
import { LoginService } from '../../shared/service/LoginService';
import { StatusLocacao } from '../../shared/model/enum/StatusLocacao';
import { ProdutoLocacao } from '../../shared/model/entity/produtoLocacao';

@Component({
  selector: 'app-locacao-listagem',
  templateUrl: './locacao-listagem.component.html',
  styleUrl: './locacao-listagem.component.scss'
})
export class LocacaoListagemComponent implements OnInit {
  abaSelecionada: "recebidas" | "efetuadas" = "recebidas"
  locacoesRecebidas: ProdutoLocacao[] = []
  locacoesEfetuadas: Locacao[] = []
  userId: number
  public StatusLocacao = StatusLocacao;

  constructor(
    private locacaoService: LocacaoService,
    private loginService: LoginService,
  ) {}

  ngOnInit(): void {
    this.userId = this.loginService.buscarIdUsuarioComToken()
    this.carregarLocacoesEfetuadas();
    this.carregarLocacoesRecebidas();
  }

  selecionarAba(aba: "recebidas" | "efetuadas") {
    this.abaSelecionada = aba
  }

  public carregarLocacoesRecebidas(): void {
    if (!this.userId) return;

    this.locacaoService.buscarLocacoesRecebidas(this.userId).subscribe(
      (res: ProdutoLocacao[]) => {
        this.locacoesRecebidas = res;
      },
      (error) => {
        console.error('Erro ao buscar locações rebebidas: ', error);
      }
    );
  }

  public carregarLocacoesEfetuadas(): void {
    if (!this.userId) return;

    this.locacaoService.buscarLocacoesEfetuadas(this.userId).subscribe(
      (res: Locacao[]) => {
        this.locacoesEfetuadas = res;
      },
      (error) => {
        console.error('Erro ao buscar locações efetuadas: ', error);
      }
    );
  }

  formatarPeriodo(dataInicio: string, dataFim: string): string {
    const inicio = new Date(dataInicio)
    const fim = new Date(dataFim)
    return `${inicio.toLocaleDateString()} a ${fim.toLocaleDateString()}`
  }

  getValorTotalProduto(produtoLocacao: ProdutoLocacao): number {
    const dataInicio = new Date(produtoLocacao.dataInicio);
    const dataFim = new Date(produtoLocacao.dataFim);
    const diffTime = Math.abs(dataFim.getTime() - dataInicio.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return produtoLocacao.valorDiario * diffDays;
  }
}

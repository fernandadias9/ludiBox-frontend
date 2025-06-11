import { Component, OnInit } from '@angular/core';
import { Locacao } from '../../shared/model/entity/locacao';
import { LocacaoService } from '../../shared/service/locacao.service';
import { LoginService } from '../../shared/service/LoginService';
import { StatusLocacao } from '../../shared/model/enum/StatusLocacao';
import { ProdutoLocacao } from '../../shared/model/entity/produtoLocacao';
import Swal from 'sweetalert2';
import { PagamentoAnuncianteService } from '../../shared/service/pagamento-anunciante.service';

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
    private pagamentoService: PagamentoAnuncianteService
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

  atualizarStatusLocacao(produtoLocacao: ProdutoLocacao): void {
    const locacaoId = produtoLocacao.locacao.id;
    this.locacaoService.atualizarStatus(locacaoId, 'FINALIZADO').subscribe(
      () => {
        this.carregarLocacoesRecebidas();
      }
    );
  };

  abrirSelectPix(produtoLocacao: ProdutoLocacao) {
    Swal.fire({
      title: 'Escolher Pix de recebimento',
      input: 'select',
      inputOptions: {
        valorDocumento: `CPF/CNPJ - ${produtoLocacao.produto.anunciante?.valorDocumento}`,
        telefone: `Telefone - ${produtoLocacao.produto.anunciante?.telefone}`,
        email: `Email - ${produtoLocacao.produto.anunciante?.email}`,
      },
      inputPlaceholder: 'Selecione a chave Pix',
      showCancelButton: true,
    }).then(result => {
      if (result.isConfirmed && result.value) {
        var tipoChave = result.value;
        const valorChave = produtoLocacao.produto.anunciante?.[tipoChave];
        if (tipoChave === 'valorDocumento') {
          tipoChave = 'CPF/CNPJ';
        }

        Swal.fire({
          title: `A chave Pix escolhida foi ${valorChave}.`,
          text: 'Confirma a escolha?',
          icon: 'question',
          showCancelButton: true,
          confirmButtonText: 'Sim',
          cancelButtonText: 'Cancelar',
        }).then(confirm => {
          if (confirm.isConfirmed) {
            const pagamento = {
              dataLimiteLiberacao: produtoLocacao.dataInicio,
              nomeAnunciante: produtoLocacao.produto.anunciante?.nome,
              tipoChavePix: tipoChave,
              valorChavePix: valorChave,
              valor: produtoLocacao.totalProduto,
            };
            this.pagamentoService.salvarPagamento(pagamento).subscribe(() => {
              Swal.fire('Sucesso', 'Pagamento registrado com sucesso!', 'success');
            });
            this.atualizarStatusLocacao(produtoLocacao);
          }
        });
      }
    });
  }
}

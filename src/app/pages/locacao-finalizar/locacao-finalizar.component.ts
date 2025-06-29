import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LocacaoService } from '../../shared/service/locacao.service';
import { EnderecoService } from '../../shared/service/endereco.service';
import { LoginService } from '../../shared/service/LoginService';
import { Locacao } from '../../shared/model/entity/locacao';
import { Endereco } from '../../shared/model/entity/endereco';
import { ProdutoLocacao } from '../../shared/model/entity/produtoLocacao';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-locacao-finalizar',
  templateUrl: './locacao-finalizar.component.html',
  styleUrl: './locacao-finalizar.component.scss',
})
export class LocacaoFinalizarComponent implements OnInit {
  locacaoId!: number;
  produtos: any[] = [];
  enderecos: any[] = [];
  enderecoSelecionado: number | null = null;
  idUsuarioLogado: number | null = null;
  locacao: Locacao | null = null;
  enderecoCompletoSelecionado: Endereco | null = null;
  modalEnderecoAberto: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private locacaoService: LocacaoService,
    private enderecoService: EnderecoService,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.buscarUsuarioLogado();
    this.locacaoId = Number(this.route.snapshot.paramMap.get('id'));
    this.buscarLocacao();
    this.buscarEnderecos();
  }

  buscarUsuarioLogado() {
    try {
      this.idUsuarioLogado = this.loginService.buscarIdUsuarioComToken();
    } catch (err) {
      console.error('Erro ao buscar usuário logado', err);
    }
  }

  buscarLocacao() {
    this.locacaoService.buscarPorId(this.locacaoId).subscribe({
      next: (res) => {
        this.locacao = res;
        this.produtos = res.produtos || [];
      },
      error: (err) => console.error('Erro ao buscar locação', err),
    });
  }

  buscarEnderecos() {
    this.enderecoService.listarPorPessoa(this.idUsuarioLogado).subscribe({
      next: (res) => (this.enderecos = res),
    });
  }

  carregarEnderecoSelecionado() {
    if (this.enderecoSelecionado) {
      this.enderecoService.buscarPorId(this.enderecoSelecionado).subscribe({
        next: (res) => (this.enderecoCompletoSelecionado = res),
        error: (err) =>
          console.error('Erro ao buscar endereço selecionado', err),
      });
    }
  }

  removerItem(item: ProdutoLocacao): void {
    if (!item || !item.id || !this.locacaoId) return;

    this.locacaoService
      .removerProdutoDaLocacao(this.locacaoId, item.id)
      .subscribe({
        next: (locacaoAtualizada) => {
          Swal.fire({
            icon: 'success',
            title: 'Produto removido com sucesso',
            timer: 2000,
            showConfirmButton: false,
          });
          this.locacao.valorTotal = locacaoAtualizada.valorTotal;
          this.produtos = locacaoAtualizada.produtos;
        },
        error: (err) => {
          console.error('Erro ao remover produto da locação:', err);
        },
      });
  }

  irParaPagamento() {
    if (!this.enderecoSelecionado || !this.idUsuarioLogado || !this.locacaoId) {
      Swal.fire(
        'Erro',
        'Por favor, selecione um endereço antes de prosseguir.',
        'error'
      );
      return;
    }

    Swal.fire({
      title: 'Redirecionamento para pagamento',
      text: 'Você será redirecionado para a plataforma de pagamentos Mercado Pago.',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'OK',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.locacaoService
          .finalizarLocacao(
            this.locacaoId,
            this.enderecoSelecionado,
            this.idUsuarioLogado!
          )
          .subscribe({
            next: () => {
              Swal.fire({
                icon: 'success',
                title: 'Locação finalizada com sucesso',
                timer: 2000,
                showConfirmButton: false,
              });
              this.router.navigate(['/']);
            },
            error: (err) => {
              console.error('Erro ao finalizar locação:', err);
              Swal.fire(
                'Erro',
                'Ocorreu um erro ao finalizar a locação.',
                'error'
              );
            },
          });
      }
    });
  }

  abrirModal() {
    this.modalEnderecoAberto = true;
  }

  fecharModal() {
    this.modalEnderecoAberto = false;
  }

  onEnderecoAdicionado() {
    this.fecharModal();

    this.enderecoService.listarPorPessoa(this.idUsuarioLogado).subscribe({
      next: (res) => {
        this.enderecos = res;
        const ultimoEndereco = res[res.length - 1];
        this.enderecoSelecionado = ultimoEndereco?.id;
        this.carregarEnderecoSelecionado();
      },
      error: (err) => {
        console.error('Erro ao recarregar endereços após adição:', err);
      },
    });
  }
}

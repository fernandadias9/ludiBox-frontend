import { Component } from '@angular/core';
import { Produto } from '../../shared/model/entity/produto';
import { ProdutoService } from '../../shared/service/produto.service';
import Swal from 'sweetalert2';
import { LoginService } from '../../shared/service/LoginService';

@Component({
  selector: 'app-anuncios-crud',
  templateUrl: './anuncios-crud.component.html',
  styleUrl: './anuncios-crud.component.scss',
})
export class AnunciosCrudComponent {
  isOpen: boolean = false;
  idUsuario: number | undefined;
  anuncios: Produto[] = [];
  produtoSendoEditado: Produto | null = null;

  constructor(private produtoService: ProdutoService, private loginService: LoginService) { }

  ngOnInit(): void {
    this.idUsuario = this.loginService.buscarIdUsuarioComToken();
    if (this.idUsuario) {
      this.listarPorPessoa();
    }
  }

  public listarPorPessoa(): void {
    if (!this.idUsuario) return;

    this.produtoService.listarProdutosPorPessoa(this.idUsuario).subscribe(
      (res: Produto[]) => {
        this.anuncios = res;
      },
      (error) => {
        console.error('Erro ao buscar anúncios:', error);
      }
    );
  }

  abrirModal() {
    this.produtoSendoEditado = null;
    this.isOpen = true;
  }

  abrirModalEdicao(produto: Produto) {
    this.produtoSendoEditado = produto;
    this.isOpen = true;
  }

  fecharModal() {
    this.isOpen = false;
  }

  onProdutoAdicionado() {
    this.listarPorPessoa();
    this.fecharModal();
  }

  deletarProduto(id: number) {
    Swal.fire({
      title: 'Tem certeza que deseja deletar este anúncio?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, deletar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.produtoService.deletar(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Anúncio deletado com sucesso',
              showConfirmButton: false,
              timer: 2000,
            });
            this.listarPorPessoa();
          },
          error: (err) => {
            Swal.fire({
              icon: 'error',
              title: 'Erro ao deletar anúncio',
              text: err.error?.message || err.message,
              showConfirmButton: false,
              timer: 2000,
            });
          },
        });
      }
    })
  }
}

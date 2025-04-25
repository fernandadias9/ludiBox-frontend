import { Component } from '@angular/core';
import { Produto } from '../../shared/model/entity/produto';
import { ProdutoService } from '../../shared/service/produto.service';

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

  constructor(private produtoService: ProdutoService) {}

  ngOnInit(): void {
    const id = localStorage.getItem('idUsuarioAutenticado');
    if (id) {
      this.idUsuario = parseInt(id);
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
  }

  deletarProduto(id: number) {
    this.produtoService.deletar(id).subscribe(() => {
      this.listarPorPessoa();
    });
  }
}

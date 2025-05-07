import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProdutoService } from '../../shared/service/produto.service';
import { Produto } from '../../shared/model/entity/produto';

@Component({
  selector: 'app-modal-anuncios',
  templateUrl: './modal-anuncios.component.html',
  styleUrl: './modal-anuncios.component.scss',
})
export class ModalAnunciosComponent {
  @Output() onClose = new EventEmitter<void>();
  @Output() onProdutoAdicionado = new EventEmitter<void>();

  @Input() set produtoEditando(value: Produto | null) {
    this._produtoEditando = value;

    if (value) {
      this.produtoForm.patchValue(value);
      this.imagensExistentes = value.imagens || [];
    }
  }

  get produtoEditando(): Produto | null {
    return this._produtoEditando;
  }

  private _produtoEditando: Produto | null = null;

  produtoForm: FormGroup;
  arquivosImagens: File[] = [];
  imagensExistentes: string[] = [];

  constructor(private fb: FormBuilder, private produtoService: ProdutoService) {
    this.produtoForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      descricao: ['', Validators.required],
      altura: [''],
      largura: [''],
      comprimento: [''],
      pesoSuportado: [''],
      estoque: ['', [Validators.required]],
      preco: ['', [Validators.required]],
    });
  }

  salvar() {
    if (this.produtoForm.valid) {
      const produto: Produto = this.produtoForm.value;
      produto.imagens = [...this.imagensExistentes];

      if (this.produtoEditando) {
        this.produtoService
          .atualizar(this.produtoEditando.id, produto, this.arquivosImagens)
          .subscribe(() => {
            this.onProdutoAdicionado.emit();
            this.fechar();
          });
      } else {
        if (this.arquivosImagens.length > 0) {
          this.produtoService
            .salvar(produto, this.arquivosImagens)
            .subscribe(() => {
              this.onProdutoAdicionado.emit();
              this.fechar();
            });
        } else {
          this.produtoForm.markAllAsTouched();
          this.fechar();
          return;
        }
      }
    } else {
      this.produtoForm.markAllAsTouched()
    }
  }

  removerImagemExistente(index: number) {
    this.imagensExistentes.splice(index, 1);
  }

  fechar() {
    this.produtoEditando = null;
    this.imagensExistentes = [];
    this.arquivosImagens = [];
    this.produtoForm.reset();
    this.onClose.emit();
  }
}

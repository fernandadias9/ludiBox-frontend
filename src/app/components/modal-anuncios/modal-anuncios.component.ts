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
      // Aqui você poderia carregar prévias das imagens caso deseje
    }
  }

  get produtoEditando(): Produto | null {
    return this._produtoEditando;
  }

  private _produtoEditando: Produto | null = null;

  produtoForm: FormGroup;
  arquivosImagens: File[] = [];

  constructor(private fb: FormBuilder, private produtoService: ProdutoService) {
    this.produtoForm = this.fb.group({
      nome: ['', Validators.required],
      descricao: ['', Validators.required],
      altura: [null],
      largura: [null],
      comprimento: [null],
      pesoSuportado: [null],
      estoque: [null, [Validators.required]],
      preco: [null, [Validators.required]]
    });
  }

  salvar() {
    if (this.produtoForm.valid && this.arquivosImagens.length > 0) {
      const produto: Produto = this.produtoForm.value;

      if (this.produtoEditando) {
        // Atualização ainda não implementada no backend com imagens
        return;
      }

      this.produtoService.salvar(produto, this.arquivosImagens).subscribe(() => {
        this.onProdutoAdicionado.emit();
        this.fechar();
      });
    } else {
      this.produtoForm.markAllAsTouched();
    }
  }

  fechar() {
    this.produtoEditando = null;
    this.produtoForm.reset();
    this.arquivosImagens = [];
    this.onClose.emit();
  }
}

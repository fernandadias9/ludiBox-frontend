import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProdutoService } from '../../shared/service/produto.service';
import { Produto } from '../../shared/model/entity/produto';
import Swal from 'sweetalert2';

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
      this.imagensExistentes = [...(value.imagens || [])];
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
      nome: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50)
        ]
      ],
      descricao: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(150)
        ]
      ],
      altura: [''],
      largura: [''],
      comprimento: [''],
      pesoSuportado: [''],
      estoque: [
        '',
        [
          Validators.required,
          Validators.maxLength(3),
          Validators.pattern(/^[0-9]*$/)
        ]
      ],
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
        .subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Anúncio editado com sucesso',
              showConfirmButton: false,
              timer: 2000
            });
            this.onProdutoAdicionado.emit();
            this.fechar();
          },
          error: err => {
            Swal.fire({
              icon: 'error',
              title: 'Não foi possível editar anúncio',
              text: err.error?.message || err.message,
              showConfirmButton: false,
              timer: 2000
            });
          }
        });
    } else {
      if (this.arquivosImagens.length > 0) {
        this.produtoService.salvar(produto, this.arquivosImagens).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Anúncio criado com sucesso',
              showConfirmButton: false,
              timer: 2000
            });
            this.onProdutoAdicionado.emit();
            this.fechar();
          },
          error: (err) => {
            console.log('Erro:', err);

            const mensagem =
              err.error?.detalhes ||
              err.error?.erro ||
              err.error?.message ||
              err.message ||
              'Erro desconhecido';

            if (err.status === 422) {
              Swal.fire({
                icon: 'error',
                title: 'Conteúdo inválido, Evite SPAM ou linguagem ofensiva.',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true
              });
            } else {
              Swal.fire({
                icon: 'error',
                title: 'Não foi possível criar anúncio',
                text: mensagem,
                showConfirmButton: false,
                timer: 3000
              });
            }
          }
        });
      } else {
        this.produtoForm.markAllAsTouched();
        Swal.fire({
          icon: 'error',
          title: 'Selecione pelo menos uma imagem para o anúncio',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        });
        return;
      }
    }
  } else {
    this.produtoForm.markAllAsTouched();
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

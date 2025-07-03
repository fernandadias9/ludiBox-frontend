import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ProdutoService } from '../../shared/service/produto.service';
import { Produto } from '../../shared/model/entity/produto';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-anuncios',
  templateUrl: './modal-anuncios.component.html',
  styleUrl: './modal-anuncios.component.scss',
})
export class ModalAnunciosComponent implements OnInit {
  @Output() onClose = new EventEmitter<void>();
  @Output() onProdutoAdicionado = new EventEmitter<void>();
  registrarDisabled = false;

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
      preco: ['', [Validators.required]]
    }, {
      validators: this.imagensValidator.bind(this)
    });
  }

  ngOnInit(): void {
    this.registrarDisabled = false;
  }

salvar() {
  this.registrarDisabled = true;
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
    }
  } else {
    this.produtoForm.markAllAsTouched();
  }
}

  removerImagemExistente(index: number) {
    this.imagensExistentes.splice(index, 1);
    this.produtoForm.updateValueAndValidity();
  }

  fechar() {
    this.produtoEditando = null;
    this.imagensExistentes = [];
    this.arquivosImagens = [];
    this.produtoForm.reset();
    this.onClose.emit();
  }

  imagensValidator(control: AbstractControl): ValidationErrors | null {
    if (this.produtoEditando && this.imagensExistentes.length > 0) {
      return null;
    }

    if (!this.produtoEditando && this.arquivosImagens.length === 0) {
      return { imagensObrigatorias: true };
    }

    if (this.produtoEditando && this.imagensExistentes.length === 0 && this.arquivosImagens.length === 0) {
      return { imagensObrigatorias: true };
    }

    return null;
  }

  onArquivosAlterados(arquivos: File[]) {
    this.arquivosImagens = arquivos;
    this.produtoForm.updateValueAndValidity();
  }
}

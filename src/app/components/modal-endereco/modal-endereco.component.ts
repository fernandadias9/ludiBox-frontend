import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EnderecoService } from '../../shared/service/endereco.service';
import Swal from 'sweetalert2';
import { skip } from 'rxjs';

@Component({
  selector: 'app-modal-endereco',
  templateUrl: './modal-endereco.component.html',
  styleUrl: './modal-endereco.component.scss'
})
export class ModalEnderecoComponent {
  @Output() onClose = new EventEmitter<void>();
  @Output() onEnderecoAdicionado = new EventEmitter<void>();

  @Input() set enderecoEditando(value: any) {
    this._enderecoEditando = value;

    if (value) {
      this.enderecoForm.patchValue(value);
    }
  }
  get enderecoEditando() {
    return this._enderecoEditando;
  }
  private _enderecoEditando: any = null;

  enderecoForm: FormGroup;
  estados: string[] = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES',
    'GO', 'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR',
    'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
    'SP', 'SE', 'TO'
  ];

  constructor(private fb: FormBuilder, private enderecoService: EnderecoService) {
    this.enderecoForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      cep: ['', [Validators.required]],
      rua: ['', [Validators.required, Validators.minLength(3)]],
      numero: [''],
      complemento: [''],
      bairro: ['', [Validators.required, Validators.minLength(3)]],
      cidade: ['', [Validators.required, Validators.minLength(3)]],
      estado: ['', [Validators.required, Validators.minLength(2)]],
      semNumero: [false]
    });

    this.handleSemNumeroChanges();
  }

  handleSemNumeroChanges() {
    this.enderecoForm.get('semNumero')?.valueChanges.subscribe((semNumero: boolean) => {
      const numeroControl = this.enderecoForm.get('numero');
      const complementoControl = this.enderecoForm.get('complemento');

      if (semNumero) {
        numeroControl?.clearValidators();
        complementoControl?.setValidators([Validators.required]);
      } else {
        numeroControl?.setValidators([Validators.required]);
        complementoControl?.clearValidators();
      }

      numeroControl?.updateValueAndValidity();
      complementoControl?.updateValueAndValidity();
    });
  }

  salvar() {
    if (this.enderecoForm.valid) {
      const dados = this.enderecoForm.value;
      dados.cep = Number(String(dados.cep).replace(/\D/g, ''));

      if (this.enderecoEditando) {
        this.enderecoService.atualizarEndereco(this.enderecoEditando.id, dados).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Endereço editado com sucesso',
              showConfirmButton: false,
              timer: 2000
            });
            this.onEnderecoAdicionado.emit();
            this.fechar();
          },
          error: err => {
            Swal.fire({
              icon: 'error',
              title: 'Não foi possível editar endereço',
              text: err.error?.message || err.message,
              showConfirmButton: false,
              timer: 2000
            });
          }
        });
      } else {
        this.enderecoService.salvarEndereco(dados).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Endereço salvo com sucesso',
              showConfirmButton: false,
              timer: 2000
            });
            this.onEnderecoAdicionado.emit();
            this.fechar();
          },
          error: err => {
            Swal.fire({
              icon: 'error',
              title: 'Não foi possível salvar endereço',
              text: err.error?.message || err.message,
              showConfirmButton: false,
              timer: 2000
            });
          }
        });
      }
    } else {
      this.enderecoForm.markAllAsTouched();
    }
  }

  onCepInput(event: any) {
    let value = event.target.value.replace(/\D/g, '');

    if (value.length > 5) {
      value = value.substring(0, 5) + '-' + value.substring(5, 7);
    }

    if (value.length > 8) {
      value = value.substring(0, 8);
    }

    this.enderecoForm.get('cep')?.setValue(value, { emitEvent: false });
  }

  fechar() {
    this.enderecoEditando = null;
    this.enderecoForm.reset({ semNumero: false });
    this.onClose.emit();
  }
}
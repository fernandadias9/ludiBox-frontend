import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EnderecoService } from '../../shared/service/endereco.service';
import Swal from 'sweetalert2';
import { skip } from 'rxjs';

@Component({
  selector: 'app-modal-endereco',
  templateUrl: './modal-endereco.component.html',
  styleUrl: './modal-endereco.component.scss'
})
export class ModalEnderecoComponent implements OnInit {
  @Output() onClose = new EventEmitter<void>();
  @Output() onEnderecoAdicionado = new EventEmitter<void>();

  @Input() set enderecoEditando(value: any) {
    this._enderecoEditando = value;

    if (value) {
      const sigla = this.estadosPorExtenso[value.estado] || value.estado;
      this.enderecoForm.patchValue({ ...value, estado: sigla });
    }
  }
  get enderecoEditando() {
    return this._enderecoEditando;
  }
  private _enderecoEditando: any = null;

  enderecoForm: FormGroup;

  estadosPorExtenso: { [key: string]: string } = {
    'Acre': 'AC', 'Alagoas': 'AL', 'Amapá': 'AP', 'Amazonas': 'AM',
    'Bahia': 'BA', 'Ceará': 'CE', 'Distrito Federal': 'DF', 'Espírito Santo': 'ES',
    'Goiás': 'GO', 'Maranhão': 'MA', 'Mato Grosso': 'MT', 'Mato Grosso do Sul': 'MS',
    'Minas Gerais': 'MG', 'Pará': 'PA', 'Paraíba': 'PB', 'Paraná': 'PR',
    'Pernambuco': 'PE', 'Piauí': 'PI', 'Rio de Janeiro': 'RJ', 'Rio Grande do Norte': 'RN',
    'Rio Grande do Sul': 'RS', 'Rondônia': 'RO', 'Roraima': 'RR', 'Santa Catarina': 'SC',
    'São Paulo': 'SP', 'Sergipe': 'SE', 'Tocantins': 'TO'
  };


  constructor(private fb: FormBuilder, private enderecoService: EnderecoService) {
    this.enderecoForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      cep: ['', [Validators.required, Validators.minLength(9), Validators.maxLength(9)]],
      rua: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(200)]],
      numero: ['', [Validators.required]],
      complemento: [''],
      bairro: ['', [Validators.required, Validators.minLength(3)]],
      cidade: ['', [Validators.required, Validators.minLength(3)]],
      estado: ['', [Validators.required, Validators.minLength(2)]],
      semNumero: [false]
    });

    this.enderecoForm.get('cidade')?.disable({ emitEvent: false });
    this.enderecoForm.get('estado')?.disable({ emitEvent: false });

    this.enderecoForm.get('cep')!.valueChanges.subscribe(raw => {
      if (raw == null) return;

      const digits = raw.replace(/\D/g, '').slice(0, 8);

      const masked = digits.length > 5
        ? digits.slice(0, 5) + '-' + digits.slice(5)
        : digits;


      if (raw !== masked) {
        this.enderecoForm.get('cep')!.setValue(masked, { emitEvent: false });
      }
    });
  }

  ngOnInit(): void {
    this.setupSemNumeroListener();
  }

  setupSemNumeroListener() {
    this.enderecoForm.get('semNumero')?.valueChanges.subscribe((semNumero: boolean) => {
      const numeroControl = this.enderecoForm.get('numero');
      const complementoControl = this.enderecoForm.get('complemento');

      const foiInteracaoUsuario = this.enderecoForm.get('semNumero')?.dirty;

      if (semNumero && foiInteracaoUsuario) {
        Swal.fire({
          icon: 'info',
          title: 'Aviso',
          text: 'Para endereços sem número o complemento é obrigatório',
        });
      }

      if (semNumero) {
        numeroControl?.setValue('');
        numeroControl?.disable();
        numeroControl?.clearValidators();
        complementoControl?.enable();
        complementoControl?.setValidators([Validators.required]);
      } else {
        numeroControl?.enable();
        numeroControl?.setValidators([Validators.required]);
        complementoControl?.clearValidators();
      }

      numeroControl?.updateValueAndValidity();
      complementoControl?.updateValueAndValidity();
    });
  }

  buscarEnderecoPorCep() {
    const cepMasked = this.enderecoForm.get('cep')?.value || '';
    const cepDigits = cepMasked.replace(/\D/g, '');

    if (cepDigits.length !== 8) {
      Swal.fire('Erro', 'Informe um CEP válido de 8 dígitos.', 'error');
      return;
    }

    this.enderecoService.buscarPorCep(cepDigits).subscribe({
      next: (data: any) => {
        if (!data.uf || !data.localidade) {
          Swal.fire('Erro', 'CEP não encontrado, favor informar um CEP válido', 'error');
          this.enderecoForm.patchValue({
            rua: '',
            bairro: '',
            cidade: '',
            estado: ''
          });
          return;
        }

        this.enderecoForm.patchValue({
          rua: data.logradouro || '',
          bairro: data.bairro || '',
          cidade: data.localidade,
          estado: data.uf
        });
      },
      error: () => {
        Swal.fire('Erro', 'Algo deu errado ao consultar o CEP', 'error');
      }
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
    this.enderecoForm.get('semNumero')?.setValue(false, { emitEvent: false });
    this.enderecoForm.reset({ semNumero: false }, { emitEvent: false });

    this.enderecoForm.get('numero')?.enable({ emitEvent: false });

    this._enderecoEditando = null;
    this.onClose.emit();
  }
}

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EnderecoService } from '../../shared/service/endereco.service';
import Swal from 'sweetalert2';

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
      const sigla = this.estadosPorExtenso[value.estado] || value.estado;
      this.enderecoForm.patchValue({ ...value, estado: sigla });
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

  buscarEnderecoPorCep() {
    const cep = this.enderecoForm.get('cep')?.value;
    if (!cep || cep.length < 8) return;

    this.enderecoService.buscarPorCep(cep).subscribe({
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
      error: (err) => {
        Swal.fire('Erro', 'Algo deu errado ao consultar o CEP', 'error');
      }
    });
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
      dados.cep = Number(dados.cep);

      if (this.enderecoEditando) {
        this.enderecoService.atualizarEndereco(this.enderecoEditando.id, dados).subscribe(() => {
          this.onEnderecoAdicionado.emit();
          this.fechar();
        });
      } else {
        this.enderecoService.salvarEndereco(dados).subscribe(() => {
          this.onEnderecoAdicionado.emit();
          this.fechar();
        });
      }
    } else {
      this.enderecoForm.markAllAsTouched();
    }
  }


  fechar() {
    this.enderecoEditando = null;
    this.enderecoForm.reset({ semNumero: false });
    this.onClose.emit();
  }
}

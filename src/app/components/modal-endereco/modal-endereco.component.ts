import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EnderecoService } from '../../shared/service/endereco.service';

@Component({
  selector: 'app-modal-endereco',
  templateUrl: './modal-endereco.component.html',
  styleUrl: './modal-endereco.component.scss'
})
export class ModalEnderecoComponent {
  @Output() onClose = new EventEmitter<void>();
  @Output() onEnderecoAdicionado = new EventEmitter<void>();

  enderecoForm: FormGroup;

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
    });
  }

  salvar() {
    if (this.enderecoForm.valid) {
      this.enderecoService.salvarEndereco(this.enderecoForm.value).subscribe(() => {
        this.onEnderecoAdicionado.emit();
        this.onClose.emit();
      });
    }
  }

  fechar() {
    this.onClose.emit();
  }
}

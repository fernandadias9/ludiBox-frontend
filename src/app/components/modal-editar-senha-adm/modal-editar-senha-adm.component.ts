// modal-editar-senha-adm.component.ts

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { PessoaService } from '../../shared/service/PessoaService';

@Component({
  selector: 'app-modal-editar-senha-adm',
  templateUrl: './modal-editar-senha-adm.component.html',
  styleUrl: './modal-editar-senha-adm.component.scss'
})
export class ModalEditarSenhaAdmComponent {

  @Input() idUsuario!: number;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSenhaAlterada = new EventEmitter<void>();

  senhaAdmForm: FormGroup;
  formSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private pessoaService: PessoaService
  ) {
    this.senhaAdmForm = this.fb.group({
      novaSenha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required, Validators.minLength(6)]],
    }, {
      validators: this.matchPasswords
    });
  }

  get f() {
    return this.senhaAdmForm.controls;
  }

  matchPasswords(group: FormGroup) {
    const novaSenha = group.get('novaSenha')?.value;
    const confirmarSenha = group.get('confirmarSenha')?.value;

    if (!novaSenha || !confirmarSenha) {
      return null;
    }

    return novaSenha === confirmarSenha ? null : { senhasDiferentes: true };
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.senhaAdmForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched || this.formSubmitted));
  }

  salvarSenha() {
    this.formSubmitted = true;

    if (this.senhaAdmForm.invalid) {
      return;
    }

    const novaSenha = this.senhaAdmForm.value.novaSenha;

    this.pessoaService.alterarSenhaAdm(this.idUsuario, novaSenha).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Senha alterada com sucesso!',
          showConfirmButton: false,
          timer: 1500
        });
        this.onSenhaAlterada.emit();
        this.fecharModal();
      },
      error: (erro) => {
        Swal.fire({
          icon: 'error',
          title: 'Erro ao alterar a senha',
          text: erro?.error?.mensagem || 'Ocorreu um erro ao tentar alterar a senha.',
        });
      }
    });
  }

  fecharModal() {
    this.onClose.emit();
    this.formSubmitted = false;
    this.senhaAdmForm.reset();
  }
}

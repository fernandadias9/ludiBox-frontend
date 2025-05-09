import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { EmailService } from '../../shared/service/emailService';
import { SenhasDTO } from '../../shared/model/dto/SenhasDTO';

@Component({
  selector: 'app-modal-alterar-senha',
  templateUrl: './modal-alterar-senha.component.html',
  styleUrls: ['./modal-alterar-senha.component.scss']
})
export class ModalAlterarSenhaComponent {
  @Output() onClose = new EventEmitter<void>();  
  @Output() onSenhaAlterada = new EventEmitter<void>(); 
  
  senhaForm: FormGroup;
  dto: SenhasDTO;
  formSubmitted = false; 

  constructor(
    private fb: FormBuilder,
    private emailService: EmailService
  ) {
    this.senhaForm = this.fb.group({
      senhaAtual: ['', [Validators.required]],
      novaSenha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required, Validators.minLength(6)]],
    }, {
      validators: this.matchPasswords
    });
  } 

  get f() {
    return this.senhaForm.controls
  }

  isFieldInvalid(fieldName: string): boolean {
    return this.formSubmitted && this.f[fieldName].invalid
    
  }

  matchPasswords(group: FormGroup) {
    const novaSenha = group.get('novaSenha')?.value;
    const confirmarSenha = group.get('confirmarSenha')?.value;
    if (novaSenha.length < 6 || confirmarSenha.length < 6) {
      return null 
    } else {
      return novaSenha === confirmarSenha ? null : { senhasDiferentes: true };
    }
  }

  salvarSenha() {
    this.formSubmitted = true;
    console.log(this.senhaForm.value)
    console.log(this.senhaForm.valid)
    console.log(this.senhaForm.invalid)
    if (this.senhaForm.invalid) {
      return;
    }

    if (this.senhaForm.valid) {
      const dados = this.senhaForm.value;
      this.dto = {
        senhaAtual: dados.senhaAtual,
        novaSenha: dados.novaSenha,
        confirmarSenha: dados.confirmarSenha
      };
      this.emailService.alterarSenha(this.dto).subscribe({
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
  }

  fecharModal() {
    this.onClose.emit();
    this.formSubmitted = false; // Zera estado de envio manual
    this.senhaForm.reset({
      senhaAtual: '',
      novaSenha: '',
      confirmarSenha: ''
    });
    
  }
  
}

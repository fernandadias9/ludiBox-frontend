import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-alterar-senha',
  templateUrl: './modal-alterar-senha.component.html',
  styleUrls: ['./modal-alterar-senha.component.scss']
})
export class ModalAlterarSenhaComponent {
  @Output() onClose = new EventEmitter<void>();  
  @Output() onSenhaAlterada = new EventEmitter<void>();  

  senhaForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.senhaForm = this.fb.group({
      senhaAtual: ['', [Validators.required]],
      novaSenha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', [Validators.required]],
    }, {
      validators: this.matchPasswords 
    });
  }


  matchPasswords(group: FormGroup) {
    const novaSenha = group.get('novaSenha')?.value;
    const confirmarSenha = group.get('confirmarSenha')?.value;
    return novaSenha === confirmarSenha ? null : { senhasDiferentes: true };
  }


  salvarSenha() {
    if (this.senhaForm.valid) {
      const dados = this.senhaForm.value;
      // Aqui você pode chamar um serviço para salvar a nova senha, por exemplo:
      // this.senhaService.alterarSenha(dados.senhaAtual, dados.novaSenha).subscribe({
      //   next: () => {
      //     Swal.fire({
      //       icon: 'success',
      //       title: 'Senha alterada com sucesso!',
      //       showConfirmButton: false,
      //       timer: 1500
      //     });
      //     this.onSenhaAlterada.emit();
      //     this.fecharModal();
      //   },
      //   error: (erro) => {
      //     Swal.fire({
      //       icon: 'error',
      //       title: 'Erro ao alterar a senha',
      //       text: erro?.error?.mensagem || 'Ocorreu um erro ao tentar alterar a senha.',
      //     });
      //   }
      // });

      // Para fins de exemplo:
      Swal.fire({
        icon: 'success',
        title: 'Senha alterada com sucesso!',
        showConfirmButton: false,
        timer: 1500
      });
      this.onSenhaAlterada.emit();
      this.fecharModal();
    } else {
      this.senhaForm.markAllAsTouched();
      Swal.fire({
        icon: 'warning',
        title: 'Formulário inválido',
        text: 'Por favor, preencha todos os campos obrigatórios corretamente.',
      });
    }
  }


  fecharModal() {
    this.senhaForm.reset();  
    this.onClose.emit();  
  }
}

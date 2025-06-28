import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { LoginService } from '../../shared/service/LoginService';
import { Pessoa } from '../../shared/model/entity/pessoa';
import { EnumDocumento } from '../../shared/model/enum/EnumDocumento';

@Component({
  selector: 'app-cadastro-administrador',
  templateUrl: './cadastro-administrador.component.html',
  styleUrl: './cadastro-administrador.component.scss'
})
export class CadastroAdministradorComponent implements OnInit {
  cadastroAdmForm!: FormGroup;
  formSubmitted = false;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.cadastroAdmForm = this.formBuilder.group({
      nome: ['', [Validators.required, Validators.minLength(3)]],
      valorDocumento: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      telefone: ['', Validators.required],
      senha: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(10)]],
      confirmarSenha: ['', Validators.required],
    });
  }

  cadastrarAdm(): void {
    this.formSubmitted = true;

    if (this.cadastroAdmForm.invalid) {
      Swal.fire({
        title: 'Erro!',
        text: 'Por favor, preencha todos os campos obrigatórios corretamente.',
        icon: 'error',
      });
      return;
    }

    const { nome, valorDocumento, email, telefone, senha, confirmarSenha } = this.cadastroAdmForm.value;

    if (senha !== confirmarSenha) {
      Swal.fire({
        title: 'Erro!',
        text: 'As senhas não coincidem.',
        icon: 'error',
      });
      return;
    }

    const novoAdmin: Pessoa = {
      id: 0,
      nome,
      valorDocumento,
      email,
      telefone,
      senha,
      tipoDocumento: EnumDocumento.CPF,
    };

    this.loginService.cadastrarAdm(novoAdmin).subscribe({
      next: () => {
        Swal.fire('Sucesso!', 'Administrador cadastrado com sucesso!', 'success');
        this.router.navigate(['/administradores']);
      },
      error: (error) => {
        if (error?.error?.message) {
          const msg = error.error.message.toLowerCase();

          if (msg.includes('email já cadastrado') || msg.includes('email existente')) {
            Swal.fire('Erro!', 'Este e-mail já está cadastrado.', 'error');
            return;
          }
          if (msg.includes('cpf já cadastrado') || msg.includes('documento existente')) {
            Swal.fire('Erro!', 'Este CPF já está cadastrado.', 'error');
            return;
          }
        }

        Swal.fire('Erro!', 'Falha ao cadastrar administrador.', 'error');
      }
    });
  }
}

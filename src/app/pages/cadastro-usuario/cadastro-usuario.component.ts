import { Component, HostListener, OnInit } from '@angular/core';
import { FormBuilder, type FormGroup, Validators } from '@angular/forms';
import { LoginService } from '../../shared/service/LoginService';
import type { Pessoa } from '../../shared/model/entity/pessoa';
import { EnumDocumento } from '../../shared/model/enum/EnumDocumento';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro-usuario',
  templateUrl: './cadastro-usuario.component.html',
  styleUrl: './cadastro-usuario.component.scss',
})
export class CadastroUsuarioComponent implements OnInit {
  isPessoaJuridica = false;
  aceitaTermos = false;
  snChecked = false;
  withOverflow = false;
  confirmarSenha = '';
  cadastroForm: FormGroup;
  formSubmitted = false;
  registrarDisabled = false;
  showTermsModal = false;

  public pessoa: Pessoa = {
    id: 0,
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    tipoDocumento: EnumDocumento.CPF,
    valorDocumento: '',
  };

  constructor(
    private loginService: LoginService,
    private router: Router,
    private formBuilder: FormBuilder
  ) {
    this.updateWithOverflow(window.innerWidth);
    this.initForm();
  }

  ngOnInit(): void {
    this.registrarDisabled = false;
  }

  initForm(): void {
    this.cadastroForm = this.formBuilder.group({
      nome: [
        this.pessoa.nome,
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(50),
        ],
      ],
      valorDocumento: [this.pessoa.valorDocumento, Validators.required],
      email: [this.pessoa.email, [Validators.required, Validators.email]],
      telefone: [this.pessoa.telefone, Validators.required],
      senha: [
        this.pessoa.senha,
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(10),
        ],
      ],
      confirmarSenha: [this.confirmarSenha, Validators.required],
      aceitaTermos: [this.aceitaTermos, Validators.requiredTrue],
    });

    this.cadastroForm.valueChanges.subscribe((values) => {
      this.pessoa.nome = values.nome;
      this.pessoa.valorDocumento = values.valorDocumento;
      this.pessoa.email = values.email;
      this.pessoa.telefone = values.telefone;
      this.pessoa.senha = values.senha;
      this.confirmarSenha = values.confirmarSenha;
    });
  }

  get f() {
    return this.cadastroForm.controls;
  }

  isFieldInvalid(fieldName: string): boolean {
    return this.formSubmitted && this.f[fieldName].invalid;
  }

  togglePessoaJuridica(event: any): void {
    this.isPessoaJuridica = event.target.checked;
  }

  toggleSN(event: any): void {
    this.snChecked = event.target.checked;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    const width = (event.target as Window).innerWidth;
    this.updateWithOverflow(width);
  }

  private updateWithOverflow(width: number) {
    this.withOverflow = width < 768;
  }

  cadastrarUsuario() {
    this.formSubmitted = true;

    if (this.cadastroForm.invalid) {
      this.mostrarMensagemErroValidacao();
      return;
    }

    if (this.pessoa.senha !== this.confirmarSenha) {
      Swal.fire({
        title: 'Erro!',
        text: 'As senhas não coincidem.',
        icon: 'error',
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return;
    }

    try {
      if (this.isPessoaJuridica) {
        this.pessoa.tipoDocumento = EnumDocumento.CNPJ;
      } else {
        this.pessoa.tipoDocumento = EnumDocumento.CPF;
      }
      this.registrarDisabled = true;

      this.loginService.cadastrar(this.pessoa).subscribe({
        next: (response) => {
          this.router.navigate(['login']);
          Swal.fire({
            title: 'Sucesso!',
            text: 'Usuário cadastrado com sucesso!',
            icon: 'success',
            confirmButtonText: 'OK',
          });
        },
        error: (error) => {
          let mensagemErro = 'Erro ao cadastrar usuário. Tente novamente.';

          if (error.error && typeof error.error === 'object') {
            const mensagens = Object.values(error.error);
            if (mensagens.length > 0) {
              mensagemErro = mensagens.join('\n');
            }
          } else if (typeof error.error === 'string') {
            mensagemErro = error.error;
          }

          Swal.fire({
            title: 'Erro!',
            text: mensagemErro,
            icon: 'error',
            confirmButtonText: 'OK',
          });
        },
      });
    } catch (error) {
      Swal.fire({
        title: 'Erro!',
        text: 'Erro inesperado. Tente novamente.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  }

  mostrarMensagemErroValidacao() {
    if (!this.aceitaTermos) {
      Swal.fire({
        title: 'Erro!',
        text: 'Aceite os termos de uso e a política de privacidade para se registrar',
        icon: 'error',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      return;
    }

    const camposInvalidos = [];
    if (this.f['nome'].invalid)
      camposInvalidos.push(
        this.isPessoaJuridica ? 'Razão Social' : 'Nome Completo'
      );
    if (this.f['valorDocumento'].invalid)
      camposInvalidos.push(this.isPessoaJuridica ? 'CNPJ' : 'CPF');
    if (this.f['email'].invalid) camposInvalidos.push('Email');
    if (this.f['telefone'].invalid) camposInvalidos.push('Telefone');
    if (this.f['senha'].invalid) camposInvalidos.push('Senha');
    if (this.f['confirmarSenha'].invalid)
      camposInvalidos.push('Confirmar Senha');

    let mensagem = '';
    if (camposInvalidos.length === 1) {
      mensagem = `O campo ${camposInvalidos[0]} é obrigatório`;
    } else if (camposInvalidos.length > 1) {
      const ultimoCampo = camposInvalidos.pop();
      mensagem = `Os campos ${camposInvalidos.join(
        ', '
      )} e ${ultimoCampo} são obrigatórios`;
    }

    Swal.fire({
      title: 'Erro!',
      text: mensagem,
      icon: 'error',
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  }

  onTermsChange(event: any): void {
    this.aceitaTermos = event.target.checked;
    this.f['aceitaTermos'].setValue(this.aceitaTermos);
  }

  openTermsModal(): void {
    this.showTermsModal = true;
  }

  closeTermsModal(): void {
    this.showTermsModal = false;
  }
}

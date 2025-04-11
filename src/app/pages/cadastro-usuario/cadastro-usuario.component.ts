import { Component, HostListener } from '@angular/core';
import { LoginService } from '../../shared/service/LoginService';
import { Pessoa } from '../../shared/model/entity/pessoa';
import { EnumDocumento } from '../../shared/model/enum/EnumDocumento';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cadastro-usuario',
  templateUrl: './cadastro-usuario.component.html',
  styleUrl: './cadastro-usuario.component.scss'
})
export class CadastroUsuarioComponent {
  isPessoaJuridica: boolean = false;
  aceitaTermos: boolean = false;
  snChecked: boolean = false;
  withOverflow: boolean = false;
  confirmarSenha: string = '';

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
    private router:Router,
  ) {
    this.updateWithOverflow(window.innerWidth);

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
    if (this.pessoa.senha !== this.confirmarSenha) {
      Swal.fire({
        title: 'Erro!',
        text: 'As senhas não coincidem.',
        icon: 'error',
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false
      });
      return;
    }
    try {
      if (this.isPessoaJuridica) {
        this.pessoa.tipoDocumento = EnumDocumento.CNPJ;
      } else {
        this.pessoa.tipoDocumento = EnumDocumento.CPF;
      }

      this.loginService.cadastrar(this.pessoa).subscribe({
        next: (response) => {
          this.router.navigate(["login"]);
          Swal.fire({
            title: 'Sucesso!',
            text: 'Usuário cadastrado com sucesso!',
            icon: 'success',
            confirmButtonText: 'OK'
          });
        },
        error: (error) => {
          Swal.fire({
            title: 'Erro!',
            text: 'Ocorreu um erro ao cadastrar o usuário. Tente novamente.',
            icon: 'error',
            confirmButtonText: 'OK'
          });
        }
      });

    } catch (error) {
      Swal.fire({
        title: 'Erro!',
        text: 'Erro inesperado. Tente novamente.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    }
  }
}

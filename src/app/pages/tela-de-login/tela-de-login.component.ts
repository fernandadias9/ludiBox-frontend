import { Router } from "@angular/router";
import { PessoaDTO } from "../../shared/model/dto/PessoaDTO";
import { Pessoa } from "../../shared/model/entity/pessoa";
import { LoginService } from "../../shared/service/LoginService";
import { Component } from "@angular/core";
import Swal from "sweetalert2";


@Component({
  selector: 'app-tela-de-login',
  templateUrl: './tela-de-login.component.html',
  styleUrl: './tela-de-login.component.scss'
})
export class TelaDeLoginComponent {

  public pessoa: Pessoa = new Pessoa();
  public id : number;

  public dto: PessoaDTO = new PessoaDTO();

  constructor(
    private service: LoginService,
    private router: Router,
  ) { }

  public realizarLogin() {
    console.log(this.dto)
    this.service.autenticar(this.dto).subscribe({
      next: jwt => {
        Swal.fire('Sucesso', 'Usuário autenticado com sucesso', 'success');
        let token: string = jwt.body + "";
        localStorage.setItem('tokenUsuarioAutenticado', token);
        this.router.navigate(['adicionar tela']);
      },
      error: erro => {
        var mensagem: string;
        if (erro.status == 401) {
          mensagem = 'Usuário ou senha inválidos, tente novamente';
        } else {
          mensagem = erro.error;
        }

        Swal.fire('Erro', mensagem, 'error');
      }
    });
  }
  voltar() {
    this.router.navigate(['']);
  }
}
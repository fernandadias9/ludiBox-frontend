import { Router } from "@angular/router";
import { PessoaDTO } from "../../shared/model/dto/PessoaDTO";
import { Pessoa } from "../../shared/model/entity/pessoa";
import { LoginService } from "../../shared/service/LoginService";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";
import { PerfilDTO } from "../../shared/model/dto/PerfilDTO";
import { PessoaService } from "../../shared/service/PessoaService";
import { MatDialog } from "@angular/material/dialog";
import { TotpModalComponent } from "../../components/totp-modal/totp-modal.component";

interface DecodedToken {
  sub: string;
  roles: string;
  iat: number;
  exp: number;
}

@Component({
  selector: "app-tela-de-login",
  templateUrl: "./tela-de-login.component.html",
  styleUrl: "./tela-de-login.component.scss",
})
export class TelaDeLoginComponent implements OnInit {
  isLoggedIn = false;
  public pessoa: Pessoa = new Pessoa();
  public perfil: PerfilDTO = new PerfilDTO();
  loginForm: FormGroup;
  formSubmitted = false;
  public idUsuario: number;

  constructor(
    private service: LoginService,
    private router: Router,
    private formBuilder: FormBuilder,
    private pessoaService: PessoaService,
    private dialog: MatDialog,
  ) {
    this.initForm();
  }

  ngOnInit() {
    this.usuarioLogado();
  }

  initForm(): void {
    this.loginForm = this.formBuilder.group({
      email: ["", Validators.required],
      senha: ["", Validators.required],
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  isFieldInvalid(fieldName: string): boolean {
    return this.formSubmitted && this.f[fieldName].invalid;
  }

  realizarLogin() {
    if (this.formSubmitted) return;
    this.formSubmitted = true;

    if (this.loginForm.invalid) {
      this.mostrarMensagemErroValidacao();
      return;
    }

    const email = this.loginForm.value.email;
    const senha = this.loginForm.value.senha;

    this.service.login(email, senha).subscribe({
      next: (res) => {
        if (res.twoFactorRequired && res.tempToken) {
          this.abrirModalTotp(res.tempToken);
        } else if (res.token) {
          this.processarJwt(res.token);
        } else {
          Swal.fire("Erro", "Resposta inesperada do servidor", "error");
        }
      },
      error: (erro) => {
        const mensagem = erro?.error?.mensagem || "Usuário ou senha inválidos, tente novamente";
        Swal.fire("Erro", mensagem, "error");
      }
    });
  }

  abrirModalTotp(tempToken: string) {
    const dialogRef = this.dialog.open(TotpModalComponent, {
      width: '400px',
      data: { tempToken }
    });

    dialogRef.afterClosed().subscribe(codigoTotp => {
      if (codigoTotp) {
        this.confirmar2FA(tempToken, codigoTotp);
      } else {
        Swal.fire('Cancelado', 'Autenticação em duas etapas cancelada.', 'info');
      }
    });
  }

  confirmar2FA(tempToken: string, code: string) {
    this.service.confirmarLoginComTotp(tempToken, code).subscribe({
      next: (res) => {
        this.processarJwt(res.token);
      },
      error: () => {
        Swal.fire("Erro", "Código inválido ou expirado", "error");
      }
    });
  }

  processarJwt(jwt: string) {
    Swal.fire("Sucesso", "Usuário autenticado com sucesso", "success");
    localStorage.setItem("auth_token", jwt);

    try {
      const decoded = jwtDecode<DecodedToken>(jwt);
      const idUsuario = Number(decoded.sub);
      const perfil = decoded.roles;

      localStorage.setItem("idUsuarioAutenticado", idUsuario.toString());

      if (perfil === 'ADMINISTRADOR') {
        this.router.navigate(['/dashboard']);
      } else if (perfil === 'USUARIO') {
        this.router.navigate(['']);
      } else {
        this.router.navigate(['/acesso-negado']);
      }
    } catch (error) {
      console.error("Erro ao decodificar o token:", error);
      this.router.navigate(['/acesso-negado']);
    }
  }

  mostrarMensagemErroValidacao() {
    const camposInvalidos = [];
    if (this.f["email"].invalid) camposInvalidos.push("E-mail");
    if (this.f["senha"].invalid) camposInvalidos.push("Senha");

    let mensagem = "";
    if (camposInvalidos.length === 1) {
      mensagem = `O campo ${camposInvalidos[0]} é obrigatório`;
    } else if (camposInvalidos.length > 1) {
      const ultimoCampo = camposInvalidos.pop();
      mensagem = `Os campos ${camposInvalidos.join(", ")} e ${ultimoCampo} são obrigatórios`;
    }

    Swal.fire({
      title: "Erro!",
      text: mensagem,
      icon: "error",
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    });
  }

  usuarioLogado() {
    this.idUsuario = this.service.buscarIdUsuarioComToken();

    if (this.idUsuario == null) {
      return;
    }

    this.pessoaService.buscarPerfilPorId(this.idUsuario).subscribe(
      resultado => {
        this.perfil = resultado;
        this.isLoggedIn = true;
      }
    );
  }

  voltar() {
    this.router.navigate([""]);
  }
}

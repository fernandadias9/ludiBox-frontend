import { Router } from "@angular/router"
import { PessoaDTO } from "../../shared/model/dto/PessoaDTO"
import { Pessoa } from "../../shared/model/entity/pessoa"
import { LoginService } from "../../shared/service/LoginService"
import { Component } from "@angular/core"
import { FormBuilder, type FormGroup, Validators } from "@angular/forms"
import Swal from "sweetalert2"
import { jwtDecode } from "jwt-decode"

@Component({
  selector: "app-tela-de-login",
  templateUrl: "./tela-de-login.component.html",
  styleUrl: "./tela-de-login.component.scss",
})
export class TelaDeLoginComponent {
  public pessoa: Pessoa = new Pessoa()
  public id: number
  public dto: PessoaDTO = new PessoaDTO()
  loginForm: FormGroup
  formSubmitted = false

  constructor(
    private service: LoginService,
    private router: Router,
    private formBuilder: FormBuilder,
  ) {
    this.initForm()
  }

  initForm(): void {
    this.loginForm = this.formBuilder.group({
      login: ["", Validators.required],
      senha: ["", Validators.required],
    })
  }

  // Getters para facilitar o acesso aos campos do formulário
  get f() {
    return this.loginForm.controls
  }

  // Método para verificar se um campo específico está inválido
  isFieldInvalid(fieldName: string): boolean {
    return this.formSubmitted && this.f[fieldName].invalid
  }

  public realizarLogin() {
    this.formSubmitted = true

    if (this.loginForm.invalid) {
      this.mostrarMensagemErroValidacao()
      return
    }

    this.service.autenticar(this.dto).subscribe({
      next: (jwt) => {
        Swal.fire("Sucesso", "Usuário autenticado com sucesso", "success");
        const token: string = jwt.body + "";
        localStorage.setItem("tokenUsuarioAutenticado", token);

        // Decodifica o token para obter o ID do usuário
        try {
          const tokenDecodificado: any = jwtDecode(token);
          const idUsuario = tokenDecodificado.id;
          localStorage.setItem("idUsuarioAutenticado", idUsuario.toString());
        } catch (error) {
          console.error("Erro ao decodificar o token:", error);
        }

        this.router.navigate(["/"]);
      },
      error: (erro) => {
        var mensagem: string;
        if (erro.status != 200) {
          mensagem = "Usuário ou senha inválidos, tente novamente";
        } else {
          mensagem = erro.error;
        }
        Swal.fire("Erro", mensagem, "error");
      }
    })
  }

  mostrarMensagemErroValidacao() {
    // Coleta os nomes dos campos inválidos
    const camposInvalidos = []
    if (this.f["login"].invalid) camposInvalidos.push("E-mail")
    if (this.f["senha"].invalid) camposInvalidos.push("Senha")

    // Constrói a mensagem de erro
    let mensagem = ""
    if (camposInvalidos.length === 1) {
      mensagem = `O campo ${camposInvalidos[0]} é obrigatório`
    } else if (camposInvalidos.length > 1) {
      const ultimoCampo = camposInvalidos.pop()
      mensagem = `Os campos ${camposInvalidos.join(", ")} e ${ultimoCampo} são obrigatórios`
    }

    Swal.fire({
      title: "Erro!",
      text: mensagem,
      icon: "error",
      timer: 3000,
      timerProgressBar: true,
      showConfirmButton: false,
    })
  }

  voltar() {
    this.router.navigate([""])
  }
}

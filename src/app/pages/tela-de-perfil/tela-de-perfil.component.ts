import { Component, OnInit } from '@angular/core';
import { PerfilDTO } from '../../shared/model/dto/PerfilDTO';
import { Router } from '@angular/router';
import { PessoaService } from '../../shared/service/PessoaService';
import { LoginService } from '../../shared/service/LoginService';
import Swal from 'sweetalert2';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tela-de-perfil',
  templateUrl: './tela-de-perfil.component.html',
  styleUrl: './tela-de-perfil.component.scss'
})
export class TelaDePerfilComponent implements OnInit {
onSenhaAlterada() {
throw new Error('Method not implemented.');
}

  public idUsuario: number;
  public perfil: PerfilDTO = new PerfilDTO();
  isEditing: boolean = false;
  private perfilOriginal: PerfilDTO;
  perfilForm: FormGroup;
  formSubmitted = false
  isOpen: boolean = false;
  isModalOpen: boolean = false;
  
  constructor(
      private router: Router,
      private pessoaService: PessoaService,
      private loginService: LoginService,
      private formBuilder: FormBuilder,
    ) {}
  
  ngOnInit() {
    this.usuarioLogado();
    this.formSubmitted = true;

  }

  initForm(): void {
    this.perfilForm = this.formBuilder.group({
      nome: [this.perfil.nome, Validators.required],
      email: [this.perfil.email, [Validators.required, Validators.email]],
      telefone: [this.perfil.telefone, Validators.required],
    });
    this.perfilForm.disable(); 
  
  }

  get f() {
    return this.perfilForm.controls
  }

  isFieldInvalid(fieldName: string): boolean {
    return this.formSubmitted && this.f[fieldName].invalid
  }

  abrirModal(){
    this.isModalOpen = true;
  }

  fecharModal(){
    this.isModalOpen = false;
  }
  
  menuList: { label: string; route: string }[] = [
    { label: 'Perfil', route: '/tela-perfil' },
    { label: 'Endereços', route: '/enderecos' },
    { label: 'Anúncios', route: '/anuncios' },
    { label: 'Locações', route: '' },
  ];

  usuarioLogado() {
    this.idUsuario = this.loginService.buscarIdUsuarioComToken();
  
    if (!this.idUsuario) {
      this.router.navigate(['/']); 
      return;
    }
  
    this.pessoaService.buscarPerfilPorId(this.idUsuario).subscribe(resultado => {
      this.perfil = resultado;
      this.perfilOriginal = { ...resultado };
      this.initForm();
    });
  }
  
  toggleEdit() {
    this.isEditing = !this.isEditing;
    if (this.isEditing) {
      this.perfilForm.enable();
      this.perfilForm.patchValue(this.perfil);
    } else {
      this.perfilForm.disable();
      this.perfilForm.reset(this.perfilOriginal);
    }
  }
  


  salvarPerfil() {
    this.formSubmitted = true;
    if (this.perfilForm.invalid) {
      //this.mostrarMensagemErroValidacao();
      //this.perfilForm.reset(this.perfilOriginal);
      return;
    }
    this.perfil = {
      ...this.perfil,
      ...this.perfilForm.value
    };
  
    const camposAlterados: any = {};
    for (const chave in this.perfil) {
      if (this.perfil[chave] !== this.perfilOriginal[chave]) {
        camposAlterados[chave] = this.perfil[chave];
      }
    }
  
    this.pessoaService.atualizarPerfil(this.idUsuario, camposAlterados).subscribe({
      next: () => {
        this.perfil = {
          ...this.perfil,
          ...this.perfilForm.value
        };
        
        this.perfilOriginal = { ...this.perfil };
        
        this.isEditing = false;
        this.perfilForm.disable();

        Swal.fire({
          title: 'Sucesso!',
          text: 'Perfil atualizado com sucesso!',
          icon: 'success',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      },
      error: err => {
        console.error(err);
        this.perfilForm.reset(this.perfilOriginal);
  
        Swal.fire({
          title: 'Erro!',
          text: err?.error?.message || 'Erro ao atualizar o perfil. Tente novamente mais tarde.',
          icon: 'error',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      }
    });
  }
  
  mostrarMensagemErroValidacao() {
      const camposInvalidos = []
      if (this.f["nome"].invalid) camposInvalidos.push("Nome")
      if (this.f["email"].invalid) camposInvalidos.push("Email")
      if (this.f["telefone"].invalid) camposInvalidos.push("Telefone")
  
      let mensagem = ""
      if (camposInvalidos.length === 1) {
        mensagem = `O campo ${camposInvalidos[0]} é obrigatório`;
      } else if (camposInvalidos.length > 1) {
        const ultimoCampo = camposInvalidos.pop()
        mensagem = `Os campos ${camposInvalidos.join(", ")} e ${ultimoCampo} são obrigatórios`;
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
}


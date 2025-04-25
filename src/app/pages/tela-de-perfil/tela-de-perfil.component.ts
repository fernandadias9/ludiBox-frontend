  import { Component, OnInit } from '@angular/core';
  import { PerfilDTO } from '../../shared/model/dto/PerfilDTO';
  import { Router } from '@angular/router';
  import { PessoaService } from '../../shared/service/PessoaService';
  import { LoginService } from '../../shared/service/LoginService';

  @Component({
    selector: 'app-tela-de-perfil',
    templateUrl: './tela-de-perfil.component.html',
    styleUrl: './tela-de-perfil.component.scss'
  })
  export class TelaDePerfilComponent implements OnInit {

    public idUsuario: number;
    public perfil: PerfilDTO = new PerfilDTO();
    isEditing: boolean = false;
    private perfilOriginal: PerfilDTO;


    constructor(
        private router: Router,
        private pessoaService: PessoaService,
        private loginService: LoginService,
      ) {}

    
    ngOnInit() {
      this.usuarioLogado();
    }

    
    isOpen: boolean = false;
    menuList: { label: string; route: string }[] = [
      { label: 'Perfil', route: '' },
      { label: 'Endereços', route: '' },
      { label: 'Anúncios', route: '' },
      { label: 'Anúncios', route: '' },
      { label: 'Locações', route: '' },
      { label: 'Sair', route: '' }
    ];

    usuarioLogado() {
      this.idUsuario = this.loginService.buscarIdUsuarioComToken();
      if (!this.idUsuario) return;
  
      this.pessoaService.buscarPerfilPorId(this.idUsuario).subscribe(resultado => {
        this.perfil = resultado;
        this.perfilOriginal = { ...resultado };
      });
    }
  
    toggleEdit() {
      this.isEditing = !this.isEditing;
    }
  
    salvarPerfil() {
      const camposAlterados: any = {};
  
      for (const chave in this.perfil) {
        if (this.perfil[chave] !== this.perfilOriginal[chave]) {
          camposAlterados[chave] = this.perfil[chave];
        }
      }
  
      this.pessoaService.atualizarPerfil(this.idUsuario, camposAlterados).subscribe({
        next: () => {
          this.isEditing = false;
          alert('Perfil atualizado com sucesso!');
        },
        error: err => {
          console.error(err);
          alert('Erro ao atualizar perfil');
        }
      });
    }
  }
  
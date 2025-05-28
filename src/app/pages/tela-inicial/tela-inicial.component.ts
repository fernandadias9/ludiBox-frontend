import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../shared/service/LoginService';
import { PessoaService } from '../../shared/service/PessoaService';
import { Router } from '@angular/router';
import { PerfilDTO } from '../../shared/model/dto/PerfilDTO';
import { AnuncioLeituraDto } from '../../shared/model/dto/anuncioLeituraDto';
import { AnuncioService } from '../../shared/service/anuncio.service';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-tela-inicial',
  templateUrl: './tela-inicial.component.html',
  styleUrls: ['./tela-inicial.component.scss']
})

export class TelaInicialComponent implements OnInit{
  isLoggedIn = false;
  userName = 'Usuário Exemplo';
  userImage = '';
  menuOpen = false;
  anuncios: AnuncioLeituraDto[] = [];
  public perfil: PerfilDTO = new PerfilDTO();
  public idUsuario: number;
  private searchSubject = new Subject<string>();

  currentPage = 0;
  loading = false;
  allLoaded = false;

  constructor(
    private loginService: LoginService,
    private pessoaService: PessoaService,
    private anuncioService: AnuncioService,
    private router: Router
  ) {}

  ngOnInit() {
    // this.usuarioLogado();
    this.carregarAnuncios();
    this.searchSubject.pipe(debounceTime(500)).subscribe(term => {
      this.filtrarAnuncios(term as string);
    });
    window.addEventListener('scroll', this.onScroll.bind(this));

  }

  carregarAnuncios(): void {
    if (this.loading || this.allLoaded) return;

    this.loading = true;

    this.anuncioService.listarComFiltro('', this.currentPage, 12).subscribe(
      (res: any) => {
        const novos = res.content;
        if (novos.length === 0) {
          this.allLoaded = true;
        } else {
          this.anuncios = [...this.anuncios, ...novos];
          this.currentPage++;
        }
        this.loading = false;
      },
      error => {
        console.error('Erro ao carregar anúncios:', error);
        this.loading = false;
      }
    );
  }

  onScroll() {
    const threshold = 300; // px do fundo
    const pos = window.innerHeight + window.scrollY;
    const max = document.body.offsetHeight;

    if (max - pos < threshold) {
      this.carregarAnuncios();
    }
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.onScroll.bind(this));
  }

  onSearch(term: string) {
    this.searchSubject.next(term);
  }

  public filtrarAnuncios(nomeBusca: string = ''): void {
    this.anuncioService.listarComFiltro(nomeBusca).subscribe(
      resultado => {
        this.anuncios = resultado.content;
      },
      error => {
        console.error('Erro ao buscar anúncios:', error);
      }
    );
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

//   usuarioLogado() {
//   const token = localStorage.getItem('tokenUsuarioAutenticado');
//   this.idUsuario = this.loginService.buscarIdUsuarioComToken();

//   if (this.idUsuario == null) {
//     return;
//   }

//   this.pessoaService.buscarPerfilPorId(this.idUsuario).subscribe(
//     resultado => {
//       this.perfil = resultado;
//       if (this.perfil && token) {
//         this.isLoggedIn = true;
//       }
//     },
//     error => {
//       console.error('Erro ao buscar perfil:', error);
//       this.isLoggedIn = false;
//     }
//   );
// }


  logoutUser() {
    Swal.fire({
      icon: 'success',
      title: 'Logout realizado com sucesso',
      showConfirmButton: false,
      timer: 2000
    });
    this.isLoggedIn = false;
    this.menuOpen = false;
    this.loginService.logout();
    this.router.navigate(['/']);
    this.perfil = null;
  }
}

import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LoginService } from '../../shared/service/LoginService';
import { Router } from '@angular/router';
import { PerfilDTO } from '../../shared/model/dto/PerfilDTO';
import { AnuncioLeituraDto } from '../../shared/model/dto/anuncioLeituraDto';
import { AnuncioService } from '../../shared/service/anuncio.service';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-tela-inicial',
  templateUrl: './tela-inicial.component.html',
  styleUrls: ['./tela-inicial.component.scss']
})

export class TelaInicialComponent implements OnInit {
  isLoggedIn = false
  userName = "Usuário Exemplo"
  userImage = ""
  menuOpen = false
  anuncios: AnuncioLeituraDto[] = []
  public perfil: PerfilDTO = new PerfilDTO()
  public idUsuario: number
  private searchSubject = new Subject<string>()

  currentSearchTerm = ""
  currentPage = 0
  loading = false
  allLoaded = false

  constructor(
    private loginService: LoginService,
    private anuncioService: AnuncioService,
    private router: Router
  ) { }

  ngOnInit() {
    this.carregarAnuncios()
    this.searchSubject.pipe(debounceTime(500), distinctUntilChanged()).subscribe((term) => {
      this.handleSearch(term as string)
    })
  }

  ngOnDestroy() {
    this.searchSubject.complete()
  }

  carregarAnuncios(): void {
    if (this.loading || this.allLoaded) return

    this.loading = true

    this.anuncioService.listarComFiltro(this.currentSearchTerm, this.currentPage, 12).subscribe(
      (res: any) => {
        const novos = res.content
        if (novos.length === 0) {
          this.allLoaded = true
        } else {
          if (this.currentPage === 0) {
            this.anuncios = novos
          } else {
            this.anuncios = [...this.anuncios, ...novos]
          }
          this.currentPage++
        }
        this.loading = false
      },
      (error) => {
        console.error("Erro ao carregar anúncios:", error)
        this.loading = false
      },
    )
  }

  private handleSearch(searchTerm: string): void {
    this.resetPaginationState()
    this.currentSearchTerm = searchTerm.trim()

    this.carregarAnuncios()
  }

  private resetPaginationState(): void {
    this.currentPage = 0
    this.loading = false
    this.allLoaded = false
    this.anuncios = []
  }

  onSearch(term: string) {
    this.searchSubject.next(term)
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

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

import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../shared/service/LoginService';
import { PessoaService } from '../../shared/service/PessoaService';
import { Router } from '@angular/router';
import { PerfilDTO } from '../../shared/model/dto/PerfilDTO';
import { AnuncioLeituraDto } from '../../shared/model/dto/anuncioLeituraDto';
import { AnuncioService } from '../../shared/service/anuncio.service';

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

  itemsPerPage = 20;
  currentPage = 1;

  constructor(
    private loginService: LoginService,
    private pessoaService: PessoaService,
    private anuncioService: AnuncioService,
    private router: Router
  ) {}

  ngOnInit() {
    this.usuarioLogado();
    this.carregarAnuncios();
  }

  public carregarAnuncios(): void {
    this.anuncioService.listar().subscribe(
      resultado => {
        this.anuncios = resultado;
      },
      error => {
        console.error('Error fetching anuncios:', error);
      }
    );
  }

  get totalPages(): number {
    return Math.ceil(this.anuncios.length / this.itemsPerPage);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  exibirAnuncios() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.anuncios.slice(startIndex, endIndex);
  }

  changePage(direction: string) {
    if (direction === 'next' && this.currentPage < this.totalPages) {
      this.currentPage++;
    } else if (direction === 'prev' && this.currentPage > 1) {
      this.currentPage--;
    }
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const total = this.totalPages;
    let startPage: number;
    let endPage: number;

    if (total <= 5) {
      startPage = 1;
      endPage = total;
    } else {
      if (this.currentPage <= 3) {
        startPage = 1;
        endPage = 5;
      } else if (this.currentPage + 2 >= total) {
        startPage = total - 4;
        endPage = total;
      } else {
        startPage = this.currentPage - 2;
        endPage = this.currentPage + 2;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }


  usuarioLogado(){
    this.idUsuario = this.loginService.buscarIdUsuarioComToken();

    if(this.idUsuario == null){
      return;
    }

    this.pessoaService.buscarPerfilPorId(this.idUsuario).subscribe(
      resultado => {
        this.perfil = resultado;
      }
    );

    if(this.perfil){
      this.isLoggedIn = true
    }
  }

  // fazer reload da pagina
  logoutUser(){
    this.loginService.logout();
    this.router.navigate(['/']);
    this.perfil = null;
  }




}

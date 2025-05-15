import { Component, ElementRef, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { LoginService } from '../../shared/service/LoginService';
import { PessoaService } from '../../shared/service/PessoaService';
import { PerfilDTO } from '../../shared/model/dto/PerfilDTO';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { LocacaoService } from '../../shared/service/locacao.service';
import { ProdutoLocacao } from '../../shared/model/entity/produtoLocacao';

@Component({
  selector: 'app-template-anuncios',
  templateUrl: './template-anuncios.component.html',
  styleUrl: './template-anuncios.component.scss',
})
export class TemplateAnunciosComponent implements OnInit {
  isLoggedIn = false;
  userName = '';
  userImage = '';
  menuOpen = false;
  public perfil: PerfilDTO = new PerfilDTO();
  public idUsuario: number;
  cartCount: number | null = null;
  cartItems: ProdutoLocacao[] = [];
  showCartMenu = false;
  @ViewChild('cartContainer', { read: ElementRef }) cartContainer!: ElementRef;

  @Input() eTelaInicial: boolean = true;

  constructor(
    private loginService: LoginService,
    private pessoaService: PessoaService,
    private router: Router,
    private locacaoService: LocacaoService
  ) {}
  ngOnInit(): void {
    this.usuarioLogado();
    this.carregarCarrinho();
  }
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  usuarioLogado() {
    const token = localStorage.getItem('tokenUsuarioAutenticado');
    this.idUsuario = this.loginService.buscarIdUsuarioComToken();

    if (this.idUsuario == null) {
      return;
    }

    this.pessoaService
      .buscarPerfilPorId(this.idUsuario)
      .subscribe((resultado) => {
        this.perfil = resultado;
      });

    if (this.perfil && token) {
      this.isLoggedIn = true;
    }
  }

  carregarCarrinho() {
    const uid = this.loginService.buscarIdUsuarioComToken();
    if (!uid) return;

    this.locacaoService.verificarLocacaoPendente(uid).subscribe(loc => {
      if (loc && loc.produtos && loc.produtos.length > 0) {
        this.cartItems = loc.produtos;
        this.cartCount = loc.produtos.length;
      } else {
        this.cartItems = [];
        this.cartCount = null;
      }
    }, err => {
      console.error(err);
      this.cartItems = [];
      this.cartCount = null;
    });
  }

  get totalLocacao(): number {
    return this.cartItems
      .map(item => item.valorDiario * (new Date(item.dataFim).getTime() - new Date(item.dataInicio).getTime())/ (1000*60*60*24) + item.valorDiario)
      .reduce((sum, v) => sum + v, 0);
  }

  toggleCartMenu() {
    this.showCartMenu = !this.showCartMenu;
  }

  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement) {
    if (this.showCartMenu && this.cartContainer && !this.cartContainer.nativeElement.contains(target)) {
      this.showCartMenu = false;
    }
  }

  removerItem(item: ProdutoLocacao) {
    console.log('Remover produto', item);
    // implementar exclusão depois ...
  }

  cancelarLocacao() {
    console.log('Cancelar locação');
    // implementar cancelamento ...
  }

  finalizarLocacao() {
    console.log('Finalizar locação');
    // implementar checkout ...
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

import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { LoginService } from '../../shared/service/LoginService';
import { PessoaService } from '../../shared/service/PessoaService';
import { PerfilDTO } from '../../shared/model/dto/PerfilDTO';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { LocacaoService } from '../../shared/service/locacao.service';
import { ProdutoLocacao } from '../../shared/model/entity/produtoLocacao';
import { jwtDecode } from 'jwt-decode';

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
  locacaoId: number | null = null;
  public perfil: PerfilDTO = new PerfilDTO();
  public idUsuario: number;
  cartCount: number | null = null;
  cartItems: ProdutoLocacao[] = [];
  showCartMenu = false;
  valorTotalLocacao: number = 0;
  hasLocacao: boolean = false;
  @ViewChild('cartContainer', { read: ElementRef }) cartContainer!: ElementRef;
  @ViewChild("scrollContainer", { static: true }) scrollContainer!: ElementRef

  @Input() eTelaInicial: boolean = true;

  @Output() scrollEvent = new EventEmitter<void>()
  @Output() searchTermChange = new EventEmitter<string>();
  searchTerm: string = '';

  constructor(
    private loginService: LoginService,
    private pessoaService: PessoaService,
    private router: Router,
    private locacaoService: LocacaoService
  ) { }
  ngOnInit(): void {
    this.getIsLoggedIn();
    this.usuarioLogado();
    this.carregarCarrinho();

    this.locacaoService.carrinhoAtualizado$.subscribe(() => {
      this.carregarCarrinho();
    });
  }
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  onInputChange() {
    this.searchTermChange.emit(this.searchTerm);
  }

  usuarioLogado() {
    const token = this.loginService.token;
    this.idUsuario = this.loginService.buscarIdUsuarioComToken();

    if (this.idUsuario == null) {
      return;
    }

    this.pessoaService.buscarPerfilPorId(this.idUsuario).subscribe(
      (resultado) => {
        this.perfil = resultado;
        if (this.perfil && token) {
          this.isLoggedIn = true;
        }
      },
      (error) => {
        console.error('Erro ao buscar perfil:', error);
        this.isLoggedIn = false;
      }
    );
  }

  getIsLoggedIn(): void {
    this.isLoggedIn = this.loginService.isLoggedIn;
  }

  carregarCarrinho() {
    if (!this.idUsuario) return;

    this.locacaoService.verificarLocacaoPendente(this.idUsuario).subscribe(
      (loc) => {
        if (loc && loc.produtos && loc.produtos.length > 0) {
          this.cartItems = loc.produtos;
          this.cartCount = loc.produtos.length;
          this.locacaoId = loc.id;
          this.valorTotalLocacao = loc.valorTotal;
          this.hasLocacao = true;
        } else {
          this.cartItems = [];
          this.cartCount = null;
          this.valorTotalLocacao = 0;
          this.hasLocacao = false;
        }
      },
      (err) => {
        console.error(err);
        this.cartItems = [];
        this.cartCount = null;
        this.locacaoId = null;
        this.valorTotalLocacao = 0;
        this.hasLocacao = false;
      }
    );
  }

  get totalLocacao(): number {
    return this.valorTotalLocacao;
  }

  toggleCartMenu() {
    this.showCartMenu = !this.showCartMenu;
  }

  @HostListener('document:click', ['$event.target'])
  onClickOutside(target: HTMLElement) {
    if (
      this.showCartMenu &&
      this.cartContainer &&
      !this.cartContainer.nativeElement.contains(target)
    ) {
      this.showCartMenu = false;
    }
  }

  removerItem(item: ProdutoLocacao): void {
    if (!item || !item.id || !this.locacaoId) return;

    this.locacaoService
      .removerProdutoDaLocacao(this.locacaoId, item.id)
      .subscribe({
        next: (locacaoAtualizada) => {
          Swal.fire({
            icon: 'success',
            title: 'Produto removido com sucesso',
            timer: 2000,
            showConfirmButton: false,
          });
          this.cartItems = locacaoAtualizada.produtos;
          this.cartCount = locacaoAtualizada.produtos.length;
          this.valorTotalLocacao = locacaoAtualizada.valorTotal;
        },
        error: (err) => {
          console.error('Erro ao remover produto da locação:', err);
        },
      });
  }

  cancelarLocacao() {
    if (!this.locacaoId) return;

    this.locacaoService.deletarLocacao(this.locacaoId).subscribe({
      next: () => {
        this.hasLocacao = false;
        this.showCartMenu = false;
        this.cartItems = [];
        this.cartCount = null;
        this.locacaoId = null;
        this.valorTotalLocacao = 0;

        this.locacaoService.notificarCarrinhoAtualizado();

        Swal.fire({
          icon: 'success',
          title: 'Locação cancelada com sucesso',
          timer: 2000,
          showConfirmButton: false,
        });
      },
      error: (err) => {
        console.error('Erro ao cancelar a locação:', err);
        Swal.fire({
          icon: 'error',
          title: 'Erro ao cancelar locação',
          text: 'Tente novamente mais tarde.',
        });
      },
    });
  }

  finalizar() {
    this.router.navigate(['/finalizar-locacao', this.locacaoId]);
  }

  logoutUser() {
    Swal.fire({
      icon: 'success',
      title: 'Logout realizado com sucesso',
      showConfirmButton: false,
      timer: 2000,
    });
    this.isLoggedIn = false;
    this.menuOpen = false;
    this.loginService.logout();
    this.router.navigate(['/']);
    this.perfil = null;
  }

  onScroll() {
    const threshold = 300
    const el = this.scrollContainer.nativeElement
    const pos = el.scrollTop + el.clientHeight
    const max = el.scrollHeight

    if (max - pos < threshold) {
      this.scrollEvent.emit()
    }
  }

  ngAfterViewInit() {
    if (this.scrollContainer?.nativeElement) {
      this.scrollContainer.nativeElement.addEventListener("scroll", this.onScroll.bind(this))
    }
  }

  ngOnDestroy() {
    if (this.scrollContainer?.nativeElement) {
      this.scrollContainer.nativeElement.removeEventListener("scroll", this.onScroll.bind(this))
    }
  }

  voltarParaTelaInicial() {
      const token = localStorage.getItem('tokenUsuarioAutenticado');
  
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          const role = decoded.roles;
  
          if (role === 'USUARIO') {
            this.router.navigate(['/']);
            return;
          }
  
          if (role === 'ADMINISTRADOR') {
            this.router.navigate(['/dashboard']);
            return;
          }
        } catch (e) {
  
          this.router.navigate(['/login']);
          return;
        }
      }
      
      this.router.navigate(['/login']);
    }
}

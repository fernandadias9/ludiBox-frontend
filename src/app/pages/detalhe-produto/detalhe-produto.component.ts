import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DetalheAnuncioDto } from '../../shared/model/dto/detalheAnuncioDto';
import { AnuncioService } from '../../shared/service/anuncio.service';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { Gallery, GalleryItem, ImageItem } from 'ng-gallery';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { LocacaoService } from '../../shared/service/locacao.service';
import { LoginService } from '../../shared/service/LoginService';
import { DenunciaService } from '../../shared/service/denunciaService';
import { DenunciaDTO } from '../../shared/model/dto/DenunciaDTO';
import Swal from 'sweetalert2';
import { jwtDecode } from 'jwt-decode';
import { Avaliacao } from '../../shared/model/entity/avaliacao';
import { AvaliacaoService } from '../../shared/service/avaliacao.service';

@Component({
  selector: 'app-detalhe-produto',
  templateUrl: './detalhe-produto.component.html',
  styleUrls: ['./detalhe-produto.component.scss'],
})
export class DetalheProdutoComponent implements OnInit {
  anuncio: DetalheAnuncioDto | null = null;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  galleryItems: GalleryItem[] = [];
  dateFilter: (date: Date | null) => boolean;
  form: FormGroup;
  menuAberto = false;
  isModalOpen: boolean = false;
  usuarioId: number;
  avaliacoes: Avaliacao[] = [];
  mediaAvaliacoes: number | null = null;

  constructor(
    private route: ActivatedRoute,
    private anuncioService: AnuncioService,
    private gallery: Gallery,
    private fb: FormBuilder,
    private locacaoService: LocacaoService,
    private loginService: LoginService,
    private denunciaService: DenunciaService,
    private avaliacaoService: AvaliacaoService,
    private router: Router
  ) { }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.carregarAnuncio(id);
      this.carregarAvaliacoes(id);
      this.carregarMedia(id);
    }

    this.form = this.fb.group({
      periodoLocacao: new FormGroup({
        inicio: new FormControl(),
        final: new FormControl(),
      }),
    });

    this.dateFilter = this.criarFiltroData();

    this.usuarioId = this.loginService.buscarIdUsuarioComToken() || null;
  }

  carregarAnuncio(id: number) {
    this.anuncioService.buscar(id).subscribe(
      (data) => {
        data.datasIndisponiveis = data.datasIndisponiveis.map(
          (dataStr: string | Date) =>
            dataStr instanceof Date ? dataStr : new Date(dataStr)
        );
        this.anuncio = data;
        this.setupGallery();
      },
      (error) => {
        console.error('Erro ao buscar anúncio:', error);
      }
    );
  }

  setupGallery() {
    if (!this.anuncio) return;

    this.galleryItems = this.anuncio.imagens.map((img) => {
      const imageSrc = `data:image/jpeg;base64,${img}`;
      return new ImageItem({ src: imageSrc, thumb: imageSrc });
    });

    const galleryRef = this.gallery.ref('produtoGallery');
    galleryRef.load(this.galleryItems);
  }

  criarFiltroData(): (date: Date | null) => boolean {
    return (date: Date | null): boolean => {
      if (!date) {
        return false;
      }

      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      if (date <= hoje) {
        return false;
      }

      return !this.anuncio.datasIndisponiveis.some((dataIndisponivel: Date) => {
        return (
          date.getFullYear() === dataIndisponivel.getFullYear() &&
          date.getMonth() === dataIndisponivel.getMonth() &&
          date.getDate() === dataIndisponivel.getDate()
        );
      });
    };
  }

  alugar() {
    if (!this.anuncio) return;

    const periodo = this.form.value.periodoLocacao;
    if (!periodo.inicio || !periodo.final) {
      alert('Selecione um período válido!');
      return;
    }

    const produtoLocacao = {
      produto: { id: this.anuncio.id },
      dataInicio: periodo.inicio,
      dataFim: periodo.final,
      valorDiario: this.anuncio.preco,
    };

    if (!this.usuarioId) {
      alert('Usuário não autenticado!');
      return;
    }

    this.locacaoService
      .verificarLocacaoPendente(this.usuarioId)
      .subscribe((locacaoExistente) => {
        if (locacaoExistente) {
          this.locacaoService
            .incluirProdutoNaLocacao(locacaoExistente.id, produtoLocacao)
            .subscribe({
              next: () => {
                Swal.fire({
                  icon: 'success',
                  title: 'Produto adicionado ao carrinho.',
                  showConfirmButton: false,
                  timer: 1500,
                });
                this.locacaoService.notificarCarrinhoAtualizado();
              },
              error: (err) => console.error(err),
            });
        } else {
          const novaLocacao = {
            locador: { id: this.usuarioId },
            produtos: [produtoLocacao],
          };

          this.locacaoService.abrirNovaLocacao(novaLocacao).subscribe({
            next: () => {
              Swal.fire({
                icon: 'success',
                title: 'Produto adicionado ao carrinho.',
                showConfirmButton: false,
                timer: 1500,
              });
              this.locacaoService.notificarCarrinhoAtualizado();
            },
            error: (err) => console.error(err),
          });
        }
      });
  }

  abrirModal() {
    this.isModalOpen = true;
    this.menuAberto = false;
  }

  fecharModal() {
    this.isModalOpen = false;
  }

  enviarDenuncia(dados: { motivo: 'CONTEUDO_INDEVIDO' | 'PRECO_ABUSIVO' | 'PUBLICACAO_FALSA' | 'OUTRO'; descricao: string }) {
    if (!this.anuncio) {
      console.error('Anúncio não carregado.');
      return;
    }

    const token = localStorage.getItem('auth_token');

    if (!token) {
      Swal.fire({
        icon: 'error',
        title: 'Usuário não autenticado',
        text: 'Você precisa estar logado para denunciar.'
      });
      return;
    }

    let decoded: any;
    try {
      decoded = jwtDecode(token);
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      Swal.fire({
        icon: 'error',
        title: 'Token inválido',
        text: 'Por favor, faça login novamente.'
      });
      return;
    }

    const role = decoded.roles;

    if (!this.usuarioId) {
      Swal.fire({
        icon: 'error',
        title: 'Usuário não autenticado',
        text: 'Você precisa estar logado para denunciar.'
      });
      return;
    }

    if (role === 'ADMINISTRADOR') {
      Swal.fire({
        icon: 'error',
        title: 'Acesso negado',
        text: 'Administradores não podem fazer denúncias.'
      });
      return;
    }

    const denunciaDto: DenunciaDTO = {
      motivo: dados.motivo,
      descricao: dados.descricao,
      produtoId: this.anuncio.id,
      denuncianteId: this.usuarioId
    };

    this.denunciaService.criar(denunciaDto).subscribe({
      next: () => {
        Swal.fire({
          icon: 'success',
          title: 'Denúncia enviada',
          text: 'Sua denúncia foi registrada com sucesso.',
          timer: 1500,
          showConfirmButton: false,
        });
        this.fecharModal();
      },
      error: () => {
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Não foi possível enviar a denúncia. Tente novamente mais tarde.',
        });
      }
    });
  }

  private carregarAvaliacoes(produtoId: number): void {
    this.avaliacaoService
      .listarPorProduto(produtoId)
      .subscribe(
        avs => this.avaliacoes = avs,
        _err => this.avaliacoes = []
      );
  }

  private carregarMedia(produtoId: number): void {
    this.avaliacaoService.obterMediaPorProduto(produtoId)
      .subscribe(m => this.mediaAvaliacoes = m, _ => this.mediaAvaliacoes = null);
  }

  goToHome() {
    this.router.navigate(['/']);
  }
}

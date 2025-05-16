import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetalheAnuncioDto } from '../../shared/model/dto/detalheAnuncioDto';
import { AnuncioService } from '../../shared/service/anuncio.service';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { Gallery, GalleryItem, ImageItem } from 'ng-gallery';
import { startOfDay, isBefore, isToday } from 'date-fns';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { LocacaoService } from '../../shared/service/locacao.service';
import { LoginService } from '../../shared/service/LoginService';

@Component({
  selector: 'app-detalhe-produto',
  templateUrl: './detalhe-produto.component.html',
  styleUrl: './detalhe-produto.component.scss',
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

  constructor(
    private route: ActivatedRoute,
    private anuncioService: AnuncioService,
    private gallery: Gallery,
    private fb: FormBuilder,
    private locacaoService: LocacaoService,
    private loginService: LoginService
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.carregarAnuncio(id);
    }

    this.form = this.fb.group({
      periodoLocacao: new FormGroup({
        inicio: new FormControl(),
        final: new FormControl(),
      }),
    });

    this.dateFilter = this.criarFiltroData();
  }

  carregarAnuncio(id: number) {
    this.anuncioService.buscar(id).subscribe(
      (data) => {
        data.datasIndisponiveis = data.datasIndisponiveis.map((dataStr: string | Date) =>
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

  const usuarioId = this.loginService.buscarIdUsuarioComToken();
  if (!usuarioId) {
    alert('Usuário não autenticado!');
    return;
  }

  this.locacaoService.verificarLocacaoPendente(usuarioId).subscribe((locacaoExistente) => {
    if (locacaoExistente) {
      this.locacaoService
        .incluirProdutoNaLocacao(locacaoExistente.id, produtoLocacao)
        .subscribe({
          next: () => {
            alert('Produto adicionado à locação existente com sucesso!');
            this.locacaoService.notificarCarrinhoAtualizado();
          },
          error: (err) => console.error(err),
        });
    } else {
      const novaLocacao = {
        locador: { id: usuarioId },
        produtos: [produtoLocacao],
      };

      this.locacaoService.abrirNovaLocacao(novaLocacao).subscribe({
        next: () => {
          alert('Locação criada com sucesso!');
          this.locacaoService.notificarCarrinhoAtualizado();
        },
        error: (err) => console.error(err),
      });
    }
  });
}

}

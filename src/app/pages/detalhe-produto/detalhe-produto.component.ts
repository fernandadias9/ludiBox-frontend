import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DetalheAnuncioDto } from '../../shared/model/dto/detalheAnuncioDto';
import { AnuncioService } from '../../shared/service/anuncio.service';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { Gallery, GalleryItem, ImageItem } from 'ng-gallery';
import { startOfDay, isBefore, isToday } from 'date-fns';

@Component({
  selector: 'app-detalhe-produto',
  templateUrl: './detalhe-produto.component.html',
  styleUrl: './detalhe-produto.component.scss'
})
export class DetalheProdutoComponent implements OnInit {
  anuncio: DetalheAnuncioDto | null = null;
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  galleryItems: GalleryItem[] = [];

  constructor(
    private route: ActivatedRoute,
    private anuncioService: AnuncioService,
    private gallery: Gallery
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.carregarAnuncio(id);
    }
  }

  carregarAnuncio(id: number) {
    this.anuncioService.buscar(id).subscribe(
      (data) => {
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

    this.galleryItems = this.anuncio.imagens.map(img => {
      const imageSrc = `data:image/jpeg;base64,${img}`;
      return new ImageItem({ src: imageSrc, thumb: imageSrc });
    });

    const galleryRef = this.gallery.ref('produtoGallery');
    galleryRef.load(this.galleryItems);
  }

  alugar() {
    console.log('Produto alugado!');
  }
}

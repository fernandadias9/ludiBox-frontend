import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-anuncios',
  templateUrl: './card-anuncios.component.html',
  styleUrl: './card-anuncios.component.scss'
})
export class CardAnunciosComponent {
  @Input() id: number;
  @Input() imagem: string;
  @Input() itemName: string = '';
  @Input() itemPrice: number = 0;
  @Input() userImage: string = '';
  @Input() userName: string = '';

  constructor(private router: Router) {}
  abrirAnuncio() {
    this.router.navigate(['/produto', this.id]);
  }
}

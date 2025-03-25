import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-card-anuncios',
  templateUrl: './card-anuncios.component.html',
  styleUrl: './card-anuncios.component.scss'
})
export class CardAnunciosComponent {
  @Input() imagem: string;
  @Input() itemName: string = '';
  @Input() itemPrice: number = 0;
  @Input() userImage: string = '';
  @Input() userName: string = '';

}

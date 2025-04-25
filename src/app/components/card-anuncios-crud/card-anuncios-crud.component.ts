import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Produto } from '../../shared/model/entity/produto';

@Component({
  selector: 'app-card-anuncios-crud',
  templateUrl: './card-anuncios-crud.component.html',
  styleUrl: './card-anuncios-crud.component.scss'
})
export class CardAnunciosCrudComponent {
  @Input() produto!: Produto;
  @Output() editar = new EventEmitter<Produto>();
  @Output() deletar = new EventEmitter<number>();

  menuAberto = false;

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }

  onEditar() {
    this.menuAberto = false;
    this.editar.emit(this.produto);
  }

  onDeletar() {
    this.menuAberto = false;
    this.deletar.emit(this.produto.id);
  }

  get imagemPrincipal(): string | undefined {
    return this.produto.imagens?.[0] || 'assets/imagem-nao-disponivel.png';
  }

}

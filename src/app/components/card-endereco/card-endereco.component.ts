import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Endereco } from '../../shared/model/entity/endereco';

@Component({
  selector: 'app-card-endereco',
  templateUrl: './card-endereco.component.html',
  styleUrl: './card-endereco.component.scss'
})
export class CardEnderecoComponent {
  @Input() endereco!: Endereco;
  @Output() editar = new EventEmitter<Endereco>();
  @Output() deletar = new EventEmitter<number>();

  menuAberto = false;

  formatarCep(cep: number): string {
    const cepStr = cep.toString().padStart(8, '0');
    return `${cepStr.slice(0, 5)}-${cepStr.slice(5)}`;
  }

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }

  onEditar() {
    this.menuAberto = false;
    this.editar.emit(this.endereco);
  }

  onDeletar() {
    this.menuAberto = false;
    this.deletar.emit(this.endereco.id);
  }
}

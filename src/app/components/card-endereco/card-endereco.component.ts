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

  estadosPorExtenso: { [key: string]: string } = {
    'Acre': 'AC', 'Alagoas': 'AL', 'Amapá': 'AP', 'Amazonas': 'AM',
    'Bahia': 'BA', 'Ceará': 'CE', 'Distrito Federal': 'DF', 'Espírito Santo': 'ES',
    'Goiás': 'GO', 'Maranhão': 'MA', 'Mato Grosso': 'MT', 'Mato Grosso do Sul': 'MS',
    'Minas Gerais': 'MG', 'Pará': 'PA', 'Paraíba': 'PB', 'Paraná': 'PR',
    'Pernambuco': 'PE', 'Piauí': 'PI', 'Rio de Janeiro': 'RJ', 'Rio Grande do Norte': 'RN',
    'Rio Grande do Sul': 'RS', 'Rondônia': 'RO', 'Roraima': 'RR', 'Santa Catarina': 'SC',
    'São Paulo': 'SP', 'Sergipe': 'SE', 'Tocantins': 'TO'
  };


  menuAberto = false;

  obterSigla(estado: string): string {
    return this.estadosPorExtenso[estado] || estado;
  }

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
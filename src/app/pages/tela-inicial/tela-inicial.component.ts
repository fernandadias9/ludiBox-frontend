import { Component } from '@angular/core';

@Component({
  selector: 'app-tela-inicial',
  templateUrl: './tela-inicial.component.html',
  styleUrl: './tela-inicial.component.scss'
})
export class TelaInicialComponent {
  isLoggedIn = false;
  userName = 'Usuário Exemplo';
  userImage = '';
  menuOpen = false;

  cards = new Array(100).fill({ title: 'Anúncio', price: 'R$ 100,00' });  // Simulando 100 itens
  itemsPerPage = 20;
  currentPage = 1;

  get totalPages(): number {
    return Math.ceil(this.cards.length / this.itemsPerPage);
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  getPaginatedCards() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.cards.slice(startIndex, endIndex);
  }

  changePage(direction: string) {
    if (direction === 'next' && this.currentPage < this.totalPages) {
      this.currentPage++;
    } else if (direction === 'prev' && this.currentPage > 1) {
      this.currentPage--;
    }
  }
}

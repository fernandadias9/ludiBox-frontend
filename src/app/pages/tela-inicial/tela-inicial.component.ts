import { Component } from '@angular/core';

@Component({
  selector: 'app-tela-inicial',
  templateUrl: './tela-inicial.component.html',
  styleUrls: ['./tela-inicial.component.scss']
})
export class TelaInicialComponent {
  isLoggedIn = false;
  userName = 'Usuário Exemplo';
  userImage = '';
  menuOpen = false;

  cards = new Array(150).fill({ title: 'Anúncio', price: 'R$ 100,00' });
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
    console.log('entrou');

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goToPage(page: number) {
    this.currentPage = page;
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const total = this.totalPages;
    let startPage: number;
    let endPage: number;

    if (total <= 5) {
      startPage = 1;
      endPage = total;
    } else {
      if (this.currentPage <= 3) {
        startPage = 1;
        endPage = 5;
      } else if (this.currentPage + 2 >= total) {
        startPage = total - 4;
        endPage = total;
      } else {
        startPage = this.currentPage - 2;
        endPage = this.currentPage + 2;
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  }
}

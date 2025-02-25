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

  cards = new Array(18).fill({ title: 'Anúncio', price: 'R$ 100,00' });

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}

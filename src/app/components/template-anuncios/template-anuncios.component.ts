import { Component } from '@angular/core';

@Component({
  selector: 'app-template-anuncios',
  templateUrl: './template-anuncios.component.html',
  styleUrl: './template-anuncios.component.scss'
})
export class TemplateAnunciosComponent {
  isLoggedIn = false;
  userName = '';
  userImage = '';
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}

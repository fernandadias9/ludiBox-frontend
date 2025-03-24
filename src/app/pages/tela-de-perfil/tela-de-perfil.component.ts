import { Component } from '@angular/core';

@Component({
  selector: 'app-tela-de-perfil',
  templateUrl: './tela-de-perfil.component.html',
  styleUrl: './tela-de-perfil.component.scss'
})
export class TelaDePerfilComponent {

  isOpen: boolean = false;
  menuList: { label: string; route: string }[] = [
    { label: 'Perfil', route: '' },
    { label: 'Endereços', route: '' },
    { label: 'Anúncios', route: '' },
    { label: 'Anúncios', route: '' },
    { label: 'Locações', route: '' },
    { label: 'Sair', route: '' }
  ];
}

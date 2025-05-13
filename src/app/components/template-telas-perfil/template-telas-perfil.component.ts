import { Component } from '@angular/core';

@Component({
  selector: 'app-template-telas-perfil',
  templateUrl: './template-telas-perfil.component.html',
  styleUrl: './template-telas-perfil.component.scss'
})
export class TemplateTelasPerfilComponent {
  menuList: { label: string; route: string }[] = [
    { label: 'Perfil', route: '/tela-perfil' },
    { label: 'Endereços', route: '/enderecos' },
    { label: 'Anúncios', route: '/anuncios' },
    { label: 'Locações', route: '' },
    { label: 'Tela inicial', route: '' },
    { label: 'Sair', route: '/login' }
  ];
}

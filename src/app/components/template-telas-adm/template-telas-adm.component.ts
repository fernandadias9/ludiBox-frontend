import { Component } from '@angular/core';

@Component({
  selector: 'app-template-telas-adm',
  templateUrl: './template-telas-adm.component.html',
  styleUrl: './template-telas-adm.component.scss'
})
export class TemplateTelasAdmComponent {

  menuList: { label: string; route: string }[] = [
    { label: 'Dashboard', route: '/dashboard' },
    { label: 'Administradores', route: '/administradores' },
    { label: 'Denúncias', route: '/denuncias' },
    { label: 'Sair', route: '' }
  ];
}

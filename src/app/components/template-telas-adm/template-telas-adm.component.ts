import { Component } from '@angular/core';

@Component({
  selector: 'app-template-telas-adm',
  templateUrl: './template-telas-adm.component.html',
  styleUrl: './template-telas-adm.component.scss'
})
export class TemplateTelasAdmComponent {

  menuList: { label: string; route: string }[] = [
    { label: 'Dashboard', route: '' },
    { label: 'Usuários', route: '' },
    { label: 'Denúncias', route: '' },
    { label: 'Sair', route: '' }
  ];
}

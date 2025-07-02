import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { LoginService } from '../../shared/service/LoginService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-template-telas-adm',
  templateUrl: './template-telas-adm.component.html',
  styleUrl: './template-telas-adm.component.scss'
})
export class TemplateTelasAdmComponent implements OnInit {
  menuList: { label: string; route: string}[] = [];

  ngOnInit(): void {
    this.menuList = [
      { label: 'Dashboard', route: '/dashboard' },
      { label: 'Administradores', route: '/administradores' },
      { label: 'Denúncias', route: '/denuncias' },
      { label: 'Valor Bruto', route: '/valor-bruto' },
      { label: 'Locações Realizadas', route: '/locacoes-realizadas' },
      { label: 'Pagamentos', route: '/pagamentos' },
    ];
  }
}

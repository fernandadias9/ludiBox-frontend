import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Component({
  selector: 'app-tela-acesso-negado',
  templateUrl: './tela-acesso-negado.component.html',
  styleUrls: ['./tela-acesso-negado.component.scss']
})
export class TelaAcessoNegadoComponent {

  constructor(private location: Location, private router: Router) {}

  voltarParaTelaInicial() {
    const token = localStorage.getItem('auth_token');

    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        const role = decoded.roles;

        if (role === 'USUARIO') {
          this.router.navigate(['/']);
          return;
        }

        if (role === 'ADMINISTRADOR') {
          this.router.navigate(['/dashboard']);
          return;
        }
      } catch (e) {

        this.router.navigate(['/login']);
        return;
      }
    }
    
    this.router.navigate(['/login']);
  }
}

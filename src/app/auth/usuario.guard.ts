import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

@Injectable({ providedIn: 'root' })
export class UsuarioGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const token = localStorage.getItem('auth_token');

    if (!token) return true;

    try {
      const decoded: any = jwtDecode(token);
      const role = decoded.roles;

      if (role === 'USUARIO') {
        return true;
      }

      if (role === 'ADMINISTRADOR') {
        this.router.navigate(['/acesso-negado']);
        return false;
      }

      return false;
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
      return true;
    }
  }
}

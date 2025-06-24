import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { LoginService } from '../shared/service/LoginService';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router, private loginService: LoginService) {}

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const token = localStorage.getItem('auth_token');
    if (!this.loginService.isLoggedIn) {
      this.router.navigate(['/']);
      return false;
    }

    try {
      const decoded: any = jwtDecode(token);
      const perfil = decoded.roles;

      const rolesPermitidos = next.data['roles'] as string[] | undefined;
      if (!rolesPermitidos || rolesPermitidos.length === 0) {
        return true;
      }
      if (!rolesPermitidos.includes(perfil)) {
        this.router.navigate(['/acesso-negado']);
        return false;
      }

      return true;

    } catch (e) {
      console.error('Erro ao decodificar o token', e);
      this.router.navigate(['/acesso-negado']);
      return false;
    }
  }
}

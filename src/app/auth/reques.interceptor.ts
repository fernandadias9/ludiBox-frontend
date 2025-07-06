import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { LoginService } from "../shared/service/LoginService";

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  private PUBLIC_PATHS = [
    '/produto/listar',
    '/produto/listarComFiltro',
    '/produto/buscar',
    '/auth/login',
    '/auth/cadastrar_adm',
    '/auth/nova-pessoa',
    '/api/password/reset',
    '/^\/avaliacoes\/produto\/\d+$/'
  ];

  constructor(private loginService: LoginService, private router: Router) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    if (req.method === 'OPTIONS') {
      return next.handle(req);
    }

    if (this.PUBLIC_PATHS.some(path => req.url.includes(path))) {
      return next.handle(req);
    }

    const token = this.loginService.token;

    if (token) {
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });
      return next.handle(cloned);
    }
    return next.handle(req);
  }
}
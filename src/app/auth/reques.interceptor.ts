import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { LoginService } from "../shared/service/LoginService";

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  private PUBLIC_PATHS = [
    '/produto/listar',
    '/produto/buscar',
    '/auth/login',
    '/auth/cadastrar_adm',
    '/auth/nova-pessoa',
    '/api/password/reset',
  ];

  private PUBLIC_REGEX_PATHS = [
    /^\/produto\/listarComFiltro(\?.*)?$/,
    /^\/avaliacoes\/produto\/\d+$/,
  ];

  constructor(private loginService: LoginService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method === 'OPTIONS') {
      return next.handle(req);
    }

    const requestPath = new URL(req.url, 'http://dummybase').pathname;

    const isPublic = this.PUBLIC_PATHS.some(path => requestPath.includes(path)) ||
                     this.PUBLIC_REGEX_PATHS.some(regex => regex.test(requestPath));

    if (isPublic) {
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
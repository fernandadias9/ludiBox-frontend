import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { catchError, Observable, throwError } from "rxjs";
import { LoginService } from "../shared/service/LoginService";

@Injectable()
export class RequestInterceptor implements HttpInterceptor {
  constructor(private loginService: LoginService, private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const tokenUsuarioAutenticado = localStorage.getItem('tokenUsuarioAutenticado');
    let authReq = req;

    if (tokenUsuarioAutenticado) {
      authReq = req.clone({
          setHeaders: { Authorization: `Bearer ${tokenUsuarioAutenticado}` }
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          this.loginService.logout();
          this.router.navigate(['/']);
        }
        return throwError(error);
      })
    );

  }
}
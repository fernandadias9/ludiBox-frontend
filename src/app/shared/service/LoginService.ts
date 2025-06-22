import { jwtDecode } from 'jwt-decode';
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { Pessoa } from "../model/entity/pessoa";

interface AuthResponse {
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private readonly API = 'http://localhost:8080/auth';

  constructor(private httpCliente: HttpClient) { }

  cadastrar(pessoa: Pessoa): Observable<any> {
    return this.httpCliente.post<any>(this.API + "/nova-pessoa", pessoa);
  }

  buscarIdUsuarioComToken(): number | null {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const tokenDecodificado: any = jwtDecode(token);
        return tokenDecodificado.id;
      }
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
    }
    return null;
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('idUsuarioAutenticado');
    localStorage.clear();
  }

  login(email: string, senha: string): Observable<void> {
    return this.httpCliente.post<AuthResponse>(`${this.API}/authenticatePessoa`, { username: email, password: senha })
      .pipe(
        map(res => {
          localStorage.setItem('auth_token', res.token);
        })
      );
  }

  public get token(): string | null {
    return localStorage.getItem('auth_token');
  }

  public get isLoggedIn(): boolean {
    return !!this.token;
  }
}



import { jwtDecode } from 'jwt-decode';
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from 'rxjs/operators';
import { Pessoa } from "../model/entity/pessoa";

interface AuthResponse {
  tempToken: string;
  twoFactorRequired: boolean;
  token: string;
}

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private readonly API = 'http://localhost:8080/auth';

  constructor(private httpCliente: HttpClient) { }

  login(email: string, senha: string): Observable<AuthResponse> {
    const url = `${this.API}/login`;

    const body = {
      username: email,
      password: senha
    };

    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    return this.httpCliente.post<any>(url, body, { headers });
  }

  confirmarLoginComTotp(tempToken: string, code: string): Observable<AuthResponse> {
    const url = `${this.API}/2fa/confirm`;

    const params = new URLSearchParams();
    params.set('tempToken', tempToken);
    params.set('code', code);

    const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });

    return this.httpCliente.post<AuthResponse>(
      url,
      params.toString(),
      { headers }
    );
  }

  getQRCode(): Observable<Blob> {
    const url = 'http://localhost:8080/two-factors/2fa/generate';

    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token || ''}`
    });

    return this.httpCliente.post(url, null, {
      headers: headers,
      responseType: 'blob'
    });
  }

  toggle2FA(enable: boolean): Observable<string> {
    const url = 'http://localhost:8080/two-factors/2fa/toggle';
    return this.httpCliente.post(url, enable, { responseType: 'text' });
  }

  confirmar2FA(code: string): Observable<string> {
    const url = `http://localhost:8080/two-factors/2fa/confirm?code=${code}`;
    return this.httpCliente.post(url, {}, { responseType: 'text' as const });
  }

  cadastrar(pessoa: Pessoa): Observable<any> {
    return this.httpCliente.post<any>(this.API + "/nova-pessoa", pessoa);
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('idUsuarioAutenticado');
    localStorage.clear();
  }

  public get token(): string | null {
    return localStorage.getItem('auth_token');
  }

  public get isLoggedIn(): boolean {
    return !!this.token;
  }

  buscarIdUsuarioComToken(): number | null {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        const tokenDecodificado: any = jwtDecode(token);
        return parseInt(tokenDecodificado.sub); // 'sub' = ID
      }
    } catch (error) {
      console.error('Erro ao decodificar o token:', error);
    }
    return null;
  }
}

import { jwtDecode } from 'jwt-decode';
import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { PessoaDTO } from "../model/dto/PessoaDTO";
import { Pessoa } from "../model/entity/pessoa";


@Injectable({
  providedIn: 'root'
})
  export class LoginService {

    private readonly API = 'http://localhost:8080/auth';

    constructor(private httpCliente: HttpClient) { }

    getQRCode(): Observable<Blob> {
      const url = 'http://localhost:8080/two-factors/2fa/generate';
      
      const token = localStorage.getItem('token'); 
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
      return this.httpCliente.post(
        url,
        {},
        {
          responseType: 'text' as const
        }
      );
    }
    
    
    autenticarComTotp(dto: PessoaDTO, code?: string): Observable<HttpResponse<string>> {
      const authHeader = 'Basic ' + btoa(`${dto.login}:${dto.senha}`);
      const headers = new HttpHeaders({ 'authorization': authHeader });
    
      const url = code
        ? `${this.API}/authenticatePessoa?code=${encodeURIComponent(code)}`
        : `${this.API}/authenticatePessoa`;
    
      return this.httpCliente.post<string>(
        url,
        dto,
        {
          headers,
          observe: 'response',
          responseType: 'text' as 'json'
        }
      );
    }
    
    cadastrar(pessoa: Pessoa): Observable<any>{
      return this.httpCliente.post<any>(this.API+"/nova-pessoa", pessoa);
    }

    buscarIdUsuarioComToken(): number | null {
    try {
      const token = localStorage.getItem('tokenUsuarioAutenticado');
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
      localStorage.removeItem('tokenUsuarioAutenticado');
      localStorage.removeItem('idUsuarioAutenticado');
      localStorage.clear();
    }


    login(email: string, senha: string): Observable<any> {
      const url = `${this.API}/login`;
    
      const params = new URLSearchParams();
      params.set('email', email);
      params.set('senha', senha);
    
      const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    
      return this.httpCliente.post<any>(
        url,
        params.toString(),
        { headers }
      );
    }

    confirmarLoginComTotp(tempToken: string, code: string): Observable<any> {
      const url = `${this.API}/2fa/confirm`;
    
      const params = new URLSearchParams();
      params.set('tempToken', tempToken);
      params.set('code', code);
    
      const headers = new HttpHeaders({ 'Content-Type': 'application/x-www-form-urlencoded' });
    
      return this.httpCliente.post<any>(
        url,
        params.toString(),
        { headers }
      );
    }
    
    

}



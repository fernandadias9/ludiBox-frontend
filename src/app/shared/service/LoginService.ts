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

  autenticar(dto: PessoaDTO): Observable<HttpResponse<string>> {
    const authHeader = 'Basic ' + btoa(`${dto.login}:${dto.senha}`);
    const headers = new HttpHeaders({
      'authorization': authHeader
    });

    return this.httpCliente.post<string>(`${this.API}/authenticatePessoa`, dto, {
      headers,
      observe: 'response',
      responseType: 'text' as 'json'
    });
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
    localStorage.clear();
  }
}



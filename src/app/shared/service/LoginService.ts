import { HttpClient, HttpHeaders, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";

import { Observable } from "rxjs";
import { PessoaDTO } from "../model/dto/PessoaDTO";
import { Pessoa } from "../model/entity/pessoa";

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  

  //URL BackEnd Local
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



  sair() {
    localStorage.removeItem('tokenUsuarioAutenticado');
  }
}



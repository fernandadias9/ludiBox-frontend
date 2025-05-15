import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Locacao } from '../model/entity/locacao';

@Injectable({
  providedIn: 'root'
})
export class LocacaoService {
  private readonly API = 'http://localhost:8080/locacao';

  constructor(private http: HttpClient) { }

  verificarLocacaoPendente(usuarioId: number): Observable<Locacao | null> {
  return this.http.get<Locacao | null>(`${this.API}/pendente/${usuarioId}`);
}

  abrirNovaLocacao(request: any): Observable<Locacao> {
    return this.http.post<Locacao>(`${this.API}`, request);
  }

  incluirProdutoNaLocacao(locacaoId: number, produto: any): Observable<Locacao> {
    return this.http.post<Locacao>(`${this.API}/${locacaoId}/produtos`, produto);
  }
}

import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Avaliacao } from '../model/entity/avaliacao';

@Injectable({
  providedIn: 'root'
})
export class AvaliacaoService {

  private readonly API = 'http://localhost:8080/avaliacoes';

  constructor(private http: HttpClient) { }

  salvarAvaliacao(produtoLocacaoId: number, estrelas: number): Observable<Avaliacao> {
    const params = new HttpParams()
      .set('produtoLocacaoId', produtoLocacaoId.toString())
      .set('estrelas', estrelas.toString());

    return this.http.post<Avaliacao>(this.API, null, { params });
  }
}

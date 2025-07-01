import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Avaliacao } from '../model/entity/avaliacao';
import { AvaliacaoRequestDTO } from '../model/dto/avaliacaoRequestDTO';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AvaliacaoService {

  private readonly API = `${environment.apiURL}/avaliacoes`;

  constructor(private http: HttpClient) { }

  salvarAvaliacao(req: AvaliacaoRequestDTO): Observable<any> {
    return this.http.post<any>(this.API, req);
  }

  listarPorProduto(produtoId: number): Observable<Avaliacao[]> {
    return this.http.get<Avaliacao[]>(`${this.API}/produto/${produtoId}`);
  }

  obterMediaPorProduto(produtoId: number): Observable<number> {
    return this.http.get<number>(`${this.API}/produto/${produtoId}/media`);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Locacao } from '../model/entity/locacao';
import { ProdutoLocacao } from '../model/entity/produtoLocacao';
import { StatusLocacao } from '../model/enum/StatusLocacao';

@Injectable({
  providedIn: 'root',
})
export class LocacaoService {
  private readonly API = 'http://localhost:8080/locacao';

  constructor(private http: HttpClient) {}

  private carrinhoAtualizado = new BehaviorSubject<void>(null);

  carrinhoAtualizado$ = this.carrinhoAtualizado.asObservable();

  notificarCarrinhoAtualizado() {
    this.carrinhoAtualizado.next();
  }

  verificarLocacaoPendente(usuarioId: number): Observable<Locacao> {
    return this.http.get<Locacao>(`${this.API}/pendente/${usuarioId}`);
  }

  abrirNovaLocacao(request: any): Observable<Locacao> {
    return this.http.post<Locacao>(`${this.API}`, request);
  }

  incluirProdutoNaLocacao(
    locacaoId: number,
    produto: any
  ): Observable<Locacao> {
    return this.http.post<Locacao>(
      `${this.API}/${locacaoId}/produtos`,
      produto
    );
  }

  removerProdutoDaLocacao(
    locacaoId: number,
    produtoLocacaoId: number
  ): Observable<Locacao> {
    return this.http.delete<Locacao>(
      `${this.API}/${locacaoId}/produtos/${produtoLocacaoId}`
    );
  }

  deletarLocacao(locacaoId: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${locacaoId}`);
  }

  buscarPorId(id: number): Observable<Locacao> {
    return this.http.get<Locacao>(`${this.API}/${id}`);
  }

  finalizarLocacao(locacaoId: number, enderecoId: number, locadorId: number) {
    return this.http.post(
      `${this.API}/finalizar/${locacaoId}/${enderecoId}/${locadorId}`,
      null
    );
  }

  buscarLocacoesRecebidas(usuarioId: number): Observable<ProdutoLocacao[]> {
    return this.http.get<ProdutoLocacao[]>(
      `${this.API}/recebidas/${usuarioId}`
    );
  }

  buscarLocacoesEfetuadas(usuarioId: number): Observable<ProdutoLocacao[]> {
    return this.http.get<ProdutoLocacao[]>(`${this.API}/efetuadas/${usuarioId}`);
  }

  atualizarStatus(locacaoId: number, status: string): Observable<Locacao> {
    return this.http.put<Locacao>(`${this.API}/status/${locacaoId}`, status);
  }

  cancelarLocacao(id: number, motivo: string): Observable<any> {
    return this.http.post(`${this.API}/${id}/cancelar`, null, {
      params: { motivoCancelamento: motivo },
      responseType: 'text',
    });
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Produto } from '../model/entity/produto';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {
  private baseUrl = 'http://localhost:8080/produto';

  constructor(private http: HttpClient) {}

  listar(): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.baseUrl}/listar`);
  }

  buscar(id: number): Observable<Produto> {
    return this.http.get<Produto>(`${this.baseUrl}/buscar/${id}`);
  }

  salvar(produto: Produto, imagens: File[]): Observable<Produto> {
    const formData = new FormData();
    formData.append('produto', new Blob([JSON.stringify(produto)], { type: 'application/json' }));
    imagens.forEach(img => formData.append('imagens', img));
    return this.http.post<Produto>(`${this.baseUrl}`, formData, {
      responseType: 'text' as 'json'
    });
  }

  atualizar(id: number, produto: Produto, imagens?: File[]) {
    const formData = new FormData();
    formData.append('produto', new Blob([JSON.stringify(produto)], { type: 'application/json' }));
    if (imagens) {
      imagens.forEach(img => formData.append('imagens', img));
    }
    return this.http.put(`${this.baseUrl}/${id}`, formData, {
      responseType: 'text' as 'json'
    });
  }

  deletar(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      responseType: 'text' as 'json'
    });
  }

  atualizarStatus(id: number, status: string) {
    return this.http.put(`${this.baseUrl}/${id}/status?status=${status}`, {});
  }

  atualizarBloqueio(id: number) {
    return this.http.put(`${this.baseUrl}/bloqueio/${id}`, {});
  }

  listarProdutosPorPessoa(pessoaId: number): Observable<Produto[]> {
    return this.http.get<Produto[]>(`${this.baseUrl}/pessoa/${pessoaId}`);
  }
}

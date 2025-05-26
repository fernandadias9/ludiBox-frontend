import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Endereco } from '../model/entity/endereco';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnderecoService {
  private readonly API = 'http://localhost:8080/endereco';

  constructor(private http: HttpClient) { }

  listarPorPessoa(pessoaId: number): Observable<Endereco[]> {
    return this.http.get<Endereco[]>(`${this.API}/pessoa/${pessoaId}`);
  }

  salvarEndereco(endereco: Endereco): Observable<Endereco> {
    return this.http.post<Endereco>(`${this.API}/novo-endereco`, endereco);
  }

  atualizarEndereco(id: number, endereco: any) {
    return this.http.patch(`${this.API}/atualizar-endereco/${id}`, endereco);
  }

  buscarPorCep(cep: number) {
    return this.http.get(`http://localhost:8080/endereco/buscar_por_cep/${cep}`);
  }

  deletarEndereco(id: number) {
    return this.http.delete(`${this.API}/deletar-endereco/${id}`);
  }

  buscarPorId(id: number): Observable<Endereco> {
  return this.http.get<Endereco>(`${this.API}/${id}`);
}
}

import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AnuncioLeituraDto } from '../model/dto/anuncioLeituraDto';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DetalheAnuncioDto } from '../model/dto/detalheAnuncioDto';

@Injectable({
  providedIn: 'root'
})
export class AnuncioService {
  private readonly API = 'http://localhost:8080/produto';

  constructor(private http: HttpClient) { }

  listar(): Observable<AnuncioLeituraDto[]> {
    return this.http.get<AnuncioLeituraDto[]>(`${this.API}/listar`);
  }

  buscar(idProduto: number): Observable<DetalheAnuncioDto> {
    return this.http.get<DetalheAnuncioDto>(`${this.API}/buscar/${idProduto}`);
  }

  listarComFiltro(nome?: string, page: number = 0, size: number = 12): Observable<any> {
  let params = new HttpParams()
    .set('page', page)
    .set('size', size);

  if (nome) {
    params = params.set('nome', nome);
  }

  return this.http.get(`${this.API}/listarComFiltro`, { params });
}
}

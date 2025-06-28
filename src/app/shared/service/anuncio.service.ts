import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AnuncioLeituraDto } from '../model/dto/anuncioLeituraDto';
import { HttpClient, HttpParams } from '@angular/common/http';
import { DetalheAnuncioDto } from '../model/dto/detalheAnuncioDto';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnuncioService {
  private readonly API = `${environment.apiURL}/produto`;

  constructor(private http: HttpClient) { }

  listar(): Observable<AnuncioLeituraDto[]> {
    return this.http.get<AnuncioLeituraDto[]>(`${this.API}/listar`);
  }

  buscar(idProduto: number): Observable<DetalheAnuncioDto> {
    return this.http.get<DetalheAnuncioDto>(`${this.API}/buscar/${idProduto}`);
  }

  listarComFiltro(nome = "", page = 0, size = 12): Observable<any> {
    let params = new HttpParams().set("page", page.toString()).set("size", size.toString())

    if (nome && nome.trim() !== "") {
      params = params.set("nome", nome.trim())
    }

    return this.http.get(`${this.API}/listarComFiltro`, { params })
  }
}

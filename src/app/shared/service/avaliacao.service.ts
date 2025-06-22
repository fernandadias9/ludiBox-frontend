import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Avaliacao } from '../model/entity/avaliacao';
import { AvaliacaoRequestDTO } from '../model/dto/avaliacaoRequestDTO';

@Injectable({
  providedIn: 'root'
})
export class AvaliacaoService {

  private readonly API = 'http://localhost:8080/avaliacoes';

  constructor(private http: HttpClient) { }

  salvarAvaliacao(req: AvaliacaoRequestDTO): Observable<any> {
    return this.http.post<any>(this.API, req);
  }
}

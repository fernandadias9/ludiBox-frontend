import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AnuncioLeituraDto } from '../model/dto/anuncioLeituraDto';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AnuncioService {
  private readonly API = 'http://localhost:8080/produto';

  constructor(private http: HttpClient) { }

  listar(): Observable<AnuncioLeituraDto[]> {
    return this.http.get<AnuncioLeituraDto[]>(`${this.API}/listar`);
  }
}

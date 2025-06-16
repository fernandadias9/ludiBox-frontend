import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Denuncia {
  id?: number;
  motivo: string;
  descricao?: string;
  status?: string;
  produto: { id: number };
  dataCriacao?: string;
}

@Injectable({ providedIn: 'root' })
export class DenunciaService {
  private readonly API = '/denuncias';

  constructor(private http: HttpClient) {}

  criar(denuncia: Denuncia): Observable<Denuncia> {
    return this.http.post<Denuncia>(this.API, denuncia);
  }

  listarComFiltro(filtros: {
    dataInicio?: string;
    dataFim?: string;
    motivo?: string;
    status?: string;
  }): Observable<Denuncia[]> {
    let params = new HttpParams();
    if (filtros.dataInicio) params = params.set('dataInicio', filtros.dataInicio);
    if (filtros.dataFim) params = params.set('dataFim', filtros.dataFim);
    if (filtros.motivo) params = params.set('motivo', filtros.motivo);
    if (filtros.status) params = params.set('status', filtros.status);

    return this.http.get<Denuncia[]>(`${this.API}/filtro`, { params });
  }

  permitir(id: number): Observable<void> {
    return this.http.put<void>(`${this.API}/${id}/permitir`, {});
  }

  bloquear(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API}/${id}/bloquear`);
  }
}

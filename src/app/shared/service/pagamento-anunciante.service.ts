import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PagamentoAnuncianteService {

  private readonly API = `${environment.apiURL}/pagamentos`;

  constructor(private http: HttpClient) { }

  salvarPagamento(pagamento: any): Observable<any> {
    return this.http.post(`${this.API}`, pagamento);
  }

  listarComFiltro(filtro: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.API}/filtrar`, filtro);
  }

  pagar(id: number): Observable<any> {
    return this.http.put(`${this.API}/pagar/${id}`, null);
  }
}

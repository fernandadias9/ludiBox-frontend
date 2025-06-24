import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PagamentoAnuncianteService {

  private readonly API = 'http://localhost:8080/pagamentos';

  constructor(private http: HttpClient) { }

  salvarPagamento(pagamento: any): Observable<any> {
    return this.http.post(`${this.API}`, pagamento);
  }
}

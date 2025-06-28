import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SenhasDTO } from '../model/dto/SenhasDTO';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = `${environment.apiURL}/api/password`;

  constructor(private http: HttpClient) {}

  enviarEmailRecuperacao(email: string) {
    return this.http.post(`${this.apiUrl}/reset/`, email , {
      responseType: 'text'
   });
  }

  alterarSenha(senhas: SenhasDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/editar-senha`, senhas);
  }
}
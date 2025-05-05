import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SenhasDTO } from '../model/dto/SenhasDTO';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'http://localhost:8080/api/password';

  constructor(private http: HttpClient) {}

  enviarEmailRecuperacao(email: string) {
    return this.http.post(`${this.apiUrl}/reset`, { email }, {
      responseType: 'text'
   }); 
  }

  alterarSenha(senhas: SenhasDTO): Observable<any> {
    return this.http.put(`${this.apiUrl}/editar-senha`, senhas)
  }
}
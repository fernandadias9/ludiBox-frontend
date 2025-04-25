import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'http://localhost:8080/api/password/reset';

  constructor(private http: HttpClient) {}

  enviarEmailRecuperacao(email: string) {
    return this.http.post(this.apiUrl, { email }, {
      responseType: 'text'
    });
  }
}
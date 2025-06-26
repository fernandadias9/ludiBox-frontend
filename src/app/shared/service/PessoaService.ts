import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Pessoa } from "../model/entity/pessoa";
import { PerfilDTO } from "../model/dto/PerfilDTO";

@Injectable({
  providedIn: 'root'
})
export class PessoaService {

  private readonly API = 'http://localhost:8080/pessoa';

  constructor(private httpCliente: HttpClient) { }

  buscarPerfilPorId(id: number): Observable<PerfilDTO> {
    return this.httpCliente.get<PerfilDTO>(`${this.API}/buscar_perfil/${id}`);
  }

  atualizarPerfil(id: number, dadosAtualizados: any): Observable<any> {
    return this.httpCliente.patch(`${this.API}/atualizar/${id}`, dadosAtualizados);
  }

  excluirPessoa(id: number): Observable<any> {
    return this.httpCliente.put(`${this.API}/excluir/${id}`, {});
  }

  atualizarFoto(id: number, foto: File): Observable<any> {
    const formData = new FormData();
    formData.append('imagem', foto);
    console.log(formData);
    console.log(`${this.API}/upload/${id}`);
    return this.httpCliente.patch(`${this.API}/upload/${id}`, formData, {
      responseType: 'text' as 'json'
    });
  }

  buscarAdministradores(): Observable<Pessoa[]> {
    return this.httpCliente.get<Pessoa[]>(`${this.API}/buscarAdministradores`);
  }

  buscarUsuariosAtivos(): Observable<Pessoa[]> {
    return this.httpCliente.get<Pessoa[]>(`${this.API}/quantidade-ativos`);
  }
}

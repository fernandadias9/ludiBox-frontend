import { Component, OnInit } from '@angular/core';
import { PessoaService } from '../../shared/service/PessoaService';
import { Pessoa } from '../../shared/model/entity/pessoa';

@Component({
  selector: 'app-tela-de-usuarios-administradores',
  templateUrl: './tela-de-usuarios-administradores.component.html',
  styleUrl: './tela-de-usuarios-administradores.component.scss'
})
export class TelaDeUsuariosAdministradoresComponent implements OnInit {
  administradores: Pessoa[] = [];

  constructor(private pessoaService: PessoaService) {}

  ngOnInit(): void {
    this.carregarAdministradores();
  }

  carregarAdministradores(): void {
    this.pessoaService.buscarAdministradores().subscribe({
      next: (data) => {
        this.administradores = data;
      },
      error: (err) => {
        console.error('Erro ao buscar administradores:', err);
      }
    });
  }
}

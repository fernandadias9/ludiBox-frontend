import { Component, OnInit } from '@angular/core';
import { Endereco } from '../../shared/model/entity/endereco';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EnderecoService } from '../../shared/service/endereco.service';

@Component({
  selector: 'app-enderecos',
  templateUrl: './enderecos.component.html',
  styleUrl: './enderecos.component.scss'
})
export class EnderecosComponent implements OnInit {
  isOpen: boolean = false;
  idUsuario: number | undefined;
  enderecos: Endereco[] = [];

  constructor(private enderecoService: EnderecoService) {}

  ngOnInit(): void {
    const id = localStorage.getItem('idUsuarioAutenticado');
    if (id) {
      this.idUsuario = parseInt(id);
      this.listarPorPessoa();
    }
  }

  public listarPorPessoa(): void {
    if (!this.idUsuario) return;

    this.enderecoService.listarPorPessoa(this.idUsuario).subscribe(
      (res: Endereco[]) => {
        this.enderecos = res;
      },
      error => {
        console.error('Erro ao buscar endereços:', error);
      }
    );
  }

  abrirModal() {
    this.isOpen = true;
  }

  fecharModal() {
    this.isOpen = false;
  }

  onEnderecoAdicionado() {
    this.listarPorPessoa();
  }
}

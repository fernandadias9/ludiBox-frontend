import { Component, OnInit, ViewChild } from '@angular/core';
import { Endereco } from '../../shared/model/entity/endereco';
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
  enderecoSendoEditado: Endereco | null = null;

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
    this.enderecoSendoEditado = null;
    this.isOpen = true;
  }

  abrirModalEdicao(endereco: Endereco) {
    this.enderecoSendoEditado = { ...endereco };
    this.isOpen = true;
  }

  fecharModal() {
    this.isOpen = false;
  }

  onEnderecoAdicionado() {
    this.listarPorPessoa();
  }

  deletarEndereco(id: number) {
    this.enderecoService.deletarEndereco(id).subscribe(() => {
      this.listarPorPessoa();
    });
  }
}

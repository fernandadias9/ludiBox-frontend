import { Component, OnInit, ViewChild } from '@angular/core';
import { Endereco } from '../../shared/model/entity/endereco';
import { EnderecoService } from '../../shared/service/endereco.service';
import Swal from 'sweetalert2';
import { LoginService } from '../../shared/service/LoginService';

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

  constructor(private enderecoService: EnderecoService, private loginService: LoginService) {}

  ngOnInit(): void {
    this.idUsuario = this.loginService.buscarIdUsuarioComToken();
    if (this.idUsuario) {
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
    Swal.fire({
      title: 'Tem certeza que deseja deletar este endereço?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, deletar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.enderecoService.deletarEndereco(id).subscribe({
          next: () => {
            Swal.fire({
              icon: 'success',
              title: 'Endereço deletado com sucesso',
              showConfirmButton: false,
              timer: 2000
            });
            this.listarPorPessoa();
          },
          error: err => {
            Swal.fire({
              icon: 'error',
              title: 'Erro ao deletar endereço',
              text: err.error?.message || err.message,
              showConfirmButton: false,
              timer: 2000
            });
          }
        });
      }
    });
  }
}
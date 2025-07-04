import { Component, OnInit } from '@angular/core';
import { Pessoa } from '../../shared/model/entity/pessoa';
import { PessoaService } from '../../shared/service/PessoaService';
import Swal from 'sweetalert2';
 
@Component({
  selector: 'app-tela-de-usuarios-administradores',
  templateUrl: './tela-de-usuarios-administradores.component.html',
  styleUrl: './tela-de-usuarios-administradores.component.scss'
})
export class TelaDeUsuariosAdministradoresComponent implements OnInit {
  administradores: Pessoa[] = [];
  isModalOpen = false;
  admSelecionado?: Pessoa;
 
  constructor(private pessoaService: PessoaService) { }
 
  ngOnInit(): void {
    this.carregarAdministradores();
  }
 
  carregarAdministradores(): void {
    this.pessoaService.buscarAdministradores().subscribe({
      next: (data) => this.administradores = data,
      error: (err) => console.error('Erro ao buscar administradores:', err)
    });
  }
 
  abrirModal(adm: Pessoa): void {
    this.admSelecionado = { ...adm };
    this.isModalOpen = true;
  }
 
  fecharModal(): void {
    this.isModalOpen = false;
    this.admSelecionado = undefined;
  }
 
  salvarAlteracoes(atualizado: Pessoa): void {
    if (!atualizado.id) {
      console.error('ID não informado!');
      return;
    }
 
    const dados = {
      nome: atualizado.nome,
      email: atualizado.email,
      telefone: atualizado.telefone
    };
 
    this.pessoaService.atualizarAdministrador(atualizado.id, dados).subscribe({
      next: () => {
        this.fecharModal();
        this.carregarAdministradores();
 
        Swal.fire({
          icon: 'success',
          title: 'Sucesso',
          text: 'Administrador atualizado com sucesso.',
          timer: 2000,
          showConfirmButton: false
        });
      },
      error: (err) => {
        console.error('Erro ao atualizar administrador:', err);
        Swal.fire({
          icon: 'error',
          title: 'Erro',
          text: 'Não foi possível atualizar. Tente novamente.',
        });
      }
    });
  }
 
  mascaraDocumento(valor: string): string {
    if (!valor) return '';
    const numeros = valor.replace(/\D/g, '');
    return numeros.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, '$1.$2.$3-$4');
  }
 
  mascaraTelefone(telefone: string): string {
    if (!telefone) return '';
    const numeros = telefone.replace(/\D/g, '');
    if (numeros.length === 11) {
      return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (numeros.length === 10) {
      return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    return telefone;
  }
 
  excluirAdm(id: number) {
    Swal.fire({
      title: 'Confirma exclusão?',
      text: 'Esta ação não pode ser desfeita.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, excluir',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.pessoaService.excluirAdm(id).subscribe({
          next: () => {
            Swal.fire('Excluído!', 'Administrador removido com sucesso.', 'success');
            this.carregarAdministradores();
          },
          error: (erro) => {
            Swal.fire('Erro', 'Não foi possível excluir o administrador.', 'error');
          }
        });
      }
    });
  }
}
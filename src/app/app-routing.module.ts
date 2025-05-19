import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TelaDeLoginComponent } from './pages/tela-de-login/tela-de-login.component';
import { CadastroUsuarioComponent } from './pages/cadastro-usuario/cadastro-usuario.component';
import { RecuperacaoDeSenhaComponent } from './pages/recuperacao-de-senha/recuperacao-de-senha.component';
import { TelaDePerfilComponent } from './pages/tela-de-perfil/tela-de-perfil.component';
import { TelaInicialComponent } from './pages/tela-inicial/tela-inicial.component';
import { DetalheProdutoComponent } from './pages/detalhe-produto/detalhe-produto.component';
import { EnderecosComponent } from './pages/enderecos/enderecos.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CadastroAdministradorComponent } from './pages/cadastro-administrador/cadastro-administrador.component';
import { TelaDeUsuariosAdministradoresComponent } from './pages/tela-de-usuarios-administradores/tela-de-usuarios-administradores.component';
import { TelaDeDenunciasComponent } from './pages/tela-de-denuncias/tela-de-denuncias.component';
import { AnunciosCrudComponent } from './pages/anuncios-crud/anuncios-crud.component';
import { AuthGuard } from './auth/auth.guard';
import { TelaAcessoNegadoComponent } from './pages/tela-acesso-negado/tela-acesso-negado.component';
import { UsuarioGuard } from './auth/usuario.guard';

const routes: Routes = [

  // Rotas Públicas   
  { path: 'login', component: TelaDeLoginComponent },
  { path: 'cadastro', component: CadastroUsuarioComponent },
  { path: 'esqueci-minha_senha', component: RecuperacaoDeSenhaComponent },
  { path: 'acesso-negado', component: TelaAcessoNegadoComponent },

  { path: '', component: TelaInicialComponent, canActivate: [UsuarioGuard] },
  { path: 'produto/:id', component: DetalheProdutoComponent, canActivate: [UsuarioGuard] }, // Verificar como vai ser denuncia, pois se o adm puder ver tem que alterar

  // Rotas Usuários
  { path: 'tela-perfil', component: TelaDePerfilComponent, canActivate: [AuthGuard], data: { roles: ['USUARIO'] } },
  { path: 'enderecos', component: EnderecosComponent, canActivate: [AuthGuard], data: { roles: ['USUARIO'] } },
  { path: 'anuncios', component: AnunciosCrudComponent, canActivate: [AuthGuard], data: { roles: ['USUARIO'] } },

  // Rotas Administrativas
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard], data: { roles: ['ADMINISTRADOR'] } },
  { path: 'cadastro-adm', component: CadastroAdministradorComponent, canActivate: [AuthGuard], data: { roles: ['ADMINISTRADOR'] } },
  { path: 'administradores', component: TelaDeUsuariosAdministradoresComponent, canActivate: [AuthGuard], data: { roles: ['ADMINISTRADOR'] } },
  { path: 'denuncias', component: TelaDeDenunciasComponent, canActivate: [AuthGuard], data: { roles: ['ADMINISTRADOR'] } },
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }



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

const routes: Routes = [
  { path: 'login', component: TelaDeLoginComponent },
  { path: 'cadastro', component: CadastroUsuarioComponent },
  { path: 'esqueci-minha_senha', component: RecuperacaoDeSenhaComponent },
  { path: 'tela-perfil', component: TelaDePerfilComponent },
  { path: '', component: TelaInicialComponent },
  { path: 'produto/:id', component: DetalheProdutoComponent },
  { path: "enderecos", component:EnderecosComponent},
  { path: "dashboard", component:DashboardComponent},
  { path: "cadastro-adm", component: CadastroAdministradorComponent},
  { path: "administradores", component: TelaDeUsuariosAdministradoresComponent},
  { path: "denuncias", component: TelaDeDenunciasComponent},
  { path: "anuncios", component: AnunciosCrudComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }



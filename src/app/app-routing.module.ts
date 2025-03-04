import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TelaDeLoginComponent } from './pages/tela-de-login/tela-de-login.component';
import { CadastroUsuarioComponent } from './pages/cadastro-usuario/cadastro-usuario.component';
import { RecuperacaoDeSenhaComponent } from './pages/recuperacao-de-senha/recuperacao-de-senha.component';
import { TelaDePerfilComponent } from './pages/tela-de-perfil/tela-de-perfil.component';

const routes: Routes = [
  { path: '', component: TelaDeLoginComponent },
  { path: 'cadastro', component: CadastroUsuarioComponent },
  { path: 'esqueci-minha_senha', component: RecuperacaoDeSenhaComponent },
  { path: 'tela-perfil', component: TelaDePerfilComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }



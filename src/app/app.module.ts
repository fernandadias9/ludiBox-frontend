import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TemplateTelasIniciaisComponent } from './components/template-telas-iniciais/template-telas-iniciais.component';
import { InputComponent } from './components/input/input.component';
import { FormsModule } from '@angular/forms';
import { TelaDeLoginComponent } from './pages/tela-de-login/tela-de-login.component';
import { CadastroUsuarioComponent } from './pages/cadastro-usuario/cadastro-usuario.component';
import { ButtonPrimaryComponent } from './components/button-primary/button-primary.component';
import { ButtonSecondaryComponent } from './components/button-secondary/button-secondary.component';

@NgModule({
  declarations: [
    AppComponent,
    TemplateTelasIniciaisComponent,
    InputComponent,
    TelaDeLoginComponent,
    CadastroUsuarioComponent,
    ButtonPrimaryComponent,
    ButtonSecondaryComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

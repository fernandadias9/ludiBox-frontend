import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GALLERY_CONFIG, GalleryConfig, GalleryModule } from 'ng-gallery';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TemplateTelasIniciaisComponent } from './components/template-telas-iniciais/template-telas-iniciais.component';
import { InputComponent } from './components/input/input.component';
import { FormsModule } from '@angular/forms';
import { TelaDeLoginComponent } from './pages/tela-de-login/tela-de-login.component';
import { CadastroUsuarioComponent } from './pages/cadastro-usuario/cadastro-usuario.component';
import { ButtonPrimaryComponent } from './components/button-primary/button-primary.component';
import { ButtonSecondaryComponent } from './components/button-secondary/button-secondary.component';
import { RecuperacaoDeSenhaComponent } from './pages/recuperacao-de-senha/recuperacao-de-senha.component';
import { TelaDePerfilComponent } from './pages/tela-de-perfil/tela-de-perfil.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { LightboxModule } from 'ng-gallery/lightbox';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LoginService } from './shared/service/LoginService';
import { RequestInterceptor } from './auth/reques.interceptor';
import { CardAnunciosComponent } from './components/card-anuncios/card-anuncios.component';
import { TelaInicialComponent } from './pages/tela-inicial/tela-inicial.component';
import { TemplateAnunciosComponent } from './components/template-anuncios/template-anuncios.component';
import { DetalheProdutoComponent } from './pages/detalhe-produto/detalhe-produto.component';

@NgModule({
  declarations: [
    AppComponent,
    TemplateTelasIniciaisComponent,
    InputComponent,
    TelaDeLoginComponent,
    CadastroUsuarioComponent,
    ButtonPrimaryComponent,
    ButtonSecondaryComponent,
    RecuperacaoDeSenhaComponent,
    TelaDePerfilComponent,
    SidebarComponent,
    CardAnunciosComponent,
    TelaInicialComponent,
    TemplateAnunciosComponent,
    DetalheProdutoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    GalleryModule,
    LightboxModule,
  ],
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true
    },
    {
      provide: GALLERY_CONFIG,
      useValue: {
        autoHeight: true,
        imageSize: 'cover'
      } as GalleryConfig
    },
    LoginService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

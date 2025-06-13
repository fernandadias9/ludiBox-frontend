import {
  MatCalendar,
  MatCalendarBody,
  MatCalendarHeader,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { GALLERY_CONFIG, GalleryConfig, GalleryModule } from 'ng-gallery';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TemplateTelasIniciaisComponent } from './components/template-telas-iniciais/template-telas-iniciais.component';
import { InputComponent } from './components/input/input.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TelaDeLoginComponent } from './pages/tela-de-login/tela-de-login.component';
import { CadastroUsuarioComponent } from './pages/cadastro-usuario/cadastro-usuario.component';
import { ButtonPrimaryComponent } from './components/button-primary/button-primary.component';
import { ButtonSecondaryComponent } from './components/button-secondary/button-secondary.component';
import { RecuperacaoDeSenhaComponent } from './pages/recuperacao-de-senha/recuperacao-de-senha.component';
import { TelaDePerfilComponent } from './pages/tela-de-perfil/tela-de-perfil.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import {
  HTTP_INTERCEPTORS,
  provideHttpClient,
  withFetch,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { LightboxModule } from 'ng-gallery/lightbox';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LoginService } from './shared/service/LoginService';
import { RequestInterceptor } from './auth/reques.interceptor';
import { TelaInicialComponent } from './pages/tela-inicial/tela-inicial.component';
import { TemplateAnunciosComponent } from './components/template-anuncios/template-anuncios.component';
import { DetalheProdutoComponent } from './pages/detalhe-produto/detalhe-produto.component';
import {
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
  MAT_NATIVE_DATE_FORMATS,
  MatNativeDateModule,
  NativeDateAdapter,
} from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DateAdapter } from 'angular-calendar';
import { MatInputModule } from '@angular/material/input';
import { CustomDateAdapter } from './utils/adaptador-calendario';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';
import { EnderecosComponent } from './pages/enderecos/enderecos.component';
import { TemplateTelasPerfilComponent } from './components/template-telas-perfil/template-telas-perfil.component';
import { ModalEnderecoComponent } from './components/modal-endereco/modal-endereco.component';
import { CardEnderecoComponent } from './components/card-endereco/card-endereco.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { TemplateTelasAdmComponent } from './components/template-telas-adm/template-telas-adm.component';
import { CadastroAdministradorComponent } from './pages/cadastro-administrador/cadastro-administrador.component';
import { TelaDeUsuariosAdministradoresComponent } from './pages/tela-de-usuarios-administradores/tela-de-usuarios-administradores.component';
import { TelaDeDenunciasComponent } from './pages/tela-de-denuncias/tela-de-denuncias.component';
import { ModalAlterarSenhaComponent } from './components/modal-alterar-senha/modal-alterar-senha.component';
import { AnunciosCrudComponent } from './pages/anuncios-crud/anuncios-crud.component';
import { HeaderTelasPerfilComAddComponent } from './components/header-telas-perfil-com-add/header-telas-perfil-com-add.component';
import { ModalAnunciosComponent } from './components/modal-anuncios/modal-anuncios.component';
import { UploadImmagensComponent } from './components/upload-immagens/upload-immagens.component';
import { CardAnunciosCrudComponent } from './components/card-anuncios-crud/card-anuncios-crud.component';
import { CardAnunciosComponent } from './components/card-anuncios/card-anuncios.component';
import { LocacaoFinalizarComponent } from './pages/locacao-finalizar/locacao-finalizar.component';
import { LocacaoListagemComponent } from './pages/locacao-listagem/locacao-listagem.component';
import { ModalConfirmacaoComponent } from './components/modal-confirmacao/modal-confirmacao.component';

export const MY_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

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
    DetalheProdutoComponent,
    EnderecosComponent,
    TemplateTelasPerfilComponent,
    ModalEnderecoComponent,
    CardEnderecoComponent,
    DashboardComponent,
    TemplateTelasAdmComponent,
    CadastroAdministradorComponent,
    TelaDeUsuariosAdministradoresComponent,
    TelaDeDenunciasComponent,
    ModalAlterarSenhaComponent,
    AnunciosCrudComponent,
    HeaderTelasPerfilComAddComponent,
    ModalAnunciosComponent,
    UploadImmagensComponent,
    CardAnunciosCrudComponent,
    LocacaoFinalizarComponent,
    LocacaoListagemComponent,
    ModalConfirmacaoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    GalleryModule,
    LightboxModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatCalendarBody,
    MatCalendarHeader,
    MatCalendar,
    MatInputModule,
    MatIconModule,
    NgxMaskDirective,
  ],
  providers: [
    provideAnimationsAsync(),
    provideHttpClient(withInterceptorsFromDi(), withFetch()),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RequestInterceptor,
      multi: true,
    },
    {
      provide: GALLERY_CONFIG,
      useValue: {
        autoHeight: true,
        imageSize: 'cover',
      } as GalleryConfig,
    },
    { provide: MAT_DATE_LOCALE, useValue: 'pt-BR' },
    { provide: DateAdapter, useClass: CustomDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    provideNgxMask(),
    LoginService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

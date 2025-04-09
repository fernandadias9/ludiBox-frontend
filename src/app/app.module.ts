import { MatCalendar, MatCalendarBody, MatCalendarHeader, MatDatepickerModule } from '@angular/material/datepicker';
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
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch, withInterceptorsFromDi } from '@angular/common/http';
import { LightboxModule } from 'ng-gallery/lightbox';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { LoginService } from './shared/service/LoginService';
import { RequestInterceptor } from './auth/reques.interceptor';
import { CardAnunciosComponent } from './components/card-anuncios/card-anuncios.component';
import { TelaInicialComponent } from './pages/tela-inicial/tela-inicial.component';
import { TemplateAnunciosComponent } from './components/template-anuncios/template-anuncios.component';
import { DetalheProdutoComponent } from './pages/detalhe-produto/detalhe-produto.component';
import { MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS, MatNativeDateModule, NativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DateAdapter } from 'angular-calendar';
import { MatInputModule } from '@angular/material/input';

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
    ReactiveFormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatCalendarBody,
    MatCalendarHeader,
    MatCalendar,
    MatInputModule
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
    {provide: DateAdapter, useClass: NativeDateAdapter}, {provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS},
    LoginService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TemplateTelasIniciaisComponent } from './components/template-telas-iniciais/template-telas-iniciais.component';

@NgModule({
  declarations: [
    AppComponent,
    TemplateTelasIniciaisComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

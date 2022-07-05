import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SharedModule } from './components/shared/shared/shared.module';
import localeEsSV from '@angular/common/locales/es-SV';
import { registerLocaleData } from '@angular/common';

registerLocaleData(localeEsSV, 'es-SV');

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    SharedModule
  ],
  providers: [{provide: LOCALE_ID, useValue: 'es-SV'}],
  bootstrap: [AppComponent]
})
export class AppModule { }

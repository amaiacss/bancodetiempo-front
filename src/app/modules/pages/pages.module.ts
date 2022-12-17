import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { HttpClient } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { PagesRoutingModule } from './pages-routing.module';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
// import { PreferencesComponent } from '../auth-navigation/preferences/preferences.component';
// import { UserComponent } from '../auth-navigation/user/user.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { CardComponent } from 'src/app/components/card/card.component';
// import { BuscadorComponent } from '../auth-navigation/buscador/buscador.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n', '.json');
}

@NgModule({
  declarations: [
    HomeComponent,
    ContactComponent,
    // PreferencesComponent,
    // UserComponent,
    RegisterComponent,
    LoginComponent,
    CardComponent
    // BuscadorComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    
    TranslateModule.forChild({
      defaultLanguage: 'es-ES',
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      }
    })

  ]
})
export class PagesModule { }

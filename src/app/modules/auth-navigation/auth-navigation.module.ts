import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateModule, TranslateLoader } from "@ngx-translate/core";
import { HttpClient } from '@angular/common/http';

import { AuthNavigationRoutingModule } from './auth-navigation-routing.module';
import { BuscadorComponent } from './buscador/buscador.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { UserComponent } from './user/user.component';
import { RegisterAdComponent } from './register-ad/register-ad.component';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n', '.json');
}


@NgModule({
  declarations: [
    BuscadorComponent,
    PreferencesComponent,
    UserComponent,
    RegisterAdComponent
  ],
  imports: [
    CommonModule,
    AuthNavigationRoutingModule,
    FormsModule,
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
export class AuthNavigationModule { }

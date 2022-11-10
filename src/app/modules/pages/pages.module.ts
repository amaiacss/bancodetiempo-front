import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PagesRoutingModule } from './pages-routing.module';
import { HomeComponent } from './home/home.component';
import { ContactComponent } from './contact/contact.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { UserComponent } from './user/user.component';
import { RegisterComponent } from './register/register.component';
import { LoginComponent } from './login/login.component';
import { BuscadorComponent } from './buscador/buscador.component';


@NgModule({
  declarations: [
    HomeComponent,
    ContactComponent,
    PreferencesComponent,
    UserComponent,
    RegisterComponent,
    LoginComponent,
    BuscadorComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule
  ]
})
export class PagesModule { }

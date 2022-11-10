import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { RegisterComponent } from './register/register.component';
import { UserComponent } from './user/user.component';
import { BuscadorComponent } from './buscador/buscador.component';

const routes: Routes = [
  {path:'', component: HomeComponent},
  {path:'#', component: HomeComponent},
  {path:'#services', component: HomeComponent},
  {path:'#portfolio', component: HomeComponent},
  {path:'#team', component: HomeComponent},

  {path:'contacto', component: ContactComponent},
  {path: 'editar', component: PreferencesComponent},
  {path: 'usuario', component: UserComponent},
  {path: 'registro', component: RegisterComponent},
  {path: 'login', component: LoginComponent},
  {path: 'buscador', component:BuscadorComponent},
  {path:'*', redirectTo:'', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }

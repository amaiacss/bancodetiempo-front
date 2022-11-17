import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../services/auth.guard';

import { ContactComponent } from './contact/contact.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
// import { PreferencesComponent } from '../auth-navigation/preferences/preferences.component';
import { RegisterComponent } from './register/register.component';
// import { UserComponent } from '../auth-navigation/user/user.component';
// import { BuscadorComponent } from '../auth-navigation/buscador/buscador.component';

const routes: Routes = [
  {path:'', component: HomeComponent},
  {path:'#', component: HomeComponent},
  {path:'#services', component: HomeComponent},
  {path:'#portfolio', component: HomeComponent},
  {path:'#participate', component: HomeComponent},

  {path:'contacto', component: ContactComponent},
  {path: 'registro', component: RegisterComponent},
  {path: 'login', component: LoginComponent},

  // {path: 'buscador', component:BuscadorComponent},
  // {path: 'editar', component: PreferencesComponent},
  // {path: 'usuario', component: UserComponent},

  {path: 'user', loadChildren: () => import('../auth-navigation/auth-navigation.module').then(module => module.AuthNavigationModule),canActivate:[AuthGuard]},


  {path:'*', redirectTo:'', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }

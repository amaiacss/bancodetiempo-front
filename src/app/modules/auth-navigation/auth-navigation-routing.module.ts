import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../pages/home/home.component';
import { BuscadorComponent } from './buscador/buscador.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
    {path: ':id',component:HomeComponent},
    {path: ':id/search', component:BuscadorComponent},
    {path: ':id/preferences', component: PreferencesComponent},
    {path: ':id/profile/:profielid', component: UserComponent}
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AuthNavigationRoutingModule { }

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../pages/home/home.component';
import { BuscadorComponent } from './buscador/buscador.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
    {path: '',component:HomeComponent},
    {path: 'search', component:BuscadorComponent},
    {path: 'preferences', component: PreferencesComponent},
    {path: 'profile/:profile', component: UserComponent}
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AuthNavigationRoutingModule { }

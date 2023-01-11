import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../pages/home/home.component';
import { BuscadorComponent } from './buscador/buscador.component';
import { NewActivityComponent } from './new-activity/new-activity.component';
import { PreferencesComponent } from './preferences/preferences.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
    {path: '',component:HomeComponent},
    {path: 'search', component:BuscadorComponent},
    {path: 'edit-profile', component: PreferencesComponent},
    {path: 'profile/:profile', component: UserComponent},
    {path: 'new-activity', component:NewActivityComponent}
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})

export class AuthNavigationRoutingModule { }

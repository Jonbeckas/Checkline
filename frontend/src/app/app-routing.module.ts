import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from './modules/login/login/login.component';
import {WelcomeComponent} from './components/welcome/welcome.component';
import {AuthGuard} from './modules/auth/auth.guard';


const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'welcome', component: WelcomeComponent, canActivate: [AuthGuard]},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

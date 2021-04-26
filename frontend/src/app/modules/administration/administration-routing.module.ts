import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AdministrationComponent} from './administration/administration.component';
import {AuthGuard} from '../auth/auth.guard';

const routes: Routes = [{path: 'admin', component: AdministrationComponent, canActivate: [AuthGuard]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdministrationRoutingModule { }

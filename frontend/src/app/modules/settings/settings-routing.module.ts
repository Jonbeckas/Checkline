import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SettingsComponent} from './settings/settings.component';
import {AuthGuard} from '../auth/auth.guard';

const routes: Routes = [{path: 'settings', component: SettingsComponent, canActivate: [AuthGuard]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }

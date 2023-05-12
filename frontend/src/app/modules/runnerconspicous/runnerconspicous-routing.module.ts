import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ConspicousComponent } from './conspicous/conspicous.component';

const routes: Routes = [{path:'', component: ConspicousComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RunnerconspicousRoutingModule { }

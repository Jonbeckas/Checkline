import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {AuthGuard} from "./auth/auth.guard";


const appRoutes: Routes = [

  { path: '',   redirectTo: '/search', pathMatch: 'full' },//pls remove
  { path:'**',component: PageNotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes,
    {enableTracing:true}//<-- Debugging
  )],
  exports: [RouterModule]
})
export class AppRoutingModule { }

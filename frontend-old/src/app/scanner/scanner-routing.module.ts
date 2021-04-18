import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ScannerComponent} from "./scanner/scanner.component";
import {AuthGuard} from "../auth/auth.guard";


const routes: Routes = [{path:'scanner',component:ScannerComponent,canActivate:[AuthGuard]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScannerRoutingModule { }

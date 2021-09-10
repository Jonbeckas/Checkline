import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthGuard} from '../auth/auth.guard';
import {ScannerComponent} from './scanner/scanner.component';

const routes: Routes = [  {path: '', component: ScannerComponent}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScannerRoutingModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScannerRoutingModule } from './scanner-routing.module';
import { ScannerComponent } from './scanner/scanner.component';
import {AuthModule} from "../auth/auth.module";


@NgModule({
  declarations: [
    ScannerComponent
  ],
  imports: [
    CommonModule,
    AuthModule,
    ScannerRoutingModule
  ]
})
export class ScannerModule { }

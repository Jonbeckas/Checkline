import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScannerRoutingModule } from './scanner-routing.module';
import { ScannerComponent } from './scanner/scanner.component';
import {AuthModule} from "../auth/auth.module";
import {ZXingScannerModule} from "@zxing/ngx-scanner";
import {FormsModule} from "@angular/forms";
import {ClrCheckboxModule, ClrDatagridModule, ClrIconModule, ClrSelectModule, ClrSpinnerModule} from "@clr/angular";



@NgModule({
  declarations: [
    ScannerComponent
  ],
  imports: [
    CommonModule,
    AuthModule,
    ScannerRoutingModule,
    ZXingScannerModule,
    FormsModule,
    ClrSelectModule,
    ClrIconModule,
    ClrCheckboxModule,
    ClrDatagridModule,
    ClrSpinnerModule,
  ]
})
export class ScannerModule { }

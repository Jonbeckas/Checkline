import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScannerRoutingModule } from './scanner-routing.module';
import { ScannerComponent } from './scanner/scanner.component';
import {ZXingScannerModule} from "@zxing/ngx-scanner";


@NgModule({
  declarations: [ScannerComponent],
  imports: [
    CommonModule,
    ZXingScannerModule,
    ScannerRoutingModule
  ]
})
export class ScannerModule { }

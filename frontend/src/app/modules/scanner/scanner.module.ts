import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScannerRoutingModule } from './scanner-routing.module';
import { ScannerComponent } from './scanner/scanner.component';
import {AuthModule} from "../auth/auth.module";
import {NgxQRCodeModule} from "@techiediaries/ngx-qrcode";


@NgModule({
  declarations: [
    ScannerComponent
  ],
  imports: [
    CommonModule,
    AuthModule,
    ScannerRoutingModule,
    NgxQRCodeModule,
  ]
})
export class ScannerModule { }

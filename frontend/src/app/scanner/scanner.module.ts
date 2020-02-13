import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScannerRoutingModule } from './scanner-routing.module';
import { ScannerComponent } from './scanner/scanner.component';
import {ZXingScannerModule} from "@zxing/ngx-scanner";
import {MatListModule} from "@angular/material/list";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import { NetworkErrorComponent } from './network-error/network-error.component';
import {MatDialog, MatDialogModule} from "@angular/material/dialog";
import {ReactiveFormsModule} from "@angular/forms";
import { WarningComponent } from './warning/warning.component';
import { InfoComponent } from './info/info.component';
import {MatTableModule} from "@angular/material/table";
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';


@NgModule({
  declarations: [ScannerComponent, NetworkErrorComponent, WarningComponent, InfoComponent],
  imports: [
    CommonModule,
    ZXingScannerModule,
    ScannerRoutingModule,
    MatListModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule
  ],
  entryComponents: [NetworkErrorComponent, WarningComponent, InfoComponent],
  exports: [
  ]
})
export class ScannerModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PermissionIf} from './permission-if.directive';
import { IfNotPem } from './if-not-pem.directive';



@NgModule({
  declarations: [ PermissionIf, IfNotPem],
  imports: [
    CommonModule
  ],
  exports: [
    PermissionIf,
    IfNotPem
  ]
})
export class PermissionDirectiveModule { }

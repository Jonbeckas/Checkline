import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {PermissionIf} from "./permission-if.directive";



@NgModule({
  declarations: [ PermissionIf],
  imports: [
    CommonModule
  ],
  exports: [
    PermissionIf
  ]
})
export class PermissionDirectiveModule { }

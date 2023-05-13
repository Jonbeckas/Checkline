import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemComponent } from './components/system/system.component';
import { SystemRoutingModule } from './system-routing.module';
import { ClarityModule } from '@clr/angular';



@NgModule({
  declarations: [
    SystemComponent
  ],
  imports: [
    SystemRoutingModule,
    CommonModule,
    ClarityModule
  ]
})
export class SystemModule { }

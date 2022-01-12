import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SystemComponent } from './components/system/system.component';
import { SystemRoutingModule } from './system-routing.module';



@NgModule({
  declarations: [
    SystemComponent
  ],
  imports: [
    SystemRoutingModule,
    CommonModule,

  ]
})
export class SystemModule { }

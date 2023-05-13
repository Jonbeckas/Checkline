import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RunnerconspicousRoutingModule } from './runnerconspicous-routing.module';
import { ConspicousComponent } from './conspicous/conspicous.component';
import { ClarityModule } from '@clr/angular';


@NgModule({
  declarations: [
    ConspicousComponent
  ],
  imports: [
    CommonModule,
    ClarityModule,
    RunnerconspicousRoutingModule
  ]
})
export class RunnerconspicousModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RunnerOverviewRoutingModule } from './runneroverview-routing.module';
import {ClarityModule} from '@clr/angular';
import {ReactiveFormsModule} from '@angular/forms';
import { OverviewComponent } from './overview/overview.component';


@NgModule({
  declarations: [
    OverviewComponent
  ],
  imports: [
    CommonModule,
    ClarityModule,
    RunnerOverviewRoutingModule,
    ReactiveFormsModule,
  ]
})
export class RunnerOverviewModule { }

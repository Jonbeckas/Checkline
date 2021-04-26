import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RunnersRoutingModule } from './runners-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import {ClarityModule} from '@clr/angular';
import {PermissionDirectiveModule} from '../../directives/permission-directive/permission-directive.module';
import {FormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    DashboardComponent
  ],
    imports: [
        CommonModule,
        RunnersRoutingModule,
        ClarityModule,
        PermissionDirectiveModule,
        FormsModule
    ]
})
export class RunnersModule { }

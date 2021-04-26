import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings/settings.component';
import {ClarityModule} from '@clr/angular';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    SettingsComponent
  ],
  imports: [
    CommonModule,
    ClarityModule,
    SettingsRoutingModule,
    ReactiveFormsModule,
  ]
})
export class SettingsModule { }

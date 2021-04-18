import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { MainComponent } from './main/main.component';
import {MatTabsModule} from "@angular/material/tabs";
import {MatButtonModule} from "@angular/material/button";
import {MatInputModule} from "@angular/material/input";


@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    MatTabsModule,
    MatButtonModule,
    MatInputModule
  ]
})
export class SettingsModule { }

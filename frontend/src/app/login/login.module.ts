import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginRoutingModule } from './login-routing.module';
import {LoginComponent} from "./login/login.component";
import {ClarityModule} from "@clr/angular";
import {ReactiveFormsModule} from "@angular/forms";


@NgModule({
  declarations: [
    LoginComponent
  ],
  imports: [
    CommonModule,
    LoginRoutingModule,
    ClarityModule,
    ReactiveFormsModule
  ],
  exports: [ClarityModule]
})
export class LoginModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {CookieService} from "ngx-cookie-service";
import {LoginModule} from "./login/login.module";
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HttpClientModule} from "@angular/common/http";
import {ScannerRoutingModule} from "./scanner/scanner-routing.module";
import { NavComponent } from './nav/nav.component';
import {SettingsRoutingModule} from "./settings/settings-routing.module";
import {SettingsModule} from "./settings/settings.module";
import {AdministrationRoutingModule} from "./administration/administration-routing.module";
import {AdministrationModule} from "./administration/administration.module";

@NgModule({
  declarations: [
    AppComponent,
    NavComponent
  ],
  imports: [
    BrowserModule,
    SettingsRoutingModule,
    SettingsModule,
    ScannerRoutingModule,
    AdministrationRoutingModule,
    AdministrationModule,
    AppRoutingModule,
    LoginModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule { }

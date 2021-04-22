import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {CookieService} from "ngx-cookie-service";
import {LoginModule} from "./modules/login/login.module";
import { ClarityModule } from '@clr/angular';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HttpClientModule} from "@angular/common/http";
import {ScannerRoutingModule} from "./modules/scanner/scanner-routing.module";
import { NavComponent } from './components/nav/nav.component';
import {SettingsRoutingModule} from "./modules/settings/settings-routing.module";
import {SettingsModule} from "./modules/settings/settings.module";
import {AdministrationRoutingModule} from "./modules/administration/administration-routing.module";
import {AdministrationModule} from "./modules/administration/administration.module";
import { WelcomeComponent } from './components/welcome/welcome.component';
import { PermissionIf } from './directives/permission-if.directive';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    WelcomeComponent,
    PermissionIf
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

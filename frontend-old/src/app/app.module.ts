import { BrowserModule } from '@angular/platform-browser';
import {ErrorHandler, Injectable, NgModule} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {ReactiveFormsModule} from "@angular/forms";
import {CookieService} from "ngx-cookie-service";
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { LoginModule } from './login/login.module';
import { SearchModule } from './search/search.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import {ScannerModule} from "./scanner/scanner.module";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatListModule} from "@angular/material/list";
import {MatButton, MatButtonModule} from "@angular/material/button";
import {SettingsModule} from "./settings/settings.module";
import { NavComponent } from './nav/nav.component';
import { LayoutModule } from '@angular/cdk/layout';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import {CommonModule} from "@angular/common";




@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    NavComponent,
    ],
  imports: [
    BrowserModule,
    CommonModule,
    ReactiveFormsModule,
    LoginModule,
    ScannerModule,
    SearchModule,
    SettingsModule,
    ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.production}),
    BrowserAnimationsModule,
    MatListModule,
    MatButtonModule,
    AppRoutingModule,
    LayoutModule,
    MatToolbarModule,
    MatSidenavModule,
    MatIconModule,

  ],
  bootstrap: [AppComponent],
  providers:[ CookieService]
})
export class AppModule { }


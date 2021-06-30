import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {CookieService} from 'ngx-cookie-service';
import {LoginModule} from './modules/login/login.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {ScannerRoutingModule} from './modules/scanner/scanner-routing.module';
import { NavComponent } from './components/nav/nav.component';
import {SettingsRoutingModule} from './modules/settings/settings-routing.module';
import {SettingsModule} from './modules/settings/settings.module';
import {AdministrationRoutingModule} from './modules/administration/administration-routing.module';
import {AdministrationModule} from './modules/administration/administration.module';
import { WelcomeComponent } from './components/welcome/welcome.component';
import {PermissionDirectiveModule} from './directives/permission-directive/permission-directive.module';
import {RunnersModule} from './modules/runners/runners.module';
import {RunnersRoutingModule} from './modules/runners/runners-routing.module';
import {ZXingScannerModule} from "@zxing/ngx-scanner"
import {FormsModule} from "@angular/forms";
import {ScannerModule} from "./modules/scanner/scanner.module";
import { ClarityModule } from '@clr/angular';

@NgModule({
    declarations: [
        AppComponent,
        NavComponent,
        WelcomeComponent,
    ],
    imports: [
        BrowserModule,
        SettingsRoutingModule,
        SettingsModule,
        ScannerRoutingModule,
        RunnersModule,
        RunnersRoutingModule,
        AdministrationRoutingModule,
        AdministrationModule,
        ScannerModule,
        AppRoutingModule,
        LoginModule,
        BrowserAnimationsModule,
        HttpClientModule,
        PermissionDirectiveModule,
        ClarityModule
    ],
    providers: [CookieService],
    exports: [

    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

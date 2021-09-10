import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import {CookieService} from 'ngx-cookie-service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import { NavComponent } from './components/nav/nav.component';
import { WelcomeComponent } from './components/welcome/welcome.component';
import {PermissionDirectiveModule} from './directives/permission-directive/permission-directive.module';
import { ClarityModule } from '@clr/angular';

@NgModule({
    declarations: [
        AppComponent,
        NavComponent,
        WelcomeComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
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

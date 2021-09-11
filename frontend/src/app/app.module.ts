import {APP_INITIALIZER, NgModule} from '@angular/core';
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
import {ConfigService} from "./config/config.service";
import {ReactiveFormsModule} from "@angular/forms";

export function initializeApp(appConfig: ConfigService) {
  return () => appConfig.load();
}

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
    providers: [CookieService,
      ConfigService,
      { provide: APP_INITIALIZER,
        useFactory: initializeApp,
        deps: [ConfigService], multi: true }],
    exports: [
      ReactiveFormsModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

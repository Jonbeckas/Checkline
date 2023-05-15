import {APP_INITIALIZER, LOCALE_ID, NgModule, isDevMode} from '@angular/core';
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
import { registerLocaleData } from '@angular/common';
import localeDe from '@angular/common/locales/de';
import localeDeExtra from '@angular/common/locales/extra/de';
import { ServiceWorkerModule } from '@angular/service-worker';

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
        ClarityModule,
        ServiceWorkerModule.register('ngsw-worker.js', {
          enabled: !isDevMode(),
          // Register the ServiceWorker as soon as the application is stable
          // or after 30 seconds (whichever comes first).
          registrationStrategy: 'registerWhenStable:30000'
        })
    ],
    providers: [CookieService,
      ConfigService,
      { provide: APP_INITIALIZER,
        useFactory: initializeApp,
        deps: [ConfigService], multi: true },
      {provide: LOCALE_ID, useValue: 'de-DE' }],
      
    exports: [
      ReactiveFormsModule
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
  constructor() {
    registerLocaleData(localeDe, 'de-DE', localeDeExtra);
  }
 }

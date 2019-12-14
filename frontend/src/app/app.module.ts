import { BrowserModule } from '@angular/platform-browser';
import {ErrorHandler, Injectable, NgModule} from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {ReactiveFormsModule} from "@angular/forms";
import * as Sentry from "@sentry/browser";
import {NavsModule} from "../navs/navs.module";
import { TestComponent } from './test/test.component';
import { LoginComponent } from './login/login.component';
Sentry.init({
  //dsn: "https://0a6dac5f58b84b6ea4902f8d7b4f26bb@sentry.io/1839947"
});

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  constructor() {}
  handleError(error) {
    const eventId = Sentry.captureException(error.originalError || error);
    Sentry.showReportDialog({ eventId });
  }
}

@NgModule({
  declarations: [
    AppComponent,
    TestComponent,
    LoginComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NavsModule
  ],
  bootstrap: [AppComponent],
  providers:[{ provide: ErrorHandler, useClass: SentryErrorHandler }]
})
export class AppModule { }

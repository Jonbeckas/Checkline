import {Component, Inject, NgModule, ViewContainerRef} from '@angular/core';
import {BrowserModule} from "@angular/platform-browser";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'Checkline';

  constructor() {

  }
  ngAfterViewInit() {

  }
}

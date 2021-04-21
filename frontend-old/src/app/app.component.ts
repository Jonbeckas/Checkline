import {Component, Inject, NgModule, ViewContainerRef} from '@angular/core';
import {BrowserModule} from "@angular/platform-browser";
import {Router} from "@angular/router";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'Checkline';
  show: boolean = true;

  constructor() {

  }
  ngOnInit() {
  }

  ngAfterViewInit() {

  }
}

import {Component, Inject, NgModule, ViewContainerRef} from '@angular/core';
import {BrowserModule} from "@angular/platform-browser";
import {NavmanagerService} from "../navs/navmanager.service";
import {NavbarComponent} from "../navs/navbar/navbar.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})

export class AppComponent {
  title = 'ispolaso';
  private viewRef: ViewContainerRef;
  private service: NavmanagerService;
  constructor(@Inject(NavmanagerService)  service ,@Inject(ViewContainerRef) viewRef) {
    this.service = service;
    this.viewRef = viewRef;
  }
  ngAfterViewInit() {
    this.service.setRootViewContainerRef(this.viewRef);
    this.service.addDynamicComponent(NavbarComponent);
  }
}

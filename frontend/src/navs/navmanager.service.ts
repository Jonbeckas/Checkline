import {
  ApplicationRef,
  Component,
  ComponentFactoryResolver,
  ComponentRef, EmbeddedViewRef, inject,
  Inject,
  Injectable,
  Injector, Type, ViewContainerRef, ViewRef
} from '@angular/core';
import {NavsModule} from "./navs.module";
import {NavbarComponent} from "./navbar/navbar.component";
import {AppComponent} from "../app/app.component";

@Injectable({
  providedIn: 'root'
})
export class NavmanagerService {
  private factoryResolver: ComponentFactoryResolver;
  private rootViewContainer: ViewContainerRef;
  private appRef: ApplicationRef;
  constructor(@Inject(ComponentFactoryResolver) factoryResolver,@Inject(ApplicationRef) appref) {
    this.factoryResolver = factoryResolver;
    this.appRef = appref;
  }
  setRootViewContainerRef(viewContainerRef) {
    this.rootViewContainer = viewContainerRef
  }
  addDynamicComponent(component) {
    const factory = this.factoryResolver.resolveComponentFactory(component);
    let  comp = factory.create(this.rootViewContainer.injector,null,"#nav");
    console.log(this.rootViewContainer);
    this.appRef.attachView(comp.hostView);
    //let vieww:ViewRef = this.rootViewContainer.attac(comp.hostView);
    //this.rootViewContainer.move(vieww,0);
  }
}

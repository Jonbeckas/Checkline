import {
  Directive,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import {AuthService} from "../modules/auth/auth.service";

@Directive({
  selector: '[permissionIf]'
})
export class PermissionIf {

  @Input()
  set permissionIf(permissions:string[]) {
    this.viewContainer.clear();
    if (this.authService.hasPermissionsOrAdmin(permissions)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }

  @HostBinding('class')
  classes: string = "";

  height:number|null = null;

  constructor(   private viewContainer: ViewContainerRef,
                 private templateRef: TemplateRef<any>,private authService:AuthService) { }

}

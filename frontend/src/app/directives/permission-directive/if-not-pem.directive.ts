import {
  Directive,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  OnInit, SimpleChanges,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import {Subscription} from "rxjs";
import {AuthService} from "../../modules/auth/auth.service";

@Directive({
  selector: '[permissionNotIf]'
})
export class IfNotPem implements OnInit,OnChanges,OnDestroy{
  @Input()
  permissionNotIf: string[] = [];

  @HostBinding('class')
  classes = '';

  height: number|null = null;
  private subscription: Subscription;

  constructor(   private viewContainer: ViewContainerRef,
                 private templateRef: TemplateRef<any>, private authService: AuthService) {
    this.subscription = this.authService.getPermissionObserver().subscribe(pems => {
      let bool = false;
      for (const pem of this.permissionNotIf) {
        if (!pems.includes(pem) || pems.includes('CENGINE_ADMIN')) {
          bool =  true;
        }
      }

      this.viewContainer.clear();
      if (bool) {
        this.viewContainer.createEmbeddedView(this.templateRef);
      }

    });
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {
    this.viewContainer.clear();
    if (!this.authService.hasPermissionsOrAdmin(this.permissionNotIf)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}


import {
  Directive,
  ElementRef,
  HostBinding,
  Input,
  OnChanges, OnDestroy, OnInit,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef
} from '@angular/core';
import {AuthService} from '../../modules/auth/auth.service';
import {Subscription} from 'rxjs';
import {conditionallyCreateMapObjectLiteral} from '@angular/compiler/src/render3/view/util';

@Directive({
  selector: '[permissionIf]'
})
export class PermissionIf implements OnChanges, OnDestroy, OnInit{

  @Input()
  permissionIf: string[] = [];

  @HostBinding('class')
  classes = '';

  height: number|null = null;
  private subscription: Subscription;

  constructor(   private viewContainer: ViewContainerRef,
                 private templateRef: TemplateRef<any>, private authService: AuthService) {
    this.subscription = this.authService.getPermissionObserver().subscribe(pems => {
      let bool = false;
      for (const pem of this.permissionIf) {
        if (pems.includes(pem) || pems.includes('CENGINE_ADMIN')) {
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
    if (this.authService.hasPermissionsOrAdmin(this.permissionIf)) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    }
  }
}

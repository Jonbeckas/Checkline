import {ComponentFactory, ComponentFactoryResolver, ComponentRef, Injectable, ViewContainerRef} from '@angular/core';
import {UserEditModalComponent} from '../user-edit-modal/user-edit-modal.component';
import {NewUserModalComponent} from '../new-user-modal/new-user-modal.component';
import {group} from '@angular/animations';
import {NewGroupModalComponent} from '../new-group-modal/new-group-modal.component';
import {EditGroupModalComponent} from '../edit-group-modal/edit-group-modal.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private componentFactory: ComponentFactoryResolver) { }

  showUserEditModal(username: string, groups: string[], viewContainerRef: ViewContainerRef) {
    const factory = this.componentFactory.resolveComponentFactory(UserEditModalComponent);
    const component: ComponentRef<UserEditModalComponent> = viewContainerRef.createComponent(factory);
    (component.instance as any).username = username;
    (component.instance as any).groups = groups;
  }

  showGroupEditModal(groupname: string, permissions: string[], viewContainerRef: ViewContainerRef) {
    const factory = this.componentFactory.resolveComponentFactory(EditGroupModalComponent);
    const component: ComponentRef<EditGroupModalComponent> = viewContainerRef.createComponent(factory);
    (component.instance as any).permissions = permissions;
    (component.instance as any).group = groupname;
  }

  showNewUserModal(viewContainerRef: ViewContainerRef) {
    const factory = this.componentFactory.resolveComponentFactory(NewUserModalComponent);
    const component: ComponentRef<NewUserModalComponent> = viewContainerRef.createComponent(factory);
  }

  showNewGroupModal(viewContainerRef: ViewContainerRef) {
    const factory = this.componentFactory.resolveComponentFactory(NewGroupModalComponent);
    const component: ComponentRef<NewGroupModalComponent> = viewContainerRef.createComponent(factory);
  }
}

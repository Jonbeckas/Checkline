import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrationRoutingModule } from './administration-routing.module';
import { AdministrationComponent } from './administration/administration.component';
import {ClarityModule} from '@clr/angular';
import { UserEditModalComponent } from './user-edit-modal/user-edit-modal.component';
import {ReactiveFormsModule} from '@angular/forms';
import { NewUserModalComponent } from './new-user-modal/new-user-modal.component';
import { NewGroupModalComponent } from './new-group-modal/new-group-modal.component';
import { EditGroupModalComponent } from './edit-group-modal/edit-group-modal.component';
import {AppModule} from '../../app.module';
import {PermissionDirectiveModule} from '../../directives/permission-directive/permission-directive.module';


@NgModule({
  declarations: [
    AdministrationComponent,
    UserEditModalComponent,
    NewUserModalComponent,
    NewGroupModalComponent,
    EditGroupModalComponent,
  ],
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    ClarityModule,
    ReactiveFormsModule,
    PermissionDirectiveModule,
  ]
})
export class AdministrationModule { }

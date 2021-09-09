import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdministrationRoutingModule } from './administration-routing.module';
import { AdministrationComponent } from './administration/administration.component';
import {ClarityModule} from '@clr/angular';
import { UserEditModalComponent } from './user-edit-modal/user-edit-modal.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NewUserModalComponent } from './new-user-modal/new-user-modal.component';
import { NewGroupModalComponent } from './new-group-modal/new-group-modal.component';
import { EditGroupModalComponent } from './edit-group-modal/edit-group-modal.component';
import {PermissionDirectiveModule} from '../../directives/permission-directive/permission-directive.module';
import { ImportUserModalComponent } from './import-user-modal/import-user-modal.component';
import {CdsFileModule} from "@cds/angular";
import { ExportUserModalComponent } from './export-user-modal/export-user-modal.component';


@NgModule({
  declarations: [
    AdministrationComponent,
    UserEditModalComponent,
    NewUserModalComponent,
    NewGroupModalComponent,
    EditGroupModalComponent,
    ImportUserModalComponent,
    ExportUserModalComponent,
  ],
  imports: [
    CommonModule,
    AdministrationRoutingModule,
    ClarityModule,
    CdsFileModule,
    ReactiveFormsModule,
    PermissionDirectiveModule,
    FormsModule,
  ]
})
export class AdministrationModule { }

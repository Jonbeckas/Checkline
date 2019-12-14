import { NgModule } from '@angular/core';
import { NavbarComponent } from './navbar/navbar.component';
import { AdminbarComponent } from './adminbar/adminbar.component';
import { AddstudentComponent } from './addstudent/addstudent.component';
import { ImportstudentsComponent } from './importstudents/importstudents.component';
import {CommonModule} from "@angular/common";
import {NavmanagerService} from "./navmanager.service";



@NgModule({
  declarations: [NavbarComponent, AdminbarComponent, ImportstudentsComponent, AddstudentComponent],
  imports: [
    CommonModule
  ],
  providers:[NavmanagerService],
  entryComponents:[NavbarComponent, AdminbarComponent, ImportstudentsComponent, AddstudentComponent]
})
export class NavsModule { }

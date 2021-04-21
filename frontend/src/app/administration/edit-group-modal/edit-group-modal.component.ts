import {Component, OnInit, ViewChild} from '@angular/core';
import {ClrDatagrid} from "@clr/angular";
import {FormBuilder, Validators} from "@angular/forms";
import {UserService} from "../services/user.service";
import {WebResult} from "../../auth/auth.service";
import {GroupService} from "../services/group.service";

@Component({
  selector: 'app-edit-group-modal',
  templateUrl: './edit-group-modal.component.html',
  styleUrls: ['./edit-group-modal.component.scss']
})
export class EditGroupModalComponent implements OnInit {

  group:string = "";
  open = true;
  groupnameForm: any;
  groupnameSpinner = false;
  ok = false;
  error: string | undefined;
  permissions: string[] = [];
  groupError: string|undefined = undefined;
  // @ts-ignore
  @ViewChild(ClrDatagrid) datagrid:ClrDatagrid;
  permissionForm: any;
  spinnerPem = false;

  constructor(private formBuilder:FormBuilder, private groupService:GroupService) { }

  ngOnInit(): void {
    this.groupnameForm = this.formBuilder.group({
      name: ['', Validators.required]
    });

    this.permissionForm = this.formBuilder.group({
      permission: ['', Validators.required]
    });
  }

  onOk() {
    this.open = false;
  }

  onCancel() {
    this.open = false;
  }

  changeGroupName() {
    if (this.groupnameForm.valid) {
      this.groupnameSpinner = true;
      this.groupService.changeGroupName(this.group,this.groupnameForm.value.name).subscribe((result:WebResult)=>{
        this.groupnameSpinner =false;
        if (result.success) {
          this.group = this.groupnameForm.value.name;
          this.ok = true;
        } else {
          this.error = result.error;
        }
      })
    }
  }

  removePermission(permission: string) {
    this.groupService.removePermissionFromGroup(permission,this.group).subscribe(res =>{
      this.groupService.getGroup(this.group).subscribe(sub => {
        this.permissions = sub.permissions;
        this.datagrid.dataChanged();
      })
    })
  }

  addPermission() {
    if (this.permissionForm.valid) {
      this.spinnerPem = true;
      this.groupService.addPermissionToGroup(this.permissionForm.value.permission,this.group).subscribe((result:WebResult)=>{
        if (result.success) {
          this.groupError = undefined;
          this.groupService.getGroup(this.group).subscribe(sub => {
            this.permissions = sub.permissions;
            this.datagrid.dataChanged();
            this.spinnerPem = false;
          })
        } else {
          this.spinnerPem = false;
          this.groupError = result.error;
        }

      })
    }
  }

}

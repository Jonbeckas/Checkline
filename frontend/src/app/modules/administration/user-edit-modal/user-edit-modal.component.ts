import {Component, OnInit, ViewChild} from '@angular/core';
import {UntypedFormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserService} from '../services/user.service';
import {WebResult} from '../../auth/auth.service';
import {ClrDatagrid} from '@clr/angular';

@Component({
  selector: 'app-user-edit-modal',
  templateUrl: './user-edit-modal.component.html',
  styleUrls: ['./user-edit-modal.component.scss']
})
export class UserEditModalComponent implements OnInit {

  username = '';
  open = true;
  passwordForm: any;
  passwordSpinner = false;
  ok = false;
  error: string | undefined;
  groups: string[] = [];
  groupError: string|undefined = undefined;
  // @ts-ignore
  @ViewChild(ClrDatagrid) datagrid: ClrDatagrid;
  permissionForm: any;
  spinnerPem = false;

  constructor(private formBuilder: UntypedFormBuilder, private userService: UserService) { }

  ngOnInit(): void {
    console.log(this.username);
    this.passwordForm = this.formBuilder.group({
      password: ['', Validators.required]
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

  changePassword() {
    if (this.passwordForm.valid) {
      this.passwordSpinner = true;
      this.userService.changeUserPassword(this.username, this.passwordForm.value.password).subscribe((result: WebResult) => {
        this.passwordSpinner = false;
        if (result.success) {
          this.ok = true;
        } else {
          this.error = result.error;
        }
      });
    }
  }

  removeGroup(group: string) {
    this.userService.removeUserFromGroup(this.username, group).subscribe(res => {
      this.userService.getUser(this.username).subscribe(sub => {
        this.groups = sub.groups;
        this.datagrid.dataChanged();
      });
    });
  }

  addGroup() {
    if (this.permissionForm.valid) {
      this.spinnerPem = true;
      this.userService.addUserToGroup(this.username, this.permissionForm.value.permission).subscribe((result: WebResult) => {
        if (result.success) {
          this.groupError = undefined;
          this.userService.getUser(this.username).subscribe(sub => {
            this.groups = sub.groups;
            this.datagrid.dataChanged();
            this.spinnerPem = false;
          });
        } else {
          this.spinnerPem = false;
          this.groupError = result.error;
        }

      });
    }
  }
}

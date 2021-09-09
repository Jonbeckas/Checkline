import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {UserService} from '../services/user.service';
import {UserDto} from '../dtos/user.dto';
import {ClarityIcons, exportIcon, importIcon, pencilIcon, plusIcon, refreshIcon, trashIcon} from '@cds/core/icon';
import {BehaviorSubject, Observable} from 'rxjs';
import {ClrDatagrid} from '@clr/angular';
import {ModalService} from '../services/modal.service';
import {GroupDto} from '../dtos/group.dto';
import {GroupService} from '../services/group.service';
import {AuthService} from '../../auth/auth.service';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss']
})
export class AdministrationComponent implements OnInit, OnDestroy{
  users$: UserDto[] = [];
  groups$: GroupDto[] = [];
  openUserDelete = false;
  element = '';
  interval: number | undefined;
  TIMEOUT = 5000;
  selectedUser:any =null;
  selectedGroup: any = null;

  // @ts-ignore
  @ViewChild(ClrDatagrid) datagrid: ClrDatagrid;
  openGroupDelete = false;

  constructor(private userService: UserService, private groupService: GroupService, private authService: AuthService, private modalService: ModalService, private viewContainerRef: ViewContainerRef) {
      if (this.authService.hasPermissionOrAdmin('CENGINE_LISTUSERS')) {
        this.userService.getUsers().subscribe(sub => {
          this.users$ = sub;
        });
      }
      if (this.authService.hasPermissionOrAdmin('CENGINE_LISTGROUPS')) {
        this.groupService.getGroups().subscribe(sub => {
          this.groups$ = sub;
      });

    }
  }


  ngOnInit(): void {
    ClarityIcons.addIcons(pencilIcon);
    ClarityIcons.addIcons(trashIcon);
    ClarityIcons.addIcons(plusIcon);
    ClarityIcons.addIcons(importIcon);
    ClarityIcons.addIcons(exportIcon);
    ClarityIcons.addIcons(refreshIcon);
  }

  onUserCancel() {
  this.openUserDelete = false;
  }

  onUserDelete() {
    this.userService.deleteUser(this.selectedUser.loginName).subscribe(res => {
      this.userService.getUsers().subscribe(sub => {
        this.users$ = sub;
        this.datagrid.dataChanged();
      });
    });
    this.openUserDelete = false;
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  onUserEdit() {
    this.modalService.showUserEditModal(this.selectedUser.loginName, this.selectedUser.groups, this.viewContainerRef);
  }

  onNewUserClick() {
    this.modalService.showNewUserModal(this.viewContainerRef);
  }

  onUserRefresh() {
    if (this.authService.hasPermissionOrAdmin('CENGINE_LISTUSERS')) {
      this.userService.getUsers().subscribe(sub => {
        console.log('Refreshed user Dataset!');
        this.users$ = sub;
        this.datagrid.dataChanged();
      });
    }
  }

  onGroupDelete() {
    this.groupService.deleteGroup(this.element).subscribe(res => {
      this.groupService.getGroups().subscribe(sub => {
        this.groups$ = sub;
        this.datagrid.dataChanged();
      });
    });
    this.openGroupDelete = false;
  }

  onGroupRefresh() {
    if (this.authService.hasPermissionOrAdmin('CENGINE_LISTGROUPS')) {
      this.groupService.getGroups().subscribe(sub => {
        console.log('Refreshed group Dataset!');
        this.groups$ = sub;
        this.datagrid.dataChanged();
      });
    }
  }

  onGroupCancel() {
    this.openGroupDelete = false;
  }

  onNewGroup() {
    this.modalService.showNewGroupModal(this.viewContainerRef);
  }

  onGroupEdit() {
    this.modalService.showGroupEditModal(this.selectedGroup.name, this.selectedGroup.permissions, this.viewContainerRef);
  }

  onUserImport() {
    this.modalService.showImportUserModal(this.viewContainerRef)
  }

  onUserExport() {
    this.modalService.showExportUserModal(this.viewContainerRef)
  }
}

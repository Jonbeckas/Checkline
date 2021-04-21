import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {UserService} from "../services/user.service";
import {UserDto} from "../dtos/user.dto";
import {ClarityIcons, pencilIcon, plusIcon, trashIcon} from "@cds/core/icon";
import {BehaviorSubject, Observable} from "rxjs";
import {ClrDatagrid} from "@clr/angular";
import {ModalService} from "../services/modal.service";
import {GroupDto} from "../dtos/group.dto";
import {GroupService} from "../services/group.service";

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.scss']
})
export class AdministrationComponent implements OnInit, OnDestroy{
  users$:UserDto[]=[];
  groups$:GroupDto[]=[];
  openUserDelete: boolean = false;
  element: string = "";
  interval: number | undefined;
  TIMEOUT = 5000;


  // @ts-ignore
  @ViewChild(ClrDatagrid) datagrid:ClrDatagrid;
  openGroupDelete: boolean =false;

  constructor(private userService:UserService,private groupService:GroupService, private modalService:ModalService, private viewContainerRef:ViewContainerRef) {
    this.userService.getUsers().subscribe(sub => this.users$ = sub)
    this.groupService.getGroups().subscribe(sub => this.groups$ = sub)
  }

  inDeleteUser(userId:string) {
    console.log(userId);
  }

  ngOnInit(): void {
    ClarityIcons.addIcons(pencilIcon)
    ClarityIcons.addIcons(trashIcon)
    ClarityIcons.addIcons(plusIcon)

    this.interval = setInterval(() => {
      this.userService.getUsers().subscribe(sub => {
        console.log("Refreshed user Dataset!");
        this.users$ = sub
        this.datagrid.dataChanged();
      });

      this.groupService.getGroups().subscribe(sub => {
        console.log("Refreshed group Dataset!");
        this.groups$ = sub
        this.datagrid.dataChanged();
      })
    },this.TIMEOUT)
  }


  onUserCancel() {
  this.openUserDelete = false;
  }

  onUserDelete() {
    this.userService.deleteUser(this.element).subscribe(res =>{
      this.userService.getUsers().subscribe(sub => {
        this.users$ = sub
        this.datagrid.dataChanged();
      })
    })
    this.openUserDelete = false;
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }

  onUserEdit(loginName: string) {
    this.modalService.showUserEditModal(loginName,this.users$.filter(user => user.loginName == loginName)[0].groups,this.viewContainerRef)
  }

  onNewUserClick() {
    this.modalService.showNewUserModal(this.viewContainerRef)
  }

  onGroupDelete() {
    this.groupService.deleteGroup(this.element).subscribe(res =>{
      this.groupService.getGroups().subscribe(sub => {
        this.groups$ = sub
        this.datagrid.dataChanged();
      })
    })
    this.openGroupDelete = false;
  }

  onGroupCancel() {
    this.openGroupDelete = false
  }

  onNewGroup() {
    this.modalService.showNewGroupModal(this.viewContainerRef);
  }

  onGroupEdit(name: GroupDto) {
    this.modalService.showGroupEditModal(name.name,name.permissions,this.viewContainerRef);
  }
}
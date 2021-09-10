import { Component, OnInit } from '@angular/core';
import {UserService} from "../services/user.service";
import {BehaviorSubject} from "rxjs";
import {SaveService} from "../../../service/save.service";

@Component({
  selector: 'app-export-user-modal',
  templateUrl: './export-user-modal.component.html',
  styleUrls: ['./export-user-modal.component.scss']
})
export class ExportUserModalComponent implements OnInit {

  open: boolean = true;
  spinner = false
  csvText: string | undefined

  constructor(private userService: UserService, private saveService: SaveService) {
  }

  ngOnInit(): void {

  }

  onOk() {
    this.open = false
  }

  export() {
    this.userService.exportUsers().subscribe((data) => {
      this.spinner = true
      const blob = new Blob([data], { type: 'text/csv' });
      this.saveService.save(blob,"export-users.csv")
      this.spinner = false
    })
  }
}

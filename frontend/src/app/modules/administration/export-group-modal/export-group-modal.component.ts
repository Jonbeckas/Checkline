import { Component, OnInit } from '@angular/core';
import {UserService} from "../services/user.service";
import {SaveService} from "../../../service/save.service";
import {GroupService} from "../services/group.service";

@Component({
  selector: 'app-export-group-modal',
  templateUrl: './export-group-modal.component.html',
  styleUrls: ['./export-group-modal.component.scss']
})
export class ExportGroupModalComponent implements OnInit {

  open: boolean = true;
  spinner = false
  csvText: string | undefined

  constructor(private groupService: GroupService, private saveService: SaveService) {
  }

  ngOnInit(): void {

  }

  onOk() {
    this.open = false
  }

  export() {
      this.groupService.exportGroups().subscribe((data) => {
      this.spinner = true
      const blob = new Blob([data], { type: 'text/csv' });
      this.saveService.save(blob,"export-groups.csv")
      this.spinner = false
    })
  }

}

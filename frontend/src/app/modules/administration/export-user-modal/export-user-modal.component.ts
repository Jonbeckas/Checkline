import { Component, OnInit } from '@angular/core';
import {UserService} from "../services/user.service";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-export-user-modal',
  templateUrl: './export-user-modal.component.html',
  styleUrls: ['./export-user-modal.component.scss']
})
export class ExportUserModalComponent implements OnInit {

  open: boolean = true;
  spinner = false
  csvText: string | undefined

  constructor(private userService: UserService) {
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
      const url= window.URL.createObjectURL(blob);

      let a:any = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = "UserExport.csv";
      a.click();
      window.URL.revokeObjectURL(url);

      this.spinner = false
    })
  }
}

import { Component, OnInit } from '@angular/core';
import {UserService} from "../services/user.service";
import {GroupService} from "../services/group.service";

@Component({
  selector: 'app-import-group-modal',
  templateUrl: './import-group-modal.component.html',
  styleUrls: ['./import-group-modal.component.scss']
})
export class ImportGroupModalComponent implements OnInit {
  open: boolean = true;
  spinner: boolean = false;
  csvText: string | undefined

  constructor(private groupService: GroupService) {
  }

  ngOnInit(): void {
  }

  onOk() {
    this.spinner = true
    this.groupService.importGroups(this.csvText!).subscribe((next) => {
      this.open = false;
    })
  }

  onFileUpload($event: Event) {
    const element = $event.currentTarget as HTMLInputElement;
    let fileList: FileList | null = element.files;
    console.log($event)
    if (fileList) {
      let fr = new FileReader();
      fr.onload = (load) => {
        this.csvText =  <string| undefined>load.target?.result
      }
      fr.readAsText(fileList[0])
    } else {
      this.csvText = undefined
    }
  }
}

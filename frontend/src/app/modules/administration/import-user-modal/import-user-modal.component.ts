import {Component, OnInit} from '@angular/core';
import {UserService} from "../services/user.service";

@Component({
  selector: 'app-import-user-modal',
  templateUrl: './import-user-modal.component.html',
  styleUrls: ['./import-user-modal.component.scss']
})
export class ImportUserModalComponent implements OnInit {
  open: boolean = true;
  spinner: boolean = false;
  csvText: string | undefined

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
  }

  onOk() {
    this.spinner = true
    this.userService.importUsers(this.csvText!).subscribe((next) => {
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

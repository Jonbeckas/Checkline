import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-info',
  templateUrl: './info.component.html',
  styleUrls: ['./info.component.scss']
})
export class InfoComponent implements OnInit {
  title: string;
  message: string;

  constructor(private dialogRef :MatDialogRef<InfoComponent>, @Inject(MAT_DIALOG_DATA) data) {
    this.title = data.title;
    this.message = data.message;
  }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }

}

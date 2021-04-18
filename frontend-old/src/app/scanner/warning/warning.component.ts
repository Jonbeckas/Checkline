import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-warning',
  templateUrl: './warning.component.html',
  styleUrls: ['./warning.component.scss']
})
export class WarningComponent implements OnInit {
  title: string;
  message: string;

  constructor(private dialogRef :MatDialogRef<WarningComponent>, @Inject(MAT_DIALOG_DATA) data) {
    this.title = data.title;
    this.message = data.message;
  }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close();
  }
}

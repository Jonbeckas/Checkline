import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-placeholder-dialog',
  templateUrl: './placeholder-dialog.component.html',
  styleUrls: ['./placeholder-dialog.component.scss']
})
export class PlaceholderDialogComponent implements OnInit {

  title: string;
  message: string;
  number: any;

  constructor(private dialogRef :MatDialogRef<PlaceholderDialogComponent>, @Inject(MAT_DIALOG_DATA) data) {
    this.message = "Der Läufer "+data.title+" hat keine Lauf nummer zugewiesen! Bitte geben sie eine ein.";
    this.title = "Information";
  }

  ngOnInit() {
  }

  close() {
    this.dialogRef.close(this.number);
  }

  abort() {
    this.dialogRef.close();
  }
}

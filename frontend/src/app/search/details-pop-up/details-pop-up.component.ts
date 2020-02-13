import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {InfoComponent} from "../../scanner/info/info.component";

@Component({
  selector: 'app-details-pop-up',
  templateUrl: './details-pop-up.component.html',
  styleUrls: ['./details-pop-up.component.scss']
})
export class DetailsPopUpComponent implements OnInit {
  message: any;
  title: any;

  constructor(private dialogRef :MatDialogRef<InfoComponent>, @Inject(MAT_DIALOG_DATA) data) { }

  ngOnInit(): void {
  }

  close() {

  }
}

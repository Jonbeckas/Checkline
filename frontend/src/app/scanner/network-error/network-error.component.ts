import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Form, FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-network-error',
  templateUrl: './network-error.component.html',
  styleUrls: ['./network-error.component.scss']
})
export class NetworkErrorComponent implements OnInit {


  constructor(private dialogRef: MatDialogRef<NetworkErrorComponent>) {
  }

  ngOnInit() {

  }

  close() {
    this.dialogRef.close();
  }
}

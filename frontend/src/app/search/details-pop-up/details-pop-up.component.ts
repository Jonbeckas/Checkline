import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {InfoComponent} from "../../scanner/info/info.component";
import {Item} from "../../scanner/scanner/tableDataSource";
import {CookieService} from "ngx-cookie-service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import Axios, {AxiosError, AxiosResponse} from "axios";

@Component({
  selector: 'app-details-pop-up',
  templateUrl: './details-pop-up.component.html',
  styleUrls: ['./details-pop-up.component.scss']
})
export class DetailsPopUpComponent implements OnInit {
  title: any;
  text: any="";
  private id: Item;

  constructor(private dialogRef : MatDialogRef<InfoComponent>, @Inject(MAT_DIALOG_DATA) data,private cookieService:CookieService,private http:HttpClient) {
    this.title = data.title;
    this.id = data.id;
  }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
  }

  roundplus() {
    let token = this.cookieService.get("token");
    const request = Axios.patch(environment.backendUrl+"/table.php", {
      Nummer:this.id.id,
      Runde: '+',
    },{headers:{
        Authorization: `Bearer ${token}`
      }});
    request.then((res:AxiosResponse)=> {
      this.text= "Dem Läufer/In "+this.title+" hat nun "+res.data.Runde+" Runden gelaufen";
    }).catch((err:AxiosError)=> this.text= "Es ist ein Fehller aufgetreten!")

  }

  roundminus() {
    let token = this.cookieService.get("token");
    const request = Axios.patch(environment.backendUrl+"/table.php", {
      Nummer:this.id.id,
      Runde: '-',
    },{headers:{
        Authorization: `Bearer ${token}`
      }});
    request.then((res:AxiosResponse)=> {
      this.text= "Dem Läufer/In "+this.title+" hat nun "+res.data.Runde+" Runden gelaufen";
    }).catch((err:AxiosError)=> this.text= "Es ist ein Fehler aufgetreten!")
  }

  abmelden() {
    let token = this.cookieService.get("token");
    const request = Axios.patch(environment.backendUrl+"/table.php", {
      Nummer:this.id.id,
      Anwesenheit: '0',
    },{headers:{
        Authorization: `Bearer ${token}`
      }});
    request.then((res:AxiosResponse)=> {
      this.text= "Dem Läufer/In "+this.title+" wurde abgemeldet"
    }).catch((err:AxiosError)=> this.text= "Es ist ein Fehler aufgetreten!")

  }

  anmelden() {
    let token = this.cookieService.get("token");
    const request = Axios.patch(environment.backendUrl+"/table.php", {
      Nummer:this.id.id,
      Anwesenheit: '1',
    },{headers:{
        Authorization: `Bearer ${token}`
      }});
    request.then((res:AxiosResponse)=> {
      this.text= "Dem Läufer/In "+this.title+" wurde angemeldet"
    }).catch((err:AxiosError)=> this.text= "Es ist ein Fehler aufgetreten!")

  }

  verletzt() {
    let token = this.cookieService.get("token");
    const request = Axios.patch(environment.backendUrl+"/table.php", {
      Nummer:this.id.id,
      Anwesenheit: '3',
    },{headers:{
        Authorization: `Bearer ${token}`
      }});
    request.then((res:AxiosResponse)=> {
      this.text= "Dem Läufer/In "+this.title+" wurde auf momentan verhindet gestellt"
    }).catch((err:AxiosError)=> this.text= "Es ist ein Fehler aufgetreten!")

  }

  gesund() {
    let token = this.cookieService.get("token");
    const request = Axios.patch(environment.backendUrl+"/table.php", {
      Nummer:this.id.id,
      Anwesenheit: '1',
    },{headers:{
        Authorization: `Bearer ${token}`
      }});
    request.then((res:AxiosResponse)=> {
      this.text= "Dem Läufer/In "+this.title+" wurde auf wieder mitlaufend gestellt"
    }).catch((err:AxiosError)=> this.text= "Es ist ein Fehler aufgetreten!")

  }

  minAn() {

  }
}

import {Component, OnInit} from '@angular/core';
import Axios, {AxiosError, AxiosResponse} from "axios";
import {BarcodeFormat} from '@zxing/library';
import {CookieService} from "ngx-cookie-service";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {NetworkErrorComponent} from "../network-error/network-error.component";
import {WarningComponent} from "../warning/warning.component";
import {InfoComponent} from "../info/info.component";
import {MatTableDataSource} from "@angular/material/table";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss']
})
export class ScannerComponent implements OnInit {
  station: string;
  allowedFormats: any = [BarcodeFormat.QR_CODE, BarcodeFormat.CODE_128];
  lastNumber: string;
  hasPermission: boolean;
  hasDevices: boolean;
  torchActivated: boolean = false;
  torchCompatible: boolean;
  cameras: MediaDeviceInfo[];
  currentCamera: MediaDeviceInfo = null;
  history : string[]= [];
  displayedColumns: ['Id'];

  constructor(private cookieService: CookieService, private dialog:MatDialog) {
    //this.history.push({id:"5",name:"Test tost (1)",status:"An",round:"8",station:"7"});
  }

  ngOnInit() {
    this.station = "0";
  }

  scanSucces(result: string) {
    if (this.lastNumber != undefined && result == this.lastNumber) {
      //return;
    }
    let token = this.cookieService.get("token");
    console.log("scanned");
    const request = Axios.patch("http://localhost:80/backend/public/table.php", {
      Nummer: result,
      Runde: '+',
      Station: this.station,
      token: token
    });
    request.then((res: AxiosResponse) => {
      this.lastNumber = result;
      const dialogConfig = new MatDialogConfig();
      dialogConfig.autoFocus = true;
      dialogConfig.data = {
        title: 'Info',
        message:"Dem Läufer mit der id " + result + " wurde eine Runde hinzugefügt!"
      };
      this.dialog.open(InfoComponent,dialogConfig);
      let json = res.data;
      this.history.push(json.Nummer);
      this.history = [...this.history];
      console.log(this.history);
    }).catch((err: AxiosError) => {
      console.error(err);
      if (!err.response) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        let networkDialog = this.dialog.open(NetworkErrorComponent,dialogConfig);
      } else if (err.response.status == 404) {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
          title: 'Warnung',
          message:"Der Läufer mit der id " + result + " wurde nicht gefunden"
        };
        this.lastNumber = result;
        this.dialog.open(WarningComponent,dialogConfig);
      } else {
        const dialogConfig = new MatDialogConfig();
        dialogConfig.autoFocus = true;
        dialogConfig.data = {
          title: 'Fehler',
          message:"Es ist ein Fehler aufgetreten!"
        };
        this.dialog.open(WarningComponent,dialogConfig);
      }
    })
  }

  onInput($event: KeyboardEvent) {
    this.station = (<HTMLInputElement>document.getElementById("ti")).value;
  }

  permRes($event: boolean) {
    this.hasPermission = $event;
  }

  toggleTorch() {
    this.torchActivated ? this.torchActivated = false : this.torchActivated = true;
  }

  sethasDevices($event: boolean) {
    this.hasDevices = $event;

  }

  setTorchCompatible($event: boolean) {
    this.torchCompatible = $event;
  }

  camerasFound($event: MediaDeviceInfo[]) {
    this.cameras = $event;
    this.currentCamera = this.cameras[0];
  }


  onCameraChanged($event: Event) {
    if ((<HTMLSelectElement>$event.target).value=='noCam') {
        this.currentCamera=null;
    } else {
      this.currentCamera = this.cameras.find(x => x.deviceId === (<HTMLSelectElement>$event.target).value);
    }
  }
}

export interface Runner{
  id:string;
  name:string;
  status:string;
  round:string;
  station:string;
}








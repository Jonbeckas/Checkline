import {Component, OnInit, ViewChild} from '@angular/core';
import {BarcodeFormat} from "@zxing/library";
import {ClrDatagrid} from "@clr/angular";
import {ZXingScannerComponent} from "@zxing/ngx-scanner";
import {ClarityIcons, infoCircleIcon} from "@cds/core/icon";
import {Runner} from "../../runners/dtos/Runner";
import {RunnerService} from "../../runners/service/runner.service";
import { FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss']
})
export class ScannerComponent implements OnInit {
  formats = [BarcodeFormat.QR_CODE];
  camera: MediaDeviceInfo|undefined;
  cameras: MediaDeviceInfo[] | undefined;

  @ViewChild("scanner",{static:false}) scanner: ZXingScannerComponent | undefined;
  @ViewChild("datagrid",{static:false}) datagrid: ClrDatagrid | undefined;
  torch = false;
  torchComp = false;
  infoMessage: string ="";
  showInfo = false;
  warnIsMessage = false;
  runners: Runner[] = [];
  lastResult: { timestamp:number,id:string }|undefined;
  scannerReady = false;

  $stations = this.runnerService.getStations().pipe();
  station!:string;


  constructor(private runnerService:RunnerService) { }

  ngOnInit(): void {
    ClarityIcons.addIcons(infoCircleIcon)
  }

  onCamerasFound($event: MediaDeviceInfo[]) {
    this.cameras = $event.reverse();
    setTimeout(()=> {this.scannerReady = true},300);
  }

  onNoCamerasFound($event: any) {
    this.infoMessage ="No cameras found!";
    this.showInfo = true;
    this.warnIsMessage = false;
  }

  onCameraChange($event: Event) {
    let devId = (<any>$event.target).value;
    if (devId != this.camera) {
      if (this.cameras) {
        this.camera = this.cameras.filter(obj => obj.deviceId == devId)[0];
      }
    }

  }

  torchCompatible($event: boolean) {
    this.torchComp = $event;
  }

  onPermissionResponse($event: boolean) {
    if (!$event) {
      this.infoMessage ="You must allow this website to use your camera!";
      this.showInfo = true;
      this.warnIsMessage = true;
    }
  }

  cameraIsEmpty():boolean {
    if (this.cameras) {
      return this.cameras?.length > 0;
    } else {
      return false;
    }
  }

  onScanComplete(id: string) {
    if (this.runners.length > 0) {
      if (this.lastResult?.id != id || this.lastResult.timestamp +10 <= Date.now()/1000) {
        this.addRoundToUser(id);
      }
    } else {
      this.addRoundToUser(id);
    }
  }

  private addRoundToUser(id:string) {
    const timestamp = Date.now() / 1000;
    this.lastResult ={id:id,timestamp:timestamp}
    this.runnerService.addRound(id).subscribe(obj => {
      if (obj.success) {
        this.runnerService.getRunner(id).subscribe(obj => {
          if (this.station) {
            this.runnerService.setStation(id,this.station).subscribe();
          }
          console.log(obj)
          this.runners.splice(0,0,obj);
          console.log(this.runners)
        });
      } else {
        if (obj.error =="The user has no defined state") {
          alert("The scanned runner has no defined state!")
        }
      }
    });

  }

  timeToString(time:number): string {
    if (!time) return "-"
    let date = new Date(Math.floor(time/1000)*1000);
    return `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  }

  onUserUndo(id: string,timestamp: Date) {
    this.runnerService.decreaseRound(id).subscribe(obj => {
      if (obj.success) {
        for (let index in this.runners) {
          if (this.runners[index].id == id && this.runners[index].timestamp == timestamp) {
            let indexx:number = parseInt(index);
            this.runners.splice(indexx!,1)
          }
        }
      }
    })
  }
}

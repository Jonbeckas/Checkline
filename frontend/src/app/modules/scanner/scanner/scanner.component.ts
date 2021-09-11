import {Component, OnInit, ViewChild} from '@angular/core';
import {BarcodeFormat} from "@zxing/library";
import {ClrDatagrid} from "@clr/angular";
import {ZXingScannerComponent} from "@zxing/ngx-scanner";
import {ClarityIcons, infoCircleIcon} from "@cds/core/icon";
import {Runner} from "../../runners/dtos/Runner";
import {RunnerService} from "../../runners/service/runner.service";

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
  lastResult: { timestamp:number,username:string }|undefined;


  constructor(private runnerService:RunnerService) { }

  ngOnInit(): void {
    ClarityIcons.addIcons(infoCircleIcon)
  }

  onCamerasFound($event: MediaDeviceInfo[]) {
    this.cameras = $event.reverse();
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

  onScanComplete(result: string) {
    if (this.runners.length > 0) {
      if (this.lastResult?.username != result || this.lastResult.timestamp +10 <= Date.now()/1000) {
        this.addRoundToUser(result);
      }
    } else {
      this.addRoundToUser(result);
    }
  }

  private addRoundToUser(username:string) {
    const timestamp = Date.now() / 1000;
    this.lastResult ={username:username,timestamp:timestamp}
    this.runnerService.addRound(username).subscribe(obj => {
      if (obj.success) {
        this.runnerService.getRunner(username).subscribe(obj => {
          this.runners.splice(0,0,obj);
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
    let date = new Date(time*1000);
    return `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  }

  onUserUndo(loginName: string,timestamp:number) {
    this.runnerService.decreaseRound(loginName).subscribe(obj => {
      if (obj.success) {
        for (let index in this.runners) {
          if (this.runners[index].loginName == loginName && this.runners[index].timestamp == timestamp) {
            let indexx:number = parseInt(index);
            this.runners.splice(indexx!,1)
          }
        }
      }
    })
  }
}

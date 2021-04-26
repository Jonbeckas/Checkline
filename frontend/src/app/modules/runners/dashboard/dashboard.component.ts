import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {Runner} from "../dtos/Runner";
import {RunnerService} from "../service/runner.service";
import {ClrDatagrid} from "@clr/angular";
import {ClarityIcons, minusIcon, plusIcon, qrCodeIcon} from "@cds/core/icon";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  runners$:Runner[] =[];
  interval: number | undefined;
  TIMEOUT =10000;
  states:string[] = []
  // @ts-ignore
  @ViewChild(ClrDatagrid) datagrid: ClrDatagrid;
  loadQr = false;

  constructor(private authService:AuthService,private runnerService:RunnerService) { }

  ngOnDestroy(): void {
        clearInterval(this.interval)
    }

  ngOnInit(): void {
    ClarityIcons.addIcons(plusIcon,minusIcon,qrCodeIcon);

    if (this.authService.hasPermissionOrAdmin('RUNNER_LIST')) {
      this.runnerService.getRunners().subscribe(sub => {
        this.runners$ = sub;
      });

    if (this.authService.hasPermissionOrAdmin("RUNNER_MODIFY")) {
      this.runnerService.getStates().subscribe(sub => {
        if (sub.success) {
          this.states = <string[]> sub.value;
        } else {
          console.error(sub.value);
        }
      });
    }

    this.interval = setInterval(() => {
      this.runnerService.getRunners().subscribe(sub => {
        console.log("Refreshed runner dataset")
        this.runners$ = sub;
        this.datagrid.dataChanged();
      });
    }, this.TIMEOUT);
    }
  }

  timeToString(time:number): string {
    if (!time) return "-"
    let date = new Date(time*1000);
    return `${date.getDate()}.${date.getMonth()+1}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  }

  onStateChange($event: Event, runner: Runner) {
    this.runnerService.setState(runner.loginName,(<any>$event.target).value).subscribe(()=> this.refreshTable());
  }

  addRound(runner:Runner) {
    this.runnerService.addRound(runner.loginName).subscribe();
    this.refreshTable()
  }

  decreaseRound(runner: Runner) {
    this.runnerService.decreaseRound(runner.loginName).subscribe();
    this.refreshTable();
  }

  refreshTable() {
    this.runnerService.getRunners().subscribe(sub => {
      this.runners$ = sub;
      this.datagrid.dataChanged();
    });
  }

  qr(username:string) {
    this.loadQr = true;
    this.runnerService.qr(username).subscribe(res => {
      let blobURL = URL.createObjectURL(res);
      window.open(blobURL, 'New Window','width=700,height=550,top=70,left=500,resizable=0,menubar=no')
      this.loadQr = false;
    })
  }
}

import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {Runner} from "../dtos/Runner";
import {RunnerService} from "../service/runner.service";
import {ClrDatagrid} from "@clr/angular";
import {ClarityIcons, minusIcon, plusIcon, qrCodeIcon, refreshIcon} from "@cds/core/icon";
import {SaveService} from "../../../service/save.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {

  runners$: Runner[] = [];
  interval: number | undefined;
  TIMEOUT = 10000;
  states: string[] = [];
  selected: Runner[] = [];
  // @ts-ignore
  @ViewChild(ClrDatagrid) datagrid: ClrDatagrid;
  loadQr = false;

  constructor(private authService: AuthService, private runnerService: RunnerService, private saveService: SaveService) {
  }

  ngOnDestroy(): void {
    clearInterval(this.interval)
  }

  ngOnInit(): void {
    ClarityIcons.addIcons(plusIcon, minusIcon, qrCodeIcon, refreshIcon);

    if (this.authService.hasPermissionOrAdmin('RUNNER_LIST')) {
      this.runnerService.getRunners().subscribe(sub => {
        this.runners$ = sub;
      });
    }

    if (this.authService.hasPermissionOrAdmin("RUNNER_MODIFY")) {
      this.runnerService.getStates().subscribe(sub => {
        if (sub.success) {
          this.states = <string[]>sub.value;
        } else {
          console.error(sub.value);
        }
      });
    }
  }

  timeToString(time: number): string {
    if (!time) return "-"
    let date = new Date(time * 1000);
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  }

  onStateChange($event: Event) {
    for (let runner of this.selected) {
      console.log(runner.state)
      this.runnerService.setState(runner.loginName, (<any>$event.target).value).subscribe(() => this.refreshTable());
    }
    this.refreshTable();
  }

  isDropdowStateSeleted(state: string) {
    if (this.selected.length == 1) {
      return (this.selected[0].state == state)?true: null;
    } else {
      let lastValue = this.selected[0].state;
      for (let element of this.selected) {
        if (element.state != lastValue) {
          return null;
        }
      }
      if (lastValue == state) {
        return true;
      } else{
        return null;
      }
    }
  }

  isDropdownNeedsPlaceholder() {
    if (this.selected.length > 0) {
      let lastValue = this.selected[0].state;
      for (let element of this.selected) {
        if (element.state != lastValue) {
          return true;
        }
      }
      return null;
    }
    return true;
  }

  addRound() {
    for (let i of this.selected) {
      this.runnerService.addRound(i.loginName).subscribe();
    }
    this.refreshTable()
  }

  decreaseRound() {
    for (let i of this.selected) {
      this.runnerService.decreaseRound(i.loginName).subscribe();
    }
    this.refreshTable();
  }

  refreshTable() {
    this.runnerService.getRunners().subscribe(sub => {
      this.runners$ = sub;
      this.datagrid.dataChanged();
    });
  }

  isDropdownDisabled() {
    return this.selected.length == 0;
  }

  qr() {
    for (let element of this.selected) {
      this.loadQr = true;
      this.runnerService.qr(element.loginName).subscribe(res => {
        this.saveService.save(res,`${element.loginName}-qr.pdf`)
        this.loadQr = false;
      })
    }
  }
}


import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {AuthService} from "../../auth/auth.service";
import {Runner} from "../dtos/Runner";
import {RunnerService} from "../service/runner.service";
import {ClrDatagrid} from "@clr/angular";
import {ClarityIcons, minusIcon, plusIcon, qrCodeIcon, refreshIcon} from "@cds/core/icon";
import {SaveService} from "../../../service/save.service";
import {catchError, takeUntil} from "rxjs/operators"
import { of } from 'rxjs';

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
  @ViewChild(ClrDatagrid) datagrid!: ClrDatagrid;
  loadQr = false;

  $stations = this.runnerService.getStations().pipe(

  )

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
    let date = new Date(Math.floor(time/1000)*1000);
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
  }

  onStateChange($event: Event) {
    for (let runner of this.selected) {
      this.runnerService.setState(runner.id, (<any>$event.target).value).subscribe(() => this.refreshTable());
    }
    this.refreshTable();
  }

  onStationChange($event: Event) {
    for (let runner of this.selected) {
      if (runner.state== null) {
        alert("The user must be logged in!");
        return;
      }
      this.runnerService.setStation(runner.id, (<any>$event.target).value).subscribe(() => this.refreshTable());
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

  isDropdowStationSeleted(station: string) {
    if (this.selected.length == 1) {
      return (this.selected[0].station == station)?true: false;
    } else {
      let lastValue = this.selected[0].station;
      for (let element of this.selected) {
        if (element.state != lastValue) {
          return false;
        }
      }
      if (lastValue == station) {
        return true;
      } else{
        return false;
      }
    }
  }

  isDropdownStateNeedsPlaceholder() {
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

  isDropdownStationNeedsPlaceholder() {
    if (this.selected.length > 0) {
      let lastValue = this.selected[0].station;
      for (let element of this.selected) {
        if (element.station != lastValue) {
          return true;
        }
      }
      return null;
    }
    return true;
  }

  addRound() {
    for (let i of this.selected) {
      this.runnerService.addRound(i.id).subscribe(() => {
        this.refreshTable();
      });
    }
  }

  decreaseRound() {
    for (let i of this.selected) {
      this.runnerService.decreaseRound(i.id).subscribe(()=> {
        this.refreshTable();
      });
    }
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
      this.runnerService.qr(element.id).subscribe(res => {
        this.saveService.save(res,`${element.username}-qr.pdf`)
        this.loadQr = false;
      })
    }
  }
}
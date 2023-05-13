import { Component, OnInit } from '@angular/core';
import { RunnerConspicousService } from '../service/runner-conspicous.service';
import { switchMap } from 'rxjs/operators';
import { Observable, timer } from 'rxjs';

@Component({
  selector: 'app-conspicous',
  templateUrl: './conspicous.component.html',
  styleUrls: ['./conspicous.component.scss']
})
export class ConspicousComponent implements OnInit {

  runners$ = timer(0,30000).pipe(switchMap(() => this.conspicousService.getRunners()))
  
  constructor(private conspicousService: RunnerConspicousService) { }

  ngOnInit(): void {
  }

}

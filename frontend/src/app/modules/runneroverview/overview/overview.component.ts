import { Component, OnInit } from '@angular/core';
import { take, takeUntil } from 'rxjs/operators';
import { AuthService } from '../../auth/auth.service';
import { RunnerService } from '../../runners/service/runner.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  id = this.authService.getUserId();
  runner = this.runnerService.getRunner(this.id).pipe(take(1));

  constructor(private runnerService: RunnerService, private authService: AuthService) {}

  ngOnInit(): void {
  }

}

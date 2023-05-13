import { Component, OnInit } from '@angular/core';
import { ClarityIcons, qrCodeIcon } from '@cds/core/icon';
import { take, takeUntil } from 'rxjs/operators';
import { SaveService } from 'src/app/service/save.service';
import { AuthService } from '../../auth/auth.service';
import { RunnerService } from '../../runners/service/runner.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  id = this.authService.getUserId();
  runner = this.runnerService.getSelfRunner().pipe(take(1));
  loadingQr = false;

  constructor(private runnerService: RunnerService, private authService: AuthService, private saveService: SaveService) {}

  ngOnInit(): void {
    ClarityIcons.addIcons(qrCodeIcon);
  }

  qr(): void {
    this.loadingQr = true;
    this.runnerService.qr(this.id).subscribe(res => {
      this.saveService.save(res,`${this.authService.getUsername()}-qr.pdf`);
      this.loadingQr = false;
    });
  }

}

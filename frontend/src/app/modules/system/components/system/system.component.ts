import { Component, OnInit } from '@angular/core';
import { ClarityIcons, exportIcon } from '@cds/core/icon';
import { SystemService } from '../../service/system.service';
import { SaveService } from 'src/app/service/save.service';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.scss']
})
export class SystemComponent implements OnInit {

  constructor(private systemService: SystemService, private saveService: SaveService) { }

  ngOnInit(): void {
    ClarityIcons.addIcons(exportIcon);
  }

  exportAndDownloadLogs() {
    this.systemService.exportLogs().subscribe((data) => {
      const blob = new Blob([data], { type: 'text/csv' });
      this.saveService.save(blob,"export-logs.csv")
    })
  }

}

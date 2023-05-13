import { Component, OnInit } from '@angular/core';
import { ClarityIcons, exportIcon } from '@cds/core/icon';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrls: ['./system.component.scss']
})
export class SystemComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    ClarityIcons.addIcons(exportIcon);
  }

}

import { Component } from '@angular/core';
import '@cds/core/icon/register.js';
import {ClarityIcons, videoCameraIcon, flagIcon, cogIcon} from '@cds/core/icon';
import {AuthService} from "./auth/auth.service";
import {ActivatedRouteSnapshot, Router} from "@angular/router";

ClarityIcons.addIcons(videoCameraIcon);
ClarityIcons.addIcons(flagIcon);
ClarityIcons.addIcons(cogIcon)

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Checkline';
}


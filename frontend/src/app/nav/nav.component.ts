import { Component, OnInit } from '@angular/core';
import {AuthService} from "../auth/auth.service";
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent implements OnInit {



  username = this.authService.getUsername();
  currTab:string|undefined;


  constructor(private authService:AuthService,private router:Router) {
    this.username = this.authService.getUsername();
  }

  ngOnInit(): void {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.username = this.authService.getUsername();
        this.currTab = event.url;
      }
    })
  }

  logout() {
    this.authService.logout();
  }

}

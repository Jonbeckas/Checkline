import {Component, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild('username', null) username;
  @ViewChild('password', null) password;
  @ViewChild('submit', null) submit;

  constructor() { }

  ngOnInit() {
  }

}

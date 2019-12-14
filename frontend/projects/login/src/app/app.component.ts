import {Component, ViewChild} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'login';
@ViewChild("username",null) username;
@ViewChild("password",null) password;
@ViewChild("submit",null) submit;



  ngAfterViewInit() {
    console.log("WORKD");
  }
}

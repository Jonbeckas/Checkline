import {Component, OnInit, ViewChild} from '@angular/core';
import Axios, {AxiosError, AxiosResponse} from "axios";

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

  ngOnViewInit() {
    this.submit.nativeElement.addEventListener("click",()=>{
        if (this.username.getText()==""&&this.password.getText()=="") {
          alert("Bitte fülle die folgenden Felder aus!");
          return;
        }
      const request = Axios.post("http://localhost:80/backend/public/admin.php/login",{username:this.username.getText(),password:this.password.getText()});
      request.then((res:AxiosResponse)=>{
        console.log(res.data);
      }).catch((err:AxiosError)=> {

      });

    });
  }

}

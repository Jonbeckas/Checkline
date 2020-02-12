import {Component, ViewChild} from '@angular/core';
import Axios, {AxiosError, AxiosResponse} from "axios";
import {CookieService} from "ngx-cookie-service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'login';
  @ViewChild('username', {static:false}) username;
  @ViewChild('password', {static:false}) password;

  constructor( private cookieService:CookieService) { }

  ngOnInit() {
    let cookie:string = this.cookieService.get("token");
    console.log(cookie);
    if (cookie!="") {
      const request = Axios.post("http://localhost:80/backend/public/admin.php/checklogin",{token:cookie});
      request.then((res:AxiosResponse)=>{
        console.log(res.data);
        if (res.data.state == true) this.toSearch();})
    }
  }


  OnInput($event: any) {
    let username = this.username.nativeElement.value;
    let password = this.password.nativeElement.value;
    if (username==""&&password=="") {
      alert("Bitte fülle die folgenden Felder aus!");
      return;
    }
    const request = Axios.post("http://localhost:80/backend/public/admin.php/login",{username:username,password:password});
    request.then((res:AxiosResponse)=>{
      console.log(res.data);
      if (res.data.error!=undefined) {
        switch (res.data.error) {
          case "wrongLogin":
            this.wrongLogin();
            break;
          case "stillLogedin":
            this.logoutQuestion(username,password);
            break;
        }
      } else {
        this.login(res.data.username,res.data.token,res.data.levels);
      }
    }).catch((err:AxiosError)=> {
      this.error(err.code);
    });
  }

   private wrongLogin() {
    alert("Falscher Benutzername/Passwort!");
  }

  private error(string:String) {
    alert("Es ist ein Fehler aufgetreten.\n Bitte probieren sie es in einigen Sekunden erneut!");
    console.error(string);
  }

  private logoutQuestion(username,password) {
    let answer:boolean = confirm("Sie sind auf einem anderen PC bereits angemeldet. \n Wollen sie sich von einem anderen PC abmelden?");
    if (answer) {
      const request = Axios.post("http://localhost:80/backend/public/admin.php/login",{username:username,password:password,force:true});
      request.then((res:AxiosResponse)=>{
        if (res.data.token==undefined) {
          this.error("No Token! "+res.data.error);
        } else {
          this.login(res.data.username,res.data.token,res.data.levels);
        }
      }).catch((err:AxiosError)=>{
          this.error(err.code);
      });
    }
  }

  login(username:string,token:string,permission:string) {
      let date = new Date(9999,12,31);
      this.cookieService.set("token", token,date,"/");
      this.cookieService.set("permission",permission,date,"/");
      this.toSearch();
  }

  toSearch() {
    document.location.href = "../search";
  }
}

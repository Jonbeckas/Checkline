import {Cookie} from "./Cookie";
import Axios, {AxiosError, AxiosResponse} from "axios";

export class LoginTools {
  static checkLoginL(dir) {
    let hash = Cookie.getCookie("id");
    let username = Cookie.getCookie("username");
    let answer;
    let data = new FormData();
    data.append("h",hash);
    data.append("u",username);
    const request = Axios.post("http://localhost:80/core/checkLogin.php",data, { responseType: "text" });
    request.then((res:AxiosResponse)=>{
      let ans:boolean = res.data;
      if (ans) {
        answer = true;
      }
      else {
        answer = false;
        Cookie.removeCookie("username");
        Cookie.removeCookie("id");
        window.location.replace(dir+"interface/login.html");
      }
    }).catch((err:AxiosError)=> {
      alert("Verbindung zum Server fehlgeschlagen!");
      console.log(err);
    });

  }

  static loginRedirection () {
    let data = new FormData();
    data.append("s","url");
    const request = Axios.post("http://localhost:80/core/settings.php",data);
    request.then((res:AxiosResponse)=>{
      this.checkLoginL(res.data)
    }).catch((err:AxiosError)=> {
      alert("Verbindung zum Server fehlgeschlagen!")
    });
  }
}

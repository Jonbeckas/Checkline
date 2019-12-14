import {
  Component,
  ContentChild,
  ElementRef,
  HostListener, Inject,
  OnInit,
  ViewChild,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';
import Axios, {AxiosError, AxiosResponse} from "axios";
import {Cookie} from "../../app/libs/Cookie";
import {NavmanagerService} from "../navmanager.service";
import {NavbarComponent} from "../navbar/navbar.component";
@Component({
  selector: 'app-adminbar',
  templateUrl: './adminbar.component.html',
  styleUrls: ['./adminbar.component.scss']
})

export class AdminbarComponent implements OnInit {
  @ViewChild("levels",null) levels;
  @ViewChild("okay",null) submit;
  @ViewChild("name",null) name;
  @ViewChild("password",null) password;
  @ViewChild("abort",null) abort;

  private service: NavmanagerService;
  private viewRef: ViewContainerRef;

  constructor(@Inject(NavmanagerService)  service) {
    this.service = service;
  }
  ngOnInit() {

  }
  ngAfterViewInit() {
    let data = new FormData();
    data.append("u",Cookie.getCookie("username"));
    data.append("h",Cookie.getCookie("id"));
    const response = Axios.post("http://localhost:80/core/getlevel.php",data);
    response.then((res:AxiosResponse)=> {
      let obj = this.levels.nativeElement;
      if (res.data == "") alert("Bitte logge dich neu ein");
      document.getElementById("wait").remove();
      res.data.forEach(function(element) {
        let option = document.createElement("option");
        option.text= element.name;
        option.id = element.id;
        obj.add(option);
      });
    });
    response.catch((err:AxiosError)=>{
      alert("Fehler beim Verbinde zu Server. Bitte logge dich neu ein");
    });


    this.submit.nativeElement.addEventListener("click",()=>{
      let data = new FormData();
      data.append("n",this.name.nativeElement.value);
      data.append("p",this.password.nativeElement.value);
      data.append("u",Cookie.getCookie("username"));
      data.append("h",Cookie.getCookie("id"));
      data.append("l",this.levels.value);
      const request = Axios.post("http://localhost:80/core/registerAdmin.php",data);
      request.then((res:AxiosResponse)=>{
        if (res.data.includes("!")) {
          alert(res.data);
        } else {
          alert(res.data);
          this.service.addDynamicComponent(NavbarComponent);
        }
      }).catch((erros:AxiosError)=> {
        alert("Verbindung zu Server nicht möglich!")
      });
    });
    this.abort.nativeElement.addEventListener("click",()=> {
      this.service.addDynamicComponent(NavbarComponent);
    });
  }
}

import {Component, Inject, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {NavmanagerService} from "../navmanager.service";
import {NavbarComponent} from "../navbar/navbar.component";
import {Cookie} from "../../app/libs/Cookie";
import Axios, {AxiosError, AxiosResponse} from "axios";

@Component({
  selector: 'app-addstudent',
  templateUrl: './addstudent.component.html',
  styleUrls: ['./addstudent.component.scss']
})
export class AddstudentComponent implements OnInit {
  @ViewChild("vorname",null) vorname;
  @ViewChild("nachname",null) nachname;
  @ViewChild("gruppe",null) gruppe;
  @ViewChild("okay",null) okay;
  @ViewChild("abort",null) abort;
  private service: NavmanagerService;

  constructor(@Inject(NavmanagerService)  service) {
    this.service = service;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.okay.nativeElement.addEventListener("click",()=> {
      this.service.addDynamicComponent(NavbarComponent);
    });

    this.okay.nativeElement.addEventListener("click",()=> {
      let data = new FormData();
      data.append("n",this.nachname.nativeElement.value);
      data.append("v",this.vorname.nativeElement.value);
      data.append("k",this.gruppe.nativeElement.value);
      data.append("u",Cookie.getCookie("username"));
      data.append("h",Cookie.getCookie("id"));
      const request = Axios.post("http://localhost:80/core/registerStudent.php",data);
      request.then((res:AxiosResponse)=>{
        alert(res.data)
      }).catch((erros:AxiosError)=> {
        alert("Verbindung zu Server nicht möglich!")
      });
    });
  }

}

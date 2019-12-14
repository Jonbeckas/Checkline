import {Component, ElementRef, Inject, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {Cookie} from "../../app/libs/Cookie"
import {LoginTools} from "../../app/libs/loginTools";
import {NavmanagerService} from "../navmanager.service";
import {AdminbarComponent} from "../adminbar/adminbar.component";
import {AddstudentComponent} from "../addstudent/addstudent.component";
import {ImportstudentsComponent} from "../importstudents/importstudents.component";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  private service: NavmanagerService;
  private viewRef: ViewContainerRef;
  @ViewChild("admin",null) admin;
  @ViewChild("addStudent",null) addStudent;
  @ViewChild("importStudent",null) importStudent;

  constructor(@Inject(NavmanagerService)  service ,) {
    this.service = service;
  }

  ngOnInit() {

  }

  ngAfterViewInit(){
    this.doAfterLoad();
    this.getName();
    this.setUser();
    this.admin.nativeElement.addEventListener("click",()=>{
      this.service.addDynamicComponent(AdminbarComponent);
    });
    this.addStudent.nativeElement.addEventListener("click",()=>{this.service.addDynamicComponent(AddstudentComponent)});
    this.importStudent.nativeElement.addEventListener("click",()=>{this.service.addDynamicComponent(ImportstudentsComponent)});

  }

  setUser() {
    if (Cookie.getCookie("username")=== undefined) {
      document.getElementById("hotbar").innerHTML= "<li><a class=TextHB id=\"title\">Über</a></li>" +
        "<a class = \"dropdown\" href='login.html'  style=\"float: right\">\n" +
        "        </a>";
    } else {
      document.getElementById("profil").innerText = Cookie.getCookie("username");
    }
  }

  getName() {
    let site = window.location.pathname;
    if (site.includes("dashboard.html")) {
      document.getElementById("title").innerText = "Dashboard";
    } else if (site.includes("client.html")) {
      document.getElementById("title").innerText = "Scanner";
    } else if (site.includes("about.html")) {
      document.getElementById("title").innerText = "Über";
    }
  }

  doAfterLoad() {
    let site = window.location.pathname;
    if (!site.includes("login.html")) {
      LoginTools.loginRedirection();
    }
    let permissions = Cookie.getCookie("level").split(",");
    for (let i=0;i<permissions.length;i++) {
      let name = permissions[i].replace(/\./g,"lyl");
      let elements =<HTMLElement[]><any> document.getElementsByClassName(name);
      for (let j=0; j<elements.length;j++) {
        let element =<HTMLElement> elements[j];
        element.style.visibility ="visible";
      }
    }
    let level = Cookie.getCookie("level");
    if (site.includes("dashboard.html")) {
      if (level.includes("ispolaso.scanner")&&!level.includes("ispolaso.dashboard.tables")&&!level.includes("ispolaso.dashboard.actions")) {
        location.replace("client.html");
      }
    } else if (site.includes("client.html")) {
      if (!level.includes("ispolaso.scanner")) {
        location.replace("dashboard.html");
      }
    }
  }

}

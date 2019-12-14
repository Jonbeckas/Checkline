import {Component, Inject, OnInit} from '@angular/core';
import {NavmanagerService} from "../navmanager.service";

@Component({
  selector: 'app-importstudents',
  templateUrl: './importstudents.component.html',
  styleUrls: ['./importstudents.component.scss']
})
export class ImportstudentsComponent implements OnInit {
  ///@Child
  private service: NavmanagerService;

  constructor(@Inject(NavmanagerService)  service) {
    this.service = service;
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    let docs = document.getElementById("file");
    //docs = docs.files;
    let doc = docs[0];
    let formData = new FormData();
    console.log(doc);
    if (!doc.name.match(".csv")) {
      return;
    }
    console.log(doc.name);
    formData.append("file", doc,doc.name);
    //formData.append("u",Cookie.getCookie("username"));
    //formData.append("h",Cookie.getCookie("id"));
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
      if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
        if (this.responseText.includes("!")) {

        }
        alert(xmlhttp.responseText)
      }
    };
    xmlhttp.open("POST", "../core/import.php", true);
    xmlhttp.send(formData);
    //
    // Toolbar.abort();
  }

}

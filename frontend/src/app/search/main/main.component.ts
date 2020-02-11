import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTable} from "@angular/material/table";
import Axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import {environment} from "../../../environments/environment";
import {CookieService} from "ngx-cookie-service";
import {Item, TableDataSource} from "../../scanner/scanner/tableDataSource";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit {
  @ViewChild("input",null) input;

  displayedColumns:any= ['id','name',"status","round","station"];
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatTable, {static: false}) table: MatTable<Item>;
  dataSource: TableDataSource;
  data:Item[] =[];
  constructor(private cookieService:CookieService) {

  }

  ngOnInit() {
    this.dataSource = new TableDataSource([]);
    let token = this.cookieService.get("token");
    const request = Axios.get(environment.backendUrl+"/table.php",{
      headers:{
        Authorization: `Bearer ${token}`
      }
    });
    request.then((res:AxiosResponse) => {
      this.data = [];
      let json = res.data;
      for (let i = 0; i < Object.keys(res.data).length; i++) {
        let item = json[i];
        this.data.push({id:item.Nummer,name:item.Vorname+" "+item.Name+" ("+item.Gruppe+")",status:item.Anwesenheit,round:item.Runde,station:item.Station})
      }
      this.dataSource = new TableDataSource(this.data);
      console.log("datas"+this.data);
    });
  }

  change($event: Event) {

  }

  ngAfterViewInit(): void {
      console.log("data"+this.dataSource);
  }
}

import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTable} from "@angular/material/table";
import Axios, {AxiosRequestConfig, AxiosResponse} from "axios";
import {environment} from "../../../environments/environment";
import {CookieService} from "ngx-cookie-service";
import {Item, TableDataSource} from "../../scanner/scanner/tableDataSource";
import {TableService} from "../table.service";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit {
  @ViewChild("input",null) input;

  displayedColumns:any= ['id','name',"status","round","station"];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatTable, {static: true}) table: MatTable<Item>;
  dataSource: TableDataSource;
  data:Item[] =[];
  constructor(private api:TableService) {

  }

  ngOnInit() {
    this.api.fetchPeople().subscribe((o:Object)=> {
      console.log(o);
      this.dataSource = new TableDataSource( <Item[]> o)
    });

  }

  change($event: Event) {

  }

  ngAfterViewInit(): void {
      console.log("data"+this.dataSource);
  }
}

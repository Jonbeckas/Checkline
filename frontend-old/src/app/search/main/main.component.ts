import {AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild} from '@angular/core';
import {Item, TableDataSource} from "../../scanner/scanner/tableDataSource";
import {TableService} from "../table.service";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatTable} from "@angular/material/table";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {DetailsPopUpComponent} from "../details-pop-up/details-pop-up.component";

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit, AfterViewInit {
  @ViewChild("input",{static:false}) input;

  displayedColumns:any= ['id','name',"status","round","station"];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild(MatTable, {static: true}) table: MatTable<Item>;
  dataSource: TableDataSource;
  data:Item[] =[];
  constructor(private api:TableService,private changeDetector:ChangeDetectorRef,private dialog:MatDialog) {

  }


  ngOnInit() {
    this.dataSource = new TableDataSource([]);
    this.api.fetchPeople().subscribe((o:[])=> {
      o.forEach((item:any) =>this.dataSource.addItem({id:item.Nummer,name:item.Vorname+" "+item.Name+" ("+item.Gruppe+")",status:item.Anwesenheit,round:item.Runde,station:item.Station}));
      this.table.renderRows();
    });

  }

  change($event: Event) {
    console.log(this.dataSource);
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
    this.table.dataSource = this.dataSource;
  }

  openDetails(row: Item) {
    console.log(row);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.autoFocus = true;
    dialogConfig.disableClose =true;
    dialogConfig.data = {
      title: row.name,
      id:row
    };
    this.dialog.open(DetailsPopUpComponent,dialogConfig);
  }
}

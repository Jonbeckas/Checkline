import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SearchRoutingModule } from './search-routing.module';
import { MainComponent } from './main/main.component';
import {MatPaginatorModule} from "@angular/material/paginator";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {TableService} from "./table.service";
import {HttpClientModule} from "@angular/common/http";



@NgModule({
  declarations: [MainComponent],
  imports: [
    CommonModule,
    SearchRoutingModule,
    MatPaginatorModule,
    MatTableModule,
    MatSortModule,
    HttpClientModule
  ],
  providers: [TableService]
})
export class SearchModule { }

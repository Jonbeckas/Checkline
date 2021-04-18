import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {from, Observable} from "rxjs";
import {Item, TableDataSource} from "../scanner/scanner/tableDataSource";
import Axios, {AxiosError, AxiosResponse} from "axios";
import {environment} from "../../environments/environment";
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class TableService {

  constructor(private cookieService:CookieService,private http:HttpClient) {

  }

  fetchPeople():Observable<Object> {
    let token = this.cookieService.get("token");
    let data: Item[] = [];
    return this.http.get(environment.backendUrl + "/table.php", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}

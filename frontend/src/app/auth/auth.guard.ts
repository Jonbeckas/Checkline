import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router
} from '@angular/router';
import { Observable } from 'rxjs';
import Axios, {AxiosError, AxiosResponse} from "axios";
import {CookieService} from "ngx-cookie-service";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {


  constructor( private cookieService:CookieService,private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,

    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    let cookie:string = this.cookieService.get("token");
    let status;
    if (cookie!="") {
      const request = Axios.post(environment.backendUrl+"/admin.php/checklogin",{token:cookie});
      request.then((res:AxiosResponse)=>{
        status= res.data.state;
      }).catch((err:AxiosError)=>{status=false});
      if (status == false) {
        this.loadLogin();
        return false;
      } else {
        return true;
      }
    } else {
      this.loadLogin();
      return false;
    }
  }

  loadLogin() {
    this.router.navigate(["/login"]);
  }
}

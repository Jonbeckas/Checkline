import { Injectable } from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import { Observable } from 'rxjs';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {CookieService} from "ngx-cookie-service";
import {AuthService, LoginResponse} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private httpClient:HttpClient,private cookieService:CookieService,private authService:AuthService,private router:Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return new Observable((observer)=> {
      let token = this.cookieService.get("token");
      let bearer = "Bearer "+token;
      this.httpClient.get<LoginResponse>(environment.backendUrl+"/isValid",{headers:{Authorization:bearer}}).subscribe({
        next: (data) =>{
          this.cookieService.set("token",data.token)
          observer.next(true);
          observer.complete();
        },
        error: (err:HttpErrorResponse) => {
          if (err.status == 401) {
            this.authService.logout();
            this.router.navigateByUrl("/login")
          }
          observer.next(false);
          observer.complete();
        }
      })
    });
  }

}

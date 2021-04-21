import { Injectable } from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {CookieService} from "ngx-cookie-service";
import {Observable} from "rxjs";
import jwtDecode from "jwt-decode";
import {Router} from "@angular/router";



interface LoginResponse {
  token:string;
}

export interface WebResult {
  success:boolean,
  error: string|undefined;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private httpService:HttpClient,private cookieService:CookieService, private router:Router) { }

  login(username:string,password:string):Observable<WebResult> {
    return new Observable<WebResult>((observer)=>{
      this.httpService.post<LoginResponse>(environment.backendUrl+"/login",{username:username,password:password}).subscribe({
        next: data => {
          this.cookieService.set("token",data.token);
          observer.next({success:true,error:undefined})
          observer.complete();
        },
        error: (error:HttpErrorResponse) => {
          if (error.status == 401) {
            observer.next({success:false,error:"Wrong Username or password"})
          } else {
            observer.next({success:false,error:"Unknown Error"})
          }
          observer.complete();
        }
      })
    })
  }

  logout() {
    this.cookieService.delete("token");
    this.router.navigateByUrl("/login")
  }

  getUsername():string|undefined{
    const token = this.cookieService.get("token");
    if (token) {
      return (<any> jwtDecode(token)).username;
    } else {
      return undefined;
    }
  }

  changeUserPassword(oldPassword:string,newPasword:string):Observable<WebResult> {
    return new Observable<WebResult>((observer)=>{
      let token = this.cookieService.get("token");
      let bearer = "Bearer "+token;
      this.httpService.post<any>(environment.backendUrl+"/users/changePassword",{username:this.getUsername(),oldPassword:oldPassword,newPassword:newPasword},{headers:{Authorization:bearer}}).subscribe({
        next: data => {
          observer.next({success:true,error:undefined})
          observer.complete();
        },
        error: (error:HttpErrorResponse) => {
         if (error.status == 400) {
           console.warn(error.error.err);
            if (error.error.err == "oldPassword is invalid") {
              observer.next({success:false,error:"Wrong 'old password'"})
            } else {
              observer.next({success:false,error:"Unknown Error"})
            }
          } else {
            observer.next({success:false,error:"Unknown Error"})
          }
          observer.complete();
        }
      })
    })
  }

}

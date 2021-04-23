import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {environment} from "../../../environments/environment";
import {CookieService} from "ngx-cookie-service";
import {BehaviorSubject, Observable, Subscriber} from "rxjs";
import jwtDecode from "jwt-decode";
import {Router} from "@angular/router";



export interface LoginResponse {
  token:string;
}

export interface WebResult {
  success:boolean,
  error: string|undefined;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService{

  // @ts-ignore
  private pemObservable: BehaviorSubject<string[]>;


  constructor(private httpService:HttpClient,private cookieService:CookieService, private router:Router) {
    this.pemObservable = new BehaviorSubject<string[]>([]);
  }

  login(username:string,password:string):Observable<WebResult> {
    return new Observable<WebResult>((observer)=>{
      this.httpService.post<LoginResponse>(environment.backendUrl+"/login",{username:username,password:password}).subscribe({
        next: data => {
          this.cookieService.set("token",data.token);
          this.pemObservable.next((<any> jwtDecode(data.token)).permissions)
          observer.next({success:true,error:undefined})
          observer.complete();
        },
        error: (error:HttpErrorResponse) => {
          if (error.status == 401 && error.error.err =="Unauthorized") {
            observer.next({success:false,error:"Wrong Username or password"})
          } else if(error.status == 401 && error.error.err =="Invalid Permissions") {
            observer.next({success:false,error:"The user does not have the Permission to log in"})
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
    this.pemObservable.next([]);
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

  hasPermissionOrAdmin(permission:string) {
    let token = this.cookieService.get("token")
    let permissions = (<any> jwtDecode(token)).permissions;
    return permissions.includes(permission) ||permissions.includes("CENGINE_ADMIN");
  }

  hasPermissionsOrAdmin(permission:string[]) {
    let token = this.cookieService.get("token")
    if (!token) return false;
    let permissions = (<any|undefined> jwtDecode(token))?.permissions;
    for (let pem of permission) {
      if (permissions.includes(pem) ||permissions.includes("CENGINE_ADMIN")) {
        return true;
      }
    }
    return false;
  }


  getPermissionObserver():BehaviorSubject<string[]> {
    return this.pemObservable;
  }

}

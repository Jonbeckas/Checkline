import { Injectable } from '@angular/core';
import {AuthService, WebResult} from "../../auth/auth.service";
import {Observable} from "rxjs";
import {UserDto} from "../dtos/user.dto";
import {environment} from "../../../environments/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private authService: AuthService,private cookieService: CookieService, private httpService:HttpClient) { }

  getUsers():Observable<UserDto[]> {
    return new Observable<UserDto[]>((observer)=>{
      let token = this.cookieService.get("token");
      let bearer = "Bearer "+token;
      this.httpService.get<UserDto[]>(environment.backendUrl+"/users",{headers:{Authorization:bearer}}).subscribe({
        next: data => {
          observer.next(data)
          observer.complete();
        },
        error: (error:HttpErrorResponse) => {
          if (error.status == 401) {
            if (error.error.err == "Invalid session") {
              this.authService.logout();
            } else {
              console.error(error);
            }
          } else {
            console.error(error);
          }
          observer.complete();
        }
      })
    })
  }

  getUser(username:string):Observable<UserDto> {
    return new Observable<UserDto>((observer)=>{
      let token = this.cookieService.get("token");
      let bearer = "Bearer "+token;
      this.httpService.post<UserDto>(environment.backendUrl+"/user",{username:username},{headers:{Authorization:bearer}}).subscribe({
        next: data => {
          observer.next(data)
          observer.complete();
        },
        error: (error:HttpErrorResponse) => {
          if (error.status == 401) {
            if (error.error.err == "Invalid session") {
              this.authService.logout();
            } else {
              console.error(error);
            }
          } else {
            console.error(error);
          }
          observer.complete();
        }
      })
    })
  }

  deleteUser(username:string) {
    return new Observable<WebResult>((observer)=>{
      let token = this.cookieService.get("token");
      let bearer = "Bearer "+token;
      this.httpService.request("DELETE",environment.backendUrl+"/user",{headers:{Authorization:bearer}, body:{username:username}}).subscribe( {
        next: data => {
          observer.next({success: true,error:""})
          observer.complete();
        },
        error: (error:HttpErrorResponse) => {
          if (error.status == 401) {
            if (error.error.err == "Invalid session") {
              this.authService.logout();
            } else {
              console.error(error);
            }
          } else {
            console.error(error);
          }
          observer.next({success: false,error:"Unknown error!"});
          observer.complete();
        }
      })
    })
  }

  changeUserPassword(username:string,password:string):Observable<WebResult> {
    return new Observable<WebResult>((observer)=>{
      let token = this.cookieService.get("token");
      let bearer = "Bearer "+token;
      this.httpService.post<any>(environment.backendUrl+"/users/changePasswordByAdmin",{username:username,newPassword:password},{headers:{Authorization:bearer}}).subscribe({
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

  addUserToGroup(username:string,groupname:string):Observable<WebResult> {
    return new Observable<WebResult>((observer) => {
      let token = this.cookieService.get("token");
      let bearer = "Bearer " + token;
      this.httpService.post<any>(environment.backendUrl + "/groups/addUserToGroup", {
        username: username,
        groupname: groupname
      }, {headers: {Authorization: bearer}}).subscribe({
        next: data => {
          observer.next({success: true, error: undefined})
          observer.complete();
        },
        error: (error: HttpErrorResponse) => {
          if (error.status == 401) {
            if (error.error.err == "Invalid session") {
              this.authService.logout();
            } else {
              console.error(error);
            }
          }else if (error.status== 404){
            observer.next({success: false, error: "Group not found!"});
          } else if (error.status == 400 && error.error.err == "User is already in group") {
            observer.next({success: false, error: "User is already in this group!"});
          }else {
            observer.next({success: false, error: "Unknown error!"});
            console.error(error);
          }
          observer.complete();
        }
      })
    })
  }

  removeUserFromGroup(username:string,groupname:string):Observable<WebResult> {
    return new Observable<WebResult>((observer)=>{
      let token = this.cookieService.get("token");
      let bearer = "Bearer "+token;
      this.httpService.post<any>(environment.backendUrl+"/groups/removeUserFromGroup",{username:username,groupname:groupname},{headers:{Authorization:bearer}}).subscribe({
        next: data => {
          observer.next({success:true,error:undefined})
          observer.complete();
        },
        error: (error:HttpErrorResponse) => {
          if (error.status == 401) {
            if (error.error.err == "Invalid session") {
              this.authService.logout();
            } else {
              console.error(error);
            }
          } else {
            console.error(error);
          }
          observer.next({success: false,error:"Unknown error!"});
          observer.complete();
        }
      })
    })
  }

  addUser(username:string,firstname:string,name:string,password:string):Observable<WebResult> {
    return new Observable<WebResult>((observer)=>{
      let token = this.cookieService.get("token");
      let bearer = "Bearer "+token;
      this.httpService.put<any>(environment.backendUrl+"/user",{username:username,firstname:firstname,name:name,password:password},{headers:{Authorization:bearer}}).subscribe({
        next: data => {
          observer.next({success:true,error:undefined})
          observer.complete();
        },
        error: (error:HttpErrorResponse) => {
          if (error.status == 401) {
            if (error.error.err == "Invalid session") {
              this.authService.logout();
            } else {
              console.error(error);
              observer.next({success: false,error:"Unknown error!"});
            }
          } else if(error.status == 400 && error.error.err == "Username exists") {
            observer.next({success: false,error:"Another user with that name exists!"});

          } else {
            observer.next({success: false,error:"Unknown error!"});
            console.error(error);
          }
          observer.complete();
        }
      })
    })
  }
}

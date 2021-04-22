import { Injectable } from '@angular/core';
import {AuthService, WebResult} from "../../auth/auth.service";
import {Observable} from "rxjs";
import {UserDto} from "../dtos/user.dto";
import {environment} from "../../../../environments/environment";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {CookieService} from "ngx-cookie-service";
import {GroupDto} from "../dtos/group.dto";

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private authService: AuthService,private cookieService: CookieService, private httpService:HttpClient) { }

  getGroups():Observable<GroupDto[]> {
    return new Observable<GroupDto[]>((observer)=>{
      let token = this.cookieService.get("token");
      let bearer = "Bearer "+token;
      this.httpService.get<GroupDto[]>(environment.backendUrl+"/groups",{headers:{Authorization:bearer}}).subscribe({
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

  getGroup(groupname:string):Observable<GroupDto> {
    return new Observable<GroupDto>((observer)=>{
      let token = this.cookieService.get("token");
      let bearer = "Bearer "+token;
      this.httpService.post<GroupDto>(environment.backendUrl+"/group",{groupname:groupname},{headers:{Authorization:bearer}}).subscribe({
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

  deleteGroup(groupname:string) {
    return new Observable<WebResult>((observer)=>{
      let token = this.cookieService.get("token");
      let bearer = "Bearer "+token;
      this.httpService.request("DELETE",environment.backendUrl+"/group",{headers:{Authorization:bearer}, body:{name:groupname}}).subscribe( {
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

  changeGroupName(groupname:string,newname:string):Observable<WebResult> {
    return new Observable<WebResult>((observer)=>{
      let token = this.cookieService.get("token");
      let bearer = "Bearer "+token;
      this.httpService.post<any>(environment.backendUrl+"/groups/changeName",{groupname:groupname,newgroupname:newname},{headers:{Authorization:bearer}}).subscribe({
        next: data => {
          observer.next({success:true,error:undefined})
          observer.complete();
        },
        error: (error:HttpErrorResponse) => {
          if (error.status == 404) {
            console.warn(error.error.err);
            if (error.error.err == "Group not found") {
              observer.next({success:false,error:"Group not found'"})
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

  addPermissionToGroup(permission:string,groupname:string):Observable<WebResult> {
    return new Observable<WebResult>((observer) => {
      let token = this.cookieService.get("token");
      let bearer = "Bearer " + token;
      this.httpService.put<any>(environment.backendUrl + "/groups/permission", {
        permission: permission,
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
          } else if (error.status == 400 && error.error.err == "The group already has the permission") {
            observer.next({success: false, error: "The group already has this permission"});
          }else {
            observer.next({success: false, error: "Unknown error!"});
            console.error(error);
          }
          observer.complete();
        }
      })
    })
  }

  removePermissionFromGroup(permission:string,groupname:string):Observable<WebResult> {
    return new Observable<WebResult>((observer)=>{
      let token = this.cookieService.get("token");
      let bearer = "Bearer "+token;
      this.httpService.request<any>("DELETE",environment.backendUrl+"/groups/permission",{headers:{Authorization:bearer},body:{permission:permission,groupname:groupname}}).subscribe({
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

  addGroup(groupname:string):Observable<WebResult> {
    return new Observable<WebResult>((observer)=>{
      let token = this.cookieService.get("token");
      let bearer = "Bearer "+token;
      this.httpService.put<any>(environment.backendUrl+"/group",{name:groupname},{headers:{Authorization:bearer}}).subscribe({
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
          } else if(error.status == 400 && error.error.err == "Group exists") {
            observer.next({success: false,error:"Another Group with that name exists!"});

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

import { Injectable } from '@angular/core';
import {AuthService, WebResult} from '../../auth/auth.service';
import {Observable} from 'rxjs';
import {UserDto} from '../dtos/user.dto';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import {GroupDto} from '../dtos/group.dto';
import {ConfigService} from "../../../config/config.service";

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  constructor(private authService: AuthService, private cookieService: CookieService, private httpService: HttpClient) { }

  getGroups(): Observable<GroupDto[]> {
    return new Observable<GroupDto[]>((observer) => {
      const token = this.cookieService.get('token');
      const bearer = 'Bearer ' + token;
      this.httpService.get<GroupDto[]>(ConfigService.settings.backendUrl + '/groups', {headers: {Authorization: bearer}}).subscribe({
        next: data => {
          observer.next(data);
          observer.complete();
        },
        error: (error: HttpErrorResponse) => {
          if (error.status == 401) {
            if (error.error.err == 'Invalid session') {
              this.authService.logout();
            } else {
              console.error(error);
            }
          } else {
            console.error(error);
          }
          observer.complete();
        }
      });
    });
  }

  getGroup(groupname: string): Observable<GroupDto> {
    return new Observable<GroupDto>((observer) => {
      const token = this.cookieService.get('token');
      const bearer = 'Bearer ' + token;
      this.httpService.post<GroupDto>(ConfigService.settings.backendUrl + '/group', {groupname}, {headers: {Authorization: bearer}}).subscribe({
        next: data => {
          observer.next(data);
          observer.complete();
        },
        error: (error: HttpErrorResponse) => {
          if (error.status == 401) {
            if (error.error.err == 'Invalid session') {
              this.authService.logout();
            } else {
              console.error(error);
            }
          } else {
            console.error(error);
          }
          observer.complete();
        }
      });
    });
  }

  deleteGroup(groupname: string) {
    return new Observable<WebResult>((observer) => {
      const token = this.cookieService.get('token');
      const bearer = 'Bearer ' + token;
      this.httpService.request('DELETE', ConfigService.settings.backendUrl + '/group', {headers: {Authorization: bearer}, body: {name: groupname}}).subscribe( {
        next: data => {
          observer.next({success: true, error: ''});
          observer.complete();
        },
        error: (error: HttpErrorResponse) => {
          if (error.status == 401) {
            if (error.error.err == 'Invalid session') {
              this.authService.logout();
            } else {
              console.error(error);
            }
          } else {
            console.error(error);
          }
          observer.next({success: false, error: 'Unknown error!'});
          observer.complete();
        }
      });
    });
  }

  changeGroupName(groupname: string, newname: string): Observable<WebResult> {
    return new Observable<WebResult>((observer) => {
      const token = this.cookieService.get('token');
      const bearer = 'Bearer ' + token;
      this.httpService.post<any>(ConfigService.settings.backendUrl + '/groups/changeName', {groupname, newgroupname: newname}, {headers: {Authorization: bearer}}).subscribe({
        next: data => {
          observer.next({success: true, error: undefined});
          observer.complete();
        },
        error: (error: HttpErrorResponse) => {
          if (error.status == 404) {
            console.warn(error.error.err);
            if (error.error.err == 'GroupNotFound') {
              observer.next({success: false, error: 'Group not found'});
            } else {
              observer.next({success: false, error: 'Unknown Error'});
            }
          } else {
            observer.next({success: false, error: 'Unknown Error'});
          }
          observer.complete();
        }
      });
    });
  }

  addPermissionToGroup(permission: string, groupname: string): Observable<WebResult> {
    return new Observable<WebResult>((observer) => {
      const token = this.cookieService.get('token');
      const bearer = 'Bearer ' + token;
      this.httpService.put<any>(ConfigService.settings.backendUrl + '/groups/permission', {
        permission,
        groupname
      }, {headers: {Authorization: bearer}}).subscribe({
        next: data => {
          observer.next({success: true, error: undefined});
          observer.complete();
        },
        error: (error: HttpErrorResponse) => {
          if (error.status == 401) {
            if (error.error.err == 'Invalid session') {
              this.authService.logout();
            } else {
              console.error(error);
            }
          }else if (error.status == 404){
            observer.next({success: false, error: 'Group not found!'});
          } else if (error.status == 400 && error.error.err == 'The group already has the permission') {
            observer.next({success: false, error: 'The group already has this permission'});
          }else {
            observer.next({success: false, error: 'Unknown error!'});
            console.error(error);
          }
          observer.complete();
        }
      });
    });
  }

  removePermissionFromGroup(permission: string, groupname: string): Observable<WebResult> {
    return new Observable<WebResult>((observer) => {
      const token = this.cookieService.get('token');
      const bearer = 'Bearer ' + token;
      this.httpService.request<any>('DELETE', ConfigService.settings.backendUrl + '/groups/permission', {headers: {Authorization: bearer}, body: {permission, groupname}}).subscribe({
        next: data => {
          observer.next({success: true, error: undefined});
          observer.complete();
        },
        error: (error: HttpErrorResponse) => {
          if (error.status == 401) {
            if (error.error.err == 'Invalid session') {
              this.authService.logout();
            } else {
              console.error(error);
            }
          } else {
            console.error(error);
          }
          observer.next({success: false, error: 'Unknown error!'});
          observer.complete();
        }
      });
    });
  }

  addGroup(groupname: string): Observable<WebResult> {
    return new Observable<WebResult>((observer) => {
      const token = this.cookieService.get('token');
      const bearer = 'Bearer ' + token;
      this.httpService.put<any>(ConfigService.settings.backendUrl + '/group', {name: groupname}, {headers: {Authorization: bearer}}).subscribe({
        next: data => {
          observer.next({success: true, error: undefined});
          observer.complete();
        },
        error: (error: HttpErrorResponse) => {
          if (error.status == 401) {
            if (error.error.err == 'Invalid session') {
              this.authService.logout();
            } else {
              console.error(error);
              observer.next({success: false, error: 'Unknown error!'});
            }
          } else if (error.status == 400 && error.error.err == 'GroupExists') {
            observer.next({success: false, error: 'Another Group with that name exists!'});

          } else {
            observer.next({success: false, error: 'Unknown error!'});
            console.error(error);
          }
          observer.complete();
        }
      });
    });
  }

  exportGroups() {
    // ts-ignore because of unexpected exceptions, that should not happen
    return new Observable<string>((observer) => {
      const token = this.cookieService.get('token');
      const bearer = 'Bearer ' + token;
      this.httpService.get<string>(ConfigService.settings.backendUrl + '/groups/export', {
        // @ts-ignore
        responseType: 'text',
        headers: new HttpHeaders({Authorization: bearer}),
      }).subscribe({
        next: (data) => {
          // @ts-ignore
          observer.next(data);
          observer.complete();
        },
        error: (error: HttpErrorResponse) => {
          console.error(error);
        }
      });
    });
  }

  importGroups(csvContent: string) {
    return new Observable<WebResult>((observer) => {
      const token = this.cookieService.get('token');
      const bearer = 'Bearer ' + token;
      this.httpService.post<any>(ConfigService.settings.backendUrl + '/groups/import', {fileContent: csvContent}, {headers: {Authorization: bearer}}).subscribe({
        next: data => {
          observer.next({success: true, error: undefined});
          observer.complete();
        },
        error: (error: HttpErrorResponse) => {
          observer.next({success: false, error: 'Unknown error!'});
          console.error(error);
          observer.complete();
        }
      });
    });
  }
}

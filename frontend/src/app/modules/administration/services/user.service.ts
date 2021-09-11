import {Injectable} from '@angular/core';
import {AuthService, WebResult} from '../../auth/auth.service';
import {Observable} from 'rxjs';
import {UserDto} from '../dtos/user.dto';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {CookieService} from 'ngx-cookie-service';
import { ConfigService } from 'src/app/config/config.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private authService: AuthService, private cookieService: CookieService, private httpService: HttpClient) {
  }

  getUsers(): Observable<UserDto[]> {
    return new Observable<UserDto[]>((observer) => {
      const token = this.cookieService.get('token');
      const bearer = 'Bearer ' + token;
      this.httpService.get<UserDto[]>(ConfigService.settings.backendUrl + '/users', {headers: {Authorization: bearer}}).subscribe({
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

  getUser(username: string): Observable<UserDto> {
    return new Observable<UserDto>((observer) => {
      const token = this.cookieService.get('token');
      const bearer = 'Bearer ' + token;
      this.httpService.post<UserDto>(ConfigService.settings.backendUrl + '/user', {username}, {headers: {Authorization: bearer}}).subscribe({
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

  deleteUser(username: string) {
    return new Observable<WebResult>((observer) => {
      const token = this.cookieService.get('token');
      const bearer = 'Bearer ' + token;
      this.httpService.request('DELETE', ConfigService.settings.backendUrl + '/user', {
        headers: {Authorization: bearer},
        body: {username}
      }).subscribe({
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

  changeUserPassword(username: string, password: string): Observable<WebResult> {
    return new Observable<WebResult>((observer) => {
      const token = this.cookieService.get('token');
      const bearer = 'Bearer ' + token;
      this.httpService.post<any>(ConfigService.settings.backendUrl + '/users/changePasswordByAdmin', {
        username,
        newPassword: password
      }, {headers: {Authorization: bearer}}).subscribe({
        next: data => {
          observer.next({success: true, error: undefined});
          observer.complete();
        },
        error: (error: HttpErrorResponse) => {
          if (error.status == 400) {
            console.warn(error.error.err);
            if (error.error.err == 'oldPassword is invalid') {
              observer.next({success: false, error: 'Wrong \'old password\''});
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

  addUserToGroup(username: string, groupname: string): Observable<WebResult> {
    return new Observable<WebResult>((observer) => {
      const token = this.cookieService.get('token');
      const bearer = 'Bearer ' + token;
      this.httpService.post<any>(ConfigService.settings.backendUrl + '/groups/addUserToGroup', {
        username,
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
          } else if (error.status == 404) {
            observer.next({success: false, error: 'Group not found!'});
          } else if (error.status == 400 && error.error.err == 'User is already in group') {
            observer.next({success: false, error: 'User is already in this group!'});
          } else {
            observer.next({success: false, error: 'Unknown error!'});
            console.error(error);
          }
          observer.complete();
        }
      });
    });
  }

  removeUserFromGroup(username: string, groupname: string): Observable<WebResult> {
    return new Observable<WebResult>((observer) => {
      const token = this.cookieService.get('token');
      const bearer = 'Bearer ' + token;
      this.httpService.post<any>(ConfigService.settings.backendUrl + '/groups/removeUserFromGroup', {
        username,
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
          } else {
            console.error(error);
          }
          observer.next({success: false, error: 'Unknown error!'});
          observer.complete();
        }
      });
    });
  }

  addUser(username: string, firstname: string, name: string, password: string): Observable<WebResult> {
    return new Observable<WebResult>((observer) => {
      const token = this.cookieService.get('token');
      const bearer = 'Bearer ' + token;
      this.httpService.put<any>(ConfigService.settings.backendUrl + '/user', {
        username,
        firstname,
        name,
        password
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
              observer.next({success: false, error: 'Unknown error!'});
            }
          } else if (error.status == 400 && error.error.err == 'Username exists') {
            observer.next({success: false, error: 'Another user with that name exists!'});

          } else {
            observer.next({success: false, error: 'Unknown error!'});
            console.error(error);
          }
          observer.complete();
        }
      });
    });
  }

  importUsers(csvContent: string) {
    return new Observable<WebResult>((observer) => {
      const token = this.cookieService.get('token');
      const bearer = 'Bearer ' + token;
      this.httpService.post<any>(ConfigService.settings.backendUrl + '/users/import', {fileContent: csvContent}, {headers: {Authorization: bearer}}).subscribe({
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

  exportUsers() {
    // ts-ignore because of unexpected exceptions, that should not happen
    return new Observable<string>((observer) => {
      const token = this.cookieService.get('token');
      const bearer = 'Bearer ' + token;
      this.httpService.get<string>(ConfigService.settings.backendUrl + '/users/export', {
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
}

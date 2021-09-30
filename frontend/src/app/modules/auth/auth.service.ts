import {Injectable, OnDestroy, OnInit} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {CookieService} from 'ngx-cookie-service';
import {BehaviorSubject, Observable, Subscriber} from 'rxjs';
import jwtDecode from 'jwt-decode';
import {Router} from '@angular/router';
import {ConfigService} from "../../config/config.service";



export interface LoginResponse {
  token: string;
}

export interface WebResult {
  success: boolean;
  error: string|undefined;
}

@Injectable({
  providedIn: 'root'
})

export class AuthService{

  // @ts-ignore
  private pemObservable: BehaviorSubject<string[]>;


  constructor(private httpService: HttpClient, private cookieService: CookieService, private router: Router) {
    this.pemObservable = new BehaviorSubject<string[]>([]);
  }

  login(username: string, password: string): Observable<WebResult> {
    return new Observable<WebResult>((observer) => {
      this.httpService.post<LoginResponse>(ConfigService.settings.backendUrl + '/login', {username, password}).subscribe({
        next: data => {
          this.cookieService.set('token', data.token);
          this.pemObservable.next((jwtDecode(data.token) as any).permissions);
          observer.next({success: true, error: undefined});
          observer.complete();
        },
        error: (error: HttpErrorResponse) => {
          if (error.status == 401 && error.error.err == 'Unauthorized') {
            observer.next({success: false, error: 'Wrong Username or password'});
          } else if (error.status == 401 && error.error.err == 'Invalid Permissions') {
            observer.next({success: false, error: 'The user does not have the Permission to log in'});
          } else {
            observer.next({success: false, error: 'Unknown Error'});
          }
          observer.complete();
        }
      });
    });
  }

  logout() {
    this.cookieService.delete('token');
    this.router.navigateByUrl('/login');
    this.pemObservable.next([]);
  }

  getUsername(): string|undefined{
    const token = this.cookieService.get('token');
    if (token) {
      return (jwtDecode(token) as any).username;
    } else {
      return undefined;
    }
  }

  changeUserPassword(oldPassword: string, newPasword: string): Observable<WebResult> {
    return new Observable<WebResult>((observer) => {
      const token = this.cookieService.get('token');
      const bearer = 'Bearer ' + token;
      this.httpService.post<any>(ConfigService.settings.backendUrl + '/users/changePassword', {username: this.getUsername(), oldPassword, newPassword: newPasword}, {headers: {Authorization: bearer}}).subscribe({
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

  hasPermissionOrAdmin(permission: string) {
    const token = this.cookieService.get('token');
    const permissions = (jwtDecode(token) as any).permissions;
    return permissions.includes(permission) || permissions.includes('CENGINE_ADMIN');
  }

  hasPermissionsOrAdmin(permission: string[]) {
    const token = this.cookieService.get('token');
    if (!token) { return false; }
    const permissions = (jwtDecode(token) as any|undefined)?.permissions;
    for (const pem of permission) {
      if (permissions.includes(pem) || permissions.includes('CENGINE_ADMIN')) {
        return true;
      }
    }
    return false;
  }


  getPermissionObserver(): BehaviorSubject<string[]> {
    return this.pemObservable;
  }

  isvalid(): Observable<boolean> {
    return new Observable((subscriber) => {
      const token = this.cookieService.get('token');
      const bearer = 'Bearer ' + token;
      this.httpService.get<LoginResponse>(ConfigService.settings.backendUrl + '/isValid', {headers: {Authorization: bearer}}).subscribe({
        next: (data) => {
          subscriber.next(true);
          subscriber.complete();
        },
        error: (err: HttpErrorResponse) => {
          if (err.status == 401) {
            this.logout();
            this.router.navigateByUrl('/login');
          }
          subscriber.next(false);
          subscriber.complete();
        }
      });
    });
  }

  getUserId(): string {
    const token = this.cookieService.get('token');
    return (jwtDecode(token) as any).userId;
  }

}

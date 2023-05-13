import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, Route, UrlSegment } from '@angular/router';
import {Observable} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {CookieService} from 'ngx-cookie-service';
import {AuthService, LoginResponse} from './auth.service';
import jwtDecode from 'jwt-decode';
import {ConfigService} from "../../config/config.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard  {

  constructor(private httpClient: HttpClient, private cookieService: CookieService, private authService: AuthService, private router: Router) {
  }

  canLoad(route: Route, segments: UrlSegment[]): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
        return this.shouldActivate(route.path!)
    }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return this.shouldActivate(route.url[0].path);
  }

  shouldActivate(route:string): Observable<boolean> {
    return new Observable((observer) => {
      const token = this.cookieService.get('token');
      const bearer = 'Bearer ' + token;
      this.httpClient.get<LoginResponse>(ConfigService.settings.backendUrl + '/isValid', {headers: {Authorization: bearer}}).subscribe({
        next: (data) => {
          this.cookieService.set('token', data.token);
          const permissions = (jwtDecode(token) as any).permissions;
          switch (route) {
            case ('admin'): {
              observer.next(permissions.includes('CENGINE_LISTUSERS') ||
                permissions.includes('CENGINE_LISTGROUPS') ||
                permissions.includes('CENGINE_MODIFYUSERS') ||
                permissions.includes('CENGINE_MODIFYGROUPS') ||
                permissions.includes('CENGINE_ADMIN'));
              break;
            }
            case ('welcome'): {
              observer.next(true);
              break;
            } case ('dashboard'): {
              observer.next(
                permissions.includes('RUNNER_MODIFY') ||
                permissions.includes('RUNNER_LIST') ||
                permissions.includes('CENGINE_ADMIN'));
              break;
            } case ('scanner'): {
              observer.next(
                permissions.includes('RUNNER_MODIFY') ||
                permissions.includes('CENGINE_ADMIN'));
              break;
            } default: {
              observer.next(permissions.includes('CENGINE_ADMIN'));
            }
          }
          observer.complete();
        },
        error: (err: HttpErrorResponse) => {
          if (err.status == 401) {
            this.authService.logout();
            this.router.navigateByUrl('/login');
          }
          observer.next(false);
          observer.complete();
        }
      });
    });
  }

}

import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Runner} from '../dtos/Runner';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from "../../../../environments/environment";
import {CookieService} from "ngx-cookie-service";
import {AuthService, WebResult} from "../../auth/auth.service";
import {WebValueResult} from "../dtos/web-value-result";


@Injectable({
  providedIn: 'root'
})
export class RunnerService {

  constructor(private httpService: HttpClient, private cookieService:CookieService,private authService:AuthService) { }

  getRunners(): Observable<Runner[]> {
      return new Observable<Runner[]>(observer => {
          const token = this.cookieService.get('token');
          const bearer = 'Bearer ' + token;
          this.httpService.get<Runner[]>(environment.backendUrl+"/runners",{headers: {Authorization: bearer}}).subscribe({
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
            }
          )
      });
  }

  getStates(): Observable<WebValueResult> {
    return new Observable<WebValueResult>(observer => {
      const token = this.cookieService.get('token');
      const bearer = 'Bearer ' + token;
      this.httpService.get<string[]>(environment.backendUrl+"/runners/states",{headers: {Authorization: bearer}}).subscribe({
          next: data => {
            observer.next({success:true,value:data});
            observer.complete();
          },
          error: (error: HttpErrorResponse) => {
            if (error.status == 401) {
              if (error.error.err == 'Invalid session') {
                this.authService.logout();
              } else {
                observer.next({success:false,value:"An error occurred"})
                console.error(error);
              }
            } else {
              observer.next({success:false,value:"An error occurred"})
              console.error(error);
            }
            observer.complete();
          }
        }
      )
    });
  }

  setState(username:string,state:string): Observable<WebResult> {
    return new Observable<WebResult>(observer => {
      const token = this.cookieService.get('token');
      const bearer = 'Bearer ' + token;
      this.httpService.post<string[]>(environment.backendUrl+"/runner/state",{username:username,state: state},{headers: {Authorization: bearer}}).subscribe({
          next: data => {
            observer.next({success:true,error:""});
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
              observer.next({success:false,error:"User not found!"})
            } else {
              observer.next({success:false,error:"Unknown error!"})
              console.error(error);
            }
            observer.complete();
          }
        }
      )
    });
  }

  addRound(username:string): Observable<WebResult> {
    return new Observable<WebResult>(observer => {
      const token = this.cookieService.get('token');
      const bearer = 'Bearer ' + token;
      this.httpService.post<WebResult>(environment.backendUrl+"/runners/addRound",{username:username},{headers: {Authorization: bearer}}).subscribe({
          next: data => {
            observer.next({success:true,error:""});
            observer.complete();
          },
          error: (error: HttpErrorResponse) => {
            if (error.status == 401) {
              if (error.error.err == 'Invalid session') {
                this.authService.logout();
              } else {
                observer.next({success:false,error:"An error occurred"})
                console.error(error);
              }
            } else {
              observer.next({success:false,error:"An error occurred"})
              console.error(error);
            }
            observer.complete();
          }
        }
      )
    });
  }

  decreaseRound(username:string): Observable<WebResult> {
    return new Observable<WebResult>(observer => {
      const token = this.cookieService.get('token');
      const bearer = 'Bearer ' + token;
      this.httpService.post<WebResult>(environment.backendUrl+"/runners/decreaseRound",{username:username},{headers: {Authorization: bearer}}).subscribe({
          next: data => {
            observer.next({success:true,error:""});
            observer.complete();
          },
          error: (error: HttpErrorResponse) => {
            if (error.status == 401) {
              if (error.error.err == 'Invalid session') {
                this.authService.logout();
              } else {
                observer.next({success:false,error:"An error occurred"})
                console.error(error);
              }
            } else {
              observer.next({success:false,error:"An error occurred"})
              console.error(error);
            }
            observer.complete();
          }
        }
      )
    });
  }

  qr(username:string): Observable<Blob> {
    return new Observable<Blob>(observer => {
      const token = this.cookieService.get('token');
      const bearer = 'Bearer ' + token;

      this.httpService.post(environment.backendUrl+"/runners/qr",{username:username},{headers: {Authorization: bearer},responseType:'arraybuffer'}).subscribe({
          next: data => {
            observer.next(new Blob([data], {type: 'application/pdf'}));
            observer.complete();
          },
          error: (error: HttpErrorResponse) => {
            if (error.status == 401) {
              if (error.error.err == 'Invalid session') {
                this.authService.logout();
              }
            } else {
              console.error(error);
            }
            observer.complete();
          }
        }
      )
    });
  }
}

import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {Runner} from '../dtos/Runner';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from "../../../../environments/environment";
import {CookieService} from "ngx-cookie-service";
import {AuthService, WebResult} from "../../auth/auth.service";
import {WebValueResult} from "../dtos/web-value-result";
import { ConfigService } from 'src/app/config/config.service';
import { TestBed } from '@angular/core/testing';


@Injectable({
  providedIn: 'root'
})
export class RunnerService {

  constructor(private httpService: HttpClient, private cookieService:CookieService,private authService:AuthService) { }

  getRunners(): Observable<Runner[]> {
      return new Observable<Runner[]>(observer => {
          const token = this.cookieService.get('token');
          const bearer = 'Bearer ' + token;
          this.httpService.get<Runner[]>(ConfigService.settings.backendUrl+"/runners",{headers: {Authorization: bearer}}).subscribe({
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

  getRunner(id:string): Observable<Runner> {
    return new Observable<Runner>(observer => {
      const token = this.cookieService.get('token');
      const bearer = 'Bearer ' + token;
      this.httpService.post<Runner>(ConfigService.settings.backendUrl+"/runner",{id:id},{headers: {Authorization: bearer}}).subscribe({
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
            }  else {
              console.error(error);
            }
            observer.complete();
          }
        }
      )
    });
  }

  getSelfRunner(): Observable<Runner> {
    return new Observable<Runner>(observer => {
      const token = this.cookieService.get('token');
      const bearer = 'Bearer ' + token;
      this.httpService.post<Runner>(ConfigService.settings.backendUrl+"/selfrunner",{},{headers: {Authorization: bearer}}).subscribe({
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
            }  else {
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
      this.httpService.get<string[]>(ConfigService.settings.backendUrl+"/runners/states",{headers: {Authorization: bearer}}).subscribe({
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

  setState(id:string,state:string): Observable<WebResult> {
    return new Observable<WebResult>(observer => {
      const token = this.cookieService.get('token');
      const bearer = 'Bearer ' + token;
      this.httpService.post<string[]>(ConfigService.settings.backendUrl+"/runner/state",{id:id,state: state},{headers: {Authorization: bearer}}).subscribe({
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

  addRound(id:string): Observable<WebResult> {
    return new Observable<WebResult>(observer => {
      const token = this.cookieService.get('token');
      const bearer = 'Bearer ' + token;
      this.httpService.post<WebResult>(ConfigService.settings.backendUrl+"/runners/addRound",{id:id},{headers: {Authorization: bearer}}).subscribe({
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
            } else if (error.status == 404) {
              if (error.error.err == "User has no defined state") {
                observer.next({success:false,error:"The user has no defined state"})
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

  decreaseRound(id:string): Observable<WebResult> {
    return new Observable<WebResult>(observer => {
      const token = this.cookieService.get('token');
      const bearer = 'Bearer ' + token;
      this.httpService.post<WebResult>(ConfigService.settings.backendUrl+"/runners/decreaseRound",{id:id},{headers: {Authorization: bearer}}).subscribe({
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

  qr(id:string): Observable<Blob> {
    return new Observable<Blob>(observer => {
      const token = this.cookieService.get('token');
      const bearer = 'Bearer ' + token;

      this.httpService.post(ConfigService.settings.backendUrl+"/runners/qr",{id:id},{headers: {Authorization: bearer}}).subscribe({
          next: data => {
            let url = "data:application/pdf;base64,"+(<any>data).data;
            fetch(url)
            .then(res => {
              res.blob().then(blob => {
                observer.next(blob);
                observer.complete();
              })
            })
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

  getStations(): Observable<string[]> {
    const token = this.cookieService.get('token');
    const bearer = 'Bearer ' + token;

    return this.httpService.get<string[]>(ConfigService.settings.backendUrl+"/runners/stations",{headers: {Authorization: bearer}});
  }

  setStation(id:string, station: string) {
    const token = this.cookieService.get('token');
    const bearer = 'Bearer ' + token;

    return this.httpService.post(ConfigService.settings.backendUrl+"/runners/station",{id:id, station:station},{headers: {Authorization: bearer}});
  }
}
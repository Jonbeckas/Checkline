import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Observable } from "rxjs";
import { Runner } from "../../runners/dtos/Runner";
import { ConfigService } from "src/app/config/config.service";
import { AuthService } from "../../auth/auth.service";

@Injectable({providedIn: 'root'})
export class RunnerConspicousService {
    constructor(private httpService: HttpClient, private cookieService: CookieService, private authService: AuthService) {

    }

    getRunners(): Observable<Runner[]> {
      return new Observable<Runner[]>(observer => {
          const token = this.cookieService.get('token');
          const bearer = 'Bearer ' + token;
          this.httpService.get<Runner[]>(ConfigService.settings.backendUrl+"/runners/conspicous",{headers: {Authorization: bearer}}).subscribe({
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
}
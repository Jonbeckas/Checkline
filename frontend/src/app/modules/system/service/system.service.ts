import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CookieService } from "ngx-cookie-service";
import { Observable } from "rxjs";
import { ConfigService } from "src/app/config/config.service";

@Injectable({ providedIn: 'root' })
export class SystemService {

    constructor(private httpService: HttpClient, private cookieService: CookieService) {}

    exportLogs() {
        // ts-ignore because of unexpected exceptions, that should not happen
        return new Observable<string>((observer) => {
            const token = this.cookieService.get('token');
            const bearer = 'Bearer ' + token;
            this.httpService.get<string>(ConfigService.settings.backendUrl + '/system/logs/export', {
                // @ts-ignore
                responseType: 'text',
                headers: { Authorization: bearer },
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
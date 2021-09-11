import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {ConfigDto} from "./config.dto";

@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  static settings: ConfigDto
  constructor(private httpService: HttpClient) { }

  load() {
    const jsonFile = `assets/config/config-${environment.name}.json`;
    return new Promise<void>((resolve, reject) => {
      this.httpService.get<ConfigDto>(jsonFile).toPromise().then((response : ConfigDto) => {
        ConfigService.settings = response;
        resolve();
      }).catch((response: any) => {
        reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
      });
    });
  }
}

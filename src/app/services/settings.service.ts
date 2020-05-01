import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  apiBaseUrl = environment.apiUrl;
  authUrl = environment.authUrl;
  logoutUrl = environment.logoutUrl;

  constructor() { }

}

import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  apiBaseUrl = 'http://api.app.eloprindelse.dk';
  authUrl = this.apiBaseUrl + '/auth/login';

  constructor() { }

}

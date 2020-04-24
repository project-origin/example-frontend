import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  apiBaseUrl = 'http://localhost:8081';
  authUrl = this.apiBaseUrl + '/auth/login';

  constructor() { }

}

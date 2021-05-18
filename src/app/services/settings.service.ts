import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import * as moment from 'moment';


@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  apiBaseUrl = environment.apiUrl;
  authUrl = environment.authUrl;
  logoutUrl = environment.logoutUrl;
  editProfileUrl = environment.apiUrl + '/auth/edit-profile';
  editClientsUrl = environment.apiUrl + '/auth/edit-clients';
  disableUserUrl = environment.apiUrl + '/auth/disable-user';


  minDate: Date = moment('2019-01-01').toDate();
  maxDate: Date = moment('2021-12-31').toDate();

}

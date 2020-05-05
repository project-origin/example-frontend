import { Injectable, Output } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { User } from './models';
import { SettingsService } from '../settings.service';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private TOKEN_COOKIE_NAME: string = 'SID';
  private _user: User = null;


  constructor(
    private cookieService: CookieService,
    private settings: SettingsService,
  ) {}


  get token() : string {
    return this.cookieService.get(this.TOKEN_COOKIE_NAME);
  }

  get user() : User {
    return this._user;
  }

//   get user() : User {
// //     let mockUser = new User();
// //     mockUser.id = '123';
// //     mockUser.name = 'MOCK USER NAME';
// //     return mockUser;
//     return this.user;
//   }

  isAuthenticated() : boolean {
    return this.token !== null && this.user !== null;
  }

  register(user: User) {
    if(this.user) {
      throw new Error('Can not login when current used is already defined');
    }
    this._user = user;
  }

  unregister() {
    this._user = null;
    this.cookieService.delete(this.TOKEN_COOKIE_NAME, '/', '.' + window.location.hostname); 
    location.replace(this.settings.logoutUrl);
  }

  login() {
    location.replace(this.settings.authUrl + '?returnUrl=' + window.location.href);
  }
}

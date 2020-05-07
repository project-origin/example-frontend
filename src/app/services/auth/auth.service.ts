import { Injectable, Output, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { User } from './models';
import { SettingsService } from '../settings.service';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authenticated = new BehaviorSubject<boolean>(false);

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

  isAuthenticated() : Observable<boolean> {
    return this.authenticated.asObservable();
  }

  register(user: User) {
    if(this.user) {
      throw new Error('Can not login when current used is already defined');
    }
    this._user = user;
    this.authenticated.next(true);
  }

  unregister() {
    this._user = null;
    this.cookieService.delete(this.TOKEN_COOKIE_NAME, '/', '.' + window.location.hostname); 
    location.href = this.settings.logoutUrl;
  }

  login() {
    location.replace(this.settings.authUrl + '?returnUrl=' + window.location.href);
  }
}

import { Injectable, EventEmitter, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { Type } from "class-transformer";
import { ApiService, ApiResponse } from '../api.service';
import { User } from './models';



export class GetProfileResponse extends ApiResponse {
  @Type(() => User)
  user: User;
}


export class GetOnboardingUrlResponse extends ApiResponse {
  url: string;
}


export class AutocompleteUsersResponse extends ApiResponse {
  @Type(() => User)
  users: User[];
}


// -- Service ------------------------------------------------------------- //

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private api: ApiService) {}


  getProfile() : Observable<GetProfileResponse> {
    return this.api.invoke('/users/profile', GetProfileResponse);
  }


  getOnboardingUrl() : Observable<GetOnboardingUrlResponse> {
    return this.api.invoke('/auth/get-onboarding-url', GetOnboardingUrlResponse);
  }


  autocompleteUsers(query: string) : Observable<AutocompleteUsersResponse> {
    return this.api.invoke('/users/autocomplete', AutocompleteUsersResponse, {
      query: query,
    });
  }
}

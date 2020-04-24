import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { plainToClass, Type, classToPlain } from "class-transformer";

import { SettingsService } from './settings.service';
import { Observable } from 'rxjs';
import { AuthService } from './auth/auth.service';


export class ApiResponse {
  success: boolean = false;
  message: string = null;
  errors: {} = {};
}



@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(
    private http: HttpClient,
    private settings: SettingsService,
    private authService: AuthService) { }


  invoke<TResponse extends ApiResponse>(
    path: String,
    responseType: {new(): TResponse},
    body?: {}
  ) : Observable<TResponse> {

    let absoluteUrl = this.settings.apiBaseUrl + path;
    let token = this.authService.token;
    let options = {};

    if(token) {
      options['headers'] = { 'Authorization': token };
    }

    return Observable.create((observer) => {
      let deserialize = (data: {}) => {
        return plainToClass(responseType, data);
      };

      let onComplete = (data: {}) => {
        observer.next(deserialize(data));
      };

      let onError = (data: {}) => {
        if(data['status'] == 0) {
          // Connection error
          observer.next(deserialize({'success': false, 'message': data['message']}));
        } else if(data['status'] == 500) {
          // Do not expect JSON output
          // TODO observer.next()
          let response = new ApiResponse();
          response.success = false;
          response.message = data['error'];
          observer.next(response);
        } else {
          // Expect the response body to be JSON
          observer.next(deserialize(data['error']));
        }
      };

      this.http
        .post(absoluteUrl, classToPlain(body), options)
        .subscribe(onComplete, onError);
    });
  }
}

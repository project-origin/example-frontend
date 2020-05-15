import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { plainToClass, Type, classToPlain } from "class-transformer";

import { SettingsService } from './settings.service';
import { Observable } from 'rxjs';
import { AuthService } from './auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorPopupComponent } from '../pages/errors/error-popup/error-popup.component';


export class ApiResponse {
  success: boolean = false;
  message: string = null;
  errors: {} = {};
}



@Injectable({
  providedIn: 'root'
})
export class ApiService {

  errorDialogVisible: boolean = false;



  constructor(
    private dialog: MatDialog,
    private http: HttpClient,
    private settings: SettingsService,
    private authService: AuthService,
  ) { }


  post(path: String, body: any, options: any = {}) : Observable<Object> {
    let absoluteUrl = this.settings.apiBaseUrl + path;
    let token = this.authService.token;
    // let options2 = {
    //   responseType: 'arraybuffer'
    // };

    if(token) {
      options['headers'] = { 'Authorization': token };
    }

    return this.http.post(absoluteUrl, classToPlain(body), options);
  }


  invoke<TResponse extends ApiResponse>(
    path: String,
    responseType: {new(): TResponse},
    body?: {}
  ) : Observable<TResponse> {

    return Observable.create((observer) => {
      let deserialize = (data: {}) => {
        return plainToClass(responseType, data);
      };

      let onComplete = (data: {}) => {
        observer.next(deserialize(data));
      };

      let onError = (data: {}) => {
        console.log('onError', data['status'], data);
        if(data['status'] == 0) {
          // Connection error
          observer.next(deserialize({'success': false, 'message': data['message']}));
        } else if(data['status'] == 401) {
          this.authService.unregister();
        } else if(data['status'] == 500) {
          // Do not expect JSON output
          this.showErrorPopup();
          let response = new ApiResponse();
          response.success = false;
          response.message = data['error'];
          observer.next(response);
        } else {
          // Expect the response body to be JSON
          observer.next(deserialize(data['error']));
        }
      };

      this.post(path, body)
        .subscribe(onComplete, onError)
    });
  }


  downloadFile(path: String, filename: string, body?: {}) {
    this.post(path, body, { responseType: 'arraybuffer' })
      .subscribe((response: any) =>{
          let dataType = response.type;
          let binaryData = [];
          binaryData.push(response);
          let downloadLink = document.createElement('a');
          downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
          downloadLink.setAttribute('download', filename);
          document.body.appendChild(downloadLink);
          downloadLink.click();
      }
    )
  }


  showErrorPopup() {
    if(!this.errorDialogVisible) {
      this.dialog
        .open(ErrorPopupComponent, { 
          width: '560px',
          panelClass: 'dialog'
        })
        .afterClosed()
        .subscribe(() => {
          this.errorDialogVisible = false;
        });
  
      this.errorDialogVisible = true;
    }
  }
}

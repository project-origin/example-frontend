import { Injectable } from '@angular/core';
import { ApiService, ApiResponse } from './api.service';
import { Observable } from 'rxjs';


export class SubmitSupportEnquiryRequest {
  email: string;
  phone: string;
  subject: string;
  message: string;

  constructor(args: {
    email: string,
    phone: string,
    subject: string,
    message: string,
  }) {
    Object.assign(this, args);
  }
}


export class SubmitSupportEnquiryResponse extends ApiResponse {}


@Injectable({
  providedIn: 'root'
})
export class SupportService {

  constructor(private api: ApiService) {}


  submitSupportEnquiry(request: SubmitSupportEnquiryRequest) : Observable<SubmitSupportEnquiryResponse> {
    return this.api.invoke('/support/submit-support-enquiry', SubmitSupportEnquiryResponse, request);
  }
}

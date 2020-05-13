import { Component, OnInit } from '@angular/core';
import { SupportService, SubmitSupportEnquiryRequest, SubmitSupportEnquiryResponse } from 'src/app/services/support.service';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';


@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent implements OnInit {


  loading: boolean = false;
  submitted: boolean = false;
  error: boolean = false;

  form: FormGroup = new FormGroup({
    email: new FormControl(),
    phone: new FormControl(),
    subject: new FormControl(),
    message: new FormControl(),
  });


  constructor(
    private authService: AuthService,
    private supportService: SupportService,
  ) { }


  ngOnInit() {
    this.form.patchValue({
      email: this.authService.user.email,
      phone: this.authService.user.phone,
    });
  }


  submit() {
    let request = new SubmitSupportEnquiryRequest({
      email: this.form.get('email').value,
      phone: this.form.get('phone').value,
      subject: this.form.get('subject').value,
      message: this.form.get('message').value,
    });

    this.loading = true;
    this.supportService
        .submitSupportEnquiry(request)
        .subscribe(this.onSubmitComplete.bind(this));
  }


  onSubmitComplete(response: SubmitSupportEnquiryResponse) {
    this.loading = false;
    this.submitted = response.success;
    this.error = !response.success;
  }

}

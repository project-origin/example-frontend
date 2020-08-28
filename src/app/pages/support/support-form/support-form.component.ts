import { Component, OnInit, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SupportService, SubmitSupportEnquiryRequest, SubmitSupportEnquiryResponse } from 'src/app/services/support.service';


@Component({
  selector: 'app-support-form',
  templateUrl: './support-form.component.html',
  styleUrls: ['./support-form.component.css']
})
export class SupportFormComponent implements OnInit {


  @Input() defaultSubject: string = 'Spørgsmål';


  subjectTypes = [
    {value: 'Spørgsmål', label: ''},
    {value: 'Ændringsønske', label: ''},
    {value: 'Fejl', label: ''},
    {value: 'Feedback', label: ''},
  ];


  translateSubscription: Subscription;


  loading: boolean = false;
  submitted: boolean = false;
  errors: any = null;

  form: FormGroup = new FormGroup({
    email: new FormControl(),
    phone: new FormControl(),
    subject: new FormControl(),
    subjectType: new FormControl(),
    message: new FormControl(),
    fileName: new FormControl(),
    file: new FormControl(),
    recipe: new FormControl(),
  });



  constructor(
    private translate: TranslateService,
    private authService: AuthService,
    private supportService: SupportService,
  ) { }


  ngOnInit() {
    this.translate.get('SUPPORT.ENQUIRY-TYPES.QUESTION').subscribe((s: string) => {
      this.subjectTypes[0].label = s;
    });
    this.translate.get('SUPPORT.ENQUIRY-TYPES.FEATURE-REQUEST').subscribe((s: string) => {
      this.subjectTypes[1].label = s;
    });
    this.translate.get('SUPPORT.ENQUIRY-TYPES.BUG').subscribe((s: string) => {
      this.subjectTypes[2].label = s;
    });
    this.translate.get('SUPPORT.ENQUIRY-TYPES.FEEDBACK').subscribe((s: string) => {
      this.subjectTypes[3].label = s;
    });

    this.form.patchValue({
      subjectType: this.defaultSubject,
      email: this.authService.user.email,
      phone: this.authService.user.phone,
      recipe: true,
    });
  }


  onFileChange(event) {
    if (event.target.files.length > 0) {
      this.form.patchValue({ file: event.target.files[0] });
    }
  }


  submit() {
    let fileSource = null;

    const submitToApi = () => {
      let request = new SubmitSupportEnquiryRequest({
        email: this.form.get('email').value,
        phone: this.form.get('phone').value,
        subject: this.form.get('subject').value,
        subjectType: this.form.get('subjectType').value,
        message: this.form.get('message').value,
        link: window.location.href,
        recipe: this.form.get('recipe').value,
        fileName: this.form.get('fileName').value,
        fileSource: fileSource,
      });
  
      this.loading = true;
      this.supportService
          .submitSupportEnquiry(request)
          .subscribe(this.onSubmitComplete.bind(this));
    }

    if(this.form.get('file').value) {
      const reader = new FileReader();
      reader.readAsDataURL(this.form.get('file').value);
      reader.onerror = error => console.log('ERROR', error);
      reader.onload = () => {
        fileSource = reader.result;
        submitToApi();
      };
    } else {
      submitToApi()
    }
  }


  onSubmitComplete(response: SubmitSupportEnquiryResponse) {
    this.loading = false;
    this.submitted = response.success;
    if(response.success) {
      this.errors = null;
    } else {
      this.errors = response.errors;
    }
  }

}

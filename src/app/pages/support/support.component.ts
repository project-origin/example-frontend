import { Component, OnInit, OnDestroy } from '@angular/core';
import { SupportService, SubmitSupportEnquiryRequest, SubmitSupportEnquiryResponse } from 'src/app/services/support.service';
import { FormGroup, FormControl } from '@angular/forms';
import { AuthService } from 'src/app/services/auth/auth.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent implements OnInit {

  // subjectTypes = [
  //   {value: 'Spørgsmål', label: 'Question'},
  //   {value: 'Ændringsønske', label: 'Feature request'},
  //   {value: 'Fejl', label: 'Bug or error'},
  // ];
  subjectTypes = [
    {value: 'Spørgsmål', label: ''},
    {value: 'Ændringsønske', label: ''},
    {value: 'Fejl', label: ''},
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

    this.form.patchValue({
      subjectType: 'Spørgsmål',
      email: this.authService.user.email,
      phone: this.authService.user.phone,
      recipe: true,
    });
  }


  onLanguageChanged(event: LangChangeEvent) {

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

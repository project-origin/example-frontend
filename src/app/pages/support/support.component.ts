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

  subjectTypes = [
    {value: 'Spørgsmål', label: 'Question'},
    {value: 'Ændringsønske', label: 'Feature request'},
    {value: 'Fejl', label: 'Bug or error'},
  ];


  loading: boolean = false;
  submitted: boolean = false;
  error: boolean = false;

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
    private authService: AuthService,
    private supportService: SupportService,
  ) { }


  ngOnInit() {
    this.form.patchValue({
      subjectType: 'Spørgsmål',
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
    this.error = !response.success;
  }

}

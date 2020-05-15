import { Component } from '@angular/core';
import { UserService, GetOnboardingUrlResponse } from 'src/app/services/auth/user.service';


@Component({
  selector: 'app-onboarding-dialog',
  templateUrl: './onboarding-dialog.component.html',
  styleUrls: ['./onboarding-dialog.component.css']
})
export class OnboardingDialogComponent {


  constructor(private userService: UserService) { }


  startOnboarding() {
    this.userService
      .getOnboardingUrl()
      .subscribe(this.onGetOnboardingUrlComplete.bind(this));
  }

  onGetOnboardingUrlComplete(response: GetOnboardingUrlResponse) {
    if(response.success) {
      location.href = response.url;
    }
  }

}

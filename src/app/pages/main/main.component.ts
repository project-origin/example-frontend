import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService, GetOnboardingUrlResponse } from '../../services/auth/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { FeedbackDialogComponent } from '../support/feedback-dialog/feedback-dialog.component';


@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {

  loading: boolean = false;

  isAuthenticated: boolean = false;


  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    private authService: AuthService,
  ) {
    this.authService
        .isAuthenticated()
        .subscribe(this.onAuthenticationStatusChanged.bind(this))
  }


  onAuthenticationStatusChanged(isAuthenticated: boolean) {
    this.isAuthenticated = isAuthenticated;
  }


  get showOnboardingMessage() : boolean {
    return !this.authService.user.hasPerformedOnboarding;
  }


  startOnboarding() {
    this.loading = true;
    this.userService
      .getOnboardingUrl()
      .subscribe(this.onGetOnboardingUrlComplete.bind(this));
  }

  onGetOnboardingUrlComplete(response: GetOnboardingUrlResponse) {
    this.loading = false;
    if(response.success) {
      location.replace(response.url);
    }
  }

  openFeedbackDialog() {
    this.dialog.open(FeedbackDialogComponent, { 
      width: '800px',
      panelClass: 'dialog',
      maxHeight: '90vh',
    });
  }

}

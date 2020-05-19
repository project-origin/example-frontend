import { Component, OnInit } from '@angular/core';
import { UserService, GetProfileResponse } from '../../services/auth/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { OnboardingDialogComponent } from '../main/onboarding-dialog/onboarding-dialog.component';
import { ActivatedRoute, ParamMap } from '@angular/router';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  loading : boolean = false;
  error : boolean = false;

  showLoginButton : boolean = false;
  showRedirecting : boolean = false;
  showGettingProfile : boolean = false;
  showOnboarding : boolean = false;


  constructor(
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private userService: UserService,
    private authService: AuthService,
  ) { }


  ngOnInit() {
    if(this.authService.token) {
      this.showGettingProfile = true;
      this.getProfile();
    } else {
      this.showLoginButton = true;
    }

    this.route.queryParamMap.subscribe((params: ParamMap) => {
      if(params.get('autoLogin') == '1') {
        this.login();
      }
    });
  }


  login() {
    this.showRedirecting = true;
    this.showLoginButton= false;
    this.authService.login();
  }

  // -- Get user profile -----------------------------------------------------

  getProfile() {
    this.loading = true;
    this.userService
      .getProfile()
      .subscribe(this.onGetProfileComplete.bind(this));
  }

  onGetProfileComplete(response: GetProfileResponse) {
    this.loading = false;
    if(response.success) {
      this.authService.register(response.user);
      
      if(!response.user.hasPerformedOnboarding) {
        this.openOnboardingDialog();
      }
    } else {
      this.showGettingProfile = false;
      this.showLoginButton = true;
    }
  }


  openOnboardingDialog() {
    this.dialog.open(OnboardingDialogComponent, { 
      width: '560px',
      panelClass: 'dialog',
    });
  }

}

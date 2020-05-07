import { Component, OnInit } from '@angular/core';
import { UserService, GetProfileResponse } from '../../services/auth/user.service';
import { AuthService } from '../../services/auth/auth.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  loading : boolean = false;
  error : boolean = false;

  showLoginButton : boolean = false;
  showGettingProfile : boolean = false;
  showOnboarding : boolean = false;


  constructor(
    private router: Router,
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
  }

  login() {
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
    } else {
      this.showGettingProfile = false;
      this.showLoginButton = true;
    }
  }

}

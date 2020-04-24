import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

//   authenticated: boolean = false;
//   subscription: Subscription;


  constructor(private authService: AuthService) {}


  ngOnInit() {
//     this.authenticated = this.userService.isAuthenticated();
//     this.subscription = this.userService.status.subscribe(
//       this.onLoginStatusChanges.bind(this));
  }

  get authenticated() : boolean {
    return this.authService.isAuthenticated();
  }

  ngOnDestroy() {
//     this.subscription.unsubscribe();
  }

//   onLoginStatusChanges(authenticated: boolean) {
//     this.authenticated = authenticated;
//   }
}

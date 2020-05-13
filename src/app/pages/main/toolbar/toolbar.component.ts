import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from 'src/app/services/auth/models';
import { AgreementService, CountPendingProposalsResponse } from 'src/app/services/agreements/agreement.service';
import { SettingsService } from 'src/app/services/settings.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit, OnDestroy {


  pendingProposals: number = 0;
  pendingProposalsTimer: number;
  pendingProposalsInterval: number = 30000;


  constructor(
    private settings: SettingsService,
    private router: Router,
    private authService: AuthService,
    private agreementService: AgreementService,
  ) { }


  ngOnInit() {
    this.countPendingProposalt();

    this.pendingProposalsTimer = window.setInterval(
      this.countPendingProposalt.bind(this),
      this.pendingProposalsInterval,
    );
  }

  ngOnDestroy() {
    window.clearInterval(this.pendingProposalsTimer);
  }


  countPendingProposalt() {
    this.agreementService
        .countPendingProposalt()
        .subscribe(this.onCountPendingProposalt.bind(this));
  }

  onCountPendingProposalt(response: CountPendingProposalsResponse) {
    if(response.success) {
      this.pendingProposals = response.count;
    }
  }



  get user() : User {
    return this.authService.user;
  }


  hasPendingProposals() : boolean {
    return this.pendingProposals > 0;
  }

  editProfil() {
    location.href = this.settings.apiBaseUrl + '/auth/edit-profile';
  }

  logOut() {
    this.authService.unregister();
  }


  isDashboard() : boolean {
    return this.router.url.startsWith('/app/dashboard');
  }

  isCommodities() : boolean {
    return this.router.url.startsWith('/app/commodities');
  }

  isTransfer() : boolean {
    return this.router.url.startsWith('/app/transfer');
  }

  isRetire() : boolean {
    return this.router.url.startsWith('/app/retire');
  }

  isFacilities() : boolean {
    return this.router.url.startsWith('/app/facilities');
  }

  isDisclosure() : boolean {
    return this.router.url.startsWith('/app/disclosure');
  }

  isSupport() : boolean {
    return this.router.url.startsWith('/app/support');
  }

}

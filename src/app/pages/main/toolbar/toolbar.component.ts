import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from 'src/app/services/auth/auth.service';
import { User } from 'src/app/services/auth/models';
import { AgreementService, CountPendingProposalsResponse } from 'src/app/services/agreements/agreement.service';

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
    private dialog: MatDialog,
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

  // get pendingProposals() : number {
  //   return this.agreementService.pendingProposals;
  // }

  hasPendingProposals() : boolean {
    return this.pendingProposals > 0;
  }

  editProfil() {
    // this.dialog.open(EditProfileComponent, { width: '500px' });
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

}

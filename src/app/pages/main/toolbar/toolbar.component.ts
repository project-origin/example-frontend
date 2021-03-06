import { Component, OnInit, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { SettingsService } from 'src/app/services/settings.service';
import { User } from 'src/app/services/auth/models';
import { AgreementService, CountPendingProposalsResponse } from 'src/app/services/agreements/agreement.service';
import { AccountDetailsDialogComponent } from 'src/app/pages/account/account-details-dialog/account-details-dialog.component';
import { UserService } from 'src/app/services/auth/user.service';



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
    private translate: TranslateService,
    private dialog: MatDialog,
    private settings: SettingsService,
    private router: Router,
    private userService: UserService,
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


  showAccountDetails() {
    this.dialog.open(AccountDetailsDialogComponent, {
      width: '560px',
      panelClass: 'dialog',
    });
  }



  get user() : User {
    return this.authService.user;
  }


  hasPendingProposals() : boolean {
    return this.pendingProposals > 0;
  }

  editProfil() {
    location.href = this.settings.editProfileUrl;
  }

  editClients() {
    location.href = this.settings.editClientsUrl;
  }

  disableUser() {
    location.href = this.settings.disableUserUrl;
  }

  logOut() {
    this.authService.unregister();
  }


  get isDashboard() : boolean {
    return this.router.url.startsWith('/app/dashboard');
  }

  get isGgos() : boolean {
    return this.isGgoOverview
      || this.isProductionConsumption
      || this.isRetire
      || this.isDisclosure
      || this.isForecast;
  }

  get isGgoOverview() : boolean {
    return this.router.url.startsWith('/app/ggo-overview');
  }

  get isProductionConsumption() : boolean {
    return this.router.url.startsWith('/app/commodities');
  }

  get isEmissions() : boolean {
    return this.router.url.startsWith('/app/emissions');
  }

  get isTransfer() : boolean {
    return this.router.url.startsWith('/app/transfer');
  }

  get isRetire() : boolean {
    return this.router.url.startsWith('/app/retire');
  }

  get isFacilities() : boolean {
    return this.router.url.startsWith('/app/facilities');
  }

  get isDisclosure() : boolean {
    return this.router.url.startsWith('/app/disclosure');
  }

  get isForecast() : boolean {
    return this.router.url.startsWith('/app/forecast');
  }

  get isSupport() : boolean {
    return this.router.url.startsWith('/app/support');
  }


  // Translation -------------------------------------------------------------


  get currentLang() : string {
    return this.translate.currentLang;
  }


  get isEnglish() : boolean {
    return this.currentLang == 'en';
  }


  get isDanish() : boolean {
    return this.currentLang == 'da';
  }


  changeLanguage(lang: string) {
    this.translate.use(lang);
  }

}

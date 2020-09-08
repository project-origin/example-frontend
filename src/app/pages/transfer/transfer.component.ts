import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { Agreement } from 'src/app/services/agreements/models';
import { AgreementService, GetAgreementsResponse, SetTransferPriorityResponse } from 'src/app/services/agreements/agreement.service';
import { ShowProposedAgreementComponent } from './show-proposed-agreement/show-proposed-agreement.component';
import { ResponseToProposedAgreementComponent } from './response-to-proposed-agreement/response-to-proposed-agreement.component';


@Component({
  selector: 'app-transfer',
  templateUrl: './transfer.component.html',
  styleUrls: ['./transfer.component.css']
})
export class TransferComponent implements OnInit {


  // Agreements
  pending: Agreement[] = [];
  sent: Agreement[] = [];
  outbound: Agreement[] = [];
  inbound: Agreement[] = [];
  cancelled: Agreement[] = [];
  declined: Agreement[] = [];

  // Loading state
  loading: boolean = false;
  error: boolean = false;


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private agreementService: AgreementService,
  ) { }


  ngOnInit(): void {
    this.loadAgreements();
  }


  // -- Load agreements ------------------------------------------------------


  loadAgreements() {
    this.loading = true;
    this.agreementService
        .getAgreements()
        .subscribe(this.onLoadAgreements.bind(this));
  }


  onLoadAgreements(response: GetAgreementsResponse) {
    this.loading = false;
    this.error = !response.success;

    if(response.success) {
      this.pending = response.pending;
      this.sent = response.sent;
      this.inbound = response.inbound;
      this.outbound = response.outbound;
      this.cancelled = response.cancelled;
      this.declined = response.declined;
    }
  }


  // -- Agreement clicked ---------------------------------------------------


  onClickReceivedProposal(agreement: Agreement) {
    this.dialog
      .open(ResponseToProposedAgreementComponent, { 
        width: '560px',
        maxHeight: '90vh',
        panelClass: 'dialog',
        data: { agreement: agreement },
      })
      .beforeClosed()
      .subscribe(this.loadAgreements.bind(this));
  }


  onClickSentProposal(agreement: Agreement) {
    this.dialog
      .open(ShowProposedAgreementComponent, {
        width: '560px',
        maxHeight: '90vh',
        panelClass: 'dialog',
        data: { agreement: agreement },
      })
      .beforeClosed()
      .subscribe(this.loadAgreements.bind(this));
  }


  onClickAgreement(agreement: Agreement) {
    this.router.navigate([agreement.id], { relativeTo: this.route });
  }


  // -- Prioritizing outbound agreements -------------------------------------


  onOutboundAgreementsPrioritiesChanged(agreements: Agreement[]) {
    let request = {
      idsPrioritized: agreements.map((agreement: Agreement) => agreement.id),
    };

    this.agreementService
        .setTransferPriority(request)
        .subscribe(this.onSubmitPrioritiesComplete.bind(this));
  }


  onSubmitPrioritiesComplete(response: SetTransferPriorityResponse) { }

}

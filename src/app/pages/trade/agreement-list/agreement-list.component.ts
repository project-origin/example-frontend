import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Agreement } from 'src/app/services/agreements/models';
import { Facility } from 'src/app/services/facilities/models';
import { CreateAgreementComponent, CreateProposalPopupType } from '../create-agreement/create-agreement.component';
import { AgreementService, GetAgreementsResponse } from 'src/app/services/agreements/agreement.service';
import { ViewSentProposalComponent } from '../view-sent-proposal/view-sent-proposal.component';
import { ViewReceivedProposalComponent } from '../view-received-proposal/view-received-proposal.component';


@Component({
  selector: 'app-agreement-list',
  templateUrl: './agreement-list.component.html',
  styleUrls: ['./agreement-list.component.css']
})
export class AgreementListComponent implements OnInit {
  
  @Input() selectedAgreementId: string;

  search: string = '';
  pending: Agreement[] = [];
  sent: Agreement[] = [];
  outbound: Agreement[] = [];
  inbound: Agreement[] = [];

  // Loading state
  loading: boolean = false;
  error: boolean = false;


  constructor(
    private router: Router,
    private dialog: MatDialog,
    private agreementService: AgreementService
  ) { }


  ngOnInit() {
    this.loadData();
  }


  loadData() {
    this.loading = true;
    this.agreementService
        .getAgreements()
        .subscribe(this.onLoadComplete.bind(this));
  }


  onLoadComplete(response: GetAgreementsResponse) {
    this.loading = false;
    this.error = !response.success;

    if(response.success) {
      this.pending = response.pending;
      this.sent = response.sent;
      this.inbound = response.inbound;
      this.outbound = response.outbound;
    }
  }


  createAgreement() {
    this.dialog.open(CreateAgreementComponent, { 
      data: { type: CreateProposalPopupType.new },
      width: '560px',
      panelClass: 'dialog',
      disableClose: true,
    });
  }


  viewPendingProposal(agreement: Agreement) {
    this.dialog.open(CreateAgreementComponent, { 
      data: { 
        type: CreateProposalPopupType.pending,
        agreement: agreement,
      },
      width: '560px',
      panelClass: 'dialog',
      disableClose: false,
    });
  }


  viewSentProposal(agreement: Agreement) {
    this.dialog.open(CreateAgreementComponent, { 
      data: { 
        type: CreateProposalPopupType.sent,
        agreement: agreement,
      },
      width: '560px',
      panelClass: 'dialog',
      disableClose: false,
    });
  }


  isSelected(agreement: Agreement) : boolean {
    return agreement.id == this.selectedAgreementId;
  }

  select(agreement: Agreement) {
    if(this.isSelected(agreement)) {
      this.router.navigate(['app/transfer']);
    } else {
      this.router.navigate(['app/transfer', agreement.id]);
    }
    
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }


}

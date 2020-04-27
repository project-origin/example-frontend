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
      this.router.navigate(['transfer']);
    } else {
      this.router.navigate(['transfer', agreement.id]);
    }
    
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }


  // buildMockData() {
  //   let facility1 = new Facility();
  //   facility1.name = 'Great Whirlwind 7';
    
  //   let facility2 = new Facility();
  //   facility2.name = 'White Breeze 9000';
    
  //   let facility3 = new Facility();
  //   facility3.name = 'White Breeze 9000';

  //   // for(var i = 1; i < 10; i++) {
  //   //   let agreement = new Agreement();
  //   //   agreement.id = i.toString();
  //   //   agreement.reference = 'MHU 76684-23435';
  //   //   agreement.counterpart = 'Christian Madsen Energy';
  //   //   agreement.technology = 'Hydro';
  //   //   agreement.facility = facility1;
  //   //   agreement.amount = 30;
  //   //   agreement.unit = '%';
  //   //   this.outbound.push(agreement);
  //   // }
    
  //   let agreement1 = new Agreement();
  //   agreement1.id = '1';
  //   agreement1.reference = 'MHU 76684-23435';
  //   agreement1.counterpart = 'Christian Madsen Energy';
  //   agreement1.technology = 'Hydro';
  //   agreement1.facility = facility1;
  //   agreement1.amount = 30;
  //   agreement1.unit = '%';
  //   this.outbound.push(agreement1);
    
  //   let agreement2 = new Agreement();
  //   agreement2.id = '1';
  //   agreement2.reference = 'MHU 76684-98745';
  //   agreement2.counterpart = 'Viborg Datacenter';
  //   agreement2.technology = '';
  //   agreement2.facility = facility2;
  //   agreement2.amount = 30;
  //   agreement2.unit = '%';
  //   this.outbound.push(agreement2);



  //   // let outbound2 = new Agreement();
  //   // outbound2.id = '2';
  //   // outbound2.reference = 'MHU 76684-23435';
  //   // outbound2.counterpart = 'Your Energy Community';
  //   // outbound2.technology = 'Wind';
  //   // outbound2.facility = facility2;
  //   // outbound2.amount = 20;
  //   // outbound2.unit = '%';

  //   // let outbound3 = new Agreement();
  //   // outbound3.id = '3';
  //   // outbound3.reference = 'MHU 76684-23435';
  //   // outbound3.counterpart = 'Energy Supplier 2000';
  //   // outbound3.technology = 'Wind';
  //   // outbound3.facility = facility3;
  //   // outbound3.amount = 30;
  //   // outbound3.unit = '%';

  //   // let outbound4 = new Agreement();
  //   // outbound4.id = '4';
  //   // outbound4.reference = 'MHU 76684-23435';
  //   // outbound4.counterpart = 'Energy Supplier 2000';
  //   // outbound4.technology = 'Wind';
  //   // outbound4.facility = facility3;
  //   // outbound4.amount = 30;
  //   // outbound4.unit = '%';


  //   // let inbound1 = new Agreement();
  //   // inbound1.id = '4';
  //   // inbound1.reference = 'MHU 76684-23435';
  //   // inbound1.counterpart = 'Super Energy & Co.';
  //   // inbound1.technology = 'Solar';

  //   // let inbound2 = new Agreement();
  //   // inbound2.id = '5';
  //   // inbound2.reference = 'MHU 76684-23435';
  //   // inbound2.counterpart = 'Super Energy & Co.';
  //   // inbound2.technology = 'Wind';

  //   // let inbound3 = new Agreement();
  //   // inbound3.id = '6';
  //   // inbound3.reference = 'MHU 76684-23435';
  //   // inbound3.counterpart = 'Water Energy World';
  //   // inbound3.technology = 'Hydro';


  //   // this.outbound.push(outbound1);
  //   // this.outbound.push(outbound2);
  //   // this.outbound.push(outbound3);


  //   // this.inbound.push(inbound1);
  //   // this.inbound.push(inbound2);
  //   // this.inbound.push(inbound3);
  // }

}

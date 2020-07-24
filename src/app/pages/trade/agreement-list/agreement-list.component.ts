import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Agreement } from 'src/app/services/agreements/models';
import { CreateAgreementComponent, CreateProposalPopupType } from '../create-agreement/create-agreement.component';
import { AgreementService, GetAgreementsResponse, SetTransferPriorityResponse } from 'src/app/services/agreements/agreement.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';


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
  cancelled: Agreement[] = [];
  declined: Agreement[] = [];

  // Loading state
  loading: boolean = false;
  error: boolean = false;
  submitting: boolean = false;
  submittingError: boolean = false;


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
      this.cancelled = response.cancelled;
      this.declined = response.declined;
    }
  }


  createAgreement() {
    this.dialog
      .open(CreateAgreementComponent, { 
        data: { type: CreateProposalPopupType.new },
        width: '560px',
        panelClass: 'dialog',
        disableClose: true,
      })
      .beforeClosed()
      .subscribe(this.loadData.bind(this));
  }


  viewPendingProposal(agreement: Agreement) {
    this.dialog
      .open(CreateAgreementComponent, { 
        data: { 
          type: CreateProposalPopupType.pending,
          agreement: agreement,
        },
        width: '560px',
        panelClass: 'dialog',
        disableClose: false,
      })
      .beforeClosed()
      .subscribe(this.loadData.bind(this));
  }


  viewSentProposal(agreement: Agreement) {
    this.dialog
      .open(CreateAgreementComponent, { 
        data: { 
          type: CreateProposalPopupType.sent,
          agreement: agreement,
        },
        width: '560px',
        panelClass: 'dialog',
        disableClose: false,
      })
      .beforeClosed()
      .subscribe(this.loadData.bind(this));
  }


  isSelected(agreement: Agreement) : boolean {
    return agreement.id == this.selectedAgreementId;
  }

  select(agreement: Agreement) {
    if(this.isSelected(agreement)) {
      this.router.navigate(['app/transfer'], { queryParamsHandling: 'preserve' });
    } else {
      this.router.navigate(['app/transfer', agreement.id], { queryParamsHandling: 'preserve' });
    }
    
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }


  // -- Agreement (outbound) priority ------------------------------------- //


  getPriority(agreement: Agreement) : number {
    let index = this.outbound.indexOf(agreement);
    if(index !== -1) {
      return index;
    }
  }

  onPriorityChanged() {
    let request = {
      idsPrioritized: this.outbound.map((agreement: Agreement) => agreement.id),
    };

    this.submitting = true;
    this.agreementService
        .setTransferPriority(request)
        .subscribe(this.onSubmitPrioritiesComplete.bind(this));
  };

  onSubmitPrioritiesComplete(response: SetTransferPriorityResponse) {
    this.submitting = false;
    this.submittingError = !response.success;
  }


  // -- Drag and drop ----------------------------------------------------- //


  drop(event: CdkDragDrop<Agreement[]>) {
    moveItemInArray(event.container.data,
                    event.previousIndex,
                    event.currentIndex);

    this.onPriorityChanged();

    // if (event.previousContainer === event.container) {
    // } else {
    //   transferArrayItem(event.previousContainer.data,
    //                     event.container.data,
    //                     event.previousIndex,
    //                     event.currentIndex);
    // }

    // let movedFromActive = event.previousContainer.data === this.active;
    // let movedFromInactive = event.previousContainer.data === this.inactive;
    // let movedToActive = event.container.data === this.active;
    // let movedToInactive = event.container.data === this.inactive;
    // let changingIndex = event.previousIndex !== event.currentIndex;

    // if(movedToActive || (movedFromActive && movedToInactive)) {
    //   this.onPriorityChanged();
    // }
  }


}

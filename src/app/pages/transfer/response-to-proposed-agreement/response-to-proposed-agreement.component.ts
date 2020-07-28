import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { AgreementService, RespondToProposalRequest, RespondToProposalResponse } from 'src/app/services/agreements/agreement.service';
import { FacilityService, GetFilteringOptionsResponse } from 'src/app/services/facilities/facility-service.service';
import { Agreement } from 'src/app/services/agreements/models';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-response-to-proposed-agreement',
  templateUrl: './response-to-proposed-agreement.component.html',
  styleUrls: ['./response-to-proposed-agreement.component.css']
})
export class ResponseToProposedAgreementComponent implements OnInit {


  agreement: Agreement;
  submitting: boolean = false;
  accepting: boolean = false;
  declining: boolean = false;
  loadingTechnologies: boolean = false;
  availableTechnologies : string[] = [];


  // Form
  form: FormGroup = new FormGroup({
    technology: new FormControl(),
    facilityIds: new FormControl(),
    amountPercent: new FormControl(),
    showTransferPercent: new FormControl(),
    limitToConsumption: new FormControl(),
  });


  get canSelectTechnology() : boolean {
    return this.agreement.technology == null;
  }


  get canSelectFacilities() : boolean {
    return this.agreement.isOutbound;
  }


  get canSelectAmountPercent() : boolean {
    return this.agreement.isOutbound;
  }


  get expandAmountPercent() : boolean {
    return this.form.get('showTransferPercent').value == true;
  }


  constructor(
    private dialogRef: MatDialogRef<ResponseToProposedAgreementComponent>,
    private agreementService: AgreementService,
    private facilityService: FacilityService,
    @Inject(MAT_DIALOG_DATA) data: {
      agreement: Agreement,
    }
  ) {
    this.agreement = data.agreement;
  }


  closeDialog() {
    this.dialogRef.close();
  }


  ngOnInit() {
    if(this.canSelectTechnology) {
      this.loadTechnologies();
    }
  }


  // -- Loading available technologies ---------------------------------------


  loadTechnologies() {
    this.availableTechnologies = [];
    this.loadingTechnologies = true;

    this.facilityService
        .getFilteringOptions({})
        .subscribe(this.onLoadFacilitiesComplete.bind(this));
  }


  onLoadFacilitiesComplete(response: GetFilteringOptionsResponse) {
    this.loadingTechnologies = false;
    this.availableTechnologies = response.technologies || [];
  }


  // -- Accept/decline -------------------------------------------------------


  acceptProposal() {
    this.accepting = true;
    this.respondToProposal(true);
  }


  declineProposal() {
    this.declining = true;
    this.respondToProposal(false);
  }


  respondToProposal(accept: boolean) {
    let request = new RespondToProposalRequest({
      id: this.agreement.id,
      accept: accept,
      technology: (accept && this.canSelectTechnology)
          ? this.form.get('technology').value
          : null,
      amountPercent: (accept && this.canSelectAmountPercent)
          ? this.form.get('amountPercent').value
          : null,
    });

    this.submitting = true;
    this.agreementService
        .respondToProposal(request)
        .subscribe(this.onRespondComplete.bind(this));
  }


  onRespondComplete(response: RespondToProposalResponse) {
    this.submitting = false;
    this.accepting = false;
    this.declining = false;
    if(response.success) {
      this.closeDialog();
    }
  }

}

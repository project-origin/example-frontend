import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormControl, FormGroup } from '@angular/forms';
import { Facility, FacilityType } from 'src/app/services/facilities/models';
import { FacilityService, GetFacilityListResponse, GetFilteringOptionsResponse } from 'src/app/services/facilities/facility-service.service';
import { UserService } from 'src/app/services/auth/user.service';
import { debounceTime, switchMap, map } from 'rxjs/operators';
import { User } from 'src/app/services/auth/models';
import { Observable } from 'rxjs';
import { Agreement } from 'src/app/services/agreements/models';
import {
  AgreementService,
  SubmitProposalRequest,
  SubmitProposalResponse,
  RespondToProposalRequest,
  RespondToProposalResponse,
  WithdrawProposalsRequest,
  WithdrawProposalsResponse,
  SubmitProposalErrors,
} from 'src/app/services/agreements/agreement.service';
import * as moment from 'moment';


export enum CreateProposalPopupType {
  new,      // Create a new proposal from scratch
  sent,     // View a proposal you've sent yourself and is pending
  pending,  // View a proposal you've received and is pending
}


@Component({
  selector: 'app-create-agreement',
  templateUrl: './create-agreement.component.html',
  styleUrls: ['./create-agreement.component.css']
})
export class CreateAgreementComponent implements OnInit {

  minDate: Date = moment('2019-01-01').toDate();
  maxDate: Date = moment('2020-12-31').toDate();


  // Injected data
  type: CreateProposalPopupType;
  agreement: Agreement;
  errors: SubmitProposalErrors = new SubmitProposalErrors();

  headline1: string = '';
  headline2: string = '';
  canSelectDates: boolean = false;
  canSelectTechnology: boolean = false;
  canSelectFacilities: boolean = false;

  // Form
  form: FormGroup = new FormGroup({
    direction: new FormControl(),
    reference: new FormControl(),
    counterpartId: new FormControl(),
    technology: new FormControl(),
    facilityIds: new FormControl(),
    amount: new FormControl(),
    unit: new FormControl(),
    date: new FormControl(),
  });

  // Loading state
  loadingFilteringOptions: boolean = false;
  loadingFacilities: boolean = false;
  loadingSubmitting: boolean = false;

  // Available options
  filteredCounterparts: Observable<User[]>;
  availableTags : string[] = [];
  availableTechnologies : string[] = [];
  availableFacilities : Facility[] = [];
  availableUnits : string[] = ['Wh', 'KWh', 'MWh', 'GWh'];


  constructor(
    private dialogRef: MatDialogRef<CreateAgreementComponent>,
    private facilityService: FacilityService,
    private agreementService: AgreementService,
    private userService: UserService,
    @Inject(MAT_DIALOG_DATA) data: {
      type: CreateProposalPopupType,
      agreement?: Agreement,
    }
  ) {
    this.type = data.type;
    this.agreement = data.agreement;

    if(this.type != CreateProposalPopupType.new && !this.agreement) {
      throw new Error('Must provide an agreement when not using type = new');
    }
  }


  ngOnInit() {
    if(this.type == CreateProposalPopupType.pending) {
      this.setupDialogReceivedProposal();
    } else if(this.type == CreateProposalPopupType.sent) {
      this.setupDialogSentdProposal();
    } else {
      this.setupDialogForNewAgreement();
    }

    // Change in counterpart trigger autocomplete
    this.filteredCounterparts = this.form.get('counterpartId').valueChanges.pipe(
      debounceTime(300),
      switchMap(query => this.userService.autocompleteUsers(query)),
      map(response => response.users)
    );

    // Change in technology trigger load of facilities which support the selected technology
    this.form.get('technology').valueChanges.subscribe(
      this.loadFacilities.bind(this));
  }


  // -- Dialog setup and lifecycle -------------------------------------------


  setupDialogForNewAgreement() {
    this.headline1 = 'NEW GGO TRANSFER AGREEMENT';
    this.headline2 = 'Submit a transfer proposal to a partner';

    // Form default values
    this.form.patchValue({
      reference: '',
      direction: 'outbound',
      counterpartId: '',
      unit: 'MWh',
      amount: '',
    });

    this.canSelectDates = true;
    this.canSelectTechnology = true;
    this.canSelectFacilities = true;

    this.loadFilteringOptions();
    this.loadFacilities();
  }


  setupDialogReceivedProposal() {
    this.headline1 = 'RECEIVED PROPOSAL';
    this.headline2 = 'This is a pending proposal you have received';

    this.form.patchValue(this.agreement);
    this.form.disable();

    if(this.isOutbound) {
      this.form.get('facilityIds').enable();
      this.loadFacilities();

      this.canSelectFacilities = true;

      if(!this.agreement.technology) {
        this.canSelectTechnology = true;
        this.form.get('technology').enable();
        this.loadFilteringOptions();
      }
    }

    if(!this.canSelectTechnology) {
      this.availableTechnologies = [this.agreement.technology];
    }
  }


  setupDialogSentdProposal() {
    this.headline1 = 'SENT PROPOSAL';
    this.headline2 = 'This is a pending proposal you have sent';

    this.form.patchValue(this.agreement);
    this.form.disable();

    if(this.agreement.technology) {
      this.availableTechnologies = [this.agreement.technology];
    }
  }


  closeDialog() {
    this.dialogRef.close();
  }


  // -- Display options ------------------------------------------------------


  get isDisabled() : boolean {
    return this.form.disabled;
  }


  get isOutbound() : boolean {
    return this.form.get('direction').value == 'outbound';
  }


  get isInbound() : boolean {
    return this.form.get('direction').value == 'inbound';
  }


  get showFacilities() : boolean {
    return this.isOutbound;
  }


  get showCancelButton() : boolean {
    return this.type == CreateProposalPopupType.new || this.type == CreateProposalPopupType.sent;
  }


  get showSubmitButton() : boolean {
    return this.type == CreateProposalPopupType.new;
  }


  get showWithdrawButton() : boolean {
    return this.type == CreateProposalPopupType.sent;
  }


  get showAcceptButton() : boolean {
    return this.type == CreateProposalPopupType.pending;
  }


  get showDeclineButton() : boolean {
    return this.type == CreateProposalPopupType.pending;
  }


  // -- Loading available tags and technologies ------------------------------


  loadFilteringOptions() {
    this.availableTags = [];
    this.availableTechnologies = [];
    this.loadingFilteringOptions = true;
    this.form.get('technology').reset();

    let request = {
      filters: {
        facilityType: this.isOutbound ? FacilityType.production : FacilityType.consumption,
      }
    };

    this.facilityService
        .getFilteringOptions(request)
        .subscribe(this.onFilteringOptionsLoaded.bind(this));
  }


  onFilteringOptionsLoaded(response: GetFilteringOptionsResponse) {
    this.loadingFilteringOptions = false;

    if(response.success) {
      this.availableTags = response.tags;
      this.availableTechnologies = response.technologies;
    }
  }


  // -- Loading available facilities -----------------------------------------


  loadFacilities() {
    this.availableFacilities = [];
    this.loadingFacilities = true;
    this.form.get('facilityIds').reset();

    let request = {
      filters: {
        technology: this.form.getRawValue()['technology'],
        facilityType: FacilityType.production,
      }
    };

    this.facilityService
        .getFacilityList(request)
        .subscribe(this.onFacilitiesLoaded.bind(this));
  }


  onFacilitiesLoaded(response: GetFacilityListResponse) {
    this.loadingFacilities = false;

    if(response.success) {
      this.availableFacilities = response.facilities;
    }
  }


  // -- Submit ---------------------------------------------------------------


  submitProposal() {
    this.loadingSubmitting = true;
    this.agreementService
        .submitProposal(new SubmitProposalRequest(this.form.value))
        .subscribe(this.onSubmitComplete.bind(this));
  }


  onSubmitComplete(response: SubmitProposalResponse) {
    this.loadingSubmitting = false;
    this.errors = response.errors;
    if(response.success) {
      this.closeDialog();
    }
  }


  // -- Withdraw -------------------------------------------------------------


  withdrawProposal() {
    this.loadingSubmitting = true;
    this.agreementService
        .withdrawProposal(new WithdrawProposalsRequest({id: this.agreement.id}))
        .subscribe(this.onWithdrawComplete.bind(this));
  }


  onWithdrawComplete(response: WithdrawProposalsResponse) {
    this.loadingSubmitting = false;
    if(response.success) {
      this.closeDialog();
    }
  }


  // -- Accept/decline -------------------------------------------------------


  acceptProposal() {
    this.respondToProposal(true);
  }


  declineProposal() {
    this.respondToProposal(false);
  }


  respondToProposal(accept: boolean) {
    let request = new RespondToProposalRequest({
      id: this.agreement.id,
      accept: accept,
      technology: this.form.get('technology').value,
      facilityIds: this.form.get('facilityIds').value,
    });

    this.loadingSubmitting = true;
    this.agreementService
        .respondToProposal(request)
        .subscribe(this.onRespondComplete.bind(this));
  }


  onRespondComplete(response: RespondToProposalResponse) {
    this.loadingSubmitting = false;
    if(response.success) {
      this.closeDialog();
    }
  }

}

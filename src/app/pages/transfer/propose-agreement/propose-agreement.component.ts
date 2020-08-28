import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { debounceTime, switchMap, map } from 'rxjs/operators';

import { User } from 'src/app/services/auth/models';
import { Facility, FacilityType } from 'src/app/services/facilities/models';
import { SettingsService } from 'src/app/services/settings.service';
import { UserService } from 'src/app/services/auth/user.service';
import { AgreementService, SubmitProposalErrors, SubmitProposalRequest, SubmitProposalResponse } from 'src/app/services/agreements/agreement.service';
import { FacilityService, GetFilteringOptionsResponse, GetFacilityListResponse } from 'src/app/services/facilities/facility-service.service';
import { AgreementDirection } from 'src/app/services/agreements/models';



@Component({
  selector: 'app-propose-agreement',
  templateUrl: './propose-agreement.component.html',
  styleUrls: ['./propose-agreement.component.css']
})
export class ProposeAgreementComponent implements OnInit {

  // Constants
  INBOUND: string = 'inbound';
  OUTBOUND: string = 'outbound';

  // Datepicker allowed range
  minDate: Date;
  maxDate: Date;

  // Form
  form: FormGroup = new FormGroup({
    direction: new FormControl(),
    reference: new FormControl(),
    counterpart: new FormControl(),
    counterpartId: new FormControl(),
    technology: new FormControl(),
    facilityIds: new FormControl(),
    amount: new FormControl(),
    unit: new FormControl(),
    showTransferPercent: new FormControl(),
    amountPercent: new FormControl(),
    date: new FormControl(),
    limitToConsumption: new FormControl(),
  });

  // Loading state
  loadingFilteringOptions: boolean = false;
  loadingFacilities: boolean = false;
  submitting: boolean = false;
  submitErrors: SubmitProposalErrors = new SubmitProposalErrors();

  // Available options
  filteredCounterparts: Observable<User[]>;
  availableTags : string[] = [];
  availableTechnologies : string[] = [];
  availableFacilities : Facility[] = [];
  availableUnits : string[] = ['Wh', 'kWh', 'MWh', 'GWh'];


  // -- Display options ------------------------------------------------------


  get isDisabled() : boolean {
    return this.form.disabled;
  }


  get isOutbound() : boolean {
    return this.form.get('direction').value == this.OUTBOUND;
  }


  get showFacilities() : boolean {
    return this.isOutbound;
  }


  get canSelectFacilities() : boolean {
    return this.isOutbound;
  }


  get showAmountPercent() : boolean {
    return this.isOutbound;
  }


  get expandAmountPercent() : boolean {
    return this.form.get('showTransferPercent').value == true;
  }


  // -- Lifecycle ------------------------------------------------------------


  constructor(
    private dialogRef: MatDialogRef<ProposeAgreementComponent>,
    private agreementService: AgreementService,
    private facilityService: FacilityService,
    private userService: UserService,
    settingsService: SettingsService,
  ) {
    this.minDate = settingsService.minDate;
    this.maxDate = settingsService.maxDate;
  }


  ngOnInit(): void {
    this.form.patchValue({
      direction: this.OUTBOUND,
      unit: 'MWh',
      facilityIds: [],
      limitToConsumption: false,
    })

    // Change in counterpart trigger autocomplete
    this.filteredCounterparts = this.form.get('counterpart').valueChanges.pipe(
      debounceTime(300),
      switchMap(query => this.userService.autocompleteUsers(query)),
      map(response => response.users)
    );
 
    // Change in technology trigger load of facilities which support the selected technology
    this.form.get('technology').valueChanges.subscribe(
      this.loadFacilities.bind(this));

    // Change in show/hide showTransferPercent
    this.form.controls['showTransferPercent'].valueChanges.subscribe(value => {
      this.form.controls['amountPercent'].setValue(null);
    });

    this.loadFilteringOptions();
    this.loadFacilities();
  }


  closeDialog() {
    this.dialogRef.close();
  }


  // -- Counterpart selection ------------------------------------------------


  get counterpart() : string {
    return this.form.get('counterpart').value;
  }


  onCounterpartSelected(event) {
    this.form.patchValue({
      counterpartId: event.option.value.id,
      counterpart: event.option.value.company + ' (' + event.option.value.name + ')',
    });
    return false;
  }


  hasCounterpart() : boolean {
    return (this.form.get('counterpartId').value !== null
            && this.form.get('counterpartId').value !== '');
  }


  resetCounterpart() {
    this.form.patchValue({
      counterpartId: null,
      counterpart: null,
    });
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
    let request = new SubmitProposalRequest(this.form.value);

    if(this.form.controls['direction'].value == 'inbound') {
      // These options are only available on OUTBOUND proposals
      request.facilityIds = [];
      request.amountPercent = null;
    }

    this.submitting = true;
    this.agreementService
        .submitProposal(request)
        .subscribe(this.onSubmitComplete.bind(this));
  }


  onSubmitComplete(response: SubmitProposalResponse) {
    this.submitting = false;
    this.submitErrors = response.errors;
    if(response.success) {
      this.closeDialog();
    }
  }


  resetErrorsFor(field: string) {
    this.submitErrors[field] = [];
  }

}

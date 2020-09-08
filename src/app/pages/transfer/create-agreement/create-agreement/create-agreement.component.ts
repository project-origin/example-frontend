import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { CounterpartDropdownDialogComponent } from '../counterpart-dropdown-dialog/counterpart-dropdown-dialog.component';
import { CounterpartListDialogComponent } from '../counterpart-list-dialog/counterpart-list-dialog.component';
import { AgreementService, SubmitProposalRequest, SubmitProposalResponse } from 'src/app/services/agreements/agreement.service';
import { AgreementDirection } from 'src/app/services/agreements/models';
import { FacilityService, GetFilteringOptionsResponse, GetFacilityListResponse } from 'src/app/services/facilities/facility-service.service';
import { CommodityService, GetPeakMeasurementRequest, GetPeakMeasurementResponse } from 'src/app/services/commodities/commodity.service';
import { DateRange } from 'src/app/services/common';
import { MeasurementType, Measurement } from 'src/app/services/commodities/models';
import { SettingsService } from 'src/app/services/settings.service';
import { ShowPeakMeasurementDialogComponent } from '../show-peak-measurement-dialog/show-peak-measurement-dialog/show-peak-measurement-dialog.component';
import * as moment from 'moment';
import { Facility, FacilityType } from 'src/app/services/facilities/models';


@Component({
  selector: 'app-create-agreement',
  templateUrl: './create-agreement.component.html',
  styleUrls: ['./create-agreement.component.css']
})
export class CreateAgreementComponent implements OnInit {


  @ViewChild('stepper') private stepper: MatStepper;


  // Forms
  directionForm: FormGroup;
  periodForm: FormGroup;
  amountForm: FormGroup;
  technologiesForm: FormGroup;
  counterpartForm: FormGroup;
  confirmForm: FormGroup;

  // Loading state
  loadingTechnologies: boolean = false;
  loadingFacilities: boolean = false;
  errorLoadingTechnologies: boolean = false;
  loadingRecommendedAmount: boolean = false;
  errorLoadingRecommendedAmount: boolean = false;
  submitting: boolean = false;
  completed: boolean = false;

  // Peak measurement / recommended amount
  peakMeasurement: Measurement;
  recommendedAmount: number;
  recommendedAmountUnit: string;
  
  // Misc
  minDate: Date;
  maxDate: Date;
  availableTechnologies : string[] = [];
  availableFacilities : Facility[] = [];
  showAmountPercentage: boolean = false;


  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private agreementService: AgreementService,
    private facilityService: FacilityService,
    private commodityService: CommodityService,
    settingsService: SettingsService,
  ) {
    this.minDate = settingsService.minDate;
    this.maxDate = settingsService.maxDate;
  }


  ngOnInit(): void {
    this.loadFilteringOptions();

    this.directionForm = this.formBuilder.group({
      direction: [null, Validators.required],
    });

    this.periodForm = this.formBuilder.group({
      date: [null, Validators.required],
    });

    this.amountForm = this.formBuilder.group({
      amount: [null, [Validators.required, Validators.pattern('^[0-9]+$')]],
      unit: ['MWh', Validators.required],
      limitToConsumption: [true, Validators.required],
      amountPercent: ['100', [Validators.required, Validators.pattern('^[0-9]+$'), Validators.min(1), Validators.max(100)]],
    });

    this.technologiesForm = this.formBuilder.group({
      technologies: [['Solar'], Validators.required],
      facilityGsrn: [],
    });

    this.counterpartForm = this.formBuilder.group({
      counterpart: [null, Validators.required],
      counterpartId: [null, Validators.required],
    });

    this.confirmForm = this.formBuilder.group({
      reference: ['', Validators.required],
      proposalNote: [''],
    });
  }


  // -- Steps ----------------------------------------------------------------


  stepTo(index: number) {
    this.stepper.selectedIndex = index;
  }


  stepPrevious() {
    this.stepper.previous();
  }


  stepNext() {
    this.stepper.next();
  }


  // -- Direction ------------------------------------------------------------


  get direction() : AgreementDirection {
    return this.directionForm.get('direction').value;
  }


  get isInbound() : boolean {
    return this.direction == AgreementDirection.inbound;
  }


  get isOutbound() : boolean {
    return this.direction == AgreementDirection.outbound;
  }


  selectInbound() {
    this.directionForm.patchValue({direction: AgreementDirection.inbound});
    this.amountForm.patchValue({amountPercent: 100});
    this.showAmountPercentage = false;
    this.loadRecommendedAmount();
    this.stepTo(1);
  }


  selectOutbound() {
    this.directionForm.patchValue({direction: AgreementDirection.outbound});
    this.loadRecommendedAmount();
    this.loadFacilities();
    this.stepTo(1);
  }


  // -- Period (dates) -------------------------------------------------------


  get date() : {begin: Date, end: Date} {
    return this.periodForm.get('date').value;
  }


  get dateRange() : DateRange {
    return new DateRange({begin: this.begin, end: this.end});
  }


  get begin() : Date {
    return this.date ? this.date.begin : null;
  }


  get end() : Date {
    return this.date ? this.date.end : null;
  }


  onUserPickedDate() {
    this.loadRecommendedAmount();
    this.stepTo(2);
  }


  // -- Amount ---------------------------------------------------------------


  get amount() : number {
    return this.amountForm.get('amount').value;
  }


  get amountPercent() : number {
    return this.amountForm.get('amountPercent').value;
  }


  get unit() : string {
    return this.amountForm.get('unit').value;
  }


  get hasRecommendedAmount() : boolean {
    return this.peakMeasurement !== null;
  }


  get isLimitedToConsumption() : boolean {
    return this.amountForm.get('limitToConsumption').value;
  }


  shouldLoadRecommendedAmount() : boolean {
    if(!this.date || !this.direction) {
      console.log('111 false');
      return false;
    }

    if(this.recommendedAmount && this.recommendedAmountUnit) {
      if(this.amount == this.recommendedAmount && this.unit == this.recommendedAmountUnit) {
        console.log('222 true');
        return true;
      } else {
        console.log('333 false');
        return false;
      }
    }

    console.log('444 true');
    return true;
  }


  loadRecommendedAmount() {
    if(this.shouldLoadRecommendedAmount()) {
      let request = new GetPeakMeasurementRequest({
        measurementType: this.isInbound ? MeasurementType.consumption : MeasurementType.production,
        dateRange: this.dateRange,
      });

      this.loadingRecommendedAmount = true;
      this.errorLoadingRecommendedAmount = false;
      this.commodityService
          .getPeakMeasurement(request)
          .subscribe(this.onRecommendedAmountComplete.bind(this));
    }
  }


  onRecommendedAmountComplete(response: GetPeakMeasurementResponse) {
    this.loadingRecommendedAmount = false;
    this.errorLoadingRecommendedAmount = !response.success;
    if(response.success) {
      this.peakMeasurement = response.measurement;
      console.log('this.peakMeasurement', this.peakMeasurement);
      this.parsePeakMeasurement(response.measurement.amount);
    } else {
      this.peakMeasurement = null;
      this.recommendedAmount = null;
      this.recommendedAmountUnit = null;
    }
  }


  parsePeakMeasurement(amount: number) {
    if(amount > Math.pow(10, 9) && amount % Math.pow(10, 9) == 0) {
      this.recommendedAmount = amount / Math.pow(10, 9);
      this.recommendedAmountUnit = 'GWh';
    } else if(amount > Math.pow(10, 9)) {
      this.recommendedAmount = Math.ceil(amount / Math.pow(10, 6));
      this.recommendedAmountUnit = 'MWh';
    } else if(amount > Math.pow(10, 6) && amount % Math.pow(10, 6) == 0) {
      this.recommendedAmount = amount / Math.pow(10, 6);
      this.recommendedAmountUnit = 'MWh';
    } else if(amount > Math.pow(10, 6)) {
      this.recommendedAmount = Math.ceil(amount / Math.pow(10, 3));
      this.recommendedAmountUnit = 'kWh';
    } else if(amount > Math.pow(10, 3) && amount % Math.pow(10, 3) == 0) {
      this.recommendedAmount = amount / Math.pow(10, 3);
      this.recommendedAmountUnit = 'kWh';
    } else if(amount > Math.pow(10, 3)) {
      this.recommendedAmount = amount;
      this.recommendedAmountUnit = 'Wh';
    } else {
      this.recommendedAmount = amount;
      this.recommendedAmountUnit = 'Wh';
    }

    this.amountForm.patchValue({
      amount: this.recommendedAmount,
      unit: this.recommendedAmountUnit,
    });
  }


  openInspectRecommendedAmountDialog() {
    this.dialog.open(ShowPeakMeasurementDialogComponent, { 
      width: '900px',
      panelClass: 'dialog',
      data: {
        measurementType: this.peakMeasurement.type,
        dateFrom: moment(this.peakMeasurement.begin).startOf('day').subtract(1, 'days').toDate(),
        dateTo: moment(this.peakMeasurement.begin).startOf('day').add(1, 'days').toDate(),
        highlighted: this.peakMeasurement.begin,
      },
    });
  }


  onToggleAmountPercent() {
    if(!this.showAmountPercentage) {
      this.amountForm.patchValue({amountPercent: '100'});
    }
  }


  // -- Technologies ---------------------------------------------------------


  get allTechnologiesSelected() : boolean {
    return this.technologiesForm.get('technologies').value.length == this.availableTechnologies.length;
  }


  get checkUncheckAllIsIndeterminate() : boolean {
    let numSelectedTechnologies = this.technologiesForm.get('technologies').value.length;
    return (numSelectedTechnologies > 0 && numSelectedTechnologies < this.availableTechnologies.length);
  }


  get technologies() : string[] {
    return this.technologiesForm.get('technologies').value
  }


  get technologiesString() : string {
    return this.technologies.join(', ');
  }


  technologyIsSelected(technology: string) {
    return this.technologiesForm.get('technologies').value.indexOf(technology) !== -1;
  }


  onCheckUncheckAllTechnologiesChanged(event: any) {
    event.preventDefault();

    let numSelectedTechnologies = this.technologiesForm.get('technologies').value.length;
    let numAvailableTechnologies = this.availableTechnologies.length;

    if(numSelectedTechnologies == 0) {
      this.technologiesForm.patchValue({technologies: this.availableTechnologies});
    } else {
      this.technologiesForm.patchValue({technologies: []});
    }
  }


  // -- Loading available technologies ---------------------------------------


  loadFilteringOptions() {
    this.availableTechnologies = [];
    this.loadingTechnologies = true;
    this.errorLoadingTechnologies = false;
    this.facilityService
        .getFilteringOptions({})
        .subscribe(this.onLoadFilteringOptionsComplete.bind(this));
  }


  onLoadFilteringOptionsComplete(response: GetFilteringOptionsResponse) {
    this.loadingTechnologies = false;
    this.errorLoadingTechnologies = !response.success;
    if(response.success) {
      this.availableTechnologies = response.technologies;
      this.technologiesForm.patchValue({technologies: this.availableTechnologies});
    } else {
      this.technologiesForm.patchValue({technologies: []});
    }
  }


  // -- Loading available facilities -----------------------------------------


  get hasAvailableFacilities(): boolean {
    return this.availableFacilities.length > 0;
  }


  get facilityGsrn() : string[] {
    return this.technologiesForm.get('facilityGsrn').value;
  }


  loadFacilities() {
    this.availableFacilities = [];
    this.loadingFacilities = true;

    let request = {
      filters: {
        facilityType: FacilityType.production,
      }
    };

    this.facilityService
        .getFacilityList(request)
        .subscribe(this.onFacilitiesLoaded.bind(this));
  }


  onFacilitiesLoaded(response: GetFacilityListResponse) {
    this.loadingFacilities = false;
    this.availableFacilities = response.facilities || [];
  }


  // -- Counterpart ----------------------------------------------------------


  get hasCounterpart() : boolean {
    return this.counterpartForm.get('counterpartId').value != null;
  }


  get counterpartId() : string {
    return this.counterpartForm.get('counterpartId').value;
  }


  get counterpartName() : string {
    return this.counterpartForm.get('counterpart').value;
  }


  openCounterpartDropdownDialog() {
    this.dialog
      .open(CounterpartDropdownDialogComponent, { 
        width: '600px',
        panelClass: 'dialog',
      })
      .beforeClosed()
      .subscribe(this.onCounterpartChosen.bind(this));
  }


  openCounterpartListDialogDialog() {
    this.dialog
      .open(CounterpartListDialogComponent, { 
        width: '750px',
        panelClass: 'dialog',
        data: {
          dateRange: this.dateRange,
          minAmount: this.amount,
        },
      })
      .beforeClosed()
      .subscribe(this.onCounterpartChosen.bind(this));
  }


  onCounterpartChosen(response: {counterpart: string, counterpartId: string}) {
    if(response) {
      this.counterpartForm.patchValue(response);
    }
  }


  resetCounterpart() {
    this.counterpartForm.reset();
  }


  // -- Confirm --------------------------------------------------------------


  get reference() : string {
    return this.confirmForm.get('reference').value;
  }


  get proposalNote() : string {
    return this.confirmForm.get('proposalNote').value;
  }


  // -- Submit proposal ------------------------------------------------------


  submitProposal() {
    let request = new SubmitProposalRequest({
      direction: this.direction,
      reference: this.reference,
      counterpartId: this.counterpartId,
      technologies: this.technologies,
      facilityGsrn: this.isOutbound ? this.facilityGsrn : [],
      amount: this.amount,
      unit: this.unit,
      amountPercent: this.amountPercent,
      date: this.date,
      limitToConsumption: this.isLimitedToConsumption,
      proposalNote: this.proposalNote,
    });

    // if(this.form.controls['direction'].value == 'inbound') {
    //   // These options are only available on OUTBOUND proposals
    //   request.facilityIds = [];
    //   request.amountPercent = null;
    // }

    this.submitting = true;
    this.agreementService
        .submitProposal(request)
        .subscribe(this.onSubmitComplete.bind(this));
  }


  onSubmitComplete(response: SubmitProposalResponse) {
    this.submitting = false;
    this.completed = response.success;
    // this.submitErrors = response.errors;
    // if(response.success) {
    //   this.closeDialog();
    // }
  }

}

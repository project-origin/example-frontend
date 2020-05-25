import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import * as moment from 'moment';
import { IFacilityFilters, Facility } from 'src/app/services/facilities/models';
import { DisclosureService, GetDisclosurePreviewRequest, GetDisclosurePreviewResponse, CreateDisclosureResponse, CreateDisclosureRequest, SummaryResolution } from 'src/app/services/disclosures/disclosures.service';
import { DateRange } from 'src/app/services/common';


@Component({
  selector: 'app-create-disclosure-dialog',
  templateUrl: './create-disclosure-dialog.component.html',
  styleUrls: ['./create-disclosure-dialog.component.css']
})
export class CreateDisclosureDialogComponent implements OnInit {


  dateFrom: Date = moment().toDate();
  dateTo: Date = moment().subtract(1, 'months').toDate();
  filters: IFacilityFilters;
  
  loadingPreview: boolean = false;
  loadingSubmitting: boolean = false;
  previewFacilities: Facility[] = [];
  submitted: boolean = false;
  submittedId: string;

  name: string = '';
  description: string = '';
  maxResolution: SummaryResolution = null;
  publicizeMeteringpoints: boolean = false;
  publicizeGsrn: boolean = true;
  publicizePhysicalAddress: boolean = true;

  selectedGsrnNumbers: string[] = [];


  constructor(
    private dialogRef: MatDialogRef<CreateDisclosureDialogComponent>,
    private disclosureService: DisclosureService,
    @Inject(MAT_DIALOG_DATA) data: {
      dateFrom: Date,
      dateTo: Date,
      filters: IFacilityFilters,
    }
  ) {
    this.dateFrom = data.dateFrom;
    this.dateTo = data.dateTo;
    this.filters = data.filters;
  }

  ngOnInit(): void {
    this.loadPreview();
  }


  closeDialog() {
    this.dialogRef.close();
  }


  possibleResolutions() : string[] {
    return Object.keys(SummaryResolution);
  }


  // -- Selecting facilities -------------------------------------------------

  isSelected(facility: Facility) : boolean {
    return this.selectedGsrnNumbers.indexOf(facility.gsrn) > -1;
  }


  toggleSelection(facility: Facility) {
    let index = this.selectedGsrnNumbers.indexOf(facility.gsrn);

    if(index > -1) {
      this.selectedGsrnNumbers.splice(index, 1);
    } else {
      this.selectedGsrnNumbers.push(facility.gsrn);
    }
  }


  // -- Loading available facilities -----------------------------------------


  loadPreview() {
    this.loadingPreview = true;

    let request = new GetDisclosurePreviewRequest({
      dateRange: new DateRange({begin: this.dateFrom, end: this.dateTo}),
      filters: this.filters,
    })

    this.disclosureService
        .getDisclosurePreview(request)
        .subscribe(this.onLoadPreviewComplete.bind(this));
  }


  onLoadPreviewComplete(response: GetDisclosurePreviewResponse) {
    this.loadingPreview = false;

    if(response.success) {
      this.previewFacilities = response.facilities;
      this.selectedGsrnNumbers = response.facilities.map((facility: Facility) => facility.gsrn);
    }
  }


  // -- Submitting -----------------------------------------------------------


  canSubmit() : boolean {
    return (!this.loadingSubmitting
            && this.selectedGsrnNumbers.length > 0
            && this.name.length > 0
            && this.maxResolution !== null);
  }


  createDisclosure() {
    this.loadingSubmitting = true;

    let request = new CreateDisclosureRequest({
      name: this.name,
      description: this.description,
      gsrn: this.selectedGsrnNumbers,
      maxResolution: this.maxResolution,
      publicizeMeteringpoints: this.publicizeMeteringpoints,
      publicizeGsrn: this.publicizeGsrn,
      publicizePhysicalAddress: this.publicizePhysicalAddress,
      dateRange: new DateRange({begin: this.dateFrom, end: this.dateTo}),
    })

    this.disclosureService
        .createDisclosure(request)
        .subscribe(this.onCreateDisclosureComplete.bind(this));
  }


  onCreateDisclosureComplete(response: CreateDisclosureResponse) {
    this.loadingSubmitting = false;
    this.submitted = response.success;

    if(response.success) {
      this.submittedId = response.id;
    }
  }

}

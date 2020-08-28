import { Component, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { SatDatepickerRangeValue } from 'saturn-datepicker';
import * as moment from 'moment';

import { SettingsService } from 'src/app/services/settings.service';
import { AgreementService, GetAgreementDetailsRequest, GetAgreementSummaryRequest, GetAgreementDetailsResponse, GetAgreementSummaryResponse, CancelAgreementRequest, CancelAgreementResponse, SetFacilitiesResponse } from 'src/app/services/agreements/agreement.service';
import { Agreement, AgreementState, AgreementDirection } from 'src/app/services/agreements/models';
import { MeasurementDataSet } from 'src/app/services/commodities/models';
import { DateRange } from 'src/app/services/common';
import { Facility, FacilityType } from 'src/app/services/facilities/models';
import { FacilityService, GetFacilityListResponse } from 'src/app/services/facilities/facility-service.service';


@Component({
  selector: 'app-agreement-details',
  templateUrl: './agreement-details.component.html',
  styleUrls: ['./agreement-details.component.css']
})
export class AgreementDetailsComponent implements OnInit {


  // Datepicker allowed range + Current date range
  minDate: Date;
  maxDate: Date;
  dateFrom: Date;
  dateTo: Date;

  // Loading state
  loadingAgreement: boolean = false;
  errorLoadingAgreement: boolean = false;
  loadingSummary: boolean = false;
  errorLoadingSummary: boolean = false;
  loadingFacilities: boolean = false;

  // Data
  agreementId: string;
  agreement: Agreement;

  // Chart data
  chartLabels: string[] = [];
  chartData: MeasurementDataSet[] = [];

  // Changing facilities
  submittingFacilities: boolean = false;
  errorSubmittingFacilities: boolean = false;
  availableFacilities: Facility[] = [];
  selectedFacilityIds: string[] = [];


  get defaultDateFrom() : Date {
    return this.agreement.dateFrom;
    return moment().subtract(3, 'months').toDate();
  }


  get defaultDateTo() : Date {
    return this.agreement.dateTo;
    return moment().toDate();
  }


  get pickerValue() : SatDatepickerRangeValue<Date> {
    return {
      begin: this.dateFrom,
      end: this.dateTo,
    };
  }


  get isOutbound() : boolean {
    return this.agreement.direction === AgreementDirection.outbound;
  }


  get userCanCancelAgreement() : boolean {
    return this.agreement && this.agreement.state == AgreementState.ACCEPTED;
  }


  // -- Construct ------------------------------------------------------------


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private agreementService: AgreementService,
    private facilityService: FacilityService,
    settingsService: SettingsService,
  ) {
    this.minDate = settingsService.minDate;
    this.maxDate = settingsService.maxDate;
  }


  ngOnInit() {
    this.route.queryParamMap.subscribe((params: ParamMap) => {
      if(params.get('dateFrom') && params.get('dateTo')) {
        this.dateFrom = moment(params.get('dateFrom'), 'YYYY-MM-DD').toDate();
        this.dateTo = moment(params.get('dateTo'), 'YYYY-MM-DD').toDate();
      }
      this.loadSummaryData();
    });

    this.route.params.subscribe(params => {
      this.agreementId = params.agreementId || null;
      if(this.agreementId) {
        this.loadAgreement();
      }
    });
  }


  // -- Date change ----------------------------------------------------------


  changeDate(dateFrom: Date, dateTo: Date) {
    this.router.navigate([], {
      replaceUrl: true,
      queryParams: {
        dateFrom: moment(dateFrom).format('YYYY-MM-DD'),
        dateTo: moment(dateTo).format('YYYY-MM-DD'),
      },
    });
  }


  onUserPickedDate(event: any) {
    this.changeDate(event.value.begin, event.value.end)
  }


  onUserNavigated(event: {dateFrom: Date, dateTo: Date}) {
    this.changeDate(event.dateFrom, event.dateTo);
  }


  onReset() {
    this.changeDate(this.defaultDateFrom, this.defaultDateTo);
  }


  // -- Load Agreement ------------------------------------------------------

  
  loadAgreement() {
    let request = new GetAgreementDetailsRequest({
      id: this.agreementId,
    });

    this.loadingAgreement = true;
    this.agreementService
        .getAgreementDetails(request)
        .subscribe(this.onLoadAgreementComplete.bind(this));
  }


  onLoadAgreementComplete(response: GetAgreementDetailsResponse) {
    this.loadingAgreement = false;
    this.errorLoadingSummary = !response.success;
    this.agreement = response.agreement;

    if(response.success) {
      this.dateFrom = this.defaultDateFrom;
      this.dateTo = this.defaultDateTo;
      this.loadSummaryData();
      // this.selectedFacilityIds = this.agreement.facilities.map(
      //   (facility: Facility) => facility.id);
      // this.loadFacilities();
    }
  }


  onFacilitiesChanged(opened: boolean) {
    if(!opened) {
      let request = {
        id: this.agreement.id,
        facilityIds: this.selectedFacilityIds,
      }

      this.submittingFacilities = true;
      this.errorSubmittingFacilities = false;
      this.agreementService
        .setFacilities(request)
        .subscribe(this.onFacilitiesChangedComplete.bind(this));
    }
  }


  onFacilitiesChangedComplete(response: SetFacilitiesResponse) {
    this.submittingFacilities = false;
    this.errorSubmittingFacilities = !response.success;
  }


  // -- Load Agreement summary -----------------------------------------------


  loadSummaryData() {
    let request = new GetAgreementSummaryRequest({
      id: this.agreementId,
      dateRange: new DateRange({
        begin: this.dateFrom,
        end: this.dateTo,
      }),
    });

    this.loadingSummary = true;
    this.agreementService
        .getAgreementSummary(request)
        .subscribe(this.onLoadSummaryDataComplete.bind(this));
  }


  onLoadSummaryDataComplete(response: GetAgreementSummaryResponse) {
    this.loadingSummary = false;
    this.errorLoadingSummary = !response.success;
    if(response.success) {
      this.chartLabels = response.labels;
      this.chartData = response.ggos;
      // this.total = this.datasets.reduce((a, b) => a + b.amount, 0);
    }
  }


  // -- Cancel agreement -----------------------------------------------------


  cancelAgreement() {
    if(this.userCanCancelAgreement && confirm('Really cancel this agreement?')) {
      let request = new CancelAgreementRequest({
        id: this.agreement.id,
      });
  
      this.agreementService
          .cancelAgreement(request)
          .subscribe(this.onCancelAgreementComplete.bind(this));
    }
  }


  onCancelAgreementComplete(response: CancelAgreementResponse) {
    if(response.success) {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }


  // -- Export data ----------------------------------------------------------


  exportTransferGgoSummary() {
    this.agreementService.exportGgoSummary(new GetAgreementSummaryRequest({
      id: this.agreementId,
      dateRange: new DateRange({
        begin: this.dateFrom,
        end: this.dateTo,
      })
    }));
  }


  // -- Loading available facilities -----------------------------------------


  // loadFacilities() {
  //   this.availableFacilities = [];
  //   this.loadingFacilities = true;
  //   // this.form.get('facilityIds').reset();

  //   let request = {
  //     filters: {
  //       technology: this.agreement.technology,
  //       facilityType: FacilityType.production,
  //     }
  //   };

  //   this.facilityService
  //       .getFacilityList(request)
  //       .subscribe(this.onFacilitiesLoaded.bind(this));
  // }


  // onFacilitiesLoaded(response: GetFacilityListResponse) {
  //   this.loadingFacilities = false;
  //   if(response.success) {
  //     this.availableFacilities = response.facilities;
  //   }
  // }

}

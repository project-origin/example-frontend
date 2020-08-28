import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { SatDatepickerRangeValue } from 'saturn-datepicker';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { CommodityService, GetMeasurementsRequest } from 'src/app/services/commodities/commodity.service';
import { AgreementService, GetAgreementSummaryRequest } from 'src/app/services/agreements/agreement.service';
import { SettingsService } from 'src/app/services/settings.service';
import { DateRange } from 'src/app/services/common';


@Component({
  selector: 'app-ggo-overview',
  templateUrl: './ggo-overview.component.html',
  styleUrls: ['./ggo-overview.component.css']
})
export class GgoOverviewComponent implements OnInit {

  minDate: Date;
  maxDate: Date;

  dateFrom: Date = moment().toDate();
  dateTo: Date = moment().subtract(1, 'months').toDate();


  get defaultDateFrom() : Date {
    return moment().subtract(1, 'months').toDate();
  }


  get defaultDateTo() : Date {
    return moment().toDate();
  }


  get pickerValue() : SatDatepickerRangeValue<Date> {
    return {
      begin: this.dateFrom,
      end: this.dateTo,
    };
  }


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private commodityService: CommodityService,
    private agreementService: AgreementService,
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
      } else {
        this.dateFrom = this.defaultDateFrom;
        this.dateTo = this.defaultDateTo;
      }
    });
  }


  // -- Date change ----------------------------------------------------------


  changeDate(dateFrom: Date, dateTo: Date) {
    let queryParams = {
      dateFrom: moment(dateFrom).format('YYYY-MM-DD'),
      dateTo: moment(dateTo).format('YYYY-MM-DD'),
    };

    this.router.navigate([], { queryParams: queryParams });
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


  // -- Export data ----------------------------------------------------------


  exportMeasurements() {
    this.commodityService.exportMeasurements(new GetMeasurementsRequest({
      dateRange: new DateRange({begin: this.dateFrom, end: this.dateTo})
    }));
  }


  exportGgoSummary() {
    this.commodityService.exportGgoSummary(new GetMeasurementsRequest({
      dateRange: new DateRange({begin: this.dateFrom, end: this.dateTo})
    }));
  }


  exportGgoList() {
    this.commodityService.exportGgoList(new GetMeasurementsRequest({
      dateRange: new DateRange({begin: this.dateFrom, end: this.dateTo})
    }));
  }


  exportTransferGgoSummary() {
    this.agreementService.exportGgoSummary(new GetAgreementSummaryRequest({
      dateRange: new DateRange({begin: this.dateFrom, end: this.dateTo})
    }));
  }

}

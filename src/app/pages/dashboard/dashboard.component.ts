import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import * as moment from 'moment';
import { CommodityService, GetMeasurementsRequest } from 'src/app/services/commodities/commodity.service';
import { DateRange } from 'src/app/services/common';
import { AgreementService, GetAgreementSummaryRequest } from 'src/app/services/agreements/agreement.service';
import { SettingsService } from 'src/app/services/settings.service';
import { SatDatepickerRangeValue } from 'saturn-datepicker';
import { EcoDeclaration, EnvironmentService, GetEcoDeclarationRequest, GetEcoDeclarationResponse, EcoDeclarationResolution } from 'src/app/services/environment/environment.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  minDate: Date;
  maxDate: Date;

  dateFrom: Date = moment().toDate();
  dateTo: Date = moment().subtract(1, 'months').toDate();

  // Enviroment declaration
  loading: boolean = false;
  error: boolean = false;
  individual: EcoDeclaration;
  general: EcoDeclaration;


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
    private environmentService: EnvironmentService,
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

      this.loadEnvironmentDeclaration();
    });
  }


  loadEnvironmentDeclaration() {
    let request = new GetEcoDeclarationRequest({
      filters: {},
      resolution: EcoDeclarationResolution.day,
      dateRange: new DateRange({
        begin: this.dateFrom,
        end: this.dateTo,
      }),
    });

    this.loading = true;
    this.environmentService
        .getEcoDeclaration(request)
        .subscribe(this.onLoadEnvironmentDeclaration.bind(this));
  }


  onLoadEnvironmentDeclaration(response: GetEcoDeclarationResponse) {
    if(response.success) {
      this.individual = response.individual;
      this.general = response.general;
    } else {
      this.individual = null;
      this.general = null;
    }
    this.loading = false;
    this.error = !response.success;
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

}

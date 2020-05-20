import { Component, OnInit } from '@angular/core';
import { DisclosureService, GetDisclosureResponse, GetDisclosureRequest, DisclosureDataSeries } from 'src/app/services/disclosures/disclosures.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import * as moment from 'moment';
import { DateRange } from 'src/app/services/common';
import { FormGroup, FormControl } from '@angular/forms';
import { SettingsService } from 'src/app/services/settings.service';


@Component({
  selector: 'app-view-disclosure',
  templateUrl: './view-disclosure.component.html',
  styleUrls: ['./view-disclosure.component.css']
})
export class ViewDisclosureComponent implements OnInit {


  minDate: Date;
  maxDate: Date;

  disclosureId: string;

  // Form controls
  form: FormGroup = new FormGroup({
    id: new FormControl(),
    dateRange: new FormControl(),
  });


  labels: string[] = [];
  description: string = '';
  data: DisclosureDataSeries[] = [];

  loading: boolean = false;
  exists: boolean = false;


  constructor(
    private route: ActivatedRoute,
    private disclosureService: DisclosureService,
    settingsService: SettingsService,
  ) {
    this.minDate = settingsService.minDate;
    this.maxDate = settingsService.maxDate;
  }


  ngOnInit(): void {

    this.form.valueChanges
      .subscribe(this.getDisclosure.bind(this));

    this.route.paramMap.subscribe(params => {
      this.form.patchValue({
        id: params.get('disclosureId')
      });
    });

    this.route.queryParamMap.subscribe((params: ParamMap) => {
      if(params.get('dateFrom') && params.get('dateTo')) {
        this.form.patchValue({dateRange: new DateRange({
          begin: moment(params.get('dateFrom'), 'YYYY-MM-DD').toDate(),
          end: moment(params.get('dateTo'), 'YYYY-MM-DD').toDate(),
        })});
      } else {
        this.form.patchValue({dateRange: null});
      }
    });
  }


  getDisclosure() {
    if(this.form.get('id').value) {
      let dateRange: DateRange;

      if(this.form.get('dateRange').value) {
        dateRange = new DateRange({
          begin: this.form.get('dateRange').value.begin,
          end: this.form.get('dateRange').value.end,
        });
      }

      let request = new GetDisclosureRequest({
        id: this.form.get('id').value,
        dateRange: dateRange,
      });

      this.labels = [];
      this.data = [];
      this.loading = true;
      this.disclosureService
        .getDisclosure(request)
        .subscribe(this.onGetDisclosureComplete.bind(this));
    }
  }

  onGetDisclosureComplete(response: GetDisclosureResponse) {
    this.loading = false;
    this.exists = response.success;
    if(response.success) {
      this.labels = response.labels;
      this.data = response.data;
      this.description = response.description;
      this.minDate = response.begin;
      this.maxDate = response.end;

      if(!this.form.get('dateRange').value) {
        this.form.patchValue({dateRange: new DateRange({
          begin: response.begin,
          end: response.end,
        })}, {emitEvent: false});
      }
    }
  }

}

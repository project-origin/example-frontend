import { Component, OnChanges, SimpleChanges, Input, OnInit } from '@angular/core';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { MeasurementDataSet } from 'src/app/services/commodities/models';
import { AgreementService, GetAgreementSummaryResponse, GetAgreementSummaryRequest } from 'src/app/services/agreements/agreement.service';
import { Agreement } from 'src/app/services/agreements/models';
import { DateRange } from 'src/app/services/common';
import { FormGroup, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';


@Component({
  selector: 'app-agreement-summary',
  templateUrl: './agreement-summary.component.html',
  styleUrls: ['./agreement-summary.component.css']
})
export class AgreementSummaryComponent implements OnInit, OnChanges {

  @Input() agreementId: string;

  dateFrom: Date = moment().subtract(1, 'year').toDate();
  dateTo: Date = moment().toDate();

  // Form controls
  form: FormGroup = new FormGroup({
    date: new FormControl(),
  });

  datasets: any[] = [];
  total: number = 0;
  agreement: Agreement;
  loading: boolean = false;
  error: boolean = false;

  // Chart data
  chartLabels: string[] = [];
  chartData: ChartDataSets[] = [{ label: '', data: [], backgroundColor: 'transparent' }];
  chartLegend = true;
  chartType: ChartType = 'line';
  chartOptions: ChartOptions = {
    responsive: true,
    aspectRatio: 2,
    maintainAspectRatio: true,
    legend: {
      align: 'end',
      position: 'top'
    },
  };


  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private agreementService: AgreementService,
  ) { 
    this.form.patchValue({date: {
      begin: this.dateFrom,
      end: this.dateTo,
    }});
  }


  ngOnInit() {
    this.route.queryParamMap.subscribe((params: ParamMap) => {
      if(params.get('dateFrom') && params.get('dateTo')) {
        this.dateFrom = moment(params.get('dateFrom'), 'YYYY-MM-DD').toDate();
        this.dateTo = moment(params.get('dateTo'), 'YYYY-MM-DD').toDate();
      } else {
        this.dateFrom = moment().subtract(6, 'months').toDate();
        this.dateTo = moment().toDate();
      }

      this.form.patchValue({date: {
        begin: this.dateFrom,
        end: this.dateTo,
      }});

      this.loadData();
    });

    this.form.valueChanges
      .subscribe(this.onFiltersChanged.bind(this));
  }


  onFiltersChanged() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParamsHandling: 'merge',
      queryParams: {
        dateFrom: moment(this.form.get('date').value.begin).format('YYYY-MM-DD'),
        dateTo: moment(this.form.get('date').value.end).format('YYYY-MM-DD'),
      },
    });
  }


  ngOnChanges(changes: SimpleChanges) {
    this.loadData();
  }


  loadData() {
    let request = new GetAgreementSummaryRequest({
      id: this.agreementId,
      dateRange: new DateRange({
        begin: this.form.get('date').value.begin,
        end: this.form.get('date').value.end,
      }),
    });

    this.loading = true;
    this.agreementService
        .getAgreementSummary(request)
        .subscribe(this.onLoadComplete.bind(this));
  }


  onLoadComplete(response: GetAgreementSummaryResponse) {
    this.loading = false;
    this.error = !response.success;

    if(response.success) {
//       this.agreement = response.agreement;

      this.chartLabels = response.labels;

      this.chartData = response.ggos.map((dataSet: MeasurementDataSet) => <ChartDataSets>{
        label: dataSet.label,
        type: 'line',
        fill: false,
        borderColor: dataSet.color,
        hoverBorderColor: dataSet.color,
        backgroundColor: dataSet.color,
        hoverBackgroundColor: dataSet.color,
        pointBorderColor: dataSet.color,
        pointBackgroundColor: dataSet.color,
        data: dataSet.values,
      });

      this.datasets = response.ggos.map((dataSet: MeasurementDataSet) => <any>{
        label: dataSet.label,
        amount: dataSet.values.reduce((a, b) => a + b, 0),
        unit: dataSet.unit,
      });

      this.total = this.datasets.reduce((a, b) => a + b.amount, 0);
    }
  }


  isAggregated() : boolean {
    return !this.agreementId;
  }


  exportTransferGgoSummary() {
    this.agreementService.exportGgoSummary(new GetAgreementSummaryRequest({
      id: this.agreementId,
      dateRange: new DateRange({
        begin: this.form.get('date').value.begin,
        end: this.form.get('date').value.end,
      })
    }));
  }

}

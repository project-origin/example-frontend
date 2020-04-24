import { Component, OnChanges, SimpleChanges, Input } from '@angular/core';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { MeasurementDataSet } from 'src/app/services/commodities/models';
import { AgreementService, GetAgreementSummaryResponse, GetAgreementSummaryRequest } from 'src/app/services/agreements/agreement.service';
import { Agreement } from 'src/app/services/agreements/models';
import { DateRange } from 'src/app/services/common';


@Component({
  selector: 'app-agreement-summary',
  templateUrl: './agreement-summary.component.html',
  styleUrls: ['./agreement-summary.component.css']
})
export class AgreementSummaryComponent implements OnChanges {

  @Input() agreementId: string;

  // dateFrom: Date = new Date('2020-01-01');
  // dateTo: Date = new Date('2020-12-31');
  date: DateRange = {
    begin: new Date('2020-01-01'),
    end: new Date('2020-12-31'),
  };
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


  constructor(private agreementService: AgreementService) { }


  ngOnChanges(changes: SimpleChanges) {
    this.loadData();
  }


  loadData() {
    let request = new GetAgreementSummaryRequest({
      id: this.agreementId,
//       dateRange: this.date,
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

      this.total = this.datasets.reduce((a, b) => a.amount + b.amount, 0);
    }
  }


  isAggregated() : boolean {
    return !this.agreementId;
  }

}

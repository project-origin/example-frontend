import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets, ChartTooltipItem } from 'chart.js';
import { MeasurementDataSet } from 'src/app/services/commodities/models';
import { AgreementDirection } from 'src/app/services/agreements/models';
import { AgreementService, GetAgreementSummaryRequest, GetAgreementSummaryResponse } from 'src/app/services/agreements/agreement.service';
import { FormatAmount } from 'src/app/pipes/unitamount';


@Component({
  selector: 'app-trading-plot',
  templateUrl: './trading-plot.component.html',
  styleUrls: ['./trading-plot.component.css']
})
export class TradingPlotComponent implements OnChanges {

  @Input() dateFrom: Date;
  @Input() dateTo: Date;
  @Input() direction: AgreementDirection;

  // Loading state
  loading: boolean = false;
  error: boolean = false;

  // Chart data
  chartLabels: string[] = [];
  chartData: ChartDataSets[] = [{ label: '', data: [], backgroundColor: 'transparent' }];
  chartLegend = true;
  chartType: ChartType = 'bar';
  chartOptions: ChartOptions = {
    responsive: true,
    aspectRatio: 3,
    maintainAspectRatio: true,
    legend: {
      align: 'end',
      position: 'top'
    },
    tooltips: {
      callbacks: {
        label: function(tooltipItem:ChartTooltipItem, data) {
          return data.datasets[tooltipItem.datasetIndex].label + ': ' + FormatAmount.format(Number(tooltipItem.value));
        }
      }
    },
    scales: {
      xAxes: [{ stacked: true }],
      yAxes: [{ 
        stacked: true,
        ticks: {
          beginAtZero: true,
          callback: label => FormatAmount.format(label)
        }
      }],
    },
  };


  constructor(private agreementService: AgreementService) { }


  ngOnChanges(changes: SimpleChanges) {
    this.loadData();
  }


  loadData() {
    let request = new GetAgreementSummaryRequest({
      direction: this.direction,
      dateRange: {
        begin: this.dateFrom,
        end: this.dateTo,
      },
    });

    this.loading = true;
    this.error = false;
    this.agreementService
        .getAgreementSummary(request)
        .subscribe(this.onLoadComplete.bind(this));
  }


  onLoadComplete(response: GetAgreementSummaryResponse) {
    this.loading = false;
    this.error = !response.success;

    if(response.success) {
      this.chartLabels = response.labels;
      this.chartData = this.buildDataFromResponse(response);
    }
  }


  buildDataFromResponse(response: GetAgreementSummaryResponse) : ChartDataSets[] {
    return response.ggos.map((data: MeasurementDataSet) => <ChartDataSets>{
        label: data.label,
        // fill: false,
        borderColor: data.color,
        hoverBorderColor: data.color,
        backgroundColor: data.color,
        hoverBackgroundColor: data.color,
        data: data.values,
    });
  }

}

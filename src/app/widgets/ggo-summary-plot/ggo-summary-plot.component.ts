import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets, ChartTooltipItem } from 'chart.js';
import { MeasurementDataSet, MeasurementType, GgoCategory } from 'src/app/services/commodities/models';
import { IFacilityFilters } from 'src/app/services/facilities/models';
import { CommodityService, GetMeasurementsRequest, GetMeasurementsResponse, GetGgoSummaryRequest, GetGgoSummaryResponse } from 'src/app/services/commodities/commodity.service';
import { FormatAmount } from 'src/app/pipes/unitamount';


@Component({
  selector: 'app-ggo-summary-plot',
  templateUrl: './ggo-summary-plot.component.html',
  styleUrls: ['./ggo-summary-plot.component.css']
})
export class GgoSummaryPlotComponent implements OnChanges {

  @Input() dateFrom: Date;
  @Input() dateTo: Date;
  @Input() category: GgoCategory;

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


  constructor(private commodityService: CommodityService) { }


  ngOnChanges(changes: SimpleChanges) {
    this.loadData();
  }


  loadData() {
    let request = new GetGgoSummaryRequest({
      category: this.category,
      dateRange: {
        begin: this.dateFrom,
        end: this.dateTo,
      },
    });

    this.loading = true;
    this.error = false;
    this.commodityService
        .getGgoSummary(request)
        .subscribe(this.onLoadComplete.bind(this));
  }


  onLoadComplete(response: GetGgoSummaryResponse) {
    this.loading = false;
    this.error = !response.success;

    if(response.success) {
      this.chartLabels = response.labels;
      this.chartData = this.buildDataFromResponse(response);
    }
  }


  buildDataFromResponse(response: GetGgoSummaryResponse) : ChartDataSets[] {
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

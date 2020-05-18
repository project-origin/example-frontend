import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets, ChartTooltipItem } from 'chart.js';
import { MeasurementDataSet, MeasurementType } from 'src/app/services/commodities/models';
import { IFacilityFilters } from 'src/app/services/facilities/models';
import { CommodityService, GetMeasurementsRequest, GetMeasurementsResponse } from 'src/app/services/commodities/commodity.service';
import { FormatAmount } from 'src/app/pipes/unitamount';


@Component({
  selector: 'app-commodity-plot',
  templateUrl: './commodity-plot.component.html',
  styleUrls: ['./commodity-plot.component.css']
})
export class CommodityPlotComponent implements OnChanges {

  @Input() dateFrom: Date;
  @Input() dateTo: Date;
  @Input() filters: IFacilityFilters;
  @Input() measurementType: MeasurementType;

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
    let request = new GetMeasurementsRequest({
      measurementType: this.measurementType,
      filters: this.filters,
      dateRange: {
        begin: this.dateFrom,
        end: this.dateTo,
      },
    });

    this.loading = true;
    this.error = false;
    this.commodityService
        .getMeasurements(request)
        .subscribe(this.onLoadComplete.bind(this));
  }


  onLoadComplete(response: GetMeasurementsResponse) {
    this.loading = false;
    this.error = !response.success;

    if(response.success) {
      this.chartLabels = response.labels;
      this.chartData = this.buildDataFromResponse(response);
    }
  }


  buildDataFromResponse(response: GetMeasurementsResponse) : ChartDataSets[] {
    let dataSets: ChartDataSets[] = [];

    dataSets.push(<ChartDataSets>{
      label: response.measurements.label,
      type: 'line',
      fill: false,
      borderColor: response.measurements.color,
      hoverBorderColor: response.measurements.color,
      backgroundColor: response.measurements.color,
      hoverBackgroundColor: response.measurements.color,
      data: response.measurements.values,
    });

    return dataSets.concat(response.ggos.map((data: MeasurementDataSet) => <ChartDataSets>{
      label: data.label,
      // fill: false,
      borderColor: data.color,
      hoverBorderColor: data.color,
      backgroundColor: data.color,
      hoverBackgroundColor: data.color,
      data: data.values,
    }));
  }

}

import { Component, OnInit, Input } from '@angular/core';
import { ChartDataSets, ChartType, ChartOptions } from 'chart.js';
import { DisclosureDataSeries } from 'src/app/services/disclosures/disclosures.service';
import { MeasurementDataSet } from 'src/app/services/commodities/models';


@Component({
  selector: 'app-disclosure-chart',
  templateUrl: './disclosure-chart.component.html',
  styleUrls: ['./disclosure-chart.component.css']
})
export class DisclosureChartComponent implements OnInit {

  @Input() labels: string[] = [];
  @Input() dataseries: DisclosureDataSeries;


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
    scales: {
      xAxes: [{ stacked: true }],
      yAxes: [{ stacked: true }],
    },
  };


  constructor() { 

  }

  ngOnInit(): void {
    this.buildDataFromResponse();
  }


  buildDataFromResponse() {
    let dataSets: ChartDataSets[] = [];

    dataSets.push(<ChartDataSets>{
      label: 'Consumption',
      type: 'line',
      fill: false,
      borderColor: '#ce3e2d',
      hoverBorderColor: '#ce3e2d',
      backgroundColor: '#ce3e2d',
      hoverBackgroundColor: '#ce3e2d',
      data: this.dataseries.measurements,
    });

    this.chartData = dataSets.concat(this.dataseries.ggos.map((data: MeasurementDataSet) => <ChartDataSets>{
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

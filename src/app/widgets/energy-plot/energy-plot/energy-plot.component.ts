import { Component, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ChartOptions, ChartType, ChartDataSets, ChartTooltipItem } from 'chart.js';
import { MeasurementDataSet } from 'src/app/services/commodities/models';
import { FormatAmount } from 'src/app/pipes/unitamount';


@Component({
  selector: 'app-energy-plot',
  templateUrl: './energy-plot.component.html',
  styleUrls: ['./energy-plot.component.css'],
})
export class EnergyPlotComponent implements OnChanges {

  @Input() loading: boolean = false;
  @Input() error: boolean = false;
  @Input() bars: MeasurementDataSet[] = [];
  @Input() lines: MeasurementDataSet[] = [];
  @Input() labels: string[] = [];

  @Output() reload: EventEmitter<any> = new EventEmitter();


  // Chart data
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
          return data.datasets[tooltipItem.datasetIndex].label
            + ': '
            + FormatAmount.format(Number(tooltipItem.value));
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


  get chartLabels() : string[] {
    return this.labels;
  }


  ngOnChanges(changes: SimpleChanges) {
    this.buildChartDataSets();
  }


  invokeReload() {
    this.reload.emit(null);
  }


  buildChartDataSets() {
    let dataSets: ChartDataSets[] = [];

    // Lines
    if(this.lines && this.lines.length > 0) {
      dataSets = dataSets.concat(this.lines.map((data: MeasurementDataSet) => <ChartDataSets>{
        label: data.label,
        type: 'line',
        fill: false,
        borderColor: data.color,
        hoverBorderColor: data.color,
        backgroundColor: data.color,
        hoverBackgroundColor: data.color,
        data: data.values,
      }));
    }

    // Bars
    if(this.bars && this.bars.length > 0) {
      dataSets = dataSets.concat(this.bars.map((data: MeasurementDataSet) => <ChartDataSets>{
        label: data.label,
        type: 'bar',
        fill: false,
        borderColor: data.color,
        hoverBorderColor: data.color,
        backgroundColor: data.color,
        hoverBackgroundColor: data.color,
        data: data.values,
      }));
    }

    // Default (if empty)
    if(dataSets.length == 0) {
      dataSets = [{ label: '', data: [], backgroundColor: 'transparent' }];
    }

    this.chartData = dataSets;
  }

}

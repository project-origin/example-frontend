import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormatEmission } from 'src/app/pipes/unitamount';
import { ChartTooltipItem, ChartType, ChartOptions, ChartDataSets } from 'chart.js';
import { formatNumber } from '@angular/common';
import * as moment from 'moment';
import { EcoDeclarationResolution, EmissionColor, EcoDeclaration } from 'src/app/services/environment/environment.service';


type InjectData = {
  declaration: EcoDeclaration,
  emission: string,
  plainLabel: string,
  htmlLabel: string,
  totalConsumedAmount: number,
  totalEmission: number,
  totalEmissionPerWh: number,
  emissions: Map<Date, Map<string, number>>,
  resolution: EcoDeclarationResolution,
};


@Component({
  selector: 'app-emission-details-dialog',
  templateUrl: './emission-details-dialog.component.html',
  styleUrls: ['./emission-details-dialog.component.css']
})
export class EmissionDetailsDialogComponent {


  declaration: EcoDeclaration;
  emission: string;
  plainLabel: string;
  htmlLabel: string;
  totalConsumedAmount: number;
  totalEmission: number;
  totalEmissionPerWh: number;
  emissions: Map<Date, Map<string, number>>;
  resolution: EcoDeclarationResolution;


  // TOTAL EMISSIONS LINE CHART
  totalEmissionsChartLabels: string[] = [];
  totalEmissionsChartData: ChartDataSets[] = [{ label: '', data: [], backgroundColor: 'transparent' }];
  totalEmissionsChartLegend = true;
  totalEmissionsChartType: ChartType = 'line';
  totalEmissionsChartOptions: ChartOptions = {
    responsive: true,
    aspectRatio: 3,
    maintainAspectRatio: true,
    legend: {
      display: false,
    },
    tooltips: {
      callbacks: {
        label: function(tooltipItem:ChartTooltipItem, data) {
          return data.datasets[tooltipItem.datasetIndex].label + ': ' + FormatEmission.format(Number(tooltipItem.value));
        }
      }
    },
    scales: {
      xAxes: [{ stacked: true }],
      yAxes: [{ 
        // stacked: true,
        ticks: {
          beginAtZero: true,
          callback: label => FormatEmission.format(Number(label))
        }
      }],
    },
  };


  // RELATIVE EMISSIONS LINE CHART
  relativeEmissionsChartLabels: string[] = [];
  relativeEmissionsChartData: ChartDataSets[] = [{ label: '', data: [], backgroundColor: 'transparent' }];
  relativeEmissionsChartLegend = true;
  relativeEmissionsChartType: ChartType = 'line';
  relativeEmissionsChartOptions: ChartOptions = {
    responsive: true,
    aspectRatio: 3,
    maintainAspectRatio: true,
    legend: {
      display: false,
    },
    tooltips: {
      callbacks: {
        label: function(tooltipItem:ChartTooltipItem, data) {
          return data.datasets[tooltipItem.datasetIndex].label + ': ' + formatNumber(Number(tooltipItem.value), 'da', '1.0-2') + ' g/kWh';
        }
      }
    },
    scales: {
      xAxes: [{ stacked: true }],
      yAxes: [{ 
        // stacked: true,
        ticks: {
          beginAtZero: true,
          callback: label => formatNumber(parseFloat(label), 'da', '1.0-2') + ' g/kWh'
        }
      }],
    },
  };


  constructor(
    private dialogRef: MatDialogRef<EmissionDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: InjectData,
  ) {
    this.declaration = data.declaration;
    this.emission = data.emission;
    this.plainLabel = data.plainLabel;
    this.htmlLabel = data.htmlLabel;
    this.totalConsumedAmount = data.totalConsumedAmount;
    this.totalEmission = data.totalEmission;
    this.totalEmissionPerWh = data.totalEmissionPerWh;
    this.emissions = data.emissions;
    this.resolution = data.resolution;
      
    this.buildEmissionsChart(
      this.declaration.emissions,
      this.totalEmissionsChartLabels,
      this.totalEmissionsChartData,
      (value) => value,
    );
    
    this.buildEmissionsChart(
      this.declaration.emissionsPerWh,
      this.relativeEmissionsChartLabels,
      this.relativeEmissionsChartData,
      (value) => value * 1000,
    );
  }


  get totalEmissionPerkWh() : number {
    return this.totalEmissionPerWh * 1000;
  }



  buildEmissionsChart(
    emissions: Map<Date, Map<string, number>>,
    targetLabels: string[],
    targetData: ChartDataSets[],
    transform: (value: number) => number,
  ) {
    let values = [];
    let color = EmissionColor.get(this.emission);
    let formatBegin = (begin: moment.Moment) : string => {
      switch(this.resolution) {
        case EcoDeclarationResolution.year:
          return moment(begin).format('YYYY');
        case EcoDeclarationResolution.month:
          return moment(begin).format('YYYY-MM');
        case EcoDeclarationResolution.day:
          return moment(begin).format('YYYY-MM-DD');
        case EcoDeclarationResolution.hour:
          return moment(begin).format('YYYY-MM-DD HH:mm');
      }
    };

    for(var begin in emissions) {
      targetLabels.push(formatBegin(moment(begin)));
      values.push(transform(emissions[begin][this.emission]));
    }

    targetData.push(<ChartDataSets>{
      label: this.plainLabel,
      fill: false,
      borderColor: color,
      backgroundColor: color,
      hoverBorderColor: color,
      hoverBackgroundColor: color,
      pointBorderColor: color,
      pointBackgroundColor: color,
      data: values,
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MultiDataSet, Label, Color } from 'ng2-charts';
import { ChartType, ChartOptions, ChartTooltipItem, ChartDataSets } from 'chart.js';
import * as moment from 'moment';
import { IFacilityFilters } from 'src/app/services/facilities/models';
import { MatDialog } from '@angular/material/dialog';
import { DateRange } from 'src/app/services/common';
import { EnvironmentService, GetEcoDeclarationRequest, EcoDeclarationResolution, GetEcoDeclarationResponse, EcoDeclaration, EmissionColor } from 'src/app/services/environment/environment.service';
import { CommodityColor } from 'src/app/services/commodities/models';
import { FormatAmount, FormatEmission } from 'src/app/pipes/unitamount';
import { EmissionDetailsDialogComponent } from './emission-details-dialog/emission-details-dialog/emission-details-dialog.component';
import { formatNumber } from '@angular/common';
import { ExportEcoDeclarationPdfDialogComponent } from './export-pdf-dialog/export-eco-declaration-pdf-dialog/export-eco-declaration-pdf-dialog.component';



type Technology = {
  technology: string,
  amount: number,
  percent: number,
};


@Component({
  selector: 'app-environment',
  templateUrl: './environment.component.html',
  styleUrls: ['./environment.component.css'],
})
export class EnvironmentComponent implements OnInit {

  // Loading state
  loading: boolean = false;
  error: boolean = false;

  dateFrom: moment.Moment = moment();
  dateTo: moment.Moment = moment().subtract(1, 'months');
  filters: IFacilityFilters;

  hasData: boolean = false;
  individual: EcoDeclaration;
  general: EcoDeclaration;
  technologies: Technology[] = [];

  emissions = {
    'CO2': {
      plain: 'CO2 (Kuldioxid - drivhusgas)',
      html: 'CO<sub>2</sub> (Kuldioxid - drivhusgas)',
    },
    'CH4': {
      plain: 'CH4 (Metan - drivhusgas)',
      html: 'CH<sub>4</sub> (Metan - drivhusgas)',
    },
    'N2O': {
      plain: 'N2O (Lattergas - drivhusgas)',
      html: 'N<sub>2</sub>O (Lattergas - drivhusgas)',
    },
    'SO2': {
      plain: 'SO2 (Svovldioxid)',
      html: 'SO<sub>2</sub> (Svovldioxid)',
    },
    'NOx': {
      plain: 'NOx (Kvælstofilte)',
      html: 'NO<sub>x</sub> (Kvælstofilte)',
    },
    'CO': {
      plain: 'CO (Kulilte)',
      html: 'CO (Kulilte)',
    },
    'NMVOC': {
      plain: 'NMVOC (Uforbrændt kulbrinter)',
      html: 'NMVOC (Uforbrændt kulbrinter)',
    },
    'particles': {
      plain: 'Partikler',
      html: 'Partikler',
    },
    'flyash': {
      plain: 'Kulflyveaske',
      html: 'Kulflyveaske',
    },
    'slag': {
      plain: 'Slagge',
      html: 'Slagge',
    },
    'desulphurisation': {
      plain: 'Afsvovlningsprodukter (Gips)',
      html: 'Afsvovlningsprodukter (Gips)',
    },
    'waste': {
      plain: 'Røggasaffald',
      html: 'Røggasaffald',
    },
  };

  emissions_in_air : string[] = [
    'CO2',
    'CH4',
    'N2O',
    'SO2',
    'NOx',
    'CO',
    'NMVOC',
    'particles',
  ]

  residues : string[] = [
    'flyash',
    'slag',
    'desulphurisation',
    'waste',
  ]


  // TECHNOLOGIES PIE CHART
  techChartLabels: Label[] = [];
  techChartData: MultiDataSet = [];
  techChartColors: Color[] = [];
  techChartType: ChartType = 'pie';
  techChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1,
    legend: {
      align: 'center',
      position: 'right'
    },
    animation: {
        duration: 200
    },
    tooltips: {
      enabled: true,
      callbacks: {
        label: function(tooltipItem, data) {
          if(data.labels[tooltipItem.index].toString() !== 'No data') {
            return data.labels[tooltipItem.index].toString() 
                + ': ' 
                + FormatAmount.format(Number(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]));
          } else {
            return 'No data';
          }
        }
      }
    }
  };


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
      align: 'end',
      position: 'top'
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
      align: 'end',
      position: 'top'
    },
    tooltips: {
      callbacks: {
        label: function(tooltipItem:ChartTooltipItem, data) {
          return data.datasets[tooltipItem.datasetIndex].label + ': ' + formatNumber(Number(tooltipItem.value), 'da', '1.0-2') + ' g/kWh';
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
          callback: label => formatNumber(parseFloat(label), 'da', '1.0-2') + ' g/kWh'
        }
      }],
    },
  };


  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private environmentService: EnvironmentService,
  ) { }


  ngOnInit() {
    this.route.queryParamMap.subscribe((params: ParamMap) => {
      if(params.get('dateFrom') && params.get('dateTo')) {
        this.dateFrom = moment(params.get('dateFrom'), 'YYYY-MM-DD');
        this.dateTo = moment(params.get('dateTo'), 'YYYY-MM-DD');
      } else {
        this.dateFrom = moment().subtract(1, 'months');
        this.dateTo = moment();
      }

      this.filters = {
        gsrn: JSON.parse(params.get('gsrn') || '[]'),
        sectors: JSON.parse(params.get('sectors') || '[]'),
        tags: JSON.parse(params.get('tags') || '[]'),
        text: params.get('text') || '',
      };

      this.loadEnvironmentDeclaration();
    });
  }


  get request() : GetEcoDeclarationRequest {
    return new GetEcoDeclarationRequest({
      filters: this.filters,
      resolution: this.getResolution(),
      dateRange: new DateRange({
        begin: this.dateFrom.toDate(),
        end: this.dateTo.toDate(),
      }),
    });
  }


  loadEnvironmentDeclaration() {
    this.techChartLabels = [];
    this.techChartData = [];
    this.techChartColors = [];
    this.totalEmissionsChartLabels = [];
    this.totalEmissionsChartData = [{ label: '', data: [], backgroundColor: 'transparent' }];
    this.relativeEmissionsChartLabels = [];
    this.relativeEmissionsChartData = [{ label: '', data: [], backgroundColor: 'transparent' }];

    this.loading = true;
    this.environmentService
        .getEcoDeclaration(this.request)
        .subscribe(this.onLoadEnvironmentDeclaration.bind(this));
  }


  onLoadEnvironmentDeclaration(response: GetEcoDeclarationResponse) {
    this.loading = false;
    this.hasData = response.success;
    this.error = !response.success;

    if(response.success) {
      this.individual = response.individual;
      this.general = response.general;
      this.technologies = this.buildTechnologies(response.individual);
      
      this.buildEmissionsChart(
        response.individual.emissions,
        this.totalEmissionsChartLabels,
        this.totalEmissionsChartData,
        (value) => value,
      );
      
      this.buildEmissionsChart(
        response.individual.emissionsPerWh,
        this.relativeEmissionsChartLabels,
        this.relativeEmissionsChartData,
        (value) => value * 1000,
      );

      this.buildTechnologyChart();
    } else {
      this.individual = null;
      this.general = null;
    }
  }


  exportPDF() {
    this.environmentService.exportEcoDeclarationPdf(this.request);
    this.dialog.open(ExportEcoDeclarationPdfDialogComponent, { 
      width: '550px',
      panelClass: 'dialog',
      data: {
        headline1: 'Generating PDF',
        headline2: 'Export environment declaration as PDF',
      },
    });
  }


  exportEmissionsCSV() {
    this.environmentService.exportEcoDeclarationEmissionsCsv(this.request);
    this.dialog.open(ExportEcoDeclarationPdfDialogComponent, { 
      width: '550px',
      panelClass: 'dialog',
      data: {
        headline1: 'Generating CSV',
        headline2: 'Export emissions (in gram) per hour',
      },
    });
  }


  exportTechnologiesCSV() {
    this.environmentService.exportEcoDeclarationEmissionsTechnologies(this.request);
    this.dialog.open(ExportEcoDeclarationPdfDialogComponent, { 
      width: '550px',
      panelClass: 'dialog',
      data: {
        headline1: 'Generating CSV',
        headline2: 'Export technologies (in Wh) per hour',
      },
    });
  }


  showEmissionDetailsPopup(key: string) {
    let data = {
      key: key,
      plainLabel: this.getPlainLabel(key),
      htmlLabel: this.getHtmlLabel(key),
      totalConsumedAmount: this.individual.totalConsumedAmount,
      totalEmission: this.individual.totalEmissions[key],
      totalEmissionPerWh: this.individual.totalEmissionsPerWh[key],
    };

    this.dialog.open(EmissionDetailsDialogComponent, { 
      data: data,
      width: '800px',
      panelClass: 'dialog',
    });
  }


  getResolution() : EcoDeclarationResolution {
    let deltaDays = this.dateTo.diff(this.dateFrom, 'days');

    if(deltaDays >= 365 * 3) {
      return EcoDeclarationResolution.year;
    } else if(deltaDays >= 60) {
      return EcoDeclarationResolution.month;
    } else if(deltaDays >= 3) {
      return EcoDeclarationResolution.day;
    } else {
      return EcoDeclarationResolution.hour;
    }
  }


  getPlainLabel(key: string) : string {
    if(key in this.emissions) {
      return this.emissions[key].plain;
    } else {
      return key;
    }
  }


  getHtmlLabel(key: string) : string {
    if(key in this.emissions) {
      return this.emissions[key].html;
    } else {
      return key;
    }
  }


  buildTechnologies(declaration: EcoDeclaration) : Technology[] {
    let technologies: Technology[] = [];

    for(var technology in declaration.totalTechnologies) {
      technologies.push({
        technology: technology,
        amount: declaration.totalTechnologies[technology],
        percent: declaration.totalTechnologies[technology] / declaration.totalConsumedAmount * 100,
      });
    }

    return technologies;
  }


  buildEmissionsChart(
    emissions: Map<Date, Map<string, number>>,
    targetLabels: string[],
    targetData: ChartDataSets[],
    transform: (value: number) => number,
  ) {
    let data = {};
    let formatBegin = (begin: moment.Moment) : string => {
      switch(this.getResolution()) {
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

      for(var key in emissions[begin]) {
        if(!(key in data)) {
          data[key] = [];
        }
        data[key].push(transform(emissions[begin][key]));
      }
    }

    for(var key in data) {
      let color = EmissionColor.get(key);

      targetData.push(<ChartDataSets>{
        label: this.getPlainLabel(key),
        fill: false,
        borderColor: color,
        backgroundColor: color,
        hoverBorderColor: color,
        hoverBackgroundColor: color,
        pointBorderColor: color,
        pointBackgroundColor: color,
        data: data[key],
      });
    }
  }


  buildTechnologyChart() {
    let techColors: string[] = [];
    for(var technology in this.individual.totalTechnologies) {
      this.techChartLabels.push(technology);
      this.techChartData.push(this.individual.totalTechnologies[technology]);
      techColors.push(CommodityColor.get(technology));
    }
    this.techChartColors = [ {backgroundColor: techColors} ];
  }


  getTotalEmissions(declaration: EcoDeclaration, key: string) : number {
    if(key in declaration.totalEmissions) {
      return declaration.totalEmissions[key];
    } else {
      return 0;
    }
  }

  getEmissionsPerkWh(declaration: EcoDeclaration, key: string) : number {
    if(key in declaration.totalEmissionsPerWh) {
      return declaration.totalEmissionsPerWh[key] * 1000;
    } else {
      return 0;
    }
  }

  getDeltaEmissionsPerkWh(d1: EcoDeclaration, d2: EcoDeclaration, key: string) : number {
    let e1 = this.getEmissionsPerkWh(d1, key);
    let e2 = this.getEmissionsPerkWh(d2, key);

    if(e1 == 0 || e2 == 0) {
      return 0;
    }

    let delta = (1 - (e1 / e2)) * 100;

    if(delta > 1) {
      return delta;
    } else if(delta < 1) {
      return -1 * delta;
    } else {
      return 0;
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MultiDataSet, Label, Color } from 'ng2-charts';
import { ChartType, ChartOptions } from 'chart.js';
import * as moment from 'moment';
import { IFacilityFilters } from 'src/app/services/facilities/models';
import { MatDialog } from '@angular/material/dialog';
import { DateRange } from 'src/app/services/common';
import { EnvironmentService, GetEcoDeclarationRequest, EcoDeclarationResolution, GetEcoDeclarationResponse, EcoDeclaration, EmissionColor } from 'src/app/services/environment/environment.service';
import { CommodityColor } from 'src/app/services/commodities/models';
import { FormatAmount } from 'src/app/pipes/unitamount';
import { EmissionDetailsDialogComponent } from './emission-details-dialog/emission-details-dialog/emission-details-dialog.component';
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

  individual: EcoDeclaration;
  general: EcoDeclaration;
  technologiesMapped: {[technology: string]: Technology};
  expandTechnologies: boolean = false;

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


  // -- Loading data ---------------------------------------------------------


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
    this.loading = true;
    this.environmentService
        .getEcoDeclaration(this.request)
        .subscribe(this.onLoadEnvironmentDeclaration.bind(this));
  }


  onLoadEnvironmentDeclaration(response: GetEcoDeclarationResponse) {
    this.loading = false;
    this.error = !response.success;

    if(response.success) {
      this.individual = response.individual;
      this.general = response.general;
      this.technologiesMapped = this.buildTechnologies(response.individual);
      this.buildTechnologyChart();
    } else {
      this.individual = null;
      this.general = null;
    }
  }


  // -- Export PDF/CSV -------------------------------------------------------


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


  showEmissionDetailsPopup(emission: string) {
    let data = {
      declaration: this.individual,
      emission: emission,
      plainLabel: this.getPlainLabel(emission),
      htmlLabel: this.getHtmlLabel(emission),
      totalConsumedAmount: this.individual.totalConsumedAmount,
      totalEmission: this.individual.totalEmissions[emission] || 0,
      totalEmissionPerWh: this.individual.totalEmissionsPerWh[emission] || 0,
      emissions: this.emissions,
      resolution: this.getResolution(),
    };

    this.dialog.open(EmissionDetailsDialogComponent, { 
      data: data,
      width: '800px',
      panelClass: 'dialog',
      maxHeight: '90vh',
    });
  }


  // -- Technologies ---------------------------------------------------------


  buildTechnologies(declaration: EcoDeclaration) : {[technology: string]: Technology} {
    let technologies: {[technology: string]: Technology} = {};

    for(var technology in declaration.totalTechnologies) {
      technologies[technology] = {
        technology: technology,
        amount: declaration.totalTechnologies[technology],
        percent: declaration.totalTechnologies[technology] / declaration.totalConsumedAmount * 100,
      };
    }

    return technologies;
  }


  get technologies(): Technology[] {
    return Object.values(this.technologiesMapped);
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


  // -- Emissions data -------------------------------------------------------


  get hasData(): boolean {
    return this.individual && !this.individual.isEmpty;
  }

  get showData(): boolean {
    return !this.loading && this.hasData;
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


  get co2Total(): number {
    return this.getTotalEmissions(this.individual, 'CO2') / 1000;
  }

  get co2Relative(): number {
    return this.getEmissionsPerkWh(this.individual, 'CO2');
  }

  get co2Compared(): number {
    return this.getDeltaEmissionsPerkWh(this.individual, this.general, 'CO2') || -100;
  }

  get cleanEnergyPercentage(): number {
    let percent: number = 0;

    if('Wind' in this.technologiesMapped)
      percent += this.technologiesMapped['Wind'].percent;
    if('Solar' in this.technologiesMapped)
      percent += this.technologiesMapped['Solar'].percent;
    if('Hydro' in this.technologiesMapped)
      percent += this.technologiesMapped['Hydro'].percent;

    return percent;
  }

  get ggoPercentage(): number {
    return this.individual.totalRetiredAmount / this.individual.totalConsumedAmount * 100;
  }

}

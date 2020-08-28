import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import * as moment from 'moment';
import { IFacilityFilters } from 'src/app/services/facilities/models';
import { MatDialog } from '@angular/material/dialog';
import { DateRange } from 'src/app/services/common';
import { EnvironmentService, GetEcoDeclarationRequest, EcoDeclarationResolution, GetEcoDeclarationResponse, EcoDeclaration } from 'src/app/services/environment/environment.service';
import { ExportEcoDeclarationPdfDialogComponent } from './export-pdf-dialog/export-eco-declaration-pdf-dialog/export-eco-declaration-pdf-dialog.component';


@Component({
  selector: 'app-environment',
  templateUrl: './environment.component.html',
  styleUrls: ['./environment.component.css'],
})
export class EnvironmentComponent implements OnInit {

  dateFrom: moment.Moment = moment();
  dateTo: moment.Moment = moment().subtract(1, 'months');
  filters: IFacilityFilters;
  loading: boolean = false;
  error: boolean = false;
  individual: EcoDeclaration;
  general: EcoDeclaration;


  get hasData(): boolean {
    return this.individual && !this.individual.isEmpty;
  }

  get showData(): boolean {
    return !this.loading && this.hasData;
  }

  get resolution() : EcoDeclarationResolution {
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


  // -- Loading data ---------------------------------------------------------


  get request() : GetEcoDeclarationRequest {
    return new GetEcoDeclarationRequest({
      filters: this.filters,
      resolution: this.resolution,
      dateRange: new DateRange({
        begin: this.dateFrom.toDate(),
        end: this.dateTo.toDate(),
      }),
    });
  }


  loadEnvironmentDeclaration() {
    this.loading = true;
    this.environmentService
        .getEcoDeclaration(this.request)
        .subscribe(this.onLoadEnvironmentDeclaration.bind(this));
  }


  onLoadEnvironmentDeclaration(response: GetEcoDeclarationResponse) {
    if(response.success) {
      this.individual = response.individual;
      this.general = response.general;
    } else {
      this.individual = null;
      this.general = null;
    }
    this.loading = false;
    this.error = !response.success;
  }


  // -- Export PDF/CSV -------------------------------------------------------


  exportPdf() {
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


  exportEmissionsCsv() {
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


  exportTechnologiesCsv() {
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

}


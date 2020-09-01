import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Type } from "class-transformer";
import { ApiService, ApiResponse } from '../api.service';
import { IFacilityFilters } from '../facilities/models';
import { DateRange } from '../common';
import { NullAstVisitor } from '@angular/compiler';


export class EmissionColor {
  static get(key: string) : string {
    switch(key) {
      case 'CO2':
        return '#8e0000';
      case 'CH4':
        return '#8e24aa';
      case 'N2O':
        return '#9fa8da';
      case 'SO2':
        return '#3f51b5';
      case 'NOx':
        return '#2196f3';
      case 'CO':
        return '#009688';
      case 'NMVOC':
        return '#4caf50';
      case 'particles':
        return '#cddc39';
      case 'flyash':
        return '#ff8f00';
      case 'slag':
        return '#6d4c41';
      case 'desulphurisation':
        return '#78909c';
      case 'waste':
        return '#f8bbd0';
      default:
        return '#000';
    }
  }
}



type Technology = {
  technology: string,
  amount: number,
  percent: number,
};


export class EcoDeclaration {
  emissions: Map<Date, Map<string, number>>;
  emissionsPerWh: Map<Date, Map<string, number>>;
  technologies: Map<Date, Map<string, number>>;
  totalEmissions: Map<string, number>;
  totalEmissionsPerWh: Map<string, number>;
  totalConsumedAmount: number;
  totalRetiredAmount: number;
  totalTechnologies: Map<string, number>;

  _technologiesMapped: {[technology: string]: Technology} = null;

  get isEmpty(): boolean {
    return this.totalConsumedAmount == 0;
  }

  get technologiesMapped(): {[technology: string]: Technology} {
    if(this._technologiesMapped === null) {
      this._technologiesMapped = {};
      
      for(var technology in this.totalTechnologies) {
        this._technologiesMapped[technology] = {
          technology: technology,
          amount: this.totalTechnologies[technology],
          percent: this.totalTechnologies[technology] / this.totalConsumedAmount * 100,
        };
      }
    }

    return this._technologiesMapped;
  }

  get technologiesList(): Technology[] {
    return Object.values(this.technologiesMapped);
  }

  getTotalEmissions(key: string) : number {
    if(key in this.totalEmissions) {
      return this.totalEmissions[key];
    } else {
      return 0;
    }
  }

  getEmissionsPerkWh(key: string) : number {
    if(key in this.totalEmissionsPerWh) {
      return this.totalEmissionsPerWh[key] * 1000;
    } else {
      return 0;
    }
  }

  getDeltaEmissionsPerkWh(other: EcoDeclaration, key: string) : number {
    let e1 = this.getEmissionsPerkWh(key);
    let e2 = other.getEmissionsPerkWh(key);

    if(e1 == 0 || e2 == 0) {
      return 0;
    }

    let delta = (e1 - e2) / e2 * 100;

    if(delta > 1) {
      return delta;
    } else if(delta < 1) {
      return -1 * delta;
    } else {
      return 0;
    }
  }
}


export enum EcoDeclarationResolution {
  year = 'year',
  month = 'month',
  day = 'day',
  hour = 'hour',
}


export class GetEcoDeclarationRequest {
  @Type(() => DateRange)
  dateRange: DateRange;
  filters?: IFacilityFilters;
  resolution: EcoDeclarationResolution;
  utcOffset: number;

  constructor(args: {
    dateRange: DateRange,
    filters?: IFacilityFilters,
    resolution: EcoDeclarationResolution,
  }) {
    Object.assign(this, args);
    this.utcOffset = (new Date().getTimezoneOffset()) / 60 * -1;
  }
}


export class GetEcoDeclarationResponse extends ApiResponse {
  @Type(() => EcoDeclaration)
  general: EcoDeclaration;

  @Type(() => EcoDeclaration)
  individual: EcoDeclaration;
}


@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

  constructor(private api: ApiService) {}


  getEcoDeclaration(request: GetEcoDeclarationRequest) : Observable<GetEcoDeclarationResponse> {
    return this.api.invoke('/eco-declaration', GetEcoDeclarationResponse, request);
  }


  exportEcoDeclarationPdf(request: GetEcoDeclarationRequest) {
    return this.api.downloadFile('/eco-declaration/pdf', 'environment-declaration.pdf', request);
  }


  exportEcoDeclarationEmissionsCsv(request: GetEcoDeclarationRequest) {
    return this.api.downloadFile('/eco-declaration/csv/emissions', 'environment-declaration-emissions.csv', request);
  }


  exportEcoDeclarationEmissionsTechnologies(request: GetEcoDeclarationRequest) {
    return this.api.downloadFile('/eco-declaration/csv/technologies', 'environment-declaration-technologies.csv', request);
  }

}

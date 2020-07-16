import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Type } from "class-transformer";
import { ApiService, ApiResponse } from '../api.service';
import { IFacilityFilters } from '../facilities/models';
import { DateRange } from '../common';



export class EcoDeclaration {
  emissions: Map<Date, Map<string, number>>;
  emissionsPerWh: Map<Date, Map<string, number>>;
  totalEmissions: Map<string, number>;
  totalEmissionsPerWh: Map<string, number>;
  totalConsumedAmount: number;
  technologies: Map<string, number>;
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

}

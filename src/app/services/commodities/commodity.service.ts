import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Type } from "class-transformer";
import * as moment from 'moment';
import { ApiService, ApiResponse } from '../api.service';
import { MeasurementDataSet, MeasurementType, GgoDistributionBundle } from './models';
import { IFacilityFilters } from '../facilities/models';
import { DateRange } from '../common';


// -- getGgoDistribution request & response ----------------------------------


export class GetGgoDistributionRequest {
  @Type(() => DateRange)
  dateRange: DateRange;
//   filters?: IFacilityFilters;

  constructor(args: {
    dateRange: DateRange,
  }) {
    Object.assign(this, args);
  }
}


export class GetGgoDistributionResponse extends ApiResponse {
  @Type(() => GgoDistributionBundle)
  distributions: GgoDistributionBundle;
}


// -- getMeasurements request & response -------------------------------------


export class GetMeasurementsRequest {
  @Type(() => DateRange)
  dateRange: DateRange;
  measurementType?: MeasurementType;
  filters?: IFacilityFilters;

  constructor(args: {
    dateRange: DateRange,
    measurementType?: MeasurementType,
    filters?: IFacilityFilters,
  }) {
    Object.assign(this, args);
  }
}


export class GetMeasurementsResponse extends ApiResponse {
  labels: string[];

  @Type(() => MeasurementDataSet)
  ggos: MeasurementDataSet[];

  @Type(() => MeasurementDataSet)
  measurements: MeasurementDataSet;
}



// -- Service ----------------------------------------------------------------


@Injectable({
  providedIn: 'root'
})
export class CommodityService {


  constructor(private api: ApiService) {}


  getGgoDistribution(request: GetGgoDistributionRequest) : Observable<GetGgoDistributionResponse> {
    return this.api.invoke('/commodities/distributions', GetGgoDistributionResponse, request);
  }


  getMeasurements(request: GetMeasurementsRequest) : Observable<GetMeasurementsResponse> {
    return this.api.invoke('/commodities/measurements', GetMeasurementsResponse, request);
  }


  exportMeasurements(request: GetMeasurementsRequest) {
    return this.api.downloadFile('/commodities/measurements/csv', 'measurements.csv', request);
  }


  exportGgoSummary(request: GetMeasurementsRequest) {
    return this.api.downloadFile('/commodities/ggo-summary/csv', 'ggo-summary.csv', request);
  }


  exportGgoList(request: GetMeasurementsRequest) {
    return this.api.downloadFile('/commodities/ggo-list/csv', 'ggo-list.csv', request);
  }

}

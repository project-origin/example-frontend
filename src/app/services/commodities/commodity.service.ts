import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Type } from "class-transformer";
import { ApiService, ApiResponse } from '../api.service';
import { Measurement, MeasurementDataSet, MeasurementType, GgoDistributionBundle, GgoCategory } from './models';
import { IFacilityFilters } from '../facilities/models';
import { DateRange } from '../common';


// -- getGgoDistribution request & response ----------------------------------


export class GetGgoDistributionRequest {
  @Type(() => DateRange)
  dateRange: DateRange;
  utcOffset: number;

  constructor(args: {
    dateRange: DateRange,
  }) {
    Object.assign(this, args);
    this.utcOffset = (new Date().getTimezoneOffset()) / 60 * -1;
  }
}


export class GetGgoDistributionResponse extends ApiResponse {
  @Type(() => GgoDistributionBundle)
  distributions: GgoDistributionBundle;
}


// -- getGgoSummary request & response -------------------------------------


export class GetGgoSummaryRequest {
  @Type(() => DateRange)
  dateRange: DateRange;
  category: GgoCategory;
  utcOffset: number;

  constructor(args: {
    dateRange: DateRange,
    category: GgoCategory,
  }) {
    Object.assign(this, args);
    this.utcOffset = (new Date().getTimezoneOffset()) / 60 * -1;
  }
}


export class GetGgoSummaryResponse extends ApiResponse {
  labels: string[];

  @Type(() => MeasurementDataSet)
  ggos: MeasurementDataSet[];
}


// -- getMeasurements request & response -------------------------------------


export class GetMeasurementsRequest {
  @Type(() => DateRange)
  dateRange: DateRange;
  measurementType?: MeasurementType;
  filters?: IFacilityFilters;
  utcOffset: number;

  constructor(args: {
    dateRange: DateRange,
    measurementType?: MeasurementType,
    filters?: IFacilityFilters,
  }) {
    Object.assign(this, args);
    this.utcOffset = (new Date().getTimezoneOffset()) / 60 * -1;
  }
}


export class GetMeasurementsResponse extends ApiResponse {
  labels: string[];

  @Type(() => MeasurementDataSet)
  measurements: MeasurementDataSet;
}


// -- getPeakMeasurement request & response ----------------------------------


export class GetPeakMeasurementRequest {
  @Type(() => DateRange)
  dateRange: DateRange;
  measurementType?: MeasurementType;
  utcOffset: number;

  constructor(args: {
    dateRange: DateRange,
    measurementType?: MeasurementType,
  }) {
    Object.assign(this, args);
    this.utcOffset = (new Date().getTimezoneOffset()) / 60 * -1;
  }
}


export class GetPeakMeasurementResponse extends ApiResponse {
  @Type(() => Measurement)
  measurement: Measurement;
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


  getGgoSummary(request: GetGgoSummaryRequest) : Observable<GetGgoSummaryResponse> {
    return this.api.invoke('/commodities/ggo-summary', GetGgoSummaryResponse, request);
  }


  getMeasurements(request: GetMeasurementsRequest) : Observable<GetMeasurementsResponse> {
    return this.api.invoke('/commodities/measurements', GetMeasurementsResponse, request);
  }


  getPeakMeasurement(request: GetPeakMeasurementRequest) : Observable<GetPeakMeasurementResponse> {
    return this.api.invoke('/commodities/get-peak-measurement', GetPeakMeasurementResponse, request);
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

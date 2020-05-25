import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Type, Transform } from "class-transformer";
import { ApiService, ApiResponse } from '../api.service';
import { IFacilityFilters, Facility } from '../facilities/models';
import { DateRange } from '../common';
import { MeasurementDataSet } from '../commodities/models';
import { Disclosure } from './models';
import * as moment from 'moment';



export enum SummaryResolution {
  all = 'all',
  year = 'year',
  month = 'month',
  day = 'day',
  hour = 'hour',
}


// -- getDisclosure request & response ---------------------------------------


export class DisclosureDataSeries {
  gsrn: string;
  address: string;
  measurements: number[];

  @Type(() => MeasurementDataSet)
  ggos: MeasurementDataSet[];
}


export class GetDisclosureRequest {
  @Type(() => DateRange)
  dateRange?: DateRange;
  id: string;

  constructor(args: {
    dateRange?: DateRange,
    id: string,
  }) {
    Object.assign(this, args);
  }
}


export class GetDisclosureResponse extends ApiResponse {
  labels: string[];
  description: string;

  @Type(() => DisclosureDataSeries)
  data: DisclosureDataSeries[];

  @Transform(obj => moment(obj).format('YYYY-MM-DD'), { toPlainOnly: true })
  begin: Date;

  @Transform(obj => moment(obj).format('YYYY-MM-DD'), { toPlainOnly: true })
  end: Date;
}


// -- getDisclosurePreview request & response --------------------------------


export class GetDisclosurePreviewRequest {
  @Type(() => DateRange)
  dateRange: DateRange;
  filters?: IFacilityFilters;

  constructor(args: {
    dateRange: DateRange,
    filters?: IFacilityFilters,
  }) {
    Object.assign(this, args);
  }
}


export class GetDisclosurePreviewResponse extends ApiResponse {
  facilities: Facility[];

  @Type(() => DateRange)
  dateRange: DateRange;
}


// -- getDisclosureListPreview request & response ----------------------------


export class GetDisclosureListResponse extends ApiResponse {
  @Type(() => Disclosure)
  disclosures: Disclosure[];
}


// -- createDisclosure request & response ------------------------------------


export class CreateDisclosureRequest {
  name: string;
  description: string;
  gsrn: string[] = [];
  maxResolution: SummaryResolution;
  publicizeMeteringpoints: boolean;
  publicizeGsrn: boolean;
  publicizePhysicalAddress: boolean;

  @Type(() => DateRange)
  dateRange: DateRange;

  constructor(args: {
    name: string,
    description: string,
    gsrn: string[],
    maxResolution: SummaryResolution,
    publicizeMeteringpoints: boolean,
    publicizeGsrn: boolean,
    publicizePhysicalAddress: boolean,
    dateRange: DateRange,
  }) {
    Object.assign(this, args);
  }
}


export class CreateDisclosureResponse extends ApiResponse {
  id: string;
}


// -- DeleteDisclosure request & response ------------------------------------


export class DeleteDisclosureRequest {
  id: string;

  constructor(args: {
    id: string,
  }) {
    Object.assign(this, args);
  }
}


export class DeleteDisclosureResponse extends ApiResponse {}



// -- Service ----------------------------------------------------------------


@Injectable({
  providedIn: 'root'
})
export class DisclosureService {


  constructor(private api: ApiService) {}


  getDisclosure(request: GetDisclosureRequest) : Observable<GetDisclosureResponse> {
    return this.api.invoke('/disclosure', GetDisclosureResponse, request);
  }


  getDisclosureList() : Observable<GetDisclosureListResponse> {
    return this.api.invoke('/disclosure/list', GetDisclosureListResponse, {});
  }


  getDisclosurePreview(request: GetDisclosurePreviewRequest) : Observable<GetDisclosurePreviewResponse> {
    return this.api.invoke('/disclosure/preview', GetDisclosurePreviewResponse, request);
  }


  createDisclosure(request: CreateDisclosureRequest) : Observable<CreateDisclosureResponse> {
    return this.api.invoke('/disclosure/create', CreateDisclosureResponse, request);
  }


  deleteDisclosure(request: DeleteDisclosureRequest) : Observable<DeleteDisclosureResponse> {
    return this.api.invoke('/disclosure/delete', DeleteDisclosureResponse, request);
  }

}

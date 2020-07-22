import { Injectable } from '@angular/core';
import { Type, Transform } from 'class-transformer';
import { Observable } from 'rxjs';
import * as moment from 'moment';
import { ApiService, ApiResponse } from '../api.service';


export class Forecast {
  id: string;
  sender: string;
  recipient: string;
  sector: string;
  reference: string;
  resolution: string;
  forecast: number[];
  
  @Type(() => Date)
  created: Date;
  
  @Type(() => Date)
  begin: Date;
  
  @Type(() => Date)
  end: Date;

  @Type(() => Date)
  begins: Date[];

  @Type(() => Date)
  ends: Date[];

  get createdString() : string {
    return moment(this.created).format('MMMM Do YYYY, h:mm:ss a');
  }
}


// -- getForecastList request & response ---------------------------------- //


export class GetForecastListRequest {
  reference?: string;
  offset?: number;
  limit?: number;

  @Transform(obj => moment(obj).toISOString(), { toPlainOnly: true })
  atTime?: Date;

  constructor(args: {
    reference?: string,
    offset?: number,
    limit?: number,
    atTime?: Date,
  }) {
    Object.assign(this, args);
  }
}


export class GetForecastListResponse extends ApiResponse {
  total: number;

  @Type(() => Forecast)
  forecasts: Forecast[] = [];
}


// -- getForecastSeries request & response -------------------------------- //


export class GetForecastSeriesResponse extends ApiResponse {
  sent: string[];
  received: string[];
}


// -- Service ------------------------------------------------------------- //


@Injectable({
  providedIn: 'root'
})
export class ForecastService {


  constructor(private api: ApiService) {}


  getForecastList(request: GetForecastListRequest) : Observable<GetForecastListResponse> {
    return this.api.invoke('/forecast/list', GetForecastListResponse, request);
  }


  getForecastSeries() : Observable<GetForecastSeriesResponse> {
    return this.api.invoke('/forecast/series', GetForecastSeriesResponse);
  }

}

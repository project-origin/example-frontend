import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Type } from "class-transformer";

import { ApiService, ApiResponse } from 'src/app/services/api.service';
import { Facility, IFacilityFilters } from './models';


// -- getFacilityList request & response ---------------------------------- //

export enum FacilityOrderBy {
  name = 'name',
  retirePriority = 'retirePriority',
}


export interface IGetFacilityListRequest {
  filters?: IFacilityFilters;
  orderBy?: FacilityOrderBy;
}


export class GetFacilityListResponse extends ApiResponse {
  @Type(() => Facility)
  facilities: Facility[] = [];
}


// -- editFacilityDetails request & response ------------------------------ //


export interface IEditFacilityDetailsRequest {
  name: string;
  tags: string[];
}


export class EditFacilityDetails extends ApiResponse {}


// -- getFilteringOptions request & response ------------------------------ //


export interface IGetFilteringOptionsRequest {
  filters?: IFacilityFilters;
}


export class GetFilteringOptionsResponse extends ApiResponse {
  sectors: string[] = [];
  tags: string[] = [];
  technologies: string[] = [];
}


// -- setRetiringPriority request & response ------------------------------ //


export interface ISetRetiringPriorityRequest {
  idsPrioritized: string[];
}


export class SetRetiringPriorityResponse extends ApiResponse {}


// -- Service ------------------------------------------------------------- //


@Injectable({
  providedIn: 'root'
})
export class FacilityService {

  constructor(private api: ApiService) {}


  getFacilityList(request: IGetFacilityListRequest = {}) : Observable<GetFacilityListResponse> {
    return this.api.invoke('/facilities', GetFacilityListResponse, request);
  }


  editFacilityDetails(request: IEditFacilityDetailsRequest) : Observable<EditFacilityDetails> {
    return this.api.invoke('/facilities/edit', EditFacilityDetails, request);
  }


  getFilteringOptions(request: IGetFilteringOptionsRequest = {}) : Observable<GetFilteringOptionsResponse> {
    return this.api.invoke('/facilities/get-filtering-options', GetFilteringOptionsResponse, request);
  }


  setRetiringPriority(request: ISetRetiringPriorityRequest) : Observable<SetRetiringPriorityResponse> {
    return this.api.invoke('/facilities/set-retiring-priority', SetRetiringPriorityResponse, request);
  }


  retireBackInTime() : Observable<ApiResponse> {
    return this.api.invoke('/facilities/retire-back-in-time', ApiResponse, {});
  }

}

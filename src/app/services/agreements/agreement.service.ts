import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Type, Transform } from "class-transformer";
import * as moment from 'moment';
import { ApiService, ApiResponse } from '../api.service';
import { Agreement, AgreementDirection } from './models';
import { MeasurementDataSet } from '../commodities/models';
import { DateRange } from '../common';


// -- getAgreements request & response ---------------------------------------


export class GetAgreementsResponse extends ApiResponse {
  @Type(() => Agreement)
  pending: Agreement[];

  @Type(() => Agreement)
  sent: Agreement[];

  @Type(() => Agreement)
  inbound: Agreement[];

  @Type(() => Agreement)
  outbound: Agreement[];
}


// -- getAgreementDetails request & response ---------------------------------


export class GetAgreementDetailsRequest {
  id?: string;

  constructor(args: {
    id?: string,
  }) {
    Object.assign(this, args);
  }
}


export class GetAgreementDetailsResponse extends ApiResponse {
  @Type(() => Agreement)
  agreement: Agreement = null;
}


// -- getAgreementSummary request & response ---------------------------------


export class GetAgreementSummaryRequest {
  id?: string;
  direction?: AgreementDirection;

  @Type(() => DateRange)
  dateRange?: DateRange;

  constructor(args: {
    id?: string,
    direction?: AgreementDirection,
    dateRange?: DateRange,
  }) {
    Object.assign(this, args);
  }
}


export class GetAgreementSummaryResponse extends ApiResponse {
  labels: string[];

  @Type(() => MeasurementDataSet)
  ggos: MeasurementDataSet[] = [];
}


// -- submitProposal requests & responses ------------------------------------


export class SubmitProposalRequest {
  direction: AgreementDirection;
  reference: string;
  counterpartId: string;
  technology: string;
  amount: number;
  unit: string;

  @Transform(obj => obj || [], { toPlainOnly: true })
  facilityIds: string[];

  @Type(() => DateRange)
  date: DateRange;

  constructor(args: {
    direction: AgreementDirection,
    reference: string,
    counterpartId: string,
    technology: string,
    facilityIds: string[],
    amount: number,
    unit: string,
    date: DateRange,
  }) {
    Object.assign(this, args);
  }
}


export class SubmitProposalResponse extends ApiResponse {}


// -- respondToProposal requests & responses ---------------------------------


export class RespondToProposalRequest {
  id: string;
  accept: boolean;
  technology: string;

  @Transform(obj => obj || [], { toPlainOnly: true })
  facilityIds: string[];

  constructor(args: {
    id: string,
    accept: boolean,
    technology?: string,
    facilityIds?: string[],
  }) {
    Object.assign(this, args);
  }
}


export class RespondToProposalResponse extends ApiResponse {}


// -- withdrawProposal request & response ------------------------------------


export class WithdrawProposalsRequest {
  id: string;

  constructor(args: {id: string}) {
    this.id = args.id;
  }
}


export class WithdrawProposalsResponse extends ApiResponse {}


// -- countPendingProposalt request & response -------------------------------


export class CountPendingProposalsResponse extends ApiResponse {
  count: number;
}


// -- Service ----------------------------------------------------------------


@Injectable({
  providedIn: 'root'
})
export class AgreementService {

  constructor(private api: ApiService) {}


  getAgreements() : Observable<GetAgreementsResponse> {
    return this.api.invoke('/agreements', GetAgreementsResponse);
  }


  getAgreementDetails(request: GetAgreementDetailsRequest) : Observable<GetAgreementDetailsResponse> {
    return this.api.invoke('/agreements/details', GetAgreementDetailsResponse, request);
  }


  getAgreementSummary(request: GetAgreementSummaryRequest) : Observable<GetAgreementSummaryResponse> {
    return this.api.invoke('/agreements/summary', GetAgreementSummaryResponse, request);
  }


  submitProposal(request: SubmitProposalRequest) : Observable<SubmitProposalResponse> {
    return this.api.invoke('/agreements/propose', SubmitProposalResponse, request);
  }


  respondToProposal(request: RespondToProposalRequest) : Observable<RespondToProposalResponse> {
    return this.api.invoke('/agreements/propose/respond', RespondToProposalResponse, request);
  }


  withdrawProposal(request: WithdrawProposalsRequest) : Observable<WithdrawProposalsResponse> {
    return this.api.invoke('/agreements/propose/withdraw', WithdrawProposalsResponse, request);
  }


  countPendingProposalt() : Observable<CountPendingProposalsResponse> {
    return this.api.invoke('/agreements/propose/pending-count', CountPendingProposalsResponse);
  }


  exportGgoSummary(request: GetAgreementSummaryRequest) {
    return this.api.downloadFile('/agreements/ggo-summary/csv', 'transfer-ggo-summary.csv', request);
  }

}

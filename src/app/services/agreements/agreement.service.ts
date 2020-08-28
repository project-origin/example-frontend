import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Type, Transform } from "class-transformer";
import { ApiService, ApiResponse } from '../api.service';
import { Agreement, AgreementDirection, GgoSupplier } from './models';
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

  @Type(() => Agreement)
  cancelled: Agreement[];

  @Type(() => Agreement)
  declined: Agreement[];
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
  utcOffset: number;

  @Type(() => DateRange)
  dateRange?: DateRange;

  constructor(args: {
    id?: string,
    direction?: AgreementDirection,
    dateRange?: DateRange,
  }) {
    Object.assign(this, args);
    this.utcOffset = (new Date().getTimezoneOffset()) / 60 * -1;
  }
}


export class GetAgreementSummaryResponse extends ApiResponse {
  labels: string[];

  @Type(() => MeasurementDataSet)
  ggos: MeasurementDataSet[] = [];
}


// -- cancelAgreement request & response ---------------------------------


export class CancelAgreementRequest {
  id?: string;

  constructor(args: {
    id?: string,
  }) {
    Object.assign(this, args);
  }
}


export class CancelAgreementResponse extends ApiResponse {}


// -- submitProposal requests & responses ------------------------------------


export class SubmitProposalRequest {
  direction: AgreementDirection;
  reference: string;
  counterpartId: string;
  technologies: string[];
  amount: number;
  unit: string;
  amountPercent: number;
  limitToConsumption: boolean;
  proposalNote: string;

  @Transform(obj => obj || [], { toPlainOnly: true })
  facilityIds: string[];

  @Type(() => DateRange)
  date: DateRange;

  constructor(args: {
    direction: AgreementDirection,
    reference: string,
    counterpartId: string,
    technologies: string[],
    facilityIds?: string[],
    amount: number,
    unit: string,
    amountPercent: number,
    date: DateRange,
    limitToConsumption: boolean,
    proposalNote: string,
  }) {
    Object.assign(this, args);
  }
}


export class SubmitProposalErrors {
  reference: string[] = [];
  counterpartId: string[] = [];
  amount: string[] = [];
  date: string[] = [];
  amountPercent: string[] = [];
  limitToConsumption: string[] = [];
}


export class SubmitProposalResponse extends ApiResponse {
  @Type(() => SubmitProposalErrors)
  errors: SubmitProposalErrors = new SubmitProposalErrors();
}


// -- respondToProposal requests & responses ---------------------------------


export class RespondToProposalRequest {
  id: string;
  accept: boolean;
  technologies: string[];
  amountPercent: number;

  @Transform(obj => obj || [], { toPlainOnly: true })
  facilityIds: string[];

  constructor(args: {
    id: string,
    accept: boolean,
    technologies?: string[],
    facilityIds?: string[],
    amountPercent?: number,
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


// -- setTransferPriority request & response ------------------------------ //


export interface ISSetTransferPriorityRequest {
  idsPrioritized: string[];
}


export class SetTransferPriorityResponse extends ApiResponse {}


// -- setFacilities request & response ------------------------------ //


export interface ISetFacilitiesRequest {
  id: string;
  facilityIds: string[];
}


export class SetFacilitiesResponse extends ApiResponse {}


// -- setFacilities request & response ------------------------------ //


export class FindSuppliersRequest {
  @Type(() => DateRange)
  dateRange: DateRange;
  minAmount: number;

  constructor(args: {
    dateRange: DateRange,
    minAmount: number,
  }) {
    Object.assign(this, args);
  }
}


export class FindSuppliersResponse extends ApiResponse {
  @Type(() => GgoSupplier)
  suppliers: GgoSupplier[];
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


  cancelAgreement(request: CancelAgreementRequest) : Observable<CancelAgreementResponse> {
    return this.api.invoke('/agreements/cancel', CancelAgreementResponse, request);
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


  setTransferPriority(request: ISSetTransferPriorityRequest) : Observable<SetTransferPriorityResponse> {
    return this.api.invoke('/agreements/set-transfer-priority', SetTransferPriorityResponse, request);
  }


  findSuppliers(request: FindSuppliersRequest) : Observable<FindSuppliersResponse> {
    return this.api.invoke('/agreements/find-suppliers', FindSuppliersResponse, request);
  }


  setFacilities(request: ISetFacilitiesRequest) : Observable<SetFacilitiesResponse> {
    return this.api.invoke('/agreements/set-facilities', SetFacilitiesResponse, request);
  }


  exportGgoSummary(request: GetAgreementSummaryRequest) {
    return this.api.downloadFile('/agreements/ggo-summary/csv', 'transfer-ggo-summary.csv', request);
  }

}

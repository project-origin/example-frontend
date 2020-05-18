import { Type } from "class-transformer";
import { Facility } from '../facilities/models';


export enum AgreementState {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DECLINED = 'DECLINED',
  CANCELLED = 'CANCELLED',
  WITHDRAWN = 'WITHDRAWN',
}


export enum AgreementDirection {
  inbound = 'inbound',
  outbound = 'outbound'
}


export class Agreement {
  state: AgreementState;
  direction: AgreementDirection;
  id: string;
  reference: string;
  counterpart: string;
  technology: string;
  amount: number;
  unit: string;
  dateFrom: Date;
  dateTo: Date;

  @Type(() => Facility)
  facilities: Facility[] = [];
}

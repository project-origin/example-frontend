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
  technologies: string[];
  amount: number;
  unit: string;
  amountPercent: number | null;
  dateFrom: Date;
  dateTo: Date;
  limitToConsumption: boolean;
  proposalNote: string;

  @Type(() => Facility)
  facilities: Facility[] = [];

  get isOutbound() : boolean {
    return this.direction == AgreementDirection.outbound;
  }

  get isInbound() : boolean {
    return this.direction == AgreementDirection.inbound;
  }

  get directionString() : string {
    return this.direction.toString();
  }

  get technologiesString() : string {
    return this.technologies.join(', ');
  }
}

import { Type } from "class-transformer";
import { Facility } from '../facilities/models';


export enum AgreementDirection {
  inbound = 'inbound',
  outbound = 'outbound'
}


export class Agreement {
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

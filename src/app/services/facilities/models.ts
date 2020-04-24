
export enum FacilityType {
  production = 'production',
  consumption = 'consumption'
}


export class IFacilityFilters {
  facilityType?: FacilityType;
  gsrn?: string[] = [];
  sectors?: string[] = [];
  tags?: string[] = [];
  text?: string;
  technology?: string;
}


export class Facility {
  id: string;
  gsrn: string;
  facilityType: FacilityType;
  technologyType: string;
  technologyCode: string;
  sourceCode: string;
  sector: string;
  name: string;
  description: string;
  address: string;
  postcode: string;
  cityName: string;
  tags: string[] = [];
  retiringPriority: number;

  isProducer() : boolean {
    return this.facilityType === FacilityType.production;
  }

  isConsumer() : boolean {
    return this.facilityType === FacilityType.consumption;
  }

  isGgoReceiver() : boolean {
    return (this.retiringPriority !== null && !isNaN(this.retiringPriority));
  }
}

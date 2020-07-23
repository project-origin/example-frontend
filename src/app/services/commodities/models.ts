import { Type } from "class-transformer";


export class CommodityColor {
  static get(technology: string) : string {
    switch(technology.toLocaleLowerCase()) {
      case 'production':
        return '#0073a0';
      case 'consumption':
        return '#ce3e2d';
      case 'wind':
        return '#0a515d';
      case 'marine':
        return '#f29e1f';
      case 'hydro':
        return '#00a98f';
      case 'solar':
        return '#ffd424';
      case 'biomass':
        return '#a0cd92';
      case 'biogas':
        return '#293a4c';
      case 'waste':
        return '#a0c1c2';
      case 'coal':
        return '#333333';
      case 'naturalgas':
        return '#a0ffc8';
      case 'oil':
        return '#ff6600';
      case 'nuclear':
        return '#8064a2';
      default:
        return '#4bacc6';
    }
  }
}


export enum MeasurementType {
  production = 'production',
  consumption = 'consumption'
}


export enum GgoCategory {
  issued = 'issued',
  stored = 'stored',
  retired = 'retired',
  expired = 'expired',
}


export class GgoTechnology {
  technology: string;
  amount: number;

  get color() : string {
    return CommodityColor.get(this.technology);
  }
}


export class GgoDistribution {
  @Type(() => GgoTechnology)
  technologies: GgoTechnology[] = [];

  get total(): number {
    return this.technologies.reduce((a, b) => a + b.amount, 0);
  }
}


export class GgoDistributionBundle {
  @Type(() => GgoDistribution)
  issued: GgoDistribution;
  
  @Type(() => GgoDistribution)
  inbound: GgoDistribution;
  
  @Type(() => GgoDistribution)
  outbound: GgoDistribution;
  
  @Type(() => GgoDistribution)
  stored: GgoDistribution;
  
  @Type(() => GgoDistribution)
  retired: GgoDistribution;
  
  @Type(() => GgoDistribution)
  expired: GgoDistribution;
}


export class MeasurementDataSet {
  label: string;
  values: number[] = [];
  unit: string;

  constructor(args: {
    label?: string,
    values?: number[],
    unit?: string,
  }) {
    Object.assign(this, args);
  }

  get color() : string {
    return CommodityColor.get(this.label);
  }
}

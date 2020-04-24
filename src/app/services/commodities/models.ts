import { Type } from "class-transformer";


export class CommodityColor {
  static get(technology: string) : string {
    switch(technology.toLocaleLowerCase()) {
      case 'production':
        return '#0073a0';
      case 'consumption':
        return '#ce3e2d';
      case 'hydro':
        return '#2b505d';
      case 'solar':
        return '#d59c48';
      case 'wind':
        return '#679b9c';
      case 'oil':
        return '#882416';
      case 'coal':
        return '#333333';
      default:
        return '#000000';
    }
  }
}


export enum MeasurementType {
  production = 'production',
  consumption = 'consumption'
}


export class GgoTechnology {
  technology: string;
  amount: number;
  unit: string;

  get color() : string {
    return CommodityColor.get(this.technology);
  }
}


export class GgoDistribution {
  @Type(() => GgoTechnology)
  technologies: GgoTechnology[] = [];
  total: number;
  unit: string;
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

  get color() : string {
    return CommodityColor.get(this.label);
  }
}

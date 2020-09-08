import { Pipe, PipeTransform } from '@angular/core';
import { formatNumber } from '@angular/common';


export enum AmountUnit {
    GWh = Math.pow(10, 9),
    MWh = Math.pow(10, 6),
    kWh = Math.pow(10, 3),
    Wh = 1,
}


export class FormatAmount {
    static format(amount: number) : string {
        let unit = FormatAmount.getUnit(amount);
        let unitLabel = FormatAmount.getUnitLabel(unit);
        return formatNumber(amount / unit, 'da', '1.0-2') + ' ' + unitLabel;
    }

    static getAmount(amount: number) {
        let unit = FormatAmount.getUnit(amount);
        return amount / unit;
    }

    static getUnit(amount: number) : AmountUnit {
        if(amount >= AmountUnit.GWh) {
            return AmountUnit.GWh;
        } else if(amount >= AmountUnit.MWh) {
            return AmountUnit.MWh;
        } else if(amount >= AmountUnit.kWh) {
            return AmountUnit.kWh;
        } else {
            return AmountUnit.Wh;
        }
    }

    static getUnitLabel(unit: AmountUnit) : string {
        switch(unit) {
            case AmountUnit.GWh:
                return 'GWh';
            case AmountUnit.MWh:
                return 'MWh';
            case AmountUnit.kWh:
                return 'kWh';
            case AmountUnit.Wh:
                return 'Wh';
        }
    }

    static getUnitLabelForAmount(amount: number) {
        return FormatAmount.getUnitLabel(FormatAmount.getUnit(amount));
    }
}


export enum EmissionUnit {
    ton = Math.pow(10, 6),
    kg = Math.pow(10, 3),
    g = 1,
}


export class FormatEmission {
    static format(amount: number) : string {
        let unit = FormatEmission.getUnit(amount);
        let unitLabel = FormatEmission.getUnitLabel(unit);
        return formatNumber(amount / unit, 'da', '1.0-2') + ' ' + unitLabel;
    }

    static getAmount(amount: number) {
        let unit = FormatEmission.getUnit(amount);
        return amount / unit;
    }

    static getUnit(amount: number) : EmissionUnit {
        if(amount >= EmissionUnit.ton) {
            return EmissionUnit.ton;
        } else if(amount >= EmissionUnit.kg) {
            return EmissionUnit.kg;
        } else {
            return EmissionUnit.g;
        }
    }

    static getUnitLabel(unit: EmissionUnit) : string {
        switch(unit) {
            case EmissionUnit.ton:
                return 'ton';
            case EmissionUnit.kg:
                return 'kg';
            case EmissionUnit.g:
                return 'g';
        }
    }

    static getUnitLabelForAmount(amount: number) {
        return FormatEmission.getUnitLabel(FormatEmission.getUnit(amount));
    }
}


@Pipe({name: 'formatAmount'})
export class formatAmountTransformer implements PipeTransform {
  transform(amount: number): string {
    return FormatAmount.format(amount);
  }
}


@Pipe({name: 'formatEmission'})
export class formatEmissionTransformer implements PipeTransform {
  transform(amount: number): string {
    return FormatEmission.format(amount);
  }
}


@Pipe({name: 'formatNumber'})
export class formatNumberTransformer implements PipeTransform {
  transform(amount: number, decimals: number = 3): string {
    return formatNumber(amount, 'da', '1.0-'+decimals);
  }
}

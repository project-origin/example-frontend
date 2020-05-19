import { Pipe, PipeTransform } from '@angular/core';
import { formatNumber } from '@angular/common';


export enum Unit {
    GWh = Math.pow(10, 9),
    MWh = Math.pow(10, 6),
    kWh = Math.pow(10, 3),
    Wh = 1,
}


export class FormatAmount {
    static format(amount: number) : string {
        let unit = FormatAmount.getUnit(amount);
        let unitLabel = FormatAmount.getUnitLabel(unit);
        return formatNumber(amount / unit, 'da') + ' ' + unitLabel;
    }

    static getAmount(amount: number) {
        let unit = FormatAmount.getUnit(amount);
        return amount / unit;
    }

    static getUnit(amount: number) : Unit {
        if(amount >= Unit.GWh) {
            return Unit.GWh;
        } else if(amount >= Unit.MWh) {
            return Unit.MWh;
        } else if(amount >= Unit.kWh) {
            return Unit.kWh;
        } else {
            return Unit.Wh;
        }
    }

    static getUnitLabel(unit: Unit) : string {
        switch(unit) {
            case Unit.GWh:
                return 'GWh';
            case Unit.MWh:
                return 'MWh';
            case Unit.kWh:
                return 'kWh';
            case Unit.Wh:
                return 'Wh';
        }
    }

    static getUnitLabelForAmount(amount: number) {
        return FormatAmount.getUnitLabel(FormatAmount.getUnit(amount));
    }
}


@Pipe({name: 'formatAmount'})
export class formatAmountTransformer implements PipeTransform {
  transform(amount: number): string {
    return FormatAmount.format(amount);
  }
}

import { Component, OnInit, Input } from '@angular/core';
import { EcoDeclaration } from 'src/app/services/environment/environment.service';


@Component({
  selector: 'app-emission-overview',
  templateUrl: './emission-overview.component.html',
  styleUrls: ['./emission-overview.component.css']
})
export class EmissionOverviewComponent implements OnInit {


  @Input() dateFrom: Date;
  @Input() dateTo: Date;
  @Input() individual: EcoDeclaration;
  @Input() general: EcoDeclaration;


  // RENEWABLE ENERGY PERCENT GAUGE CHART
  renewableEnergyGaugeOptions = {
    hasNeedle: true,
    needleColor: 'gray',
    needleUpdateSpeed: 0,
    arcColors: ['green', 'black'],
    arcDelimiters: [50],
    rangeLabel: ['0%', '100%'],
    needleStartValue: 0,
  }


  // GGO SHARE PERCENT GAUGE CHART
  ggoShareGaugeOptions = {
    hasNeedle: true,
    needleColor: 'gray',
    needleUpdateSpeed: 0,
    arcColors: ['green', 'black'],
    arcDelimiters: [50],
    rangeLabel: ['0%', '100%'],
    needleStartValue: 0,
  }


  ngOnInit() {
    this.buildGaugeChart(this.renewableEnergyGaugeOptions, this.cleanEnergyPercentage);
    this.buildGaugeChart(this.ggoShareGaugeOptions, this.ggoPercentage);
  }


  buildGaugeChart(options: any, value: number) {
    if(value == 0) {
      options['arcColors'] = ['black', 'black'];
      options['arcDelimiters'] = [1];
    } else if(value == 100) {
      options['arcColors'] = ['green', 'green'];
      options['arcDelimiters'] = [1];
    } else {
      options['arcColors'] = ['green', 'black'];
      options['arcDelimiters'] = [value];
    }
  }

  get co2Total(): number {
    return this.individual.getTotalEmissions('CO2') / 1000;
  }

  get co2Relative(): number {
    return this.individual.getEmissionsPerkWh('CO2');
  }

  get co2Compared(): number {
    return this.individual.getDeltaEmissionsPerkWh(this.general, 'CO2') || -100;
  }

  get cleanEnergyPercentage(): number {
    let percent: number = 0;

    if('Wind' in this.individual.technologiesMapped)
      percent += this.individual.technologiesMapped['Wind'].percent;
    if('Solar' in this.individual.technologiesMapped)
      percent += this.individual.technologiesMapped['Solar'].percent;
    if('Hydro' in this.individual.technologiesMapped)
      percent += this.individual.technologiesMapped['Hydro'].percent;

    return Math.floor(percent);
  }

  get ggoPercentage(): number {
    if(this.individual.totalConsumedAmount > 0)
      return Math.floor(this.individual.totalRetiredAmount / this.individual.totalConsumedAmount * 100);
    else
      return 0;
  }

}

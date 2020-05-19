import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MultiDataSet, Label, Color } from 'ng2-charts';
import { ChartType, ChartOptions, ChartTooltipItem } from 'chart.js';
import { GgoDistribution, GgoTechnology } from 'src/app/services/commodities/models';
import { FormatAmount } from 'src/app/pipes/unitamount';


@Component({
  selector: 'app-ggo-doughnot-chart',
  templateUrl: './ggo-doughnot-chart.component.html',
  styleUrls: ['./ggo-doughnot-chart.component.css']
})
export class GgoDoughnotChartComponent implements OnChanges {

  @Input() distribution: GgoDistribution;
  @Input() interactive: boolean = true;


  chartLabels: Label[];
  chartData: MultiDataSet;
  chartColors: Color[];
  chartType: ChartType = 'doughnut';
  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1,
    legend: {
      display: false
    },
    animation: {
        duration: 0
    },
    tooltips: {
      enabled: this.interactive,
      callbacks: {
        label: function(tooltipItem, data) {
          if(data.labels[tooltipItem.index].toString() !== 'No data') {
            return data.labels[tooltipItem.index].toString() 
                + ': ' 
                + FormatAmount.format(Number(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]));
          } else {
            return 'No data';
          }
        }
      }
    }
  };


  constructor() { }


  hasData() : boolean {
    return this.distribution && this.distribution.technologies.length > 0;
  }


  ngOnChanges(changes: SimpleChanges) {
    if(this.hasData()) {
      this.chartLabels = this.distribution.technologies.map((tech: GgoTechnology) => tech.technology);
      this.chartData = [ this.distribution.technologies.map((tech: GgoTechnology) => tech.amount) ];
      this.chartColors = [ {
        backgroundColor: this.distribution.technologies.map((tech: GgoTechnology) => tech.color)
      } ];
    } else {
      this.chartLabels = ['No data'];
      this.chartData = [[ 1 ]];
      this.chartColors = [{ backgroundColor: '#f0efef' }];
    }
  }

}

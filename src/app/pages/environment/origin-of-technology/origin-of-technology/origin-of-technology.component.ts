import { Component, OnInit, Input } from '@angular/core';
import { FormatAmount } from 'src/app/pipes/unitamount';
import { CommodityColor } from 'src/app/services/commodities/models';
import { EcoDeclaration } from 'src/app/services/environment/environment.service';
import { Label, MultiDataSet, Color } from 'ng2-charts';
import { ChartType, ChartOptions } from 'chart.js';

@Component({
  selector: 'app-origin-of-technology',
  templateUrl: './origin-of-technology.component.html',
  styleUrls: ['./origin-of-technology.component.css']
})
export class OriginOfTechnologyComponent implements OnInit {


  @Input() individual: EcoDeclaration;

  expandTechnologies: boolean = false;


  // TECHNOLOGIES PIE CHART
  techChartLabels: Label[] = [];
  techChartData: MultiDataSet = [];
  techChartColors: Color[] = [];
  techChartType: ChartType = 'pie';
  techChartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: 1,
    legend: {
      align: 'center',
      position: 'right'
    },
    animation: {
        duration: 200
    },
    tooltips: {
      enabled: true,
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


  ngOnInit(): void {
    this.buildTechnologyChart();
  }


  buildTechnologyChart() {
    let techColors: string[] = [];
    for(var technology in this.individual.totalTechnologies) {
      this.techChartLabels.push(technology);
      this.techChartData.push(this.individual.totalTechnologies[technology]);
      techColors.push(CommodityColor.get(technology));
    }
    this.techChartColors = [ {backgroundColor: techColors} ];
  }


  toggleExpand() {
    this.expandTechnologies = !this.expandTechnologies;
  }

}

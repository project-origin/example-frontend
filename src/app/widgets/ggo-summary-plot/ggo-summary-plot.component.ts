import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MeasurementDataSet, GgoCategory } from 'src/app/services/commodities/models';
import { CommodityService, GetGgoSummaryRequest, GetGgoSummaryResponse } from 'src/app/services/commodities/commodity.service';


@Component({
  selector: 'app-ggo-summary-plot',
  templateUrl: './ggo-summary-plot.component.html',
  styleUrls: ['./ggo-summary-plot.component.css']
})
export class GgoSummaryPlotComponent implements OnChanges {

  @Input() dateFrom: Date;
  @Input() dateTo: Date;
  @Input() category: GgoCategory;

  // Loading state
  loading: boolean = false;
  error: boolean = false;

  // Graph data
  labels: string[] = [];
  bars: MeasurementDataSet[] = [];


  constructor(private commodityService: CommodityService) { }


  ngOnChanges(changes: SimpleChanges) {
    this.loadData();
  }


  loadData() {
    let request = new GetGgoSummaryRequest({
      category: this.category,
      dateRange: {
        begin: this.dateFrom,
        end: this.dateTo,
      },
    });

    this.loading = true;
    this.error = false;
    this.commodityService
        .getGgoSummary(request)
        .subscribe(this.onLoadComplete.bind(this));
  }


  onLoadComplete(response: GetGgoSummaryResponse) {
    this.loading = false;
    this.error = !response.success;
    if(response.success) {
      this.labels = response.labels;
      this.bars = response.ggos;
    }
  }

}

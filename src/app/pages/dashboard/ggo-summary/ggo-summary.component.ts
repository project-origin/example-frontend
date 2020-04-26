import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { GgoDistribution } from 'src/app/services/commodities/models';
import { IFacilityFilters } from 'src/app/services/facilities/models';
import { CommodityService, GetGgoDistributionResponse, GetGgoDistributionRequest } from 'src/app/services/commodities/commodity.service';


@Component({
  selector: 'app-ggo-summary',
  templateUrl: './ggo-summary.component.html',
  styleUrls: ['./ggo-summary.component.css']
})
export class GgoSummaryComponent implements OnChanges {

  @Input() dateFrom: Date;
  @Input() dateTo: Date;
  @Input() filters: IFacilityFilters;

  // Loading state
  loading: boolean = false;
  error: boolean = false;

  issued: GgoDistribution = new GgoDistribution();
  inbound: GgoDistribution = new GgoDistribution();
  outbound: GgoDistribution = new GgoDistribution();
  stored: GgoDistribution = new GgoDistribution();
  retired: GgoDistribution = new GgoDistribution();
  expired: GgoDistribution = new GgoDistribution();


  constructor(private commodityService: CommodityService) { }


  ngOnChanges(changes: SimpleChanges) {
    this.loadData();
  }


  loadData() {
    let request = new GetGgoDistributionRequest({
      dateRange: {
        begin: this.dateFrom,
        end: this.dateTo,
      },
    });

    this.loading = true;
    this.error = false;
    this.commodityService
        .getGgoDistribution(request)
        .subscribe(this.onLoadComplete.bind(this));
  }


  onLoadComplete(response: GetGgoDistributionResponse) {
    this.loading = false;
    this.error = !response.success;

    if(response.success) {
      console.log('GgoSummaryComponent.onLoadComplete', response);
      this.issued = response.distributions.issued;
      this.inbound = response.distributions.inbound;
      this.outbound = response.distributions.outbound;
      this.stored = response.distributions.stored;
      this.retired = response.distributions.retired;
      this.expired = response.distributions.expired;
    }
  }

}

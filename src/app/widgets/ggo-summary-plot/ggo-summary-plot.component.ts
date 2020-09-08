import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MeasurementDataSet, GgoCategory } from 'src/app/services/commodities/models';
import { CommodityService, GetGgoSummaryRequest, GetGgoSummaryResponse } from 'src/app/services/commodities/commodity.service';
import * as moment from 'moment';


@Component({
  selector: 'app-ggo-summary-plot',
  templateUrl: './ggo-summary-plot.component.html',
  styleUrls: ['./ggo-summary-plot.component.css']
})
export class GgoSummaryPlotComponent implements OnChanges {


  @Input() dateFrom: Date;
  @Input() dateTo: Date;
  @Input() category: GgoCategory;

  selectedDateFrom: Date;
  selectedDateTo: Date;


  // Loading state
  loading: boolean = false;
  error: boolean = false;

  // Graph data
  labels: string[] = [];
  bars: MeasurementDataSet[] = [];


  get actualDateFrom() : Date {
    return this.selectedDateFrom ? this.selectedDateFrom : this.dateFrom;
  }


  get actualDateTo() : Date {
    return this.selectedDateTo ? this.selectedDateTo : this.dateTo;
  }


  get deltaDays() : number {
    return moment(this.actualDateTo).diff(this.actualDateFrom, 'days');
  }


  get showNavigationBar() : boolean {
    return true;
  }


  get canZoomIn() : boolean {
    return this.deltaDays > 1;
  }


  get canZoomOut() : boolean {
    return this.deltaDays < (365 * 10);
  }


  get canReset() : boolean {
    return (this.selectedDateFrom !== null || this.selectedDateTo !== null);
  }


  constructor(private commodityService: CommodityService) { }


  ngOnChanges(changes: SimpleChanges) {
    this.selectedDateFrom = null;
    this.selectedDateTo = null;
    this.loadData();
  }


  loadData() {
    let request = new GetGgoSummaryRequest({
      category: this.category,
      dateRange: {
        begin: this.actualDateFrom,
        end: this.actualDateTo,
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


  // -- Navigation and zoom --------------------------------------------------


  navigatePrevious() {
    let deltaDays = this.deltaDays + 1;
    this.selectedDateFrom = moment(this.actualDateFrom).subtract(deltaDays, 'days').toDate();
    this.selectedDateTo = moment(this.actualDateTo).subtract(deltaDays, 'days').toDate();
    this.loadData();
  }


  navigateNext() {
    let deltaDays = this.deltaDays + 1;
    this.selectedDateFrom = moment(this.actualDateFrom).add(deltaDays, 'days').toDate();
    this.selectedDateTo = moment(this.actualDateTo).add(deltaDays, 'days').toDate();
    this.loadData();
  }


  zoomIn() {
    let delta = Math.floor(this.deltaDays / 3);
    delta = (delta > 1) ? delta : 1;
    let dateFrom = moment(this.actualDateFrom).add(delta, 'days');
    let dateTo = moment(this.actualDateTo).subtract(delta, 'days');
    if(dateTo.diff(dateFrom, 'days') < 0) {
      dateFrom = dateTo;
    }
    this.selectedDateFrom = dateFrom.toDate();
    this.selectedDateTo = dateTo.toDate();
    this.loadData();
  }


  zoomOut() {
    let delta = Math.floor(this.deltaDays / 1.5);
    delta = (delta > 1) ? delta : 1;
    this.selectedDateFrom = moment(this.actualDateFrom).subtract(delta, 'days').toDate();
    this.selectedDateTo = moment(this.actualDateTo).add(delta, 'days').toDate();
    this.loadData();
  }


  reset() {
    this.selectedDateFrom = null;
    this.selectedDateTo = null;
    this.loadData();
  }

}

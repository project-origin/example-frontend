import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MeasurementDataSet, MeasurementType, GgoCategory } from 'src/app/services/commodities/models';
import { CommodityService, GetMeasurementsRequest, GetMeasurementsResponse, GetGgoSummaryRequest, GetGgoSummaryResponse } from 'src/app/services/commodities/commodity.service';
import { IFacilityFilters } from 'src/app/services/facilities/models';


@Component({
  selector: 'app-commodity-plot',
  templateUrl: './commodity-plot.component.html',
  styleUrls: ['./commodity-plot.component.css'],
})
export class CommodityPlotComponent implements OnChanges {

  @Input() dateFrom: Date;
  @Input() dateTo: Date;
  @Input() filters: IFacilityFilters;
  @Input() measurementType: MeasurementType = null;
  @Input() ggoCategory: GgoCategory = null;

  // Loading state
  measurementsLoading: boolean = false;
  measurementsError: boolean = false;
  ggosLoading: boolean = false;
  ggosError: boolean = false;

  // Graph data
  loading: boolean = false;
  error: boolean = false;
  labels: string[] = [];
  lines: MeasurementDataSet[] = [];
  bars: MeasurementDataSet[] = [];


  constructor(private commodityService: CommodityService) {}


  ngOnChanges(changes: SimpleChanges) {
    this.loadData();
  }


  loadData() {
    this.labels = [];
    this.lines = [];
    this.bars = [];
    if(this.measurementType !== null)
      this.loadMeasurements();
    if(this.ggoCategory !== null)
      this.loadGgos();
  }


  loadMeasurements() {
    let request = new GetMeasurementsRequest({
      measurementType: this.measurementType,
      filters: this.filters,
      dateRange: {
        begin: this.dateFrom,
        end: this.dateTo,
      },
    });

    this.measurementsLoading = true;
    this.measurementsError = false;
    this.commodityService
        .getMeasurements(request)
        .subscribe(this.onLoadMeasurementsComplete.bind(this));
  }


  onLoadMeasurementsComplete(response: GetMeasurementsResponse) {
    this.measurementsLoading = false;
    this.measurementsError = !response.success;
    if(response.success) {
      if(!this.labels || this.labels.length == 0 && response.labels)
        this.labels = response.labels;
      if(response.measurements)
        this.lines = [response.measurements];
    }
    this.onLoadComplete();
  }


  loadGgos() {
    let request = new GetGgoSummaryRequest({
      category: this.ggoCategory,
      dateRange: {
        begin: this.dateFrom,
        end: this.dateTo,
      },
    });

    this.ggosLoading = true;
    this.ggosError = false;
    this.commodityService
        .getGgoSummary(request)
        .subscribe(this.onLoadGgosComplete.bind(this));
  }


  onLoadGgosComplete(response: GetGgoSummaryResponse) {
    this.ggosLoading = false;
    this.ggosError = !response.success;
    if(response.success) {
      if(!this.labels || this.labels.length == 0 && response.labels)
        this.labels = response.labels;
      if(response.ggos)
        this.bars = response.ggos;
    }
    this.onLoadComplete();
  }


  onLoadComplete() {
    this.loading = this.measurementsLoading || this.ggosLoading;
    this.error = this.measurementsError || this.ggosError;
  }

}

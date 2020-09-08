import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { ForecastService, Forecast, GetForecastListRequest, GetForecastListResponse } from 'src/app/services/forecast/forecast.service';
import { MeasurementDataSet } from 'src/app/services/commodities/models';
import * as moment from 'moment';


@Component({
  selector: 'app-forecast-details',
  templateUrl: './forecast-details.component.html',
  styleUrls: ['./forecast-details.component.css']
})
export class ForecastDetailsComponent implements OnInit, OnChanges {


  @Input() reference: string;
  @Input() offset: number;
  @Output() previous: EventEmitter<any> = new EventEmitter();
  @Output() next: EventEmitter<any> = new EventEmitter();

  loading: boolean = false;
  error: boolean = false;
  forecast: Forecast;

  // Paging
  total: number = 0;

  // Graph
  graphLabels: string[] = [];
  graphData: MeasurementDataSet[] = [];


  constructor(private forecastService: ForecastService) {}


  ngOnInit() {
    this.loadForecast();
  }


  ngOnChanges(changes: SimpleChanges) {
    if('reference' in changes) {
      this.total = 0;
    }
    this.loadForecast();
  }


  // -- Loading data ---------------------------------------------------------


  loadForecast() {
    let request = new GetForecastListRequest({
      reference: this.reference,
      offset: this.offset,
      limit: 1,
    });

    this.loading = true;
    this.error = false;
    this.forecastService
        .getForecastList(request)
        .subscribe(this.onLoadForecastComplete.bind(this));
  }


  onLoadForecastComplete(response: GetForecastListResponse) {
    this.loading = false;
    this.error = !response.success;
    if(response.success && response.forecasts.length > 0) {
      this.forecast = response.forecasts[0];
      this.total = response.total;
      this.buildGraphData();
    } else {
      this.forecast = null;
      this.clearGraphData();
    }
  }


  // -- Graph ----------------------------------------------------------------


  buildGraphData() {
    this.graphLabels = this.forecast.begins.map(
      (begin: Date) => moment(begin).format('YYYY-MM-DD HH:mm:SS'));

    this.graphData = [new MeasurementDataSet({
      label: 'Forecast',
      values: this.forecast.forecast,
    })];
  }


  clearGraphData() {
    this.graphLabels = [];
    this.graphData = [];
  }


  // -- Navigation -----------------------------------------------------------


  canNavigatePrevious() : boolean {
    return this.offset < (this.total - 1);
  }


  canNavigateNext() : boolean {
    return this.offset > 0;
  }


  navigatePrevious() {
    this.previous.emit(null);
  }


  navigateNext() {
    this.next.emit(null);
  }

}

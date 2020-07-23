import { Component, OnInit, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { Forecast, ForecastService, GetForecastListRequest, GetForecastListResponse } from 'src/app/services/forecast/forecast.service';


@Component({
  selector: 'app-forecast-history',
  templateUrl: './forecast-history.component.html',
  styleUrls: ['./forecast-history.component.css']
})
export class ForecastHistoryComponent implements OnInit, OnChanges {


  @Input() reference: string;
  @Input() offset: number;
  @Output() offsetChange: EventEmitter<number> = new EventEmitter<number>();

  loading: boolean = false;
  error: boolean = false;
  forecasts: Forecast[] = [];


  constructor(private forecastService: ForecastService) {}


  ngOnInit(): void {
    this.loadHistory();
  }


  ngOnChanges(changes: SimpleChanges) {
    if('reference' in changes) {
      this.loadHistory();
    }
  }


  getOffset(forecast: Forecast) {
    return this.forecasts.indexOf(forecast);
  }


  // -- Loading data ---------------------------------------------------------


  loadHistory() {
    let request = new GetForecastListRequest({
      reference: this.reference,
    });

    this.loading = true;
    this.error = false;
    this.forecastService
        .getForecastList(request)
        .subscribe(this.onLoadHistoryComplete.bind(this));
  }


  onLoadHistoryComplete(response: GetForecastListResponse) {
    this.loading = false;
    this.error = !response.success;
    if(response.success) {
      this.forecasts = response.forecasts;
    } else {
      this.forecasts = [];
    }
  }


  // -- Selection ------------------------------------------------------------


  isSelected(forecast: Forecast) : boolean {
    return this.getOffset(forecast) == this.offset;
  }


  selectForecast(forecast: Forecast) {
    this.offsetChange.emit(this.getOffset(forecast));
  }

}

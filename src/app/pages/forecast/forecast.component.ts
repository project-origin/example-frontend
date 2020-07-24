import { Component, OnInit } from '@angular/core';
import { ForecastService, GetForecastSeriesResponse } from 'src/app/services/forecast/forecast.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { of } from 'rxjs';


@Component({
  selector: 'app-forecast',
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.css']
})
export class ForecastComponent implements OnInit {


  loading: boolean = false;
  error: boolean = false;
  sentSeries: string[] = [];
  receivedSeries: string[] = [];
  selectedReference: string;
  offset: number = 0;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private forecastService: ForecastService,
  ) { }


  ngOnInit() {
    this.loadSeries();

    this.route.queryParamMap.subscribe((params: ParamMap) => {
      if(params.get('offset')) {
        this.offset = parseInt(params.get('offset'));
      }
      if(params.get('reference')) {
        this.selectedReference = params.get('reference');
      } else {
        this.selectedReference = null;
      }
    });
  }


  // -- Loading data ---------------------------------------------------------


  loadSeries() {
    this.loading = true;
    this.error = false;
    this.forecastService
        .getForecastSeries()
        .subscribe(this.onLoadSeriesComplete.bind(this));
  }


  onLoadSeriesComplete(response: GetForecastSeriesResponse) {
    this.loading = false;
    this.error = !response.success;
    if(response.success) {
      this.sentSeries = response.sent;
      this.receivedSeries = response.received;
    } else {
      this.sentSeries = [];
      this.receivedSeries = [];
    }
  }


  // -- Selection ------------------------------------------------------------


  isSelected(reference: string) : boolean {
    return reference == this.selectedReference;
  }


  selectSeries(reference: string) {
    if(reference == this.selectedReference) {
      this.router.navigate([]);
    } else {
      this.router.navigate([], { queryParams: { 
        offset: 0,
        reference: reference
      } });
    }
  }


  // -- Navigation -----------------------------------------------------------


  onOffsetChange(offset: number) {
    this.router.navigate([], { queryParams: { 
      offset: offset,
      reference: this.selectedReference
    } });
  }


  navigatePrevious() {
    this.router.navigate([], { queryParams: { 
      offset: this.offset + 1,
      reference: this.selectedReference
    } });
  }


  navigateNext() {
    this.router.navigate([], { queryParams: { 
      offset: this.offset - 1,
      reference: this.selectedReference
    } });
  }

}

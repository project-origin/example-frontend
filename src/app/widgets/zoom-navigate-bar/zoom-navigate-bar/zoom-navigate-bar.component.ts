import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';


@Component({
  selector: 'app-zoom-navigate-bar',
  templateUrl: './zoom-navigate-bar.component.html',
  styleUrls: ['./zoom-navigate-bar.component.css']
})
export class ZoomNavigateBarComponent {


  static MAX_ZOOM_OUT_DAYS: number = 365 * 6;
  static MAX_ZOOM_IN_DAYS: number = 1;


  @Input() dateFrom: Date;
  @Input() dateTo: Date;
  @Output() dateChange: EventEmitter<{dateFrom: Date, dateTo: Date}> = new EventEmitter();
  @Output() dateReset: EventEmitter<any> = new EventEmitter();


  get deltaDays() : number {
    return moment(this.dateTo).diff(this.dateFrom, 'days');
  }


  get canZoomIn() : boolean {
    return this.deltaDays > 1;
  }


  get canZoomOut() : boolean {
    return this.deltaDays < (365 * 10);
  }


  emitChange(newDateFrom: Date, newDateTo: Date) {
    this.dateChange.emit({
      dateFrom: newDateFrom,
      dateTo: newDateTo,
    });
  }


  navigatePrevious() {
    let deltaDays = this.deltaDays + 1;
    let newDateFrom = moment(this.dateFrom).subtract(deltaDays, 'days').toDate();
    let newDateTo = moment(this.dateTo).subtract(deltaDays, 'days').toDate();
    this.emitChange(newDateFrom, newDateTo);
  }


  navigateNext() {
    let deltaDays = this.deltaDays + 1;
    let newDateFrom = moment(this.dateFrom).add(deltaDays, 'days').toDate();
    let newDateTo = moment(this.dateTo).add(deltaDays, 'days').toDate();
    this.emitChange(newDateFrom, newDateTo);
  }


  ZOOM_STEPS: number[] = [0, 3, 7, 15, 31, 30*3, 365, 365*2, 365*3, 365*6];


  zoomIn() {
    let newDelta: number;

    for(var i = this.ZOOM_STEPS.length - 1; i >= 0; i--) {
      if(this.deltaDays > this.ZOOM_STEPS[i]) {
        newDelta = this.ZOOM_STEPS[i];
        break;
      }
    }

    let diff = Math.ceil((this.deltaDays - newDelta) / 2);
    let dateFrom = moment(this.dateFrom).add(diff, 'days');
    let dateTo = moment(this.dateTo).subtract(diff, 'days');

    if(dateTo.diff(dateFrom, 'days') < 0) {
      dateFrom = dateTo;
    }

    this.emitChange(dateFrom.toDate(), dateTo.toDate());
  }


  zoomOut() {
    let newDelta: number;

    for(var i = 0; i < this.ZOOM_STEPS.length; i++) {
      if(this.deltaDays + 1 < this.ZOOM_STEPS[i]) {
        newDelta = this.ZOOM_STEPS[i];
        break;
      }
    }

    let diff = Math.floor((newDelta - this.deltaDays) / 2);
    let dateFrom = moment(this.dateFrom).subtract(diff, 'days');
    let dateTo = moment(this.dateTo).add(diff, 'days');
    this.emitChange(dateFrom.toDate(), dateTo.toDate());
  }


  reset() {
    this.dateReset.emit(null);
  }

}

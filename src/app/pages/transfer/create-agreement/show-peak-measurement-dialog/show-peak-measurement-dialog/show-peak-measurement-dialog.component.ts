import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MeasurementType } from 'src/app/services/commodities/models';


@Component({
  selector: 'app-show-peak-measurement-dialog',
  templateUrl: './show-peak-measurement-dialog.component.html',
  styleUrls: ['./show-peak-measurement-dialog.component.css']
})
export class ShowPeakMeasurementDialogComponent {

  measurementType: MeasurementType;
  dateFrom: Date;
  dateTo: Date;
  highlighted: Date;


  constructor(
    @Inject(MAT_DIALOG_DATA) data: {
      measurementType: MeasurementType,
      dateFrom: Date,
      dateTo: Date,
      highlighted: Date,
    }
  ) {
    this.measurementType = data.measurementType;
    this.dateFrom = data.dateFrom;
    this.dateTo = data.dateTo;
    this.highlighted = data.highlighted;
  }

}

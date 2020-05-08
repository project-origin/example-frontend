import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import * as moment from 'moment';
import { IFacilityFilters, FacilityType } from 'src/app/services/facilities/models';
import { MatDialog } from '@angular/material/dialog';
import { CreateDisclosureDialogComponent } from '../disclosure/create-disclosure/create-disclosure-dialog/create-disclosure-dialog.component';
import { CommodityService, GetMeasurementsRequest } from 'src/app/services/commodities/commodity.service';
import { DateRange } from 'src/app/services/common';


@Component({
  selector: 'app-commodities',
  templateUrl: './commodities.component.html',
  styleUrls: ['./commodities.component.css']
})
export class CommoditiesComponent implements OnInit {

  dateFrom: Date = moment().toDate();
  dateTo: Date = moment().subtract(1, 'months').toDate();
  filters: IFacilityFilters;


  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private commodityService: CommodityService,
  ) { }


  ngOnInit() {
    this.route.queryParamMap.subscribe((params: ParamMap) => {
      if(params.get('dateFrom') && params.get('dateTo')) {
        this.dateFrom = moment(params.get('dateFrom'), 'YYYY-MM-DD').toDate();
        this.dateTo = moment(params.get('dateTo'), 'YYYY-MM-DD').toDate();
      } else {
        this.dateFrom = moment().subtract(1, 'months').toDate();
        this.dateTo = moment().toDate();
      }

      this.filters = {
        gsrn: JSON.parse(params.get('gsrn') || '[]'),
        sectors: JSON.parse(params.get('sectors') || '[]'),
        tags: JSON.parse(params.get('tags') || '[]'),
        text: params.get('text') || '',
        facilityType: FacilityType[params.get('facilityType')] || '',
      };
    });
  }


  createDisclosure() {
    this.dialog.open(CreateDisclosureDialogComponent, { 
      data: {
        dateFrom: this.dateFrom,
        dateTo: this.dateTo,
        filters: this.filters, 
      },
      width: '750px',
      panelClass: 'dialog'
    });
  }


  exportMeasurements() {
    this.commodityService.exportMeasurements(new GetMeasurementsRequest({
        dateRange: new DateRange({begin: this.dateFrom, end: this.dateTo})
      }));
  }


  exportGgoSummary() {
    this.commodityService.exportGgoSummary(new GetMeasurementsRequest({
        dateRange: new DateRange({begin: this.dateFrom, end: this.dateTo})
      }));
  }


  exportGgoList() {
    this.commodityService.exportGgoList(new GetMeasurementsRequest({
        dateRange: new DateRange({begin: this.dateFrom, end: this.dateTo})
      }));
  }

}

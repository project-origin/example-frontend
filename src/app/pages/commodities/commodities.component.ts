import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import * as moment from 'moment';
import { IFacilityFilters, FacilityType } from 'src/app/services/facilities/models';


@Component({
  selector: 'app-commodities',
  templateUrl: './commodities.component.html',
  styleUrls: ['./commodities.component.css']
})
export class CommoditiesComponent implements OnInit {

  dateFrom: Date = moment().toDate();
  dateTo: Date = moment().subtract(1, 'months').toDate();
  filters: IFacilityFilters;


  constructor(private route: ActivatedRoute) { }


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

}

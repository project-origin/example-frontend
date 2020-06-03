import { Component, OnInit, Input } from '@angular/core';
import { FacilityType } from 'src/app/services/facilities/models';

@Component({
  selector: 'app-facility-type-badge',
  templateUrl: './facility-type-badge.component.html',
  styleUrls: ['./facility-type-badge.component.css']
})
export class FacilityTypeBadgeComponent {


  @Input() facilityType: FacilityType;


  constructor() { }


  isProduction() : boolean {
    return this.facilityType == FacilityType.production;
  }


  isConsumption() : boolean {
    return this.facilityType == FacilityType.consumption;
  }

}

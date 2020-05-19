import { Component, OnInit } from '@angular/core';
import { Facility  } from '../../services/facilities/models';
import { FacilityService, GetFacilityListResponse } from '../../services/facilities/facility-service.service';
import { MatDialog } from '@angular/material/dialog';
import { EditFacilityDialogComponent } from './edit-facility-dialog/edit-facility-dialog.component';
import { UserService, GetOnboardingUrlResponse } from '../../services/auth/user.service';


@Component({
  selector: 'app-facilities',
  templateUrl: './facilities.component.html',
  styleUrls: ['./facilities.component.css']
})
export class FacilitiesComponent implements OnInit {

  // Loading state
  loading: boolean = false;
  error: boolean = false;

  producers: Facility[] = [];
  consumers: Facility[] = [];


  constructor(
    private dialog: MatDialog,
    private userService: UserService,
    private facilityService: FacilityService,
  ) { }


  ngOnInit(): void {
    this.loadData();
  }


  get empty() : boolean {
    return this.producers.length == 0 && this.consumers.length == 0;
  }


  loadData() {
    this.loading = true;
    this.facilityService
        .getFacilityList()
        .subscribe(this.onLoadComplete.bind(this));
  }

  onLoadComplete(response: GetFacilityListResponse) {
    this.loading = false;
    this.error = !response.success;

    if(response.success) {
      this.parseFacilityList(response.facilities);
    }
  }

  parseFacilityList(facilities: Facility[]) {
    this.producers = facilities.filter(
        (facility: Facility) => facility.isProducer());

      this.consumers = facilities.filter(
          (facility: Facility) => facility.isConsumer());
  }


  editFacility(facility) {
    this.dialog
      .open(EditFacilityDialogComponent, {
        data: { facility: facility },
        width: '560px',
        panelClass: 'dialog',
      })
      .beforeClosed()
      .subscribe(this.loadData.bind(this));;
  }


  startOnboarding() {
    this.userService
      .getOnboardingUrl()
      .subscribe(this.onGetOnboardingUrlComplete.bind(this));
  }

  onGetOnboardingUrlComplete(response: GetOnboardingUrlResponse) {
    if(response.success) {
      location.href = response.url;
    }
  }

}

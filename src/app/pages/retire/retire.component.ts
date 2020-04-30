import { Component } from '@angular/core';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Facility, FacilityType } from '../../services/facilities/models';
import { FacilityService, GetFacilityListResponse, SetRetiringPriorityResponse, FacilityOrderBy } from '../../services/facilities/facility-service.service';


@Component({
  selector: 'app-retire',
  templateUrl: './retire.component.html',
  styleUrls: ['./retire.component.css']
})
export class RetireComponent {


  // Loading state
  loadingFacilities: boolean = false;
  loadingError: boolean = false;
  submitting: boolean = false;
  submittingError: boolean = false;
  retiringBackInTime: boolean = false;
  retiringBackInTimeError: boolean = false;

  // Sorting lists
  active: Facility[] = [];
  inactive: Facility[] = [];


  constructor(private facilityService: FacilityService) { }


  ngOnInit(): void {
    this.loadFacilities();
  }


  // -- Load facilities --------------------------------------------------- //


  loadFacilities() {
    let request = {
      filters: { facilityType: FacilityType.consumption },
      orderBy: FacilityOrderBy.retirePriority,
    };

    this.loadingFacilities = true;
    this.facilityService
        .getFacilityList(request)
        .subscribe(this.onLoadComplete.bind(this));
  }

  onLoadComplete(response: GetFacilityListResponse) {
    this.loadingFacilities = false;
    this.loadingError = !response.success;

    if(response.success) {
      this.active = response.facilities.filter(
          (facility: Facility) => facility.isGgoReceiver());
  
      this.inactive = response.facilities.filter(
          (facility: Facility) => !facility.isGgoReceiver());
    }
  }


  // -- Retire back in time ----------------------------------------------- //


  retireBackInTime() {
    this.retiringBackInTime = true;
    this.facilityService
        .retireBackInTime()
        .subscribe(this.onRetireBackInTimeComplete.bind(this));
  }

  onRetireBackInTimeComplete(response: GetFacilityListResponse) {
    this.retiringBackInTime = response.success;
    this.retiringBackInTimeError = !response.success;
  }


  // -- Facility priority ------------------------------------------------- //


  getPriority(facility: Facility) : number {
    let index = this.active.indexOf(facility);
    if(index !== -1) {
      return index;
    }
  }

  onPriorityChanged() {
    let request = {
      idsPrioritized: this.active.map((facility: Facility) => facility.id),
    };

    this.submitting = true;
    this.facilityService
        .setRetiringPriority(request)
        .subscribe(this.onSubmitPrioritiesComplete.bind(this));
  };

  onSubmitPrioritiesComplete(response: SetRetiringPriorityResponse) {
    this.submitting = false;
    this.submittingError = !response.success;
  }


  // -- Drag and drop ----------------------------------------------------- //


  drop(event: CdkDragDrop<Facility[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data,
                      event.previousIndex,
                      event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
                        event.container.data,
                        event.previousIndex,
                        event.currentIndex);
    }

    let movedFromActive = event.previousContainer.data === this.active;
    let movedFromInactive = event.previousContainer.data === this.inactive;
    let movedToActive = event.container.data === this.active;
    let movedToInactive = event.container.data === this.inactive;
    let changingIndex = event.previousIndex !== event.currentIndex;

    if(movedToActive || (movedFromActive && movedToInactive)) {
      this.onPriorityChanged();
    }
  }

}

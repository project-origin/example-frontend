import { Component, OnInit, Input, SimpleChanges } from '@angular/core';
import * as moment from 'moment';
import { FacilityService, GetFilteringOptionsResponse, GetFacilityListResponse } from 'src/app/services/facilities/facility-service.service';
import { IFacilityFilters, Facility, FacilityType } from 'src/app/services/facilities/models';
import { Router } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';


type DateRange = [{begin: Date, end: Date}];


@Component({
  selector: 'app-commodities-filters',
  templateUrl: './commodities-filters.component.html',
  styleUrls: ['./commodities-filters.component.css']
})
export class CommoditiesFiltersComponent implements OnInit {

  // Current selected filters
  @Input() dateFrom: Date;
  @Input() dateTo: Date;
  @Input() filters: IFacilityFilters;

  // Form controls
  form: FormGroup = new FormGroup({
    date: new FormControl(),
    sectors: new FormControl(),
    tags: new FormControl(),
    facilityType: new FormControl(),
    text: new FormControl(),
    gsrn: new FormControl(),
  });

  // Available filtering options
  availableSectors: string[] = [];
  availableTags: string[] = [];
  availableFacilities: Facility[] = [];

  // Loading state
  loadingOptions: boolean = false;
  errorOptions: boolean = false;
  loadingFacilities: boolean = false;
  errorFacilities: boolean = false;


  constructor(
    private router: Router,
    private facilityService: FacilityService,
  ) { }


  ngOnInit() {
    this.form.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(this.onFiltersChanged.bind(this));

    this.loadFilteringOptions();
  }


  ngOnChanges(changes: SimpleChanges) {
    if('dateFrom' in changes && 'dateTo' in changes) {
      this.form.patchValue({
        date: {
          begin: changes.dateFrom.currentValue,
          end: changes.dateTo.currentValue,
        },
      }, {emitEvent: false});
    }

    if('filters' in changes) {
      this.form.patchValue({
        sectors: changes.filters.currentValue.sectors,
        tags: changes.filters.currentValue.tags,
        facilityType: changes.filters.currentValue.facilityType,
        text: changes.filters.currentValue.text,
        gsrn: changes.filters.currentValue.gsrn,
      }, {emitEvent: false});
    }

    this.loadFacilities();
  }


  onFiltersChanged() {
    let queryParams = {
      dateFrom: moment(this.form.get('date').value.begin).format('YYYY-MM-DD'),
      dateTo: moment(this.form.get('date').value.end).format('YYYY-MM-DD'),
    };

    if(this.form.get('sectors').value.length > 0)
      queryParams['sectors'] = JSON.stringify(this.form.get('sectors').value);
    if(this.form.get('tags').value.length > 0)
      queryParams['tags'] = JSON.stringify(this.form.get('tags').value);
    if(this.form.get('facilityType').value.length > 0)
      queryParams['facilityType'] = this.form.get('facilityType').value;
    if(this.form.get('text').value.length > 0)
      queryParams['text'] = this.form.get('text').value;
    if(this.form.get('gsrn').value.length > 0)
      queryParams['gsrn'] = JSON.stringify(this.form.get('gsrn').value);

    this.router.navigate(['/commodities'], { queryParams: queryParams });
  }


  resetFilters() {
    this.form.patchValue({
      tags: [],
      facilityType: '',
      text: '',
    });
  }


  resetFacilitySelection() {
    this.form.patchValue({
      gsrn: [],
    });
  }


  // -- Loading filtering options --------------------------------------------

  loadFilteringOptions() {
    this.loadingOptions = true;
    this.errorOptions = false;
    this.facilityService
        .getFilteringOptions()
        .subscribe(this.onFilteringOptionsLoaded.bind(this));
  }

  onFilteringOptionsLoaded(response: GetFilteringOptionsResponse) {
    this.loadingOptions = false;
    this.errorOptions = !response.success;

    if(response.success) {
      this.availableSectors = response.sectors;
      this.availableTags = response.tags;
    }
  }


  // -- Loading facilities ---------------------------------------------------

  loadFacilities() {
    // Get all facilities matching current filters,
    // but without filtering on GSRN
    let filters = Object.assign({}, this.filters);
    filters.gsrn = [];

    this.loadingFacilities = true;
    this.errorFacilities = false;
    this.facilityService
        .getFacilityList({ filters: filters })
        .subscribe(this.onFacilitiesLoaded.bind(this));
  }


  onFacilitiesLoaded(response: GetFacilityListResponse) {
    this.loadingFacilities = false;
    this.errorFacilities = !response.success;

    if(response.success) {
      this.availableFacilities = response.facilities;
    } else {
      this.availableFacilities = [];
    }
  }


  selectFacilitiy(facility: Facility) {
    let selectedIds = this.form.get('gsrn').value;
    let index = selectedIds.indexOf(facility.gsrn);
    if(index === -1) {
      selectedIds.push(facility.gsrn);
    } else {
      selectedIds.splice(index, 1);
    }

    this.form.get('gsrn').setValue(selectedIds);
  }


  isSelected(facility: Facility) : boolean {
    return this.filters.gsrn?.indexOf(facility.gsrn) !== -1;
  }

}

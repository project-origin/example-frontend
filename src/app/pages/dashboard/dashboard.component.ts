import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import * as moment from 'moment';
import { IFacilityFilters, FacilityType } from 'src/app/services/facilities/models';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  dateFrom: Date = moment().toDate();
  dateTo: Date = moment().subtract(1, 'months').toDate();

  // Form controls
  form: FormGroup = new FormGroup({
    date: new FormControl(),
  });


  constructor(
    private router: Router,
    private route: ActivatedRoute,
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

      this.form.patchValue({date: {
        begin: this.dateFrom,
        end: this.dateTo,
      }})
    });

    this.form.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(this.onFiltersChanged.bind(this));
  }


  onFiltersChanged() {
    let queryParams = {
      dateFrom: moment(this.form.get('date').value.begin).format('YYYY-MM-DD'),
      dateTo: moment(this.form.get('date').value.end).format('YYYY-MM-DD'),
    };

    this.router.navigate(['/app/dashboard'], { queryParams: queryParams });
  }

}

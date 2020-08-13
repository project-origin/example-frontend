import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from 'src/app/services/auth/models';
import { FormGroup, FormControl } from '@angular/forms';
import { debounceTime, switchMap, map } from 'rxjs/operators';
import { UserService } from 'src/app/services/auth/user.service';
import { MatDialogRef } from '@angular/material/dialog';


@Component({
  selector: 'app-counterpart-dropdown-dialog',
  templateUrl: './counterpart-dropdown-dialog.component.html',
  styleUrls: ['./counterpart-dropdown-dialog.component.css']
})
export class CounterpartDropdownDialogComponent implements OnInit {


  filteredCounterparts: Observable<User[]>;

  form: FormGroup = new FormGroup({
    counterpart: new FormControl(),
    counterpartId: new FormControl(),
  });


  constructor(
    private dialogRef: MatDialogRef<CounterpartDropdownDialogComponent>,
    private userService: UserService,
  ) { }


  ngOnInit(): void {
    this.filteredCounterparts = this.form.get('counterpart').valueChanges.pipe(
      debounceTime(300),
      switchMap(query => this.userService.autocompleteUsers(query)),
      map(response => response.users)
    );
  }


  closeDialog() {
    this.dialogRef.close();
  }


  onCounterpartSelected(event) {
    this.dialogRef.close({
      counterpartId: event.option.value.id,
      counterpart: event.option.value.company,
    });
  }

}

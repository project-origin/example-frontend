import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { Facility } from 'src/app/services/facilities/models';
import { MatChipInputEvent } from '@angular/material/chips';
import { FacilityService, EditFacilityDetails } from 'src/app/services/facilities/facility-service.service';
import { FormGroup, FormControl } from '@angular/forms';


@Component({
  selector: 'app-edit-facility-dialog',
  templateUrl: './edit-facility-dialog.component.html',
  styleUrls: ['./edit-facility-dialog.component.css']
})
export class EditFacilityDialogComponent {

  facility: Facility;
  name: string;
  tags: string[];

  // Tags (chips) options
  visible = true;
  selectable = false;
  removable = true;
  addOnBlur = true;
  separatorKeysCodes: number[] = [ENTER, COMMA];

  // Loading state
  loading: boolean = false;
  error: boolean = false;


  constructor(
    private dialogRef: MatDialogRef<EditFacilityDialogComponent>,
    private facilityService: FacilityService,
    @Inject(MAT_DIALOG_DATA) data: { facility: Facility }
  ) {
    this.facility = data.facility;
    this.name = data.facility.name;
    this.tags = data.facility.tags.slice();
  }


  closeDialog() {
    this.dialogRef.close();
  }


  // -- Tags (chips) ---------------------------------------------------------


  addTag(event: MatChipInputEvent): void {
    const input = event.input;
    const tag = (event.value || '').trim().toLowerCase();
    const index = this.tags.indexOf(tag);

    if (tag && index === -1) {
      this.tags.push(tag.trim());
    }

    if (input) {
      input.value = '';
    }
  }

  removeTag(tag: string): void {
    const index = this.tags.indexOf(tag);

    if (index >= 0) {
      this.tags.splice(index, 1);
    }
  }


  // -- Submitting -----------------------------------------------------------


  submitForm() {
    let request = {
      id: this.facility.id,
      name: this.name,
      tags: this.tags,
    }

    this.loading = true;
    this.error = false;
    this.facilityService
      .editFacilityDetails(request)
      .subscribe(this.onSubmitComplete.bind(this));
  }

  onSubmitComplete(response: EditFacilityDetails) {
    this.loading = false;
    this.error = !response.success;

    if(response.success) {
      this.closeDialog();
    }
  }

}

import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-error-popup',
  templateUrl: './error-popup.component.html',
  styleUrls: ['./error-popup.component.css']
})
export class ErrorPopupComponent  {

  constructor(
    private dialogRef: MatDialogRef<ErrorPopupComponent>,
  ) { }


  closeDialog() {
    this.dialogRef.close();
  }

}
